import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

const features = [
  {
    title: 'Multi-format support',
    desc: 'Upload PDF, DOCX, or TXT files. We handle the parsing.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'AI-powered insights',
    desc: 'Get executive summaries, risks, opportunities, and key metrics instantly.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Document chat',
    desc: 'Ask questions about your document and get accurate, grounded answers.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Document history',
    desc: 'All your analyzed documents saved and accessible anytime.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export default async function LandingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-semibold text-text">PDF Analyzer</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/app/upload" className="px-4 py-2 rounded-lg bg-accent text-base text-sm font-medium hover:bg-accent-dim transition-colors">
              Go to app
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-text-dim hover:text-text transition-colors">Sign in</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg bg-accent text-base text-sm font-medium hover:bg-accent-dim transition-colors">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text mb-6 leading-tight tracking-tight">
          Turn documents into{' '}
          <span className="text-accent">actionable insights</span>
        </h1>

        <p className="text-lg text-text-dim max-w-xl mb-10 leading-relaxed">
          Upload any PDF, DOCX, or TXT file and get AI-generated summaries, risks, opportunities, key metrics, and an interactive chat — in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <Link
            href={user ? '/app/upload' : '/login'}
            className="px-6 py-3.5 rounded-xl bg-accent text-base font-semibold text-base hover:bg-accent-dim transition-all shadow-glow hover:shadow-glow-lg"
          >
            Start analyzing for free
          </Link>
          <Link
            href={user ? '/app/documents' : '/login'}
            className="px-6 py-3.5 rounded-xl bg-elevated border border-border text-text font-medium hover:border-accent/40 transition-all"
          >
            View documents
          </Link>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {features.map((f, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 text-left hover:border-accent/30 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/15 flex items-center justify-center text-accent mb-3">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-text mb-1">{f.title}</h3>
              <p className="text-xs text-text-dim leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center">
        <p className="text-xs text-muted">Made by Rajveer Rauniyar</p>
      </footer>
    </div>
  );
}
