import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PageWrapperProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  statusBadge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subtitle,
  action,
  statusBadge,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-6 pb-12', className)}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            {statusBadge && <div>{statusBadge}</div>}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1 font-normal">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
      </div>

      {/* Page Body */}
      <div>{children}</div>
    </div>
  );
};
