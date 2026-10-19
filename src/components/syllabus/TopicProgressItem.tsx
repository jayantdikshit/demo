import * as React from 'react';
import { cn, formatDate } from '@/lib/utils';
import { Badge, type BadgeStatus } from '@/components/common/Badge';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { TeachingPlan } from '@/types';

export interface TopicProgressItemProps {
  topic: TeachingPlan;
  onStatusChange?: (status: TeachingPlan['status']) => void;
}

export const TopicProgressItem: React.FC<TopicProgressItemProps> = ({ topic, onStatusChange }) => {
  const statusBadgeMap: Record<TeachingPlan['status'], BadgeStatus> = {
    completed: 'Completed',
    pending: 'Pending',
    overdue: 'Overdue',
  };

  const statusIcons = {
    completed: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    pending: <Clock className="h-4 w-4 text-amber-500" />,
    overdue: <AlertTriangle className="h-4 w-4 text-rose-600" />,
  };

  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all">
      <div className="flex items-start gap-3">
        <div className="mt-1 shrink-0">{statusIcons[topic.status]}</div>
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{topic.topicName}</h4>
          <p className="text-xs text-gray-500">Scheduled: {formatDate(topic.scheduledDate)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge status={statusBadgeMap[topic.status]}>{topic.status.toUpperCase()}</Badge>
        {onStatusChange && (
          <select
            value={topic.status}
            onChange={(e) => onStatusChange(e.target.value as TeachingPlan['status'])}
            className="text-xs border border-gray-200 rounded-md p-1 bg-gray-50 text-gray-700"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        )}
      </div>
    </div>
  );
};
