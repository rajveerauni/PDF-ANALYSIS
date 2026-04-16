# Engineering Tasks — PDF Analyzer SaaS

## ✅ Completed

### Foundation
- [x] package.json — added @supabase/supabase-js, @supabase/ssr, mammoth, date-fns; removed @lottiefiles/dotlottie-react
- [x] tailwind.config.ts — new teal/dark palette (bg-base, bg-surface, accent #2DD4BF, Inter font)
- [x] globals.css — new CSS vars, Inter font, clean scrollbar + selection
- [x] .env.local — all 4 env vars (GROQ, SUPABASE URL + anon + service role)
- [x] vercel.json — maxDuration for API functions

### Database
- [x] supabase/setup.sql — profiles, documents, pages, insights, chats tables with RLS
- [x] Storage bucket `documents` with per-user policies

### Supabase Clients
- [x] src/lib/supabase/client.ts — browser client
- [x] src/lib/supabase/server.ts — server client (SSR cookies)
- [x] src/lib/supabase/admin.ts — service role admin client

### Auth + Routing
- [x] src/middleware.ts — protects /app/* routes, redirects authenticated from /login
- [x] src/app/login/page.tsx — login + signup form
- [x] src/app/app/page.tsx — redirect to /app/upload

### AI + Parsing
- [x] src/lib/ai/prompts.ts — buildInsightsPrompt, buildChatPrompt
- [x] src/lib/ai/chunker.ts — chunkText (3000/200 overlap), buildContextFromChunks
- [x] src/lib/parsers/pdf.ts — client-side pdfjs extraction
- [x] src/lib/parsers/docx.ts — server-side mammoth extraction
- [x] src/lib/parsers/txt.ts — plain text reader

### API Routes
- [x] src/app/api/upload/route.ts — upload file → Supabase Storage → parse → Groq AI → store insights
- [x] src/app/api/analyze/route.ts — updated to new InsightsSchema + chunker
- [x] src/app/api/qa/route.ts — updated to new buildChatPrompt
- [x] src/app/api/chat/route.ts — document Q&A with history persistence

### Layouts
- [x] src/app/layout.tsx — minimal root layout (Inter, no Header/Sidebar)
- [x] src/app/app/layout.tsx — app shell with Sidebar + Topbar
- [x] src/components/layout/Sidebar.tsx — Upload Document + Documents links
- [x] src/components/layout/Topbar.tsx — logo + sign out

### Pages
- [x] src/app/page.tsx — landing page with features grid
- [x] src/app/app/upload/page.tsx — drag-drop upload + StatusStepper
- [x] src/app/app/documents/page.tsx — document history table
- [x] src/app/app/view/[id]/page.tsx — insights + chat side-by-side

### Components
- [x] src/components/ui/Button.tsx — primary / secondary / ghost / danger variants
- [x] src/components/ui/Badge.tsx — accent / success / warning / error / muted
- [x] src/components/ui/Spinner.tsx — animated spinner
- [x] src/components/insights/InsightsPanel.tsx — full insights display
- [x] src/components/chat/ChatPanel.tsx — real-time chat UI

### Types
- [x] src/types/insights.ts — DocumentInsights, KeyMetric, ChatMessage
- [x] src/types/documents.ts — Document, DocumentWithInsights, DocumentStatus

---

## 🔲 Remaining (nice-to-have)

### Supabase Setup
- [ ] **ACTION REQUIRED**: Run `supabase/setup.sql` in Supabase SQL editor at https://supabase.com/dashboard

### Production Polish
- [ ] Error boundary components
- [ ] Loading skeletons on documents page
- [ ] Delete document action (with Storage cleanup)
- [ ] SEO metadata per page
- [ ] Rate limiting on API routes
