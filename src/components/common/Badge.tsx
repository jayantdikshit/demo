import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeStatus = 'Completed' | 'Pending' | 'Overdue' | 'Verified' | 'Rejected' | 'At Risk' | 'Active' | 'Present' | 'Absent' | 'Late';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info';
  status?: BadgeStatus;
  dot?: boolean;
}

const statusConfig: Record<BadgeStatus, { className: string; dotClass: string; label?: string }> = {
  Completed: {
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500',
  },
  Verified: {
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500',
  },
  Present: {
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500',
  },
  Active: {
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dotClass: 'bg-emerald-500',
  },
  Pending: {
    className: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dotClass: 'bg-amber-500 animate-pulse',
  },
  Late: {
    className: 'bg-orange-50 text-orange-700 border-orange-200/80',
    dotClass: 'bg-orange-500',
  },
  Overdue: {
    className: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dotClass: 'bg-rose-500',
  },
  Rejected: {
    className: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dotClass: 'bg-rose-500',
  },
  Absent: {
    className: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dotClass: 'bg-rose-500',
  },
  'At Risk': {
    className: 'bg-red-50 text-red-700 border-red-300 font-semibold ring-1 ring-red-400/30',
    dotClass: 'bg-red-600 animate-ping',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  status,
  dot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'border-transparent bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'border-transparent bg-gray-100 text-gray-800',
    destructive: 'border-transparent bg-red-50 text-red-700 border-red-200',
    outline: 'text-gray-700 border-gray-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
  };

  if (status && statusConfig[status]) {
    const config = statusConfig[status];
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
          config.className,
          className
        )}
        {...props}
      >
        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dotClass)} />
        {children || status}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </div>
  );
};
