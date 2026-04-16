'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function Topbar() {
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <header className="h-14 border-b border-border bg-surface/80 backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1 flex items-center gap-3">
        <Link href="/app/upload" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-text group-hover:text-accent transition-colors">PDF Analyzer</span>
        </Link>
      </div>

      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign out
      </Button>
    </header>
  );
}
