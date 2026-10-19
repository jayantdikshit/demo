import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { NotificationItem } from '@/components/communication/NotificationItem';
import {
  Bell,
  CheckCheck,
  Calendar,
  IndianRupee,
  BookOpen,
  AlertTriangle,
  Filter,
} from 'lucide-react';
import type { NotificationType } from '@/types';

export function NotificationsPage() {
  const { notifications } = useSchoolData();
  const { markNotificationRead, markAllNotificationsRead } = useAppStore();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'absence' | 'attendance' | 'marks' | 'fee' | 'syllabus'>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category filter
      let matchCategory = true;
      if (categoryFilter === 'absence') matchCategory = n.type === 'absence';
      else if (categoryFilter === 'attendance') matchCategory = n.type === 'low_attendance';
      else if (categoryFilter === 'marks') matchCategory = n.type === 'low_marks';
      else if (categoryFilter === 'fee') matchCategory = n.type === 'fee_reminder' || n.type === 'fee_submitted';
      else if (categoryFilter === 'syllabus') matchCategory = n.type === 'syllabus_delayed' || n.type === 'intervention';

      // Read filter
      let matchRead = true;
      if (readFilter === 'unread') matchRead = !n.isRead;
      else if (readFilter === 'read') matchRead = n.isRead;

      return matchCategory && matchRead;
    });
  }, [notifications, categoryFilter, readFilter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <PageWrapper
      title="Notification & Alert Intelligence Center"
      subtitle="Real-time automated incident alerts, parent notifications, and academic intervention queues"
      action={
        unreadCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            className="gap-2 text-xs"
          >
            <CheckCheck size={14} className="text-blue-600" />
            <span>Mark All as Read ({unreadCount})</span>
          </Button>
        ) : undefined
      }
    >
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'all', label: 'All Alerts', count: notifications.length },
          { id: 'absence', label: '🔴 Absence Alerts', count: notifications.filter((n) => n.type === 'absence').length },
          { id: 'attendance', label: '🟡 Low Attendance', count: notifications.filter((n) => n.type === 'low_attendance').length },
          { id: 'marks', label: '🟠 Low Marks', count: notifications.filter((n) => n.type === 'low_marks').length },
          { id: 'fee', label: '💰 Fee Reminders', count: notifications.filter((n) => n.type === 'fee_reminder' || n.type === 'fee_submitted').length },
          { id: 'syllabus', label: '📚 Syllabus Delays', count: notifications.filter((n) => n.type === 'syllabus_delayed').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              categoryFilter === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                categoryFilter === tab.id ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Read Status Toggle */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Filter Read Status:</span>
          <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 text-xs">
            <button
              onClick={() => setReadFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                readFilter === 'all' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setReadFilter('unread')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                readFilter === 'unread' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setReadFilter('read')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                readFilter === 'read' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600'
              }`}
            >
              Read
            </button>
          </div>
        </div>

        <span className="text-xs text-gray-400">Showing {filteredNotifications.length} alerts</span>
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center text-gray-400">
            <Bell size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No alerts found in this category.</p>
            <p className="text-xs text-gray-400 mt-1">
              All automated compliance and risk monitors are clear.
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onMarkRead={markNotificationRead}
            />
          ))
        )}
      </div>
    </PageWrapper>
  );
}
