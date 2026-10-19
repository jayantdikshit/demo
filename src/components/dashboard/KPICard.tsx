import * as React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: number | string;
    isPositive?: boolean;
    label?: string;
  };
  icon: React.ReactNode;
  gradient?: string;
  onClick?: () => void;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon,
  gradient = 'from-blue-500 to-indigo-600',
  onClick,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">{value}</h3>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}

          {change && (
            <div className="mt-2.5 flex items-center gap-1.5 text-xs font-medium">
              <span
                className={cn(
                  'flex items-center gap-0.5 rounded px-1.5 py-0.5 font-semibold',
                  change.isPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
                )}
              >
                {change.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {typeof change.value === 'number' ? `${change.value > 0 ? '+' : ''}${change.value}%` : change.value}
              </span>
              {change.label && <span className="text-gray-400 font-normal">{change.label}</span>}
            </div>
          )}
        </div>

        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-105',
            gradient
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
