'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

type Mode = 'login' | 'signup';

export default function LoginPage() {
  const supabase = createClient();

  // If already logged in, go straight to app
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = '/app/upload';
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = '/app/upload';
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        // If session is returned immediately, email confirmation is disabled — go straight to app
        if (data.session) {
          window.location.href = '/app/upload';
        } else {
          setSuccess('Account created! Check your email to confirm, then sign in.');
          setMode('login');
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('over_email_send_rate_limit')) {
        setError('Too many sign-up attempts. Please wait a few minutes, or disable email confirmation in your Supabase dashboard.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-text">PDF Analyzer</span>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h1 className="text-xl font-semibold text-text mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-text-dim mb-6">
            {mode === 'login'
              ? 'Sign in to analyze your documents'
              : 'Start analyzing documents for free'}
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-text-dim mb-1.5">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Rajveer Rauniyar"
                  required
                  className="w-full bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-text-dim mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dim mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full bg-elevated border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder-muted focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30"
              />
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-text-dim mt-4">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
            className="text-accent hover:text-accent-dim font-medium"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
