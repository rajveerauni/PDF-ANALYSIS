import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import Groq from 'groq-sdk';
import { buildChatPrompt } from '@/lib/ai/prompts';
import { chunkText, buildContextFromChunks } from '@/lib/ai/chunker';
import { z } from 'zod';

const RequestSchema = z.object({
  documentId: z.string().uuid(),
  question: z.string().min(1).max(2000),
  documentText: z.string().optional(),
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    const { documentId, question, documentText } = parsed.data;

    // Verify document belongs to user
    const { data: doc } = await supabaseAdmin
      .from('documents')
      .select('id, name')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

    // Build context from document text (client-side extracted) or stored insights
    let context = '';
    if (documentText && documentText.length > 0) {
      const chunks = chunkText(documentText);
      context = buildContextFromChunks(chunks, question);
    } else {
      // Fall back to stored insights as context
      const { data: insights } = await supabaseAdmin
        .from('insights')
        .select('executive_summary, key_insights, risks, opportunities, recommendations')
        .eq('document_id', documentId)
        .single();

      if (insights) {
        context = [
          `Summary: ${insights.executive_summary}`,
          `Key Insights: ${(insights.key_insights as string[])?.join(', ')}`,
          `Risks: ${(insights.risks as string[])?.join(', ')}`,
          `Opportunities: ${(insights.opportunities as string[])?.join(', ')}`,
          `Recommendations: ${(insights.recommendations as string[])?.join(', ')}`,
        ].join('\n\n');
      }
    }

    const prompt = buildChatPrompt(context, question);

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 512,
    });

    const answer = completion.choices[0]?.message?.content ?? 'No response generated.';

    // Persist chat messages
    await supabaseAdmin.from('chats').insert([
      { document_id: documentId, user_id: user.id, role: 'user', content: question },
      { document_id: documentId, user_id: user.id, role: 'assistant', content: answer },
    ]);

    return NextResponse.json({ answer });

  } catch (err) {
    console.error('Chat error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 },
    );
  }
}
