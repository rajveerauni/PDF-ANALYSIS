export interface ParseResult {
  fullText: string;
  pageCount: number;
  charCount: number;
}

export async function parseTxt(file: File): Promise<ParseResult> {
  const fullText = await file.text();
  // Approximate pages: ~2000 chars per page
  const pageCount = Math.max(1, Math.ceil(fullText.length / 2000));
  return { fullText, pageCount, charCount: fullText.length };
}
