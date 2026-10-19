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
  AlertTriangle,
  IndianRupee,
  BookOpen,
} from 'lucide-react';

export function StudentAlertsPage() {
  const { notifications, students } = useSchoolData();
  const { markNotificationRead, markAllNotificationsRead } = useAppStore();

  const student = students[0];
  const [filterType, setFilterType] = useState<string>('all');

  // Filter alerts relevant to this student
  const studentAlerts = useMemo(() => {
    return notifications.filter((n) => {
      const isMine =
        n.relatedStudentId === student?.id ||
        n.recipientRole === 'student' ||
        n.recipientRole === 'parent' ||
        n.type === 'announcement';

      if (!isMine) return false;
      if (filterType === 'all') return true;
      if (filterType === 'attendance') return n.type === 'absence' || n.type === 'low_attendance';
      if (filterType === 'academics') return n.type === 'low_marks';
      if (filterType === 'fees') return n.type === 'fee_reminder' || n.type === 'fee_submitted';
      return true;
    });
  }, [notifications, student, filterType]);

  const unreadCount = studentAlerts.filter((a) => !a.isRead).length;

  return (
    <PageWrapper
      title="Student Notices & Risk Alerts"
      subtitle="Important communications regarding daily attendance logs, examination performance, and fee schedules"
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
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'all', label: 'All Notices', count: studentAlerts.length },
          { id: 'attendance', label: '🔴 Attendance Alerts', count: studentAlerts.filter((a) => a.type === 'absence' || a.type === 'low_attendance').length },
          { id: 'academics', label: '🟠 Academic Notices', count: studentAlerts.filter((a) => a.type === 'low_marks').length },
          { id: 'fees', label: '💰 Fee Notices', count: studentAlerts.filter((a) => a.type === 'fee_reminder' || a.type === 'fee_submitted').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterType === tab.id ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Alerts Stream */}
      <div className="space-y-3">
        {studentAlerts.length === 0 ? (
          <Card className="p-12 text-center text-gray-400">
            <Bell size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No active alerts</p>
            <p className="text-xs text-gray-400 mt-1">Your academic and attendance records are in good standing.</p>
          </Card>
        ) : (
          studentAlerts.map((notif) => (
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
