'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

type Step = 'idle' | 'uploading' | 'parsing' | 'analyzing' | 'done' | 'error';

const STEPS: { key: Step; label: string }[] = [
  { key: 'uploading',  label: 'Uploading file' },
  { key: 'parsing',   label: 'Parsing document' },
  { key: 'analyzing', label: 'Analyzing with AI' },
  { key: 'done',      label: 'Analysis complete' },
];

function stepIndex(step: Step) {
  return STEPS.findIndex(s => s.key === step);
}

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const processFile = useCallback(async (file: File) => {
    setError('');
    setStep('uploading');
    setSelectedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Client-side PDF text extraction before uploading
      if (file.name.endsWith('.pdf')) {
        setStep('parsing');
        const { parsePdf } = await import('@/lib/parsers/pdf');
        const { fullText, pageCount } = await parsePdf(file);
        formData.append('text', fullText);
        formData.append('pageCount', String(pageCount));
      }

      setStep('uploading');
      setStep('analyzing');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Upload failed');

      setDocumentId(data.documentId);
      setStep('done');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: accepted => { if (accepted[0]) processFile(accepted[0]); },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
    disabled: step !== 'idle' && step !== 'error',
  });

  const isProcessing = step === 'uploading' || step === 'parsing' || step === 'analyzing';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text mb-1">Upload Document</h1>
        <p className="text-text-dim text-sm">Supports PDF, DOCX, and TXT files up to 20MB</p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'idle' || step === 'error' ? (
          <motion.div key="dropzone" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Drop zone */}
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all',
                isDragActive
                  ? 'border-accent bg-accent-glow scale-[1.01]'
                  : 'border-border hover:border-accent/40 hover:bg-elevated/50',
              )}
            >
              <input {...getInputProps()} />

              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                className="w-14 h-14 rounded-xl bg-elevated border border-border flex items-center justify-center mx-auto mb-4"
              >
                <svg className={cn('w-7 h-7', isDragActive ? 'text-accent' : 'text-text-dim')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </motion.div>

              <p className="text-sm font-medium text-text mb-1">
                {isDragActive ? 'Drop it here' : 'Drag & drop or click to browse'}
              </p>
              <p className="text-xs text-text-dim">PDF, DOCX, TXT — max 20MB</p>
            </div>

            {step === 'error' && error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </motion.div>
            )}
          </motion.div>

        ) : step === 'done' ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-text mb-1">Analysis complete</h2>
            <p className="text-text-dim text-sm mb-6">
              {selectedFile?.name} has been analyzed successfully
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="primary" onClick={() => router.push(`/app/view/${documentId}`)}>
                View insights
              </Button>
              <Button variant="secondary" onClick={() => { setStep('idle'); setSelectedFile(null); setDocumentId(''); }}>
                Upload another
              </Button>
            </div>
          </motion.div>

        ) : (
          <motion.div key="processing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Spinner size="sm" />
              <div>
                <p className="text-sm font-medium text-text">{selectedFile?.name}</p>
                <p className="text-xs text-text-dim">{selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB' : ''}</p>
              </div>
            </div>

            {/* Step tracker */}
            <div className="space-y-3">
              {STEPS.map((s, i) => {
                const current = stepIndex(step);
                const done = i < current;
                const active = i === current;
                return (
                  <motion.div
                    key={s.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn('flex items-center gap-3', !done && !active && 'opacity-40')}
                  >
                    <div className={cn(
                      'w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 text-xs',
                      done   ? 'bg-success/10 border-success/30 text-success' :
                      active ? 'bg-accent/10 border-accent/30 text-accent' :
                               'bg-elevated border-border text-muted',
                    )}>
                      {done
                        ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        : active
                        ? <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
                        : <span className="w-1.5 h-1.5 rounded-full bg-muted" />}
                    </div>
                    <span className={cn('text-sm', active ? 'text-text font-medium' : done ? 'text-success' : 'text-text-dim')}>
                      {s.label}
                    </span>
                    {active && <Spinner size="sm" className="ml-auto" />}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
