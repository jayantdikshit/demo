import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className,
}) => {
  const configs = {
    success: {
      border: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      icon: <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />,
    },
    warning: {
      border: 'border-amber-200 bg-amber-50 text-amber-900',
      icon: <AlertTriangle className="text-amber-600 shrink-0" size={18} />,
    },
    error: {
      border: 'border-red-200 bg-red-50 text-red-900',
      icon: <AlertCircle className="text-red-600 shrink-0" size={18} />,
    },
    info: {
      border: 'border-blue-200 bg-blue-50 text-blue-900',
      icon: <Info className="text-blue-600 shrink-0" size={18} />,
    },
  };

  const config = configs[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 shadow-md transition-all duration-200',
        config.border,
        className
      )}
    >
      <div className="mt-0.5">{config.icon}</div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && <p className="text-xs opacity-90 mt-0.5">{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 rounded-md p-1 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
