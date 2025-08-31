import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-colors',
  {
    variants: {
      variant: {
        active: 'bg-success/15 text-success border-success/30',
        pending: 'bg-warning/15 text-warning border-warning/30',
        rejected: 'bg-destructive/15 text-destructive border-destructive/30',
        inactive: 'bg-muted text-muted-foreground border-border',
        processing: 'bg-primary/15 text-primary border-primary/30',
        completed: 'bg-success/15 text-success border-success/30',
        cancelled: 'bg-destructive/15 text-destructive border-destructive/30',
        draft: 'bg-muted text-muted-foreground border-border',
      },
      size: {
        default: 'px-3 py-1 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        lg: 'px-4 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'active',
      size: 'default',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

function StatusBadge({ className, variant, size, children, ...props }: StatusBadgeProps) {
  return (
    <div
      className={cn(statusBadgeVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </div>
  );
}

export { StatusBadge, statusBadgeVariants };