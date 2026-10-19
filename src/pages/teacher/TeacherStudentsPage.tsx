import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { getInitials, getGrade } from '@/lib/utils';
import {
  Users,
  ShieldAlert,
  HeartPulse,
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';
import type { Student, InterventionType } from '@/types';

export function TeacherStudentsPage() {
  const { schoolConfig, students, classes, marksRecords, attendanceRecords } = useSchoolData();
  const { createIntervention } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-6');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAttentionOnly, setFilterAttentionOnly] = useState(false);

  // Intervention modal
  const [interventionStudent, setInterventionStudent] = useState<Student | null>(null);
  const [planType, setPlanType] = useState<InterventionType>('remedial_class');
  const [planNotes, setPlanNotes] = useState('');
  const [interventionSuccess, setInterventionSuccess] = useState<string | null>(null);

  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Compute student stats
  const studentStats = useMemo(() => {
    return classStudents.map((st) => {
      const att = attendanceRecords.filter((r) => r.studentId === st.id);
      const attended = att.filter((r) => r.status === 'present' || r.status === 'late').length;
      const attRate = att.length > 0 ? Math.round((attended / att.length) * 100) : 85;

      const marks = marksRecords.filter((m) => m.studentId === st.id);
      const avgMark =
        marks.length > 0
          ? Math.round(
              marks.reduce((sum, m) => sum + (m.marksObtained / m.maxMarks) * 100, 0) / marks.length
            )
          : 74;

      const needsAttention = attRate < schoolConfig.attendanceThreshold || avgMark < schoolConfig.marksThreshold;

      return {
        student: st,
        attRate,
        avgMark,
        needsAttention,
      };
    });
  }, [classStudents, attendanceRecords, marksRecords, schoolConfig]);

  const filtered = useMemo(() => {
    return studentStats.filter(({ student, needsAttention }) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAttention = !filterAttentionOnly || needsAttention;
      return matchSearch && matchAttention;
    });
  }, [studentStats, searchQuery, filterAttentionOnly]);

  const handleSaveIntervention = () => {
    if (!interventionStudent) return;
    createIntervention({
      id: `int-${Date.now()}`,
      schoolId: schoolConfig.schoolId,
      studentId: interventionStudent.id,
      teacherId: 'tch-001',
      type: planType,
      reason: `Flagged during teacher performance audit (Requires targeted academic/attendance intervention)`,
      plannedDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      status: 'in_progress',
      notes: planNotes || 'Remedial instruction and follow-up assigned.',
      createdAt: new Date().toISOString(),
    });

    setInterventionSuccess(`Intervention plan created for ${interventionStudent.name}!`);
    setInterventionStudent(null);
    setPlanNotes('');
    setTimeout(() => setInterventionSuccess(null), 3500);
  };

  const needingAttentionCount = studentStats.filter((s) => s.needsAttention).length;

  return (
    <PageWrapper
      title="Student Performance & Classroom Diagnostics"
      subtitle="Monitor individual student learning curves, identify gaps, and launch corrective intervention plans"
    >
      {/* Toast Alert */}
      {interventionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{interventionSuccess}</span>
        </div>
      )}

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">Enrolled Students</span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{classStudents.length}</p>
          <span className="text-[11px] text-gray-400">Class {classes.find((c) => c.id === selectedClassId)?.className}</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">Class Grade Average</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">74%</p>
          <span className="text-[11px] text-gray-400">Across all evaluations</span>
        </Card>

        <Card className="p-4 border-rose-200 bg-rose-50/40">
          <span className="text-xs font-bold text-rose-700 uppercase">Students Needing Attention</span>
          <p className="text-2xl font-extrabold text-rose-800 mt-1">{needingAttentionCount}</p>
          <span className="text-[11px] text-rose-600 font-medium">Below academic/attendance criteria</span>
        </Card>
      </div>

      {/* Filter Controls Bar */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-700">Class:</span>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  Class {c.className}-{c.section}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search student or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              onClick={() => setFilterAttentionOnly(!filterAttentionOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                filterAttentionOnly
                  ? 'bg-rose-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Needs Attention ({needingAttentionCount})
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Students Performance Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            Student Academic &amp; Attendance Diagnostic Roster
          </CardTitle>
          <p className="text-xs text-gray-500">Launch personalized remedial plans or counseling alerts</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Marks Average</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Intervention Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(({ student, attRate, avgMark, needsAttention }) => (
                <TableRow key={student.id} className={needsAttention ? 'bg-rose-50/20' : 'hover:bg-gray-50/80'}>
                  <TableCell className="font-bold text-gray-600 text-xs">{student.rollNo}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {getInitials(student.name)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-xs sm:text-sm block">
                          {student.name}
                        </span>
                        <span className="text-[10px] text-gray-400 block">{student.parentName}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-bold ${
                        attRate < schoolConfig.attendanceThreshold ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {attRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-gray-900">
                      {avgMark}% ({getGrade(avgMark)})
                    </span>
                  </TableCell>
                  <TableCell>
                    {needsAttention ? (
                      <Badge status="At Risk">Needs Attention</Badge>
                    ) : (
                      <Badge status="Completed">On Track</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={needsAttention ? 'destructive' : 'outline'}
                      onClick={() => setInterventionStudent(student)}
                      className="h-7 text-xs gap-1"
                    >
                      <HeartPulse size={12} />
                      <span>Plan Intervention</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Intervention Plan Modal */}
      {interventionStudent && (
        <Modal
          isOpen={Boolean(interventionStudent)}
          onClose={() => setInterventionStudent(null)}
          title={`Create Intervention: ${interventionStudent.name}`}
          description={`Class ${interventionStudent.className}-${interventionStudent.section} | Launch targeted academic support`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setInterventionStudent(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveIntervention}>
                Save Intervention Plan
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Select Intervention Strategy</label>
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
              <label className="font-bold text-gray-800 block mb-1">Action Notes / Objectives</label>
              <textarea
                rows={3}
                placeholder="Describe focus topics or guidance points for this student..."
                value={planNotes}
                onChange={(e) => setPlanNotes(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
}
