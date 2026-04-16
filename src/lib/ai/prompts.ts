export function buildInsightsPrompt(text: string, fileName: string): string {
  return `You are a senior business analyst. Analyze the following document and extract structured insights.

Document: "${fileName}"
Content:
${text.slice(0, 12000)}

Return ONLY valid JSON matching this exact schema:
{
  "executiveSummary": "2-3 sentence summary of the document",
  "keyInsights": ["insight 1", "insight 2", "insight 3", "insight 4", "insight 5"],
  "risks": ["risk 1", "risk 2", "risk 3"],
  "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "keyMetrics": [
    { "label": "metric name", "value": "metric value with units" }
  ],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "confidenceScore": 85
}

Rules:
- keyInsights: exactly 5 items
- risks: 2-4 items
- opportunities: 2-4 items
- keyMetrics: 3-6 items with actual numbers from the document
- recommendations: 3-5 items
- confidenceScore: integer 0-100 based on document clarity and completeness
- Use plain English, no jargon
- Be specific, cite actual data from the document`;
}

export function buildChatPrompt(context: string, question: string): string {
  return `You are a helpful document assistant. Answer questions based only on the provided document context.

Document context:
${context}

Question: ${question}

Instructions:
- Answer based only on the document content above
- Be concise and direct (2-4 sentences unless more detail is needed)
- If the answer is not in the document, say "I couldn't find that information in the document"
- Do not make up facts`;
}
