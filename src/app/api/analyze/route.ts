import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { z } from 'zod';
import { buildInsightsPrompt } from '@/lib/ai/prompts';
import { chunkText } from '@/lib/ai/chunker';

const InputSchema = z.object({
  text:     z.string().min(50, 'Document text too short.').max(500_000),
  fileName: z.string().optional().default('document'),
});

const InsightsSchema = z.object({
  executiveSummary:  z.string().default('No summary available.'),
  keyInsights:       z.array(z.string()).default([]),
  risks:             z.array(z.string()).default([]),
  opportunities:     z.array(z.string()).default([]),
  keyMetrics:        z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  recommendations:   z.array(z.string()).default([]),
  confidenceScore:   z.number().min(0).max(100).default(50),
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = InputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input.' }, { status: 400 });
  }

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY not configured.' }, { status: 500 });
  }

  try {
    const chunks = chunkText(parsed.data.text);
    const analysisText = chunks.length > 1
      ? chunks.slice(0, 4).join('\n\n[...]\n\n')
      : parsed.data.text;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
      temperature: 0.3,
      messages: [{ role: 'user', content: buildInsightsPrompt(analysisText, parsed.data.fileName) }],
      response_format: { type: 'json_object' },
    });

    const raw = JSON.parse(completion.choices[0]?.message?.content ?? '{}');
    const result = InsightsSchema.safeParse(raw);
    const insights = result.success ? result.data : InsightsSchema.parse({});

    return NextResponse.json({ insights });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
