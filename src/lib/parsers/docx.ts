export interface ParseResult {
  fullText: string;
  pageCount: number;
  charCount: number;
}

export async function parseDocx(file: File): Promise<ParseResult> {
  // mammoth is a CommonJS module — import server-side only
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await mammoth.extractRawText({ buffer });
  const fullText = result.value;
  const pageCount = Math.max(1, Math.ceil(fullText.length / 2000));
  return { fullText, pageCount, charCount: fullText.length };
}
