import React from 'react';
import { useSchoolNavigate } from '@/hooks/useSchoolNavigate';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolData } from '@/hooks/useSchoolData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { KPICard } from '@/components/dashboard/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  IndianRupee,
  AlertOctagon,
  Clock,
  ShieldAlert,
  BellRing,
  ArrowRight,
  CheckCircle2,
  FileWarning,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function ManagementDashboard() {
  const navigate = useSchoolNavigate();
  const {
    schoolConfig,
    students,
    teachers,
    attendanceRecords,
    feeTransactions,
    teachingPlans,
    notifications,
    complaints,
    totalFeesCollected,
    totalFeesPending,
  } = useSchoolData();

  // 1. Calculations for KPIs
  const totalStudentsCount = students.length;
  const totalTeachersCount = teachers.length;

  // Attendance rate for latest date
  const latestDate = attendanceRecords.length > 0 ? attendanceRecords[0].date : '2026-09-08';
  const todayRecords = attendanceRecords.filter((r) => r.date === latestDate);
  const presentToday = todayRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const attendancePercentage = todayRecords.length > 0 ? Math.round((presentToday / todayRecords.length) * 100) : 88;

  // Syllabus pending topics
  const pendingTopicsCount = teachingPlans.filter((tp) => tp.status === 'pending' || tp.status === 'overdue').length;

  // At-risk students count (attendance < threshold or multiple alerts)
  const atRiskStudents = students.filter((student) => {
    const studentAttendance = attendanceRecords.filter((r) => r.studentId === student.id);
    if (studentAttendance.length === 0) return false;
    const present = studentAttendance.filter((r) => r.status === 'present' || r.status === 'late').length;
    const rate = (present / studentAttendance.length) * 100;
    return rate < schoolConfig.attendanceThreshold;
  });

  const alertsSentCount = notifications.filter((n) => n.type === 'absence' || n.type === 'low_attendance' || n.type === 'fee_reminder').length;

  // 2. Attendance Trend Data (Simulated 30 Days trend based on records)
  const attendanceTrendData = [
    { day: 'Day 1', rate: 92 },
    { day: 'Day 5', rate: 89 },
    { day: 'Day 10', rate: 94 },
    { day: 'Day 15', rate: 86 },
    { day: 'Day 20', rate: 90 },
    { day: 'Day 25', rate: 87 },
    { day: 'Day 30', rate: attendancePercentage },
  ];

  // 3. Fee Collection Monthly Data
  const monthlyFeeData = [
    { month: 'Apr', collected: 450000, target: 500000 },
    { month: 'May', collected: 380000, target: 400000 },
    { month: 'Jun', collected: 290000, target: 350000 },
    { month: 'Jul', collected: 520000, target: 500000 },
    { month: 'Aug', collected: 480000, target: 500000 },
    { month: 'Sep', collected: 320000, target: 450000 },
  ];

  // 4. Combined Recent Activity Feed (Last 10 actions)
  const recentActivities = [
    ...notifications.map((n) => ({
      id: `notif-${n.id}`,
      type: 'notification',
      title: n.title,
      description: n.message,
      time: n.createdAt,
      icon: <BellRing size={16} className="text-blue-500" />,
      badge: 'Alert',
    })),
    ...feeTransactions.slice(0, 4).map((f) => ({
      id: `fee-${f.id}`,
      type: 'fee',
      title: `Fee Payment ${f.status.toUpperCase()}`,
      description: `₹${f.amount.toLocaleString('en-IN')} received via ${f.paymentMethod.toUpperCase()} (${f.termName})`,
      time: f.paymentDate,
      icon: <IndianRupee size={16} className="text-emerald-500" />,
      badge: f.status === 'verified' ? 'Verified' : 'Payment',
    })),
    ...complaints.slice(0, 3).map((c) => ({
      id: `comp-${c.id}`,
      type: 'complaint',
      title: `Ticket: ${c.type.replace('_', ' ').toUpperCase()}`,
      description: c.description,
      time: c.createdAt,
      icon: <FileWarning size={16} className="text-amber-500" />,
      badge: 'Ticket',
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  return (
    <PageWrapper
      title="Management Intelligence Center"
      subtitle={`Executive overview and real-time operations pulse for ${schoolConfig.name}`}
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/management/ai')}
            className="gap-2 border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100/60"
          >
            <Sparkles size={14} className="text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Ask AI Intelligence</span>
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/management/attendance')}
            className="gap-1.5"
          >
            <span>Live Attendance</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      }
    >
      {/* 8 Clickable KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <KPICard
          title="Total Students"
          value={totalStudentsCount}
          change={{ value: 4.2, isPositive: true, label: 'vs last term' }}
          icon={<Users size={22} />}
          gradient="from-blue-600 to-indigo-700"
          onClick={() => navigate('/management/students')}
        />
        <KPICard
          title="Total Faculty"
          value={totalTeachersCount}
          change={{ value: '100%', isPositive: true, label: 'Staffing' }}
          icon={<GraduationCap size={22} />}
          gradient="from-emerald-600 to-teal-700"
          onClick={() => navigate('/management/teachers')}
        />
        <KPICard
          title="Today's Attendance"
          value={`${attendancePercentage}%`}
          change={{
            value: attendancePercentage >= schoolConfig.attendanceThreshold ? 2.1 : -3.5,
            isPositive: attendancePercentage >= schoolConfig.attendanceThreshold,
          }}
          icon={<CalendarCheck size={22} />}
          gradient="from-violet-600 to-purple-700"
          onClick={() => navigate('/management/attendance')}
        />
        <KPICard
          title="Fees Collected"
          value={formatCurrency(totalFeesCollected)}
          change={{ value: 12.5, isPositive: true, label: 'vs last month' }}
          icon={<IndianRupee size={22} />}
          gradient="from-amber-600 to-orange-700"
          onClick={() => navigate('/management/fees')}
        />
        <KPICard
          title="Pending Fees"
          value={formatCurrency(totalFeesPending)}
          change={{ value: '18 Students', isPositive: false }}
          icon={<AlertOctagon size={22} />}
          gradient="from-rose-600 to-red-700"
          onClick={() => navigate('/management/fees')}
        />
        <KPICard
          title="Pending Syllabus"
          value={pendingTopicsCount}
          change={{ value: `${teachingPlans.filter((tp) => tp.status === 'overdue').length} Overdue`, isPositive: false }}
          icon={<Clock size={22} />}
          gradient="from-sky-600 to-cyan-700"
          onClick={() => navigate('/management/syllabus')}
        />
        <KPICard
          title="Students At Risk"
          value={atRiskStudents.length}
          change={{ value: 'Action Needed', isPositive: false }}
          icon={<ShieldAlert size={22} />}
          gradient="from-red-600 to-rose-700"
          onClick={() => navigate('/management/academics')}
        />
        <KPICard
          title="Parent Alerts"
          value={alertsSentCount}
          change={{ value: 98, isPositive: true, label: '% Delivered' }}
          icon={<BellRing size={22} />}
          gradient="from-indigo-600 to-blue-700"
          onClick={() => navigate('/management/notifications')}
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="mt-8 rounded-2xl bg-white border border-gray-200/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Quick Action Shortcuts
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Rapid workflow routing for key daily administrative checkpoints
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/management/attendance')}
              className="text-xs"
            >
              <CalendarCheck size={14} className="text-blue-600" />
              <span>View Attendance</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/management/fees')}
              className="text-xs"
            >
              <IndianRupee size={14} className="text-emerald-600" />
              <span>Verify Fees</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/management/academics')}
              className="text-xs text-rose-700 bg-rose-50/60 border-rose-200 hover:bg-rose-100/60"
            >
              <ShieldAlert size={14} className="text-rose-600" />
              <span>At-Risk Students ({atRiskStudents.length})</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/management/syllabus')}
              className="text-xs text-amber-700 bg-amber-50/60 border-amber-200 hover:bg-amber-100/60"
            >
              <Clock size={14} className="text-amber-600" />
              <span>Syllabus Delays</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Attendance Trend Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">
                Attendance Trend (Last 30 Days)
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Daily campus attendance compliance rate</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Avg {attendancePercentage}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                    formatter={(value: any) => [`${value}%`, 'Attendance']}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Fee Collection Bar Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">
                Fee Collection Status
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Target vs Actual receipts in INR</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Healthy Pace
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFeeData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                    formatter={(val: any) => [formatCurrency(Number(val)), 'Collected']}
                  />
                  <Bar dataKey="collected" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">
                Recent Campus Activity Feed
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">Live stream of academic and administrative actions</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/management/notifications')}
              className="text-xs text-blue-600"
            >
              <span>View All Alerts</span>
              <ArrowRight size={13} />
            </Button>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-gray-100">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3.5 p-4 hover:bg-gray-50/80 transition-colors">
                <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 shrink-0 mt-0.5 shadow-xs">
                  {act.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {act.title}
                    </p>
                    <span className="text-xs text-gray-500 shrink-0">
                      {formatDateTime(act.time)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
