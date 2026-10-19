import React from 'react';
import { useSchoolNavigate } from '@/hooks/useSchoolNavigate';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { KPICard } from '@/components/dashboard/KPICard';
import { formatDate } from '@/lib/utils';
import {
  CalendarCheck,
  PenLine,
  BookOpenCheck,
  HeartPulse,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  BookOpen,
} from 'lucide-react';

export function TeacherDashboard() {
  const navigate = useSchoolNavigate();
  const { schoolConfig, teachingPlans, classes, students } = useSchoolData();

  // Simulated active teacher profile (Anita Deshmukh, tch-001)
  const teacherId = 'tch-001';
  const teacherName = 'Anita Deshmukh';

  // Teaching plans for this teacher
  const myPlans = teachingPlans.filter((tp) => tp.teacherId === teacherId);
  const pendingTopics = myPlans.filter((tp) => tp.status === 'pending' || tp.status === 'overdue');
  const overdueTopics = myPlans.filter((tp) => tp.status === 'overdue');
  const completedTopics = myPlans.filter((tp) => tp.status === 'completed');
  const syllabusRate = myPlans.length > 0 ? Math.round((completedTopics.length / myPlans.length) * 100) : 78;

  const { timetables } = useAppStore();
  const { subjects, classes: allClasses } = useSchoolData();

  // Today's Timetable Schedule (Dynamic based on 'Wednesday' for Demo)
  const todaySchedule = timetables
    .filter((tt) => tt.teacherId === teacherId && tt.schoolId === schoolConfig.schoolId && tt.dayOfWeek === 'Wednesday')
    .sort((a, b) => a.periodNumber - b.periodNumber)
    .map((tt) => {
      const cls = allClasses.find(c => c.id === tt.classId);
      const sub = subjects.find(s => s.id === tt.subjectId);
      const plan = myPlans.find(p => p.classId === tt.classId && p.subjectId === tt.subjectId && p.status !== 'completed');

      return {
        period: tt.periodNumber,
        time: `${tt.startTime} - ${tt.endTime}`,
        class: cls ? `Class ${cls.className}-${cls.section}` : 'Unknown Class',
        subject: sub?.name || 'Unknown Subject',
        topic: plan?.topicName || 'Standard Curriculum',
        room: tt.room,
      };
    });

  return (
    <PageWrapper
      title={`Welcome back, ${teacherName}`}
      subtitle="Class timetable, pending lesson plans, student attendance logs, and academic interventions"
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/teacher/teaching-plan')}
            className="text-xs gap-1.5"
          >
            <BookOpenCheck size={14} className="text-blue-600" />
            <span>Curriculum Plan</span>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/teacher/attendance')}
            className="text-xs gap-1.5"
          >
            <CalendarCheck size={14} />
            <span>Mark Attendance</span>
          </Button>
        </div>
      }
    >
      {/* 3 Quick Action / Pending Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => navigate('/teacher/attendance')}
          className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              Attendance Roster
            </span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <CalendarCheck size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mt-3">Class 6-A</h3>
          <p className="text-xs text-blue-100 mt-1">Pending attendance recording for today</p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-white">
            <span>Mark Register</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div
          onClick={() => navigate('/teacher/marks')}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Exam Marks Entry
            </span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <PenLine size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mt-3">Unit Test 1</h3>
          <p className="text-xs text-emerald-100 mt-1">Class 6-A & 7-A marks due for upload</p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-white">
            <span>Enter Marks</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div
          onClick={() => navigate('/teacher/teaching-plan')}
          className="p-5 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 text-white shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-100">
              Curriculum Progress
            </span>
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm">
              <BookOpenCheck size={20} />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold mt-3">{syllabusRate}% Completed</h3>
          <p className="text-xs text-purple-100 mt-1">{overdueTopics.length} topics delayed or carried over</p>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-white">
            <span>Update Teaching Plan</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule + Today's & Pending Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Today's Timetable Schedule (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Today&rsquo;s Teaching Timetable
                </CardTitle>
                <p className="text-xs text-gray-500">Scheduled classroom periods and locations</p>
              </div>
              <Badge status="Active">5 Periods Today</Badge>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-gray-100">
              {todaySchedule.map((item) => (
                <div
                  key={item.period}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50/80 transition-colors gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0 border border-blue-100">
                      P{item.period}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm">
                        {item.class} • {item.subject}
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">{item.topic}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-between sm:justify-end">
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                      <Clock size={12} className="text-gray-400" />
                      {item.time}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-gray-100 text-gray-700">
                      {item.room}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Assigned & Overdue Topics Side Panel */}
        <div className="space-y-6">
          {/* Overdue/Pending Topics Alert Box */}
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50/60 border-b border-amber-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-600" />
                  <CardTitle className="text-sm font-bold text-amber-900">
                    Carried-Over Topics ({overdueTopics.length})
                  </CardTitle>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Pending Pacing
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2.5">
              {overdueTopics.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No pending topics carried over!</p>
              ) : (
                overdueTopics.map((tp) => (
                  <div
                    key={tp.id}
                    className="p-3 rounded-xl border border-amber-200/80 bg-white shadow-2xs flex items-center justify-between"
                  >
                    <div>
                      <h5 className="font-bold text-gray-900 text-xs">{tp.topicName}</h5>
                      <span className="text-[10px] text-rose-600 font-semibold">
                        Scheduled: {formatDate(tp.scheduledDate)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/teacher/teaching-plan')}
                      className="h-7 px-2 text-[11px]"
                    >
                      Update
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Shortcuts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-gray-900">Teacher Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              <button
                onClick={() => navigate('/teacher/students')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users size={16} className="text-blue-600" />
                  <span>Class Performance &amp; Risk Flags</span>
                </div>
                <ArrowRight size={14} className="text-gray-400" />
              </button>

              <button
                onClick={() => navigate('/teacher/interventions')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HeartPulse size={16} className="text-rose-600" />
                  <span>Student Remedial Interventions</span>
                </div>
                <ArrowRight size={14} className="text-gray-400" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
