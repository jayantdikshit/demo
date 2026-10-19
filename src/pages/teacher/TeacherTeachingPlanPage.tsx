import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatDate } from '@/lib/utils';
import {
  BookOpenCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import type { TeachingPlan } from '@/types';

export function TeacherTeachingPlanPage() {
  const { teachingPlans, subjects, classes } = useSchoolData();
  const { updateTopicStatus } = useAppStore();

  const teacherId = 'tch-001';
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filter plans for this teacher and sort by date, putting today's plans at the top
  const myPlans = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const filtered = teachingPlans.filter(
      (tp) => tp.teacherId === teacherId && (selectedClassId === 'all' || tp.classId === selectedClassId)
    );

    return filtered.sort((a, b) => {
      // Prioritize today's plans
      if (a.scheduledDate === today && b.scheduledDate !== today) return -1;
      if (a.scheduledDate !== today && b.scheduledDate === today) return 1;
      
      // Then prioritize overdue
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      
      // Otherwise sort by date ascending
      return a.scheduledDate.localeCompare(b.scheduledDate);
    });
  }, [teachingPlans, teacherId, selectedClassId]);

  const completedPlans = myPlans.filter((p) => p.status === 'completed');
  const overduePlans = myPlans.filter((p) => p.status === 'overdue');
  const pendingPlans = myPlans.filter((p) => p.status === 'pending');
  const completionRate = myPlans.length > 0 ? Math.round((completedPlans.length / myPlans.length) * 100) : 0;

  const handleMarkComplete = (topic: TeachingPlan) => {
    const today = new Date().toISOString().split('T')[0];
    updateTopicStatus(topic.id, 'completed', today);
    setActionSuccess(`Topic "${topic.topicName}" marked as COMPLETED on ${today}!`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleMarkPending = (topic: TeachingPlan) => {
    updateTopicStatus(topic.id, 'overdue');
    setActionSuccess(`Topic "${topic.topicName}" carried forward to overdue queue.`);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <PageWrapper
      title="Lesson Delivery & Teaching Plan Register"
      subtitle="Track daily topic deliveries, record completions, and manage carried-over syllabus units"
    >
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Progress & Pacing Card */}
      <Card className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Curriculum Delivery Progress
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              {completionRate}% of Syllabus Covered
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {completedPlans.length} of {myPlans.length} scheduled topics completed to date
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-blue-800 text-xs font-bold shadow-xs border border-blue-200">
              {overduePlans.length} Carried Over
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/80 rounded-full h-3 overflow-hidden shadow-inner border border-blue-100">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </Card>

      {/* Class Selector Filter */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Filter Class:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Assigned Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.className}-{c.section}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-400">Total {myPlans.length} units</span>
      </div>

      {/* Teaching Plan List Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            Teaching Plan Topics &amp; Status Actions
          </CardTitle>
          <p className="text-xs text-gray-500">
            Marking pending will automatically carry forward the topic to next day&rsquo;s schedule
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPlans.map((plan) => {
                const subject = subjects.find((s) => s.id === plan.subjectId);
                const cls = classes.find((c) => c.id === plan.classId);
                const isOverdue = plan.status === 'overdue';
                const isDone = plan.status === 'completed';

                return (
                  <TableRow key={plan.id} className={isOverdue ? 'bg-amber-50/30' : 'hover:bg-gray-50/80'}>
                    <TableCell>
                      <span className="font-bold text-gray-900 text-xs sm:text-sm block">
                        {plan.topicName}
                      </span>
                      <span className="text-[11px] text-gray-400 block">{plan.notes || 'Core lesson unit'}</span>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-gray-700">
                      {subject?.name || plan.subjectId}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      Class {cls ? `${cls.className}-${cls.section}` : ''}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      <div className="flex flex-col gap-1">
                        <span>{formatDate(plan.scheduledDate)}</span>
                        {plan.scheduledDate === new Date().toISOString().split('T')[0] && (
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-max">
                            TODAY'S SCHEDULE
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isDone ? (
                        <Badge status="Completed">Completed</Badge>
                      ) : isOverdue ? (
                        <Badge status="Overdue">Overdue / Carried</Badge>
                      ) : (
                        <Badge status="Pending">Scheduled</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!isDone ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleMarkComplete(plan)}
                            className="h-7 px-2.5 text-xs gap-1"
                          >
                            <CheckCircle2 size={13} />
                            <span>Mark Complete</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkPending(plan)}
                            className="h-7 px-2 text-xs border-amber-200 text-amber-700 hover:bg-amber-50"
                            title="Carry forward to next day"
                          >
                            <Clock size={13} />
                            <span>Carry Forward</span>
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center justify-end gap-1">
                          <CheckCircle2 size={14} />
                          <span>Finished {plan.completedDate ? `(${formatDate(plan.completedDate)})` : ''}</span>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
