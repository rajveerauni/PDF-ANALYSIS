const CHUNK_SIZE = 3000;
const CHUNK_OVERLAP = 200;

export function chunkText(text: string): string[] {
  if (!text || text.length <= CHUNK_SIZE) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    chunks.push(text.slice(start, end));
    if (end >= text.length) break; // reached the end — stop
    start = end - CHUNK_OVERLAP;
  }

  return chunks;
}

export function buildContextFromChunks(chunks: string[], query: string): string {
  if (chunks.length === 0) return '';
  if (chunks.length === 1) return chunks[0];

  const queryWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const scored = chunks.map((chunk, i) => {
    const lower = chunk.toLowerCase();
    const score = queryWords.reduce((acc, w) => acc + (lower.includes(w) ? 1 : 0), 0);
    return { chunk, score, i };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .sort((a, b) => a.i - b.i)
    .map(s => s.chunk)
    .join('\n\n---\n\n');
}
