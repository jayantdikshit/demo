import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { formatDate } from '@/lib/utils';
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  UserCheck,
  TrendingUp,
  RotateCcw,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { TeachingPlan } from '@/types';

export function SyllabusPage() {
  const { schoolConfig, teachers, classes, subjects, teachingPlans } = useSchoolData();
  const { addNotification, updateTopicStatus, addTeachingPlans, removeTeachingPlan } = useAppStore();

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('all');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [reminderModalTopic, setReminderModalTopic] = useState<TeachingPlan | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    topicName: '',
    subjectId: '',
    classId: '',
    teacherId: '',
    scheduledDate: '',
    notes: '',
  });

  // Filtered topics
  const filteredPlans = useMemo(() => {
    return teachingPlans.filter((tp) => {
      const matchTeacher = selectedTeacherId === 'all' || tp.teacherId === selectedTeacherId;
      const matchClass = selectedClassId === 'all' || tp.classId === selectedClassId;
      return matchTeacher && matchClass;
    });
  }, [teachingPlans, selectedTeacherId, selectedClassId]);

  // Overall syllabus completion rate
  const totalTopics = filteredPlans.length;
  const completedTopics = filteredPlans.filter((tp) => tp.status === 'completed').length;
  const overdueTopics = filteredPlans.filter((tp) => tp.status === 'overdue');
  const overallCompletionRate = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 75;

  // Teacher-wise progress rates
  const teacherProgress = useMemo(() => {
    return teachers.map((teacher) => {
      const teacherPlans = teachingPlans.filter((tp) => tp.teacherId === teacher.id);
      const total = teacherPlans.length || 1;
      const comp = teacherPlans.filter((tp) => tp.status === 'completed').length;
      const overdue = teacherPlans.filter((tp) => tp.status === 'overdue').length;
      const rate = Math.round((comp / total) * 100);
      return {
        teacher,
        total: teacherPlans.length,
        completed: comp,
        overdue,
        rate,
      };
    });
  }, [teachers, teachingPlans]);

  const handleSendReminder = () => {
    if (!reminderModalTopic) return;
    const assignedTeacher = teachers.find((t) => t.id === reminderModalTopic.teacherId);

    addNotification({
      id: `notif-${Date.now()}`,
      schoolId: schoolConfig.schoolId,
      type: 'syllabus_delayed',
      title: `Reminder Sent: ${reminderModalTopic.topicName}`,
      message: `Management dispatched an overdue reminder to ${assignedTeacher?.name || 'Faculty'} for topic ${reminderModalTopic.topicName}.`,
      recipientRole: 'teacher',
      recipientId: reminderModalTopic.teacherId,
      relatedStudentId: null,
      isRead: false,
      createdAt: new Date().toISOString(),
      priority: 'high',
      actionUrl: '/teacher/teaching-plan',
    });

    setActionSuccess(`Priority reminder dispatched to ${assignedTeacher?.name}!`);
    setReminderModalTopic(null);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: TeachingPlan = {
      id: generateId(),
      schoolId: schoolConfig.schoolId,
      subjectId: formData.subjectId,
      classId: formData.classId,
      teacherId: formData.teacherId,
      topicName: formData.topicName,
      scheduledDate: formData.scheduledDate,
      status: 'pending',
      notes: formData.notes,
    };
    addTeachingPlans([newPlan]);
    setIsAddTopicModalOpen(false);
    setActionSuccess(`Topic "${newPlan.topicName}" added successfully.`);
    setTimeout(() => setActionSuccess(null), 3500);
    setFormData({
      topicName: '',
      subjectId: '',
      classId: '',
      teacherId: '',
      scheduledDate: '',
      notes: '',
    });
  };

  const handleDeletePlan = (planId: string) => {
    removeTeachingPlan(planId);
    setActionSuccess('Teaching plan topic deleted successfully.');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <PageWrapper
      title="Syllabus Tracking & Term Plans"
      subtitle="Monitor academic delivery schedules and curriculum compliance"
      action={
        <Button onClick={() => setIsAddTopicModalOpen(true)} className="gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
          <UploadCloud size={16} />
          Add New Topic
        </Button>
      }
    >
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Syllabus Covered</span>
            <TrendingUp size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-blue-700 mt-2">{overallCompletionRate}%</p>
          <span className="text-xs text-gray-500">{completedTopics} of {totalTopics} topics finished</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Completed</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{completedTopics}</p>
          <span className="text-xs text-emerald-600 font-medium">On track delivery</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Pending Review</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">
            {filteredPlans.filter((p) => p.status === 'pending').length}
          </p>
          <span className="text-xs text-gray-500">Scheduled for this term</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Overdue Topics</span>
            <AlertTriangle size={18} className="text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">{overdueTopics.length}</p>
          <span className="text-xs text-rose-600 font-medium">Requires management action</span>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-700">Filter Teacher:</span>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Faculty Members</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-700">Filter Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.className}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Teacher-Wise Progress Bars */}
      <Card className="mb-8">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            Faculty Syllabus Delivery Benchmark
          </CardTitle>
          <p className="text-xs text-gray-500">Curriculum coverage performance per assigned faculty member</p>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teacherProgress.map(({ teacher, completed, total, overdue, rate }) => (
            <div key={teacher.id} className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{teacher.name}</h4>
                  <p className="text-xs text-gray-500">{teacher.designation}</p>
                </div>
                <span className="text-xs font-extrabold text-blue-700 px-2 py-0.5 rounded bg-blue-50">
                  {rate}%
                </span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    rate >= 75 ? 'bg-emerald-500' : rate >= 50 ? 'bg-blue-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${rate}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span>{completed} / {total} Topics</span>
                {overdue > 0 && (
                  <span className="font-semibold text-rose-600">{overdue} Overdue</span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Teaching Plan Table with Status and Escalation Action */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Curriculum Topics ({filteredPlans.length})
            </CardTitle>
            <p className="text-xs text-gray-500">Detailed scheduled timeline and delivery status</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Assigned Teacher</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Management Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => {
                const assignedTeacher = teachers.find((t) => t.id === plan.teacherId);
                const assignedSubject = subjects.find((s) => s.id === plan.subjectId);
                return (
                  <TableRow key={plan.id} className="hover:bg-gray-50/80">
                    <TableCell>
                      <span className="font-bold text-gray-900 text-xs sm:text-sm block">
                        {plan.topicName}
                      </span>
                      <span className="text-xs text-gray-500 block">{plan.notes || 'Standard curriculum'}</span>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-gray-700">
                      {assignedSubject?.name || plan.subjectId}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {assignedTeacher?.name || 'Assigned Faculty'}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {formatDate(plan.scheduledDate)}
                    </TableCell>
                    <TableCell>
                      {plan.status === 'completed' ? (
                        <Badge status="Completed">Completed</Badge>
                      ) : plan.status === 'overdue' ? (
                        <Badge status="Overdue">Overdue</Badge>
                      ) : (
                        <Badge status="Pending">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end gap-1">
                      {plan.status === 'overdue' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setReminderModalTopic(plan)}
                          className="text-xs gap-1 h-7 px-2"
                        >
                          <Send size={12} />
                          Remind
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        className="h-7 w-7 p-0 hover:bg-rose-50 text-rose-500 hover:text-rose-600"
                        title="Delete Plan"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reminder / Escalation Modal */}
      {reminderModalTopic && (
        <Modal
          isOpen={Boolean(reminderModalTopic)}
          onClose={() => setReminderModalTopic(null)}
          title="Curriculum Escalation Notice"
          description={`Topic "${reminderModalTopic.topicName}" is delayed past ${formatDate(reminderModalTopic.scheduledDate)}.`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setReminderModalTopic(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSendReminder}>
                Dispatch Escalation Alert
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed">
              This action will dispatch a priority notification to the teacher&rsquo;s portal and notify the department head regarding the syllabus delay.
            </div>
            <p className="text-gray-600">
              Assigned Faculty: <strong>{teachers.find((t) => t.id === reminderModalTopic.teacherId)?.name}</strong>
            </p>
          </div>
        </Modal>
      )}

      {/* Add Topic Modal */}
      <Modal
        isOpen={isAddTopicModalOpen}
        onClose={() => setIsAddTopicModalOpen(false)}
        title="Add New Curriculum Topic"
        description="Schedule a new topic for a specific class and subject."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Topic Name</label>
              <input required type="text" value={formData.topicName} onChange={(e) => setFormData({ ...formData, topicName: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Introduction to Algebra" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
              <select required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Class</label>
              <select required value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.className} - {c.section}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Assign Teacher</label>
              <select required value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Scheduled Date</label>
              <input required type="date" value={formData.scheduledDate} onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Notes (Optional)</label>
              <textarea rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="Any additional notes..." />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsAddTopicModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Topic</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
