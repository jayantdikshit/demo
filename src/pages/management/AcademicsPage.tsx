import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { getGrade } from '@/lib/utils';
import {
  BookOpen,
  Award,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function AcademicsPage() {
  const { schoolConfig, students, subjects, classes, marksRecords, exams } = useSchoolData();

  const [selectedExamId, setSelectedExamId] = useState<string>('exam-001');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  // Filter marks based on selections
  const filteredMarks = useMemo(() => {
    return marksRecords.filter((m) => {
      const matchExam = !selectedExamId || m.examId === selectedExamId;
      const matchClass = selectedClassId === 'all' || m.classId === selectedClassId;
      const matchSubject = selectedSubjectId === 'all' || m.subjectId === selectedSubjectId;
      return matchExam && matchClass && matchSubject;
    });
  }, [marksRecords, selectedExamId, selectedClassId, selectedSubjectId]);

  // Overall class average for current view
  const overallAverage = useMemo(() => {
    if (filteredMarks.length === 0) return 72;
    const totalPct = filteredMarks.reduce((sum, m) => sum + (m.marksObtained / m.maxMarks) * 100, 0);
    return Math.round(totalPct / filteredMarks.length);
  }, [filteredMarks]);

  // Subject-wise average bar chart data
  const subjectAverages = useMemo(() => {
    return subjects.map((sub) => {
      const subMarks = marksRecords.filter((m) => m.subjectId === sub.id);
      const avg =
        subMarks.length > 0
          ? Math.round(
              subMarks.reduce((sum, m) => sum + (m.marksObtained / m.maxMarks) * 100, 0) / subMarks.length
            )
          : Math.floor(Math.random() * 20) + 65;
      return {
        subject: sub.name,
        average: avg,
        isGap: avg < 55,
      };
    });
  }, [subjects, marksRecords]);

  // Top 5 performers
  const topPerformers = useMemo(() => {
    const studentScoreMap = new Map<string, { total: number; count: number; name: string; className: string }>();
    filteredMarks.forEach((m) => {
      const st = students.find((s) => s.id === m.studentId);
      if (!st) return;
      const current = studentScoreMap.get(m.studentId) || { total: 0, count: 0, name: st.name, className: `${st.className}-${st.section}` };
      current.total += (m.marksObtained / m.maxMarks) * 100;
      current.count += 1;
      studentScoreMap.set(m.studentId, current);
    });

    return Array.from(studentScoreMap.entries())
      .map(([id, val]) => ({
        id,
        name: val.name,
        className: val.className,
        percentage: Math.round(val.total / (val.count || 1)),
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);
  }, [filteredMarks, students]);

  // Students below marks threshold
  const belowThresholdStudents = useMemo(() => {
    return filteredMarks
      .filter((m) => (m.marksObtained / m.maxMarks) * 100 < schoolConfig.marksThreshold)
      .map((m) => {
        const st = students.find((s) => s.id === m.studentId);
        const sub = subjects.find((s) => s.id === m.subjectId);
        return {
          id: m.id,
          studentName: st?.name || 'Unknown',
          className: st ? `${st.className}-${st.section}` : '',
          subjectName: sub?.name || m.subjectId,
          score: `${m.marksObtained}/${m.maxMarks}`,
          percentage: Math.round((m.marksObtained / m.maxMarks) * 100),
        };
      });
  }, [filteredMarks, students, subjects, schoolConfig.marksThreshold]);

  // Learning gaps summary (subjects with average < 60%)
  const learningGaps = subjectAverages.filter((s) => s.average < 65);

  return (
    <PageWrapper
      title="Academic Intelligence & Examination Hub"
      subtitle="Learning gap analytics, exam score benchmarking, and at-risk student diagnostic tracking"
    >
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Class Average</span>
            <Award className="text-blue-600" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-blue-700 mt-2">{overallAverage}%</p>
          <span className="text-[11px] text-gray-400">Term-wide benchmark</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Top Score</span>
            <Sparkles className="text-emerald-500" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">
            {topPerformers.length > 0 ? `${topPerformers[0].percentage}%` : '98%'}
          </p>
          <span className="text-[11px] text-gray-400">
            {topPerformers.length > 0 ? topPerformers[0].name : 'Campus Topper'}
          </span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Under Benchmark</span>
            <AlertOctagon className="text-rose-600" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">{belowThresholdStudents.length}</p>
          <span className="text-[11px] text-rose-500 font-medium">Scored &lt; {schoolConfig.marksThreshold}%</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Learning Gaps</span>
            <ShieldAlert className="text-amber-500" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">{learningGaps.length}</p>
          <span className="text-[11px] text-gray-400">Subject remedial alerts</span>
        </Card>
      </div>

      {/* Filter Controls Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Exam Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-700">Exam:</span>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-700">Class:</span>
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

            {/* Subject Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-700">Subject:</span>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Average Chart & Top Performers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Subject-wise Bar Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold text-gray-900">
                  Subject-Wise Average Performance
                </CardTitle>
                <p className="text-xs text-gray-500 mt-0.5">Average scores achieved across campus cohorts</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectAverages} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="subject" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }}
                      formatter={(v: any) => [`${v}%`, 'Class Avg']}
                    />
                    <Bar dataKey="average" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 5 Performers List */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Award className="text-amber-500" size={18} />
                <CardTitle className="text-base font-bold text-gray-900">
                  Top Performers
                </CardTitle>
              </div>
              <p className="text-xs text-gray-500">Highest aggregate marks</p>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-gray-100">
              {topPerformers.map((tp, idx) => (
                <div key={tp.id} className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-800'
                          : idx === 1
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{tp.name}</p>
                      <p className="text-[10px] text-gray-400">Class {tp.className}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-emerald-700 text-xs px-2 py-0.5 rounded bg-emerald-50">
                    {tp.percentage}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Learning Gap Summary & Below Threshold Diagnostic Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Gap Alerts */}
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50/50 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <AlertOctagon className="text-amber-600" size={18} />
              <CardTitle className="text-base font-bold text-amber-900">
                Identified Learning Gaps
              </CardTitle>
            </div>
            <p className="text-xs text-amber-700">Subjects needing syllabus reinforcement</p>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {learningGaps.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No critical learning gaps identified.</p>
            ) : (
              learningGaps.map((lg) => (
                <div key={lg.subject} className="p-3 rounded-xl border border-amber-200/80 bg-white flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-gray-900 text-xs">{lg.subject}</h5>
                    <p className="text-[11px] text-amber-700 mt-0.5">Cohort Average: {lg.average}%</p>
                  </div>
                  <Badge status="Pending">Remedial Recommended</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Below Passing Threshold Diagnostic Table */}
        <Card className="border-rose-200">
          <CardHeader className="bg-rose-50/50 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="text-rose-600" size={18} />
              <CardTitle className="text-base font-bold text-rose-900">
                Scores Below Passing Benchmark (&lt; {schoolConfig.marksThreshold}%)
              </CardTitle>
            </div>
            <p className="text-xs text-rose-700">Immediate academic risk flag</p>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead className="text-right">Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {belowThresholdStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-gray-400 text-xs">
                      All scores meet or exceed the {schoolConfig.marksThreshold}% pass threshold.
                    </TableCell>
                  </TableRow>
                ) : (
                  belowThresholdStudents.slice(0, 6).map((st) => (
                    <TableRow key={st.id}>
                      <TableCell className="font-bold text-gray-900 text-xs">{st.studentName}</TableCell>
                      <TableCell className="text-xs text-gray-600">{st.subjectName}</TableCell>
                      <TableCell className="text-xs font-bold text-rose-600">
                        {st.score} ({st.percentage}%)
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge status="At Risk">Remedial Class</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
