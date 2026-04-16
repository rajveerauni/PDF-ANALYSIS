import type { PdfExtractResult } from '@/types/pdf';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_PAGES = 60;
const WORKER_URL = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export async function extractTextFromPdf(file: File): Promise<PdfExtractResult> {
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are supported.');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('PDF exceeds 10 MB limit.');
  }

  // Dynamic import keeps pdfjs out of the server bundle
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  if (pdf.numPages > MAX_PAGES) {
    throw new Error(`PDF has ${pdf.numPages} pages (max ${MAX_PAGES}).`);
  }

  const pages: PdfExtractResult['pages'] = [];

  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    const text = content.items
      .map(item => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) pages.push({ pageNumber: n, text });
  }

  const fullText = pages.map(p => `[Page ${p.pageNumber}] ${p.text}`).join('\n');

  if (fullText.length < 100) {
    throw new Error('Could not extract enough readable text from this PDF.');
  }

  return { fullText, pages };
}
