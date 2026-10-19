import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  CalendarCheck,
  AlertTriangle,
  Send,
  CheckCircle2,
  Users,
  Clock,
  UserX,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function AttendancePage() {
  const { schoolConfig, students, classes, attendanceRecords } = useSchoolData();
  const { addNotification, createIntervention } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<string>('2026-09-08');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [interventionModalStudent, setInterventionModalStudent] = useState<any | null>(null);
  const [interventionAction, setInterventionAction] = useState<'sms' | 'counseling'>('sms');
  const [interventionSuccess, setInterventionSuccess] = useState<string | null>(null);

  // Class-wise summary for selected date
  const classSummaries = useMemo(() => {
    return classes.map((cls) => {
      const clsStudents = students.filter((s) => s.classId === cls.id);
      const studentIds = new Set(clsStudents.map((s) => s.id));
      const recordsForDate = attendanceRecords.filter(
        (r) => r.date === selectedDate && studentIds.has(r.studentId)
      );

      const present = recordsForDate.filter((r) => r.status === 'present').length;
      const late = recordsForDate.filter((r) => r.status === 'late').length;
      const absent = recordsForDate.filter((r) => r.status === 'absent').length;
      const total = clsStudents.length || 1;
      const rate = Math.round(((present + late) / total) * 100);

      return {
        classId: cls.id,
        className: cls.className,
        section: cls.section,
        total,
        present,
        late,
        absent,
        rate,
      };
    });
  }, [classes, students, attendanceRecords, selectedDate]);

  // Students below threshold (< 75% or school threshold)
  const belowThresholdStudents = useMemo(() => {
    return students
      .map((student) => {
        const records = attendanceRecords.filter((r) => r.studentId === student.id);
        const total = records.length;
        const attended = records.filter((r) => r.status === 'present' || r.status === 'late').length;
        const rate = total > 0 ? Math.round((attended / total) * 100) : 82;
        return {
          ...student,
          attendanceRate: rate,
          isBelow: rate < schoolConfig.attendanceThreshold,
        };
      })
      .filter((s) => s.isBelow && (selectedClass === 'all' || s.classId === selectedClass));
  }, [students, attendanceRecords, schoolConfig.attendanceThreshold, selectedClass]);

  // Overall campus stats for selected date
  const totalPresentToday = classSummaries.reduce((sum, c) => sum + c.present, 0);
  const totalLateToday = classSummaries.reduce((sum, c) => sum + c.late, 0);
  const totalAbsentToday = classSummaries.reduce((sum, c) => sum + c.absent, 0);
  const totalStudentsOverall = students.length || 1;
  const campusOverallRate = Math.round(((totalPresentToday + totalLateToday) / totalStudentsOverall) * 100);

  // 30 days simulated trend
  const trendData = [
    { date: '08 Aug', attendance: 91 },
    { date: '15 Aug', attendance: 88 },
    { date: '22 Aug', attendance: 93 },
    { date: '29 Aug', attendance: 85 },
    { date: '05 Sep', attendance: 89 },
    { date: '08 Sep', attendance: campusOverallRate },
  ];

  const handleTriggerAction = () => {
    if (!interventionModalStudent) return;

    if (interventionAction === 'sms') {
      addNotification({
        id: `alert-${Date.now()}`,
        schoolId: schoolConfig.schoolId,
        type: 'low_attendance',
        title: `SMS Sent: ${interventionModalStudent.name} Low Attendance`,
        message: `Alert sent to parent ${interventionModalStudent.parentName} (${interventionModalStudent.parentPhone}) regarding ${interventionModalStudent.attendanceRate}% attendance.`,
        recipientRole: 'management',
        recipientId: 'mgmt-001',
        relatedStudentId: interventionModalStudent.id,
        isRead: false,
        createdAt: new Date().toISOString(),
        priority: 'high',
        actionUrl: '/management/attendance',
      });
      setInterventionSuccess(`SMS alert dispatched to ${interventionModalStudent.parentName}!`);
    } else {
      createIntervention({
        id: `interv-${Date.now()}`,
        schoolId: schoolConfig.schoolId,
        studentId: interventionModalStudent.id,
        teacherId: 'tch-001',
        type: 'counseling',
        reason: `Attendance dropped to ${interventionModalStudent.attendanceRate}% (below ${schoolConfig.attendanceThreshold}%)`,
        plannedDate: new Date().toISOString().split('T')[0],
        completedDate: null,
        status: 'in_progress',
        notes: 'Parent counseling meeting scheduled by administration.',
        createdAt: new Date().toISOString(),
      });
      setInterventionSuccess(`Counseling intervention created for ${interventionModalStudent.name}!`);
    }

    setInterventionModalStudent(null);
    setTimeout(() => setInterventionSuccess(null), 4000);
  };

  return (
    <PageWrapper
      title="Attendance Intelligence & Risk Monitoring"
      subtitle={`Daily attendance audits, compliance thresholds (${schoolConfig.attendanceThreshold}%), and automated parent interventions`}
    >
      {/* Toast Notification */}
      {interventionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{interventionSuccess}</span>
        </div>
      )}

      {/* Overview Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Campus Rate</span>
            <CalendarCheck size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">{campusOverallRate}%</p>
          <span className="text-[11px] text-gray-400">Selected Date: {selectedDate}</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Present</span>
            <Users size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{totalPresentToday}</p>
          <span className="text-[11px] text-emerald-600 font-medium">On campus today</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Late Arrivals</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">{totalLateToday}</p>
          <span className="text-[11px] text-gray-400">Flagged at gate</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Below Threshold</span>
            <AlertTriangle size={18} className="text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">{belowThresholdStudents.length}</p>
          <span className="text-[11px] text-rose-500 font-medium">&lt; {schoolConfig.attendanceThreshold}% Benchmark</span>
        </Card>
      </div>

      {/* Date & Filter Controls */}
      <Card className="mb-6">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-700">Audit Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-700">Filter Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
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

      {/* Class-wise Attendance Table & Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-gray-900">
                Class-Wise Attendance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead className="text-right">Compliance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classSummaries.map((cls) => (
                    <TableRow key={cls.classId}>
                      <TableCell className="font-bold text-gray-900 text-xs">
                        Class {cls.className}-{cls.section}
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">{cls.total}</TableCell>
                      <TableCell className="text-xs font-semibold text-emerald-700">{cls.present}</TableCell>
                      <TableCell className="text-xs font-semibold text-amber-600">{cls.late}</TableCell>
                      <TableCell className="text-xs font-semibold text-rose-600">{cls.absent}</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-extrabold ${
                            cls.rate < schoolConfig.attendanceThreshold
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {cls.rate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Trend Chart */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-gray-900">
                Attendance Trajectory
              </CardTitle>
              <p className="text-xs text-gray-500">30-day compliance movement</p>
            </CardHeader>
            <CardContent>
              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                      formatter={(v: any) => [`${v}%`, 'Attendance']}
                    />
                    <Line type="monotone" dataKey="attendance" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Critical At-Risk Section: Below 75% Students */}
      <Card className="border-rose-200">
        <CardHeader className="bg-rose-50/50 border-b border-rose-100 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-rose-600" size={18} />
              <CardTitle className="text-base font-bold text-rose-900">
                At-Risk Students (Below {schoolConfig.attendanceThreshold}% Threshold)
              </CardTitle>
            </div>
            <p className="text-xs text-rose-700 mt-0.5">
              Students identified for automated parent SMS dispatch or counseling intervention
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
            {belowThresholdStudents.length} Students Flagged
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Parent Contact</TableHead>
                <TableHead>Alert Status</TableHead>
                <TableHead>Intervention</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {belowThresholdStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-400 text-sm">
                    No students currently below the {schoolConfig.attendanceThreshold}% threshold. Excellent compliance!
                  </TableCell>
                </TableRow>
              ) : (
                belowThresholdStudents.map((st) => (
                  <TableRow key={st.id} className="hover:bg-rose-50/30">
                    <TableCell className="font-bold text-gray-900 text-xs sm:text-sm">
                      {st.name}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {st.className}-{st.section}
                    </TableCell>
                    <TableCell>
                      <Badge status="At Risk">{st.attendanceRate}%</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {st.parentName} ({st.parentPhone})
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Pending SMS
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                        Action Needed
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setInterventionModalStudent(st)}
                        className="text-xs gap-1.5 h-8"
                      >
                        <Send size={12} />
                        <span>Intervene</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Intervention Trigger Modal */}
      {interventionModalStudent && (
        <Modal
          isOpen={Boolean(interventionModalStudent)}
          onClose={() => setInterventionModalStudent(null)}
          title={`Take Action: ${interventionModalStudent.name}`}
          description={`Attendance is ${interventionModalStudent.attendanceRate}% (below the ${schoolConfig.attendanceThreshold}% threshold)`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setInterventionModalStudent(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleTriggerAction}>
                Confirm & Dispatch
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-800 block mb-1.5">Select Intervention Channel</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInterventionAction('sms')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    interventionAction === 'sms'
                      ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare size={16} className="text-blue-600 mb-1" />
                  <p className="font-bold text-gray-900">Send WhatsApp / SMS</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Automated notice to parent with attendance logs</p>
                </button>

                <button
                  type="button"
                  onClick={() => setInterventionAction('counseling')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    interventionAction === 'counseling'
                      ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Users size={16} className="text-purple-600 mb-1" />
                  <p className="font-bold text-gray-900">Schedule Counseling</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Formal meeting with Class Teacher & Parent</p>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-700">
              <p className="font-bold text-gray-900 mb-1">Message Preview:</p>
              <p className="text-[11px] leading-relaxed italic text-gray-600">
                &ldquo;Dear {interventionModalStudent.parentName}, this is an urgent notification from {schoolConfig.name}.
                {interventionModalStudent.name}&rsquo;s attendance has dropped to {interventionModalStudent.attendanceRate}%,
                which is below our mandatory threshold of {schoolConfig.attendanceThreshold}%. Please contact the school office.&rdquo;
              </p>
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
}
