'use client';

export interface ParseResult {
  fullText: string;
  pageCount: number;
  charCount: number;
}

export async function parsePdf(file: File): Promise<ParseResult> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => typeof item.str === 'string')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.str as string)
      .join(' ');
    pages.push(text);
  }

  const fullText = pages.join('\n\n');
  return { fullText, pageCount: pdf.numPages, charCount: fullText.length };
}
