import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge, type BadgeStatus } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { formatDate } from '@/lib/utils';
import {
  HeartPulse,
  CheckCircle2,
  Clock,
  Users,
  AlertCircle,
  Plus,
  BookOpen,
} from 'lucide-react';
import type { Intervention, InterventionType } from '@/types';

export function TeacherInterventionsPage() {
  const { students, schoolConfig } = useSchoolData();
  const { interventions, updateInterventionStatus, createIntervention } = useAppStore();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [planType, setPlanType] = useState<InterventionType>('remedial_class');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Baseline sample interventions if list is empty
  const teacherInterventions: Intervention[] = useMemo(() => {
    if (interventions.length > 0) return interventions;
    return [
      {
        id: 'int-001',
        schoolId: schoolConfig.schoolId,
        studentId: students[0]?.id || 'stu-001',
        teacherId: 'tch-001',
        type: 'remedial_class',
        reason: 'Scored 28/100 in Algebra diagnostic test',
        plannedDate: '2026-09-12',
        completedDate: null,
        status: 'in_progress',
        notes: 'Conduct 3 extra afternoon sessions on Fractions & Linear Equations.',
        createdAt: '2026-09-07T10:00:00Z',
      },
      {
        id: 'int-002',
        schoolId: schoolConfig.schoolId,
        studentId: students[1]?.id || 'stu-002',
        teacherId: 'tch-001',
        type: 'parent_meeting',
        reason: 'Consecutive Monday absences dropped attendance to 71%',
        plannedDate: '2026-09-14',
        completedDate: null,
        status: 'planned',
        notes: 'Formal meeting with father to address chronic absenteeism.',
        createdAt: '2026-09-08T11:30:00Z',
      },
    ];
  }, [interventions, students, schoolConfig]);

  const filtered = useMemo(() => {
    return teacherInterventions.filter((inv) => filterStatus === 'all' || inv.status === filterStatus);
  }, [teacherInterventions, filterStatus]);

  const handleCreateNew = () => {
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student) return;

    createIntervention({
      id: `int-${Date.now()}`,
      schoolId: schoolConfig.schoolId,
      studentId: selectedStudentId,
      teacherId: 'tch-001',
      type: planType,
      reason: reason || 'Identified for academic/attendance support during lesson review',
      plannedDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      completedDate: null,
      status: 'in_progress',
      notes: notes || 'Remedial coaching scheduled.',
      createdAt: new Date().toISOString(),
    });

    setActionSuccess(`Intervention scheduled for ${student.name}!`);
    setCreateModalOpen(false);
    setReason('');
    setNotes('');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleMarkComplete = (id: string) => {
    updateInterventionStatus(id, 'completed', 'Completed target remedial coaching goals.');
    setActionSuccess('Intervention marked as COMPLETED!');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const getStatusBadge = (status: Intervention['status']): BadgeStatus => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'Pending';
      case 'planned':
        return 'Active';
      default:
        return 'Rejected';
    }
  };

  return (
    <PageWrapper
      title="Student Interventions & Remedial Action Plans"
      subtitle="Detect → Alert → Action → Follow-up: Structured corrective plans for struggling learners"
      action={
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2 text-xs">
          <Plus size={14} />
          <span>New Remedial Plan</span>
        </Button>
      }
    >
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">Total Interventions</span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{teacherInterventions.length}</p>
          <span className="text-[11px] text-gray-400">Targeted student actions</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">In Progress</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {teacherInterventions.filter((i) => i.status === 'in_progress').length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Currently receiving coaching</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">Scheduled Planned</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">
            {teacherInterventions.filter((i) => i.status === 'planned').length}
          </p>
          <span className="text-[11px] text-gray-400">Upcoming parent/remedial dates</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">Completed Success</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {teacherInterventions.filter((i) => i.status === 'completed').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Closed with improvement</span>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Plans ({teacherInterventions.length})</option>
            <option value="in_progress">In Progress</option>
            <option value="planned">Planned</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <span className="text-xs text-gray-400">Synchronized with Management Analytics</span>
      </div>

      {/* Interventions Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            Active &amp; Historical Remedial Interventions ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Intervention Strategy</TableHead>
                <TableHead>Reason / Trigger</TableHead>
                <TableHead>Planned Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    No interventions found in this view.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((inv) => {
                  const student = students.find((s) => s.id === inv.studentId);
                  const isDone = inv.status === 'completed';

                  return (
                    <TableRow key={inv.id} className="hover:bg-gray-50/80">
                      <TableCell>
                        <span className="font-bold text-gray-900 text-xs sm:text-sm block">
                          {student?.name || 'Student'}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {student ? `Class ${student.className}-${student.section}` : ''}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">
                          {inv.type.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 max-w-xs">
                        <span className="font-medium block truncate">{inv.reason}</span>
                        {inv.notes && (
                          <span className="text-[10px] text-gray-400 block truncate">{inv.notes}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">
                        {formatDate(inv.plannedDate)}
                      </TableCell>
                      <TableCell>
                        <Badge status={getStatusBadge(inv.status)}>
                          {inv.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!isDone ? (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleMarkComplete(inv.id)}
                            className="h-7 text-xs gap-1"
                          >
                            <CheckCircle2 size={13} />
                            <span>Mark Completed</span>
                          </Button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center justify-end gap-1">
                            <CheckCircle2 size={13} />
                            <span>Closed</span>
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Intervention Modal */}
      {createModalOpen && (
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Create New Student Intervention"
          description="Establish structured remedial support tracked across Teacher & Management portals"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateNew}>
                Schedule &amp; Log Intervention
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Target Student:</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Class {s.className}-{s.section}, Roll #{s.rollNo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Intervention Strategy:</label>
              <select
                value={planType}
                onChange={(e) => setPlanType(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="remedial_class">Remedial Class (After School)</option>
                <option value="extra_practice">Extra Practice Worksheets</option>
                <option value="parent_meeting">Formal Parent Meeting</option>
                <option value="counseling">Academic Counseling Session</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Trigger / Root Cause:</label>
              <input
                type="text"
                placeholder="e.g. Scored 30% in Algebra, missed 4 classes"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Action Plan Notes:</label>
              <textarea
                rows={3}
                placeholder="Specific guidance points, worksheets to assign, or meeting agenda..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
}
