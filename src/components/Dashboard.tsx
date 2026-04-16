'use client';

import { motion } from 'framer-motion';
import type { DocumentInsights } from '@/types/insights';
import { dashboardContainer, cardVariant } from '@/lib/variants';

interface DashboardProps {
  insights: DocumentInsights;
  fileName: string;
  onReset: () => void;
}

export default function Dashboard({ insights, fileName, onReset }: DashboardProps) {
  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      <motion.div variants={dashboardContainer} initial="initial" animate="animate" className="space-y-6">
        <motion.div variants={cardVariant} className="bg-surface border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-text truncate">{fileName}</h2>
            <button onClick={onReset} className="text-sm text-accent hover:text-accent-dim">
              New scan
            </button>
          </div>
          <p className="text-text-dim text-sm leading-relaxed">{insights.executiveSummary}</p>
        </motion.div>

        {insights.keyInsights.length > 0 && (
          <motion.div variants={cardVariant} className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-text mb-4">Key Insights</h3>
            <ul className="space-y-2">
              {insights.keyInsights.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-dim">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.risks.length > 0 && (
            <motion.div variants={cardVariant} className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-text mb-3">Risks</h3>
              <ul className="space-y-1.5">
                {insights.risks.map((r: string, i: number) => (
                  <li key={i} className="text-sm text-error/80 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-error flex-shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          {insights.opportunities.length > 0 && (
            <motion.div variants={cardVariant} className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-text mb-3">Opportunities</h3>
              <ul className="space-y-1.5">
                {insights.opportunities.map((o: string, i: number) => (
                  <li key={i} className="text-sm text-success/80 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
                    {o}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
