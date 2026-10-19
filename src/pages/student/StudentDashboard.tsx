import React, { useState } from 'react';
import { useSchoolNavigate } from '@/hooks/useSchoolNavigate';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, getInitials, getGrade } from '@/lib/utils';
import {
  CalendarCheck,
  TrendingUp,
  Award,
  IndianRupee,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CreditCard,
  Star,
  FileWarning,
  Clock,
  Calendar,
  CheckCircle2,
  MapPin,
  User,
  Download,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';

// Timetable period interface
interface TimetablePeriod {
  periodNumber: number;
  time: string;
  subject: string;
  topicPlanned: string;
  teacher: string;
  room: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  note?: string;
  color: string;
}

export function StudentDashboard() {
  const navigate = useSchoolNavigate();
  const { schoolConfig, students, attendanceRecords, marksRecords, feeTransactions, teachingPlans, notifications } = useSchoolData();

  // Day selector for timetable (Default: Wednesday / Today)
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Wednesday');

  // Active student profile: Aarav Sharma (stu-001)
  const student = students[0] || {
    id: 'stu-001',
    name: 'Aarav Sharma',
    rollNo: '101',
    className: '6',
    section: 'A',
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98765 43210',
    admissionDate: '2022-04-10',
    dateOfBirth: '2014-06-15',
    bloodGroup: 'B+',
    address: 'Flat 402, Green Valley Apartments, Noida',
  };

  // Student metrics
  const myAttendance = attendanceRecords.filter((r) => r.studentId === student.id);
  const presentDays = myAttendance.filter((r) => r.status === 'present' || r.status === 'late').length;
  const attendanceRate = myAttendance.length > 0 ? Math.round((presentDays / myAttendance.length) * 100) : 82;

  const myMarks = marksRecords.filter((m) => m.studentId === student.id);
  const overallScore =
    myMarks.length > 0
      ? Math.round(myMarks.reduce((sum, m) => sum + (m.marksObtained / m.maxMarks) * 100, 0) / myMarks.length)
      : 76;

  const myFees = feeTransactions.filter((f) => f.studentId === student.id);
  const pendingFees = myFees
    .filter((f) => f.status === 'pending' || f.status === 'pending_verification')
    .reduce((sum, f) => sum + f.amount, 0) || 15000;

  // Syllabus progress for student's class
  const classPlans = teachingPlans.filter((tp) => tp.classId === 'cls-6a-s1' || tp.classId === 'cls-6');
  const completedPlans = classPlans.filter((tp) => tp.status === 'completed');
  const syllabusProgress = classPlans.length > 0 ? Math.round((completedPlans.length / classPlans.length) * 100) : 80;

  // Fetch dynamic timetables, subjects, teachers
  const { timetables } = useAppStore();
  const { subjects, teachers } = useSchoolData();

  // Get student's class timetables
  const studentTimetables = timetables
    .filter(tt => tt.classId === student.classId && tt.schoolId === schoolConfig.schoolId)
    .sort((a, b) => a.periodNumber - b.periodNumber);

  // Derive daily schedules mapped to TimetablePeriod format
  const dynamicTimetableSchedule: Record<string, TimetablePeriod[]> = {};
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].forEach(day => {
    dynamicTimetableSchedule[day] = studentTimetables
      .filter(tt => tt.dayOfWeek === day)
      .map((tt, index) => {
        const subject = subjects.find(s => s.id === tt.subjectId);
        const teacher = teachers.find(t => t.id === tt.teacherId);
        
        // Find if there is a teaching plan for this subject and day
        const relevantPlan = teachingPlans.find(
          tp => tp.classId === tt.classId && tp.subjectId === tt.subjectId && tp.status !== 'completed'
        );

        const colors = [
          'from-blue-600 to-indigo-600',
          'from-emerald-600 to-teal-600',
          'from-purple-600 to-pink-600',
          'from-amber-600 to-orange-600',
          'from-rose-600 to-red-600',
          'from-cyan-600 to-blue-600',
          'from-teal-600 to-cyan-600',
          'from-indigo-600 to-purple-700'
        ];

        return {
          periodNumber: tt.periodNumber,
          time: `${tt.startTime} - ${tt.endTime}`,
          subject: subject?.name || 'Unknown',
          topicPlanned: relevantPlan?.topicName || 'Standard Curriculum / Ongoing Topics',
          teacher: teacher?.name || 'Unknown',
          room: tt.room,
          status: 'upcoming',
          color: colors[index % colors.length]
        };
      });
  });

  const activeDayPeriods = dynamicTimetableSchedule[selectedDay] || [];
  
  // Periods planned for today (Wednesday default for demo)
  const todayPlannedPeriods = dynamicTimetableSchedule['Wednesday'] || [];

  return (
    <PageWrapper
      title="Student Learning & Academic Portal"
      subtitle={`Welcome back, ${student.name} • Class ${student.className}-${student.section} | Roll #${student.rollNo}`}
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Schedule</span>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/student/academics')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>View Marks & Report Card</span>
          </Button>
        </div>
      }
    >
      {/* Active Alerts Banner (if attendance low or fee pending) */}
      {attendanceRate < schoolConfig.attendanceThreshold && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={20} />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-rose-950">Attendance Compliance Warning</h4>
            <p className="mt-0.5 leading-relaxed text-rose-800">
              Your overall attendance is currently <strong>{attendanceRate}%</strong>, which is below the school benchmark of{' '}
              <strong>{schoolConfig.attendanceThreshold}%</strong>. Please maintain regular attendance to avoid examination eligibility flags.
            </p>
          </div>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => navigate('/student/alerts')}
            className="text-xs shrink-0 h-8"
          >
            View Alerts
          </Button>
        </div>
      )}

      {/* Profile Summary Card & 4 Key Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* Profile Card */}
        <Card className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md text-white font-extrabold text-xl flex items-center justify-center border border-white/20 shadow-inner">
                {getInitials(student.name)}
              </div>
              <div>
                <h3 className="font-extrabold text-lg leading-tight">{student.name}</h3>
                <span className="text-xs text-blue-100 font-medium">Roll No: #{student.rollNo}</span>
              </div>
            </div>
            <div className="space-y-1 text-xs text-blue-100 border-t border-white/10 pt-3">
              <p>Class: <strong>{student.className}-{student.section} (Grade 6)</strong></p>
              <p>Class Teacher: <strong>Dr. Rajesh Iyer</strong></p>
              <p>Guardian: <strong>{student.parentName}</strong></p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/student/profile')}
            className="mt-4 bg-white/10 text-white border-white/20 hover:bg-white hover:text-blue-900 text-xs gap-1"
          >
            <span>View Institutional Dossier</span>
            <ArrowRight size={13} />
          </Button>
        </Card>

        {/* 4 Metric Cards (3 cols in desktop) */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Attendance */}
          <div
            onClick={() => navigate('/student/academics')}
            className="p-4 rounded-2xl border border-gray-200/80 bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Attendance</span>
              <CalendarCheck
                size={18}
                className={attendanceRate >= schoolConfig.attendanceThreshold ? 'text-emerald-600' : 'text-rose-600'}
              />
            </div>
            <div className="my-2">
              <p
                className={`text-2xl sm:text-3xl font-extrabold ${
                  attendanceRate >= schoolConfig.attendanceThreshold ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {attendanceRate}%
              </p>
              <span className="text-[11px] text-gray-400">
                Threshold: {schoolConfig.attendanceThreshold}%
              </span>
            </div>
            <Badge variant={attendanceRate >= schoolConfig.attendanceThreshold ? 'success' : 'destructive'} className="text-[10px]">
              {attendanceRate >= schoolConfig.attendanceThreshold ? 'Good Standing' : 'Low Attendance'}
            </Badge>
          </div>

          {/* Academic Score */}
          <div
            onClick={() => navigate('/student/academics')}
            className="p-4 rounded-2xl border border-gray-200/80 bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Overall Score</span>
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <div className="my-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-700">{overallScore}%</p>
              <span className="text-[11px] text-gray-400">Grade {getGrade(overallScore)}</span>
            </div>
            <Badge variant="success" className="text-[10px] bg-blue-500/10 text-blue-700 border-blue-200">
              Distinction
            </Badge>
          </div>

          {/* Class Rank */}
          <div
            onClick={() => navigate('/student/academics')}
            className="p-4 rounded-2xl border border-gray-200/80 bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Class Rank</span>
              <Award size={18} className="text-purple-600" />
            </div>
            <div className="my-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-800">#12</p>
              <span className="text-[11px] text-gray-400">Out of 42 scholars</span>
            </div>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full inline-block">
              Top 30%
            </span>
          </div>

          {/* Fee Pending */}
          <div
            onClick={() => navigate('/student/fees')}
            className="p-4 rounded-2xl border border-gray-200/80 bg-white hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500 uppercase">Pending Fee</span>
              <IndianRupee size={18} className="text-amber-500" />
            </div>
            <div className="my-2">
              <p className="text-xl sm:text-2xl font-extrabold text-amber-600">
                {formatCurrency(pendingFees)}
              </p>
              <span className="text-[11px] text-gray-400">Term 2 Tuition Dues</span>
            </div>
            <Badge variant="warning" className="text-[10px]">Pay Online →</Badge>
          </div>
        </div>
      </div>

      {/* ── ⭐ SECTION 1: TODAY'S PLANNED TOPICS (AAJ KAUN SA TOPIC PLANNED HAI) ── */}
      <Card className="mb-8 border border-blue-500/30 bg-gradient-to-br from-blue-500/5 via-card to-card shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-foreground">
                  Today's Planned Topics (आज का शिक्षण प्लान)
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-bold bg-blue-500/10 text-blue-700 border-blue-300">
                  Wednesday, 09-Sep-2026
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Exact topics scheduled for instruction today in Class 6-A by subject teachers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-mono">
              8 Periods Scheduled
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {todayPlannedPeriods.slice(0, 4).map((p) => (
              <div
                key={p.periodNumber}
                className="p-4 rounded-2xl border border-border/80 bg-card hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                <div className={`h-1.5 absolute top-0 left-0 right-0 bg-gradient-to-r ${p.color}`} />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Period #{p.periodNumber}
                  </span>
                  <Badge
                    variant={
                      p.status === 'completed'
                        ? 'success'
                        : p.status === 'in_progress'
                        ? 'warning'
                        : 'outline'
                    }
                    className="text-[10px]"
                  >
                    {p.status === 'completed' && 'Completed ✅'}
                    {p.status === 'in_progress' && 'Live Now 🔴'}
                    {p.status === 'upcoming' && 'Upcoming ⏳'}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <span>{p.subject}</span>
                  </h4>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{p.time}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block uppercase">
                    Planned Topic:
                  </span>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {p.topicPlanned}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <User className="w-3 h-3 text-blue-500" />
                    {p.teacher}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <MapPin className="w-3 h-3" />
                    {p.room}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Periods 5 to 8 Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {todayPlannedPeriods.slice(4, 8).map((p) => (
              <div
                key={p.periodNumber}
                className="p-4 rounded-2xl border border-border/80 bg-card hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                <div className={`h-1.5 absolute top-0 left-0 right-0 bg-gradient-to-r ${p.color}`} />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Period #{p.periodNumber}
                  </span>
                  <Badge
                    variant={
                      p.status === 'completed'
                        ? 'success'
                        : p.status === 'in_progress'
                        ? 'warning'
                        : 'outline'
                    }
                    className="text-[10px]"
                  >
                    {p.status === 'completed' && 'Completed ✅'}
                    {p.status === 'in_progress' && 'Live Now 🔴'}
                    {p.status === 'upcoming' && 'Upcoming ⏳'}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-foreground">{p.subject}</h4>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{p.time}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block uppercase">
                    Planned Topic:
                  </span>
                  <p className="text-xs font-semibold text-foreground leading-snug">
                    {p.topicPlanned}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                  <span className="font-semibold text-foreground flex items-center gap-1">
                    <User className="w-3 h-3 text-indigo-500" />
                    {p.teacher}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <MapPin className="w-3 h-3" />
                    {p.room}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── ⭐ SECTION 2: CLASS 6-A FULL WEEKLY TIMETABLE MATRIX ── */}
      <Card className="mb-8 border border-border/80 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/60">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Class 6-A Timetable & Weekly Schedule (टाइम टेबल)</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Select day to review the full period schedule, room allocations, and teacher curriculum
            </p>
          </div>

          {/* Day Switcher Tabs */}
          <div className="flex bg-muted/60 p-1 rounded-xl border border-border/60 overflow-x-auto">
            {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {day} {day === 'Wednesday' && '• Today'}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/60">
                <tr>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Planned Topic / Curriculum Delivery</th>
                  <th className="py-3 px-4">Teacher</th>
                  <th className="py-3 px-4">Room / Lab</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {activeDayPeriods.map((item) => (
                  <tr
                    key={item.periodNumber}
                    className={`hover:bg-muted/40 transition-colors ${
                      item.status === 'in_progress' ? 'bg-amber-500/5 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      <span className="w-6 h-6 rounded-lg bg-muted text-foreground flex items-center justify-center font-mono text-xs">
                        #{item.periodNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {item.time}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-foreground">
                      {item.subject}
                    </td>
                    <td className="py-3.5 px-4 text-foreground/90 max-w-xs leading-relaxed">
                      {item.topicPlanned}
                      {item.note && (
                        <span className="block text-[10px] text-muted-foreground mt-0.5">
                          💡 {item.note}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {item.teacher}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-muted-foreground">
                      {item.room}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge
                        variant={
                          item.status === 'completed'
                            ? 'success'
                            : item.status === 'in_progress'
                            ? 'warning'
                            : 'outline'
                        }
                        className="text-[10px]"
                      >
                        {item.status === 'completed' && 'Done ✅'}
                        {item.status === 'in_progress' && 'Current Period ⏳'}
                        {item.status === 'upcoming' && 'Upcoming'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Syllabus Progress Card */}
      <Card className="mb-8 p-5 bg-card border border-border/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h4 className="text-sm font-bold text-foreground">Curriculum &amp; Syllabus Coverage</h4>
            <p className="text-xs text-muted-foreground">Cumulative syllabus completion across all subjects for Class 6-A</p>
          </div>
          <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50">
            {syllabusProgress}% Completed
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${syllabusProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
          <span>{completedPlans.length} Topics Finished</span>
          <span>{classPlans.length - completedPlans.length} Units In Progress</span>
        </div>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/student/fees')}
          className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 w-fit mb-3">
            <CreditCard size={20} />
          </div>
          <h4 className="font-bold text-foreground text-xs sm:text-sm">Pay Fees</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">UPI, QR Code, Bank</p>
        </button>

        <button
          onClick={() => navigate('/student/academics')}
          className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 w-fit mb-3">
            <TrendingUp size={20} />
          </div>
          <h4 className="font-bold text-foreground text-xs sm:text-sm">Report Card</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">Marks &amp; Class Average</p>
        </button>

        <button
          onClick={() => navigate('/student/feedback')}
          className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 w-fit mb-3">
            <Star size={20} />
          </div>
          <h4 className="font-bold text-foreground text-xs sm:text-sm">Rate Teachers</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">Monthly Feedback</p>
        </button>

        <button
          onClick={() => navigate('/student/complaints')}
          className="p-4 rounded-2xl border border-border bg-card hover:bg-muted/50 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
        >
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 w-fit mb-3">
            <FileWarning size={20} />
          </div>
          <h4 className="font-bold text-foreground text-xs sm:text-sm">File Ticket</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">Correction / Grievance</p>
        </button>
      </div>
    </PageWrapper>
  );
}
