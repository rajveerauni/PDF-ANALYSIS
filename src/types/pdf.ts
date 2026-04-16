export type PdfPageText = {
  pageNumber: number;
  text: string;
};

export type PdfExtractResult = {
  fullText: string;
  pages: PdfPageText[];
};
