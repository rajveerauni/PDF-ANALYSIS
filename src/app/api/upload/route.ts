import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import Groq from 'groq-sdk';
import { chunkText } from '@/lib/ai/chunker';
import { buildInsightsPrompt } from '@/lib/ai/prompts';
import { z } from 'zod';

const InsightsSchema = z.object({
  executiveSummary:  z.string(),
  keyInsights:       z.array(z.string()),
  risks:             z.array(z.string()),
  opportunities:     z.array(z.string()),
  keyMetrics:        z.array(z.object({ label: z.string(), value: z.string() })),
  recommendations:   z.array(z.string()),
  confidenceScore:   z.number().min(0).max(100),
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const fileType = file.name.endsWith('.pdf') ? 'pdf'
      : file.name.endsWith('.docx') ? 'docx'
      : file.name.endsWith('.txt') ? 'txt'
      : null;

    if (!fileType) return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });

    // 1. Create document record
    const storagePath = `${user.id}/${Date.now()}_${file.name}`;
    const { data: doc, error: docError } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: user.id,
        name: file.name,
        file_type: fileType,
        file_size: file.size,
        storage_path: storagePath,
        status: 'uploading',
      })
      .select()
      .single();

    if (docError || !doc) {
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 });
    }

    // 2. Parse text + upload to storage in parallel
    const arrayBuffer = await file.arrayBuffer();

    let fullText = '';
    let pageCount = 1;

    if (fileType === 'txt') {
      fullText = await file.text();
      pageCount = Math.max(1, Math.ceil(fullText.length / 2000));
    } else if (fileType === 'docx') {
      const mammoth = await import('mammoth');
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      fullText = result.value;
      pageCount = Math.max(1, Math.ceil(fullText.length / 2000));
    } else {
      fullText = (formData.get('text') as string) ?? '';
      pageCount = parseInt((formData.get('pageCount') as string) ?? '1', 10);
    }
    const charCount = fullText.length;

    // Upload to storage and update status simultaneously
    const [uploadResult] = await Promise.all([
      supabaseAdmin.storage.from('documents').upload(storagePath, arrayBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      }),
      supabaseAdmin.from('documents').update({ status: 'analyzing', page_count: pageCount, char_count: charCount }).eq('id', doc.id),
    ]);

    if (uploadResult.error) {
      await supabaseAdmin.from('documents').update({ status: 'error' }).eq('id', doc.id);
      return NextResponse.json({ error: 'Storage upload failed' }, { status: 500 });
    }

    // 4. AI Analysis with chunking
    const chunks = chunkText(fullText);
    const analysisText = chunks.length > 1
      ? chunks.slice(0, 4).join('\n\n[...continued...]\n\n')
      : fullText;

    const prompt = buildInsightsPrompt(analysisText, file.name);

    const completion = await groq.chat.completions.create({
      model: MODEL,
      response_format: { type: 'json_object' },
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = InsightsSchema.safeParse(JSON.parse(raw));

    if (!parsed.success) {
      await supabaseAdmin.from('documents').update({ status: 'error' }).eq('id', doc.id);
      return NextResponse.json({ error: 'AI parsing failed' }, { status: 500 });
    }

    // 5. Store insights
    const { data: insights } = await supabaseAdmin
      .from('insights')
      .insert({
        document_id: doc.id,
        user_id: user.id,
        executive_summary: parsed.data.executiveSummary,
        key_insights: parsed.data.keyInsights,
        risks: parsed.data.risks,
        opportunities: parsed.data.opportunities,
        key_metrics: parsed.data.keyMetrics,
        recommendations: parsed.data.recommendations,
        confidence_score: parsed.data.confidenceScore,
      })
      .select()
      .single();

    await supabaseAdmin.from('documents').update({ status: 'done' }).eq('id', doc.id);

    return NextResponse.json({ documentId: doc.id, insights: parsed.data, insightId: insights?.id });

  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
