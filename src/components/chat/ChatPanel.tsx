'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  documentId: string;
  initialMessages: { role: string; content: string; created_at: string }[];
}

export default function ChatPanel({ documentId, initialMessages }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, question }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.ok ? data.answer : (data.error ?? 'Something went wrong'),
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to get a response.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="bg-surface border border-border rounded-xl flex flex-col h-[600px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-sm font-semibold text-text">Document Chat</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-text-dim text-sm py-8">
            <p className="mb-1 font-medium text-text">Ask anything about this document</p>
            <p className="text-xs">What are the main risks? What does the data say about growth?</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              <div className={cn(
                'max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-accent text-base rounded-br-sm'
                  : 'bg-elevated border border-border text-text-dim rounded-bl-sm',
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-elevated border border-border rounded-xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
              <Spinner size="sm" />
              <span className="text-xs text-text-dim">Analyzing...</span>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-border">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question..."
            rows={2}
            disabled={loading}
            className="flex-1 bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text placeholder-muted resize-none focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 disabled:opacity-50"
          />
          <Button
            variant="primary"
            size="sm"
            onClick={send}
            disabled={!input.trim() || loading}
            className="self-end"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
        <p className="text-xs text-muted mt-1.5">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}
