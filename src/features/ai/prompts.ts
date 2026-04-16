export function buildInsightsPrompt(documentText: string): string {
  return `
You are a business analyst assistant.
Read the business document text and return ONLY valid JSON with this exact shape:
{
  "summary": "string",
  "revenue": ["string"],
  "growth": ["string"],
  "risks": ["string"],
  "opportunities": ["string"],
  "changes": [{ "area": "string", "whatChanged": "string", "impact": "string" }],
  "strengths": ["string"],
  "improvements": ["string"],
  "pros": ["string"],
  "cons": ["string"],
  "actionPlan": ["string"],
  "confidence": 0.0
}

Rules:
- Concise, actionable bullet-like statements.
- Empty array for categories with no evidence.
- confidence must be 0–1.
- No markdown, no code fences.

Document text:
${documentText}
`.trim();
}

export function buildQaPrompt(params: {
  question: string;
  fileName?: string;
  chunks: Array<{ id: string; pageNumber?: number; text: string }>;
}): string {
  const chunkBlock = params.chunks
    .map(c => `[${c.id} | page ${c.pageNumber ?? '?'}]\n${c.text}`)
    .join('\n\n---\n\n');

  return `
You are an expert business analyst assistant.
Answer the user's question using ONLY the provided document excerpts.
Return ONLY valid JSON:
{
  "answer": "string",
  "citations": [{ "pageNumber": 1, "quote": "string", "reason": "string" }],
  "followUps": ["string"],
  "confidence": 0.0
}

Rules:
- 2–5 citations when possible. Quotes must be verbatim from excerpts.
- "followUps" should be 2–4 short suggested next questions.
- No markdown, no code fences.

File: ${params.fileName ?? 'N/A'}
Question: ${params.question}

Excerpts:
${chunkBlock}
`.trim();
}
