import * as React from 'react';
import { cn, formatDateTime } from '@/lib/utils';
import { Bell, AlertCircle, Calendar, CheckCircle2, IndianRupee, ArrowRight } from 'lucide-react';
import type { Notification } from '@/types';
import { Link } from 'react-router-dom';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkRead }) => {
  const { schoolPath } = useSchoolSlug();
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'absence':
      case 'low_attendance':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'low_marks':
      case 'complaint_update':
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case 'fee_reminder':
      case 'fee_submitted':
        return <IndianRupee className="h-4 w-4 text-emerald-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3.5 rounded-xl border transition-all',
        notification.isRead
          ? 'bg-white border-gray-100 text-gray-600'
          : 'bg-blue-50/40 border-blue-100 text-gray-900 shadow-xs'
      )}
    >
      <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-gray-100 shadow-xs">
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={cn('text-sm truncate', notification.isRead ? 'font-medium' : 'font-bold text-gray-900')}>
            {notification.title}
          </h4>
          <span className="text-[10px] text-gray-400 shrink-0">
            {formatDateTime(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>

        <div className="flex items-center justify-between mt-2 pt-1">
          {notification.actionUrl ? (
            <Link
              to={schoolPath(notification.actionUrl)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>View Details</span>
              <ArrowRight size={12} />
            </Link>
          ) : (
            <span />
          )}

          {!notification.isRead && onMarkRead && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="text-[11px] font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
