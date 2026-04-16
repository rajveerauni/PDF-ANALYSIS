'use client';

import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

interface InsightData {
  executive_summary: string | null;
  key_insights: string[] | null;
  risks: string[] | null;
  opportunities: string[] | null;
  key_metrics: { label: string; value: string }[] | null;
  recommendations: string[] | null;
  confidence_score: number | null;
}

interface InsightsPanelProps {
  insights: InsightData | null;
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-accent">{icon}</span>
        <h3 className="text-sm font-semibold text-text">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ListItems({ items, color = 'text-text-dim' }: { items: string[]; color?: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className={cn('flex items-start gap-2.5 text-sm', color)}
        >
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60" />
          {item}
        </motion.li>
      ))}
    </ul>
  );
}

export default function InsightsPanel({ insights }: InsightsPanelProps) {
  if (!insights) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-dim">
        No insights available yet.
      </div>
    );
  }

  const confidence = insights.confidence_score ?? 0;
  const confidenceColor = confidence >= 75 ? 'text-success' : confidence >= 50 ? 'text-warning' : 'text-error';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Executive Summary */}
      {insights.executive_summary && (
        <Section
          title="Executive Summary"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-text-dim leading-relaxed flex-1">{insights.executive_summary}</p>
            <div className="flex-shrink-0 text-right">
              <p className={cn('text-xl font-bold tabular-nums', confidenceColor)}>{confidence}%</p>
              <p className="text-xs text-muted">confidence</p>
            </div>
          </div>
        </Section>
      )}

      {/* Key Metrics */}
      {insights.key_metrics && insights.key_metrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {insights.key_metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="bg-surface border border-border rounded-xl p-4"
            >
              <p className="text-lg font-bold text-accent truncate">{m.value}</p>
              <p className="text-xs text-muted mt-0.5 truncate">{m.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Key Insights */}
      {insights.key_insights && insights.key_insights.length > 0 && (
        <Section
          title="Key Insights"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
        >
          <ListItems items={insights.key_insights} color="text-text-dim" />
        </Section>
      )}

      {/* Two-column: Risks + Opportunities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.risks && insights.risks.length > 0 && (
          <Section
            title="Risks"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          >
            <ListItems items={insights.risks} color="text-error/80" />
          </Section>
        )}
        {insights.opportunities && insights.opportunities.length > 0 && (
          <Section
            title="Opportunities"
            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
          >
            <ListItems items={insights.opportunities} color="text-success/80" />
          </Section>
        )}
      </div>

      {/* Recommendations */}
      {insights.recommendations && insights.recommendations.length > 0 && (
        <Section
          title="Recommendations"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
        >
          <div className="space-y-2">
            {insights.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3"
              >
                <Badge variant="accent" className="flex-shrink-0 mt-0.5">{i + 1}</Badge>
                <p className="text-sm text-text-dim">{rec}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}
    </motion.div>
  );
}
