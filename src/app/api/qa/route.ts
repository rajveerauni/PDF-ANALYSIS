import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { z } from 'zod';
import { buildChatPrompt } from '@/lib/ai/prompts';
import { chunkText, buildContextFromChunks } from '@/lib/ai/chunker';

const InputSchema = z.object({
  question: z.string().min(3).max(2000),
  text:     z.string().min(1).max(500_000),
  fileName: z.string().optional().default('document'),
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
    const context = buildContextFromChunks(chunks, parsed.data.question);
    const prompt = buildChatPrompt(context, parsed.data.question);

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const answer = completion.choices[0]?.message?.content ?? 'No answer available.';
    return NextResponse.json({ answer });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Q&A failed.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
