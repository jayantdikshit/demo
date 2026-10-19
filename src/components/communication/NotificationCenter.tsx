import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { SimulatedParentView, alertPresets } from './SimulatedParentView';
import { formatDateTime } from '@/lib/utils';
import {
  Bell,
  CheckCheck,
  Calendar,
  IndianRupee,
  BookOpen,
  AlertTriangle,
  Filter,
  Sparkles,
  Eye,
  Send,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Clock,
  UserCheck,
} from 'lucide-react';
import type { NotificationType } from '@/types';

interface NotificationCenterProps {
  roleFilter?: string;
  showSimulateTrigger?: boolean;
}

export function NotificationCenter({ roleFilter, showSimulateTrigger = true }: NotificationCenterProps) {
  const { notifications, schoolConfig } = useSchoolData();
  const { markNotificationRead, markAllNotificationsRead, triggerSimulatedAlert } = useAppStore();

  const [activeTab, setActiveTab] = useState<'feed' | 'parent_preview'>('feed');
  const [selectedAlertForPreview, setSelectedAlertForPreview] = useState<string>('student_absent');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [simulateSuccessMessage, setSimulateSuccessMessage] = useState<string | null>(null);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Role scope filter
      if (roleFilter && (n.recipientRole as string) !== roleFilter && (n.recipientRole as string) !== 'all') {
        // if viewing as accounts, show accounts and parent notifications
        if (roleFilter === 'accounts' && n.type !== 'fee_reminder' && n.type !== 'fee_submitted' && n.type !== 'payment_verified' && n.type !== 'payment_rejected') {
          // allow general viewing if needed
        }
      }

      // Category filter
      let matchCat = true;
      if (categoryFilter === 'absence') matchCat = n.type === 'absence';
      else if (categoryFilter === 'attendance') matchCat = n.type === 'low_attendance';
      else if (categoryFilter === 'marks') matchCat = n.type === 'low_marks';
      else if (categoryFilter === 'fee') matchCat = n.type === 'fee_reminder' || n.type === 'fee_submitted' || n.type === 'payment_verified' || n.type === 'payment_rejected';
      else if (categoryFilter === 'syllabus') matchCat = n.type === 'syllabus_delayed';
      else if (categoryFilter === 'intervention') matchCat = n.type === 'intervention';

      // Read filter
      let matchRead = true;
      if (readFilter === 'unread') matchRead = !n.isRead;
      else if (readFilter === 'read') matchRead = n.isRead;

      return matchCat && matchRead;
    });
  }, [notifications, roleFilter, categoryFilter, readFilter]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSimulate = (alertType: any, presetId: string) => {
    triggerSimulatedAlert(alertType);
    setSelectedAlertForPreview(presetId);
    setSimulateSuccessMessage(`Dispatched alert: "${alertType.replace(/_/g, ' ').toUpperCase()}" to Parent & Management queues!`);
    setTimeout(() => setSimulateSuccessMessage(null), 4000);
  };

  const getAlertIcon = (type: NotificationType) => {
    switch (type) {
      case 'absence':
        return <UserCheck className="w-4 h-4 text-rose-500" />;
      case 'low_attendance':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'low_marks':
      case 'poor_performance':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'fee_reminder':
      case 'fee_submitted':
      case 'payment_verified':
      case 'payment_rejected':
        return <IndianRupee className="w-4 h-4 text-emerald-500" />;
      case 'syllabus_delayed':
        return <BookOpen className="w-4 h-4 text-purple-500" />;
      case 'intervention':
        return <ShieldAlert className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border/80 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">Parent & Institutional Communications</h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time threshold incident feeds, WhatsApp dispatch triggers, and parent delivery channels
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="flex bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-card text-foreground shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Alert Feed ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('parent_preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'parent_preview'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Simulated Parent View</span>
            </button>
          </div>

          {unreadCount > 0 && activeTab === 'feed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllNotificationsRead}
              className="text-xs gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Mark All Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Simulator Trigger Bar (1-Click Test for All 8 Alerts) */}
      {showSimulateTrigger && (
        <div className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 border border-blue-500/20 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Instant Alert Simulator (Test 8 Automated Triggers):
              </h4>
            </div>
            <span className="text-[11px] text-muted-foreground">
              Click any button to trigger live event & auto-dispatch
            </span>
          </div>

          {simulateSuccessMessage && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCheck className="w-4 h-4 shrink-0" />
              <span>{simulateSuccessMessage}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {[
              { label: '🔴 1. Absent Today', type: 'student_absent', preset: 'student_absent' },
              { label: '🟡 2. Attendance <75%', type: 'attendance_below_threshold', preset: 'attendance_below_threshold' },
              { label: '🟠 3. Low Marks (<40%)', type: 'marks_below_threshold', preset: 'marks_below_threshold' },
              { label: '⚠️ 4. Compound Risk', type: 'poor_performance', preset: 'poor_performance' },
              { label: '💰 5. Fee Pending', type: 'fee_pending', preset: 'fee_pending' },
              { label: '🧾 6. Payment Submitted', type: 'payment_submitted', preset: 'payment_submitted' },
              { label: '📚 7. Syllabus Delayed', type: 'syllabus_delayed', preset: 'syllabus_delayed' },
              { label: '🎯 8. Intervention Review', type: 'intervention_review', preset: 'intervention_review' },
            ].map((btn) => (
              <Button
                key={btn.type}
                size="sm"
                variant="outline"
                onClick={() => handleSimulate(btn.type, btn.preset)}
                className="text-xs py-1 px-2.5 bg-card hover:bg-blue-50 dark:hover:bg-blue-950/40 border-border/80 hover:border-blue-500/50"
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Tab Content ── */}
      {activeTab === 'feed' ? (
        <div className="space-y-4">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All Alerts', count: notifications.length },
              { id: 'absence', label: 'Absence', count: notifications.filter((n) => n.type === 'absence').length },
              { id: 'attendance', label: 'Low Attendance', count: notifications.filter((n) => n.type === 'low_attendance').length },
              { id: 'marks', label: 'Marks & Academic', count: notifications.filter((n) => n.type === 'low_marks' || n.type === 'poor_performance').length },
              { id: 'fee', label: 'Fee & Payments', count: notifications.filter((n) => n.type === 'fee_reminder' || n.type === 'fee_submitted' || n.type === 'payment_verified' || n.type === 'payment_rejected').length },
              { id: 'syllabus', label: 'Syllabus', count: notifications.filter((n) => n.type === 'syllabus_delayed').length },
              { id: 'intervention', label: 'Interventions', count: notifications.filter((n) => n.type === 'intervention').length },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  categoryFilter === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-card border border-border/70 text-foreground/80 hover:bg-muted/60'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  categoryFilter === cat.id ? 'bg-blue-700 text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Notifications Feed */}
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground space-y-2">
                <Bell className="w-8 h-8 mx-auto text-muted-foreground/50" />
                <p className="font-semibold text-sm">No notifications found in this filter</p>
                <p className="text-xs">Use the Simulator bar above to trigger live alerts</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    !n.isRead
                      ? 'bg-card border-blue-500/40 shadow-sm'
                      : 'bg-card/60 border-border/70 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-muted/60 border border-border/60 shrink-0 mt-0.5">
                        {getAlertIcon(n.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className={`text-sm font-bold ${!n.isRead ? 'text-foreground' : 'text-foreground/80'}`}>
                            {n.title}
                          </h4>
                          {!n.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          )}
                          <Badge variant="outline" className="text-[10px] font-mono capitalize">
                            Target: {n.recipientRole}
                          </Badge>
                          <Badge
                            variant={n.priority === 'high' ? 'destructive' : 'outline'}
                            className="text-[10px] uppercase font-bold"
                          >
                            {n.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed font-normal">
                          {n.message}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(n.createdAt)}
                          </span>
                          <span>•</span>
                          <span>School: {schoolConfig.shortName || 'Vidya Public'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedAlertForPreview('student_absent');
                          setActiveTab('parent_preview');
                        }}
                        className="text-xs flex items-center gap-1 h-8"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="hidden sm:inline">Parent View</span>
                      </Button>
                      {!n.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markNotificationRead(n.id)}
                          className="text-xs h-8 text-blue-600 hover:text-blue-700"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Parent View Tab */
        <SimulatedParentView initialAlertId={selectedAlertForPreview} />
      )}
    </div>
  );
}
