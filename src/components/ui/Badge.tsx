import { cn } from '@/lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'muted';
  className?: string;
}

const variants = {
  accent:  'bg-accent/10 text-accent border border-accent/20',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  error:   'bg-error/10 text-error border border-error/20',
  muted:   'bg-elevated text-text-dim border border-border',
};

export default function Badge({ children, variant = 'muted', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  );
}
