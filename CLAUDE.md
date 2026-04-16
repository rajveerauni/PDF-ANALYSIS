# ARCHITECT_AI — Engineering Reference

## Tech Stack
| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 14 (App Router)             |
| Language   | TypeScript 5.5                      |
| Styling    | Tailwind CSS 3 (pixel-art palette)  |
| Animation  | Framer Motion 11                    |
| Lottie     | @lottiefiles/dotlottie-react        |
| AI         | Groq SDK (llama-3.3-70b-versatile)  |
| PDF        | pdfjs-dist 3.11.174 (client-side)   |
| Validation | Zod 3                               |

## Project Structure
```
src/
  app/
    page.tsx              — Main stateful page (idle/loading/done)
    layout.tsx            — Root layout: Header + Sidebar + Footer
    globals.css           — Tailwind base + custom globals
    api/
      analyze/route.ts    — POST /api/analyze  (Groq insights)
      qa/route.ts         — POST /api/qa       (Groq Q&A)
  components/
    Header.tsx            — Fixed top nav
    Sidebar.tsx           — Fixed left nav (lg+)
    HeroSection.tsx       — Idle state hero
    UploadSection.tsx     — Dropzone (react-dropzone + forwardRef)
    ProcessingOverlay.tsx — Loading state with Lottie + progress
    Dashboard.tsx         — Results state with stagger reveal
  features/
    ai/prompts.ts         — buildInsightsPrompt, buildQaPrompt
    pdf/extractText.ts    — Client-side PDF text extraction
  lib/
    variants.ts           — All Framer Motion variants (single source)
    cn.ts                 — clsx + tailwind-merge utility
  types/
    insights.ts           — Insights, AnalyzeResponse, QaResponse
    pdf.ts                — PdfExtractResult, PdfPageText
```

## Animation System (variants.ts)
- `pageVariants`        — idle↔loading↔done page-level transitions
- `lottieFloat`         — Lottie floating + breathing loop
- `terminalContainer`   — Stagger wrapper for log lines
- `terminalLine`        — Individual log line (y:10→0, opacity fade)
- `dashboardContainer`  — Dashboard entrance (y:30→0, stagger children)
- `cardVariant`         — Card entrance (scale:0.98→1)
- `btnHover/btnTap`     — Button micro-interactions (spring)

## App State Machine
```
idle  ──[file drop]──► loading ──[API done]──► done
done  ──[NEW_SCAN]──► idle
loading ──[error]──► idle (after 2.2s)
```

## Environment Variables
```
GROQ_API_KEY     — Required. Groq API key.
GROQ_MODEL       — Optional. Default: llama-3.3-70b-versatile
NEXT_PUBLIC_APP_URL — App URL for metadata
```

## Architecture Decisions
1. **PDF extraction is client-only** — pdfjs-dist uses browser APIs. Dynamically imported to keep it out of server bundle.
2. **API key server-only** — GROQ_API_KEY never exposed to client. All AI calls go through `/api/*` routes.
3. **Single variants.ts** — All animation configs in one file. Prevents drift between components.
4. **Zod on both sides** — Request validation (server) + response parsing (server) with Zod.
5. **forwardRef on UploadSection** — Exposes `open()` so HeroSection button can trigger the file picker without prop-drilling a ref to the input element.
