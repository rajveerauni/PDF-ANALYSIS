'use client';

import { motion } from 'framer-motion';
import { terminalContainer, terminalLine } from '@/lib/variants';
import Spinner from '@/components/ui/Spinner';

interface ProcessingOverlayProps {
  progress: number;
  logs: string[];
  tokenId: string;
}

export default function ProcessingOverlay({ progress, logs, tokenId }: ProcessingOverlayProps) {
  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      <motion.div
        className="bg-surface border border-border rounded-xl p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-xl bg-elevated border border-border">
            <Spinner size="lg" />
          </div>

          <div className="flex-grow w-full">
            <div className="flex justify-between items-end mb-3">
              <span className="text-xs text-text-dim font-mono">ID: {tokenId}</span>
              <span className="text-xs text-accent font-mono tabular-nums">{Math.round(progress)}%</span>
            </div>

            <div className="h-2 w-full bg-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>

            <motion.div
              className="mt-6 text-xs font-mono text-text-dim space-y-1"
              variants={terminalContainer}
              initial="initial"
              animate="animate"
            >
              {logs.map((log, i) => (
                <motion.p key={i} variants={terminalLine}>&gt; {log}</motion.p>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
