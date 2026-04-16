'use client';

export interface ParseResult {
  fullText: string;
  pageCount: number;
  charCount: number;
}

export async function parsePdf(file: File): Promise<ParseResult> {
  const pdfjsLib = await import('pdfjs-dist');

  // Serve worker locally — avoids CDN fetch latency on every upload
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  // Extract all pages in parallel instead of serially
  const pagePromises = Array.from({ length: pdf.numPages }, (_, i) =>
    pdf.getPage(i + 1).then(page =>
      page.getTextContent().then(content =>
        content.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((item: any) => typeof item.str === 'string')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => item.str as string)
          .join(' ')
      )
    )
  );

  const pages = await Promise.all(pagePromises);
  const fullText = pages.join('\n\n');
  return { fullText, pageCount: pdf.numPages, charCount: fullText.length };
}
