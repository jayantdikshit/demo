import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export interface RiskCardProps {
  studentName: string;
  classNameSection: string;
  riskType: 'attendance' | 'marks' | 'fee' | 'multiple';
  severity: 'high' | 'medium' | 'low';
  details: string;
  metricLabel: string;
  metricValue: string;
  onTakeAction?: () => void;
  className?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  studentName,
  classNameSection,
  riskType,
  severity,
  details,
  metricLabel,
  metricValue,
  onTakeAction,
  className,
}) => {
  const severityColors = {
    high: 'border-l-rose-500 bg-rose-50/20 hover:border-rose-300',
    medium: 'border-l-amber-500 bg-amber-50/20 hover:border-amber-300',
    low: 'border-l-yellow-400 bg-yellow-50/20 hover:border-yellow-300',
  };

  const riskTypeLabels = {
    attendance: 'Low Attendance',
    marks: 'Failing Marks',
    fee: 'Fee Overdue',
    multiple: 'Multiple Risks',
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200/80 border-l-4 p-4 bg-white shadow-sm transition-all hover:shadow-md',
        severityColors[severity],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {severity === 'high' ? (
            <AlertCircle className="h-5 w-5 text-rose-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">{studentName}</h4>
            <span className="text-xs text-gray-500 font-medium">({classNameSection})</span>
            <Badge status="At Risk">{riskTypeLabels[riskType]}</Badge>
          </div>
          <p className="text-xs text-gray-600 mt-1">{details}</p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{metricLabel}</p>
          <p className="text-sm font-bold text-gray-900">{metricValue}</p>
        </div>
        {onTakeAction && (
          <button
            onClick={onTakeAction}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
          >
            <span>Intervene</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
