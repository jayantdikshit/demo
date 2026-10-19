import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { getGrade } from '@/lib/utils';
import {
  Award,
  TrendingUp,
  BarChart3,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export function StudentAcademicsPage() {
  const { exams, subjects, marksRecords } = useSchoolData();
  const studentId = 'stu-001';

  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || 'exam-001');

  // Filter marks for this student and exam
  const studentMarks = useMemo(() => {
    return marksRecords.filter(
      (m) => m.studentId === studentId && (!selectedExamId || m.examId === selectedExamId)
    );
  }, [marksRecords, studentId, selectedExamId]);

  // Aggregate stats
  const totalMarksObtained = studentMarks.reduce((sum, m) => sum + m.marksObtained, 0);
  const totalMaxMarks = studentMarks.reduce((sum, m) => sum + m.maxMarks, 0);
  const aggregatePercentage = totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 100) : 78;

  // Comparison Bar Chart Data (My Score vs Class Average)
  const comparisonData = useMemo(() => {
    return subjects.map((sub) => {
      const myRecord = studentMarks.find((m) => m.subjectId === sub.id);
      const myPct = myRecord ? Math.round((myRecord.marksObtained / myRecord.maxMarks) * 100) : 75;
      const classAvg = 72; // Baseline class cohort average

      return {
        subject: sub.name,
        myScore: myPct,
        classAverage: classAvg,
      };
    });
  }, [subjects, studentMarks]);

  // Exam Trajectory Line Chart (across terms)
  const examTrajectory = [
    { exam: 'Unit Test 1', score: 72, classAvg: 70 },
    { exam: 'Mid Term Exam', score: 78, classAvg: 73 },
    { exam: 'Unit Test 2', score: 81, classAvg: 75 },
    { exam: 'Final Mock', score: 85, classAvg: 74 },
  ];

  return (
    <PageWrapper
      title="Academic Report & Examination Performance"
      subtitle="Detailed subject evaluations, letter grades, and cohort benchmarking comparisons"
    >
      {/* Top Academic Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Overall Percentage</span>
            <TrendingUp size={18} className="text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-blue-700 mt-2">{aggregatePercentage}%</p>
          <span className="text-[11px] text-gray-400">Total: {totalMarksObtained} / {totalMaxMarks} Marks</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Cumulative Grade</span>
            <Award size={18} className="text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 mt-2">{getGrade(aggregatePercentage)}</p>
          <span className="text-[11px] text-emerald-600 font-medium">First Division with Distinction</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Cohort Performance</span>
            <Sparkles size={18} className="text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-purple-700 mt-2">+6%</p>
          <span className="text-[11px] text-purple-600 font-medium">Higher than Class 6-A average</span>
        </Card>
      </div>

      {/* Exam Selector Dropdown */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">Select Exam:</span>
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-gray-400">CBSE Affiliated Evaluation Schedule</span>
      </div>

      {/* Subject-wise Marks Table */}
      <Card className="mb-8">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            Subject-Wise Score Breakdown
          </CardTitle>
          <p className="text-xs text-gray-500">Official marks certified by subject faculty</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject Name</TableHead>
                <TableHead>Marks Obtained</TableHead>
                <TableHead>Maximum Marks</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Letter Grade</TableHead>
                <TableHead className="text-right">Faculty Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentMarks.map((m) => {
                const sub = subjects.find((s) => s.id === m.subjectId);
                const pct = Math.round((m.marksObtained / m.maxMarks) * 100);
                return (
                  <TableRow key={m.id} className="hover:bg-gray-50/80">
                    <TableCell className="font-bold text-gray-900 text-xs sm:text-sm">
                      {sub?.name || m.subjectId}
                    </TableCell>
                    <TableCell className="font-extrabold text-blue-700 text-xs sm:text-sm">
                      {m.marksObtained}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">{m.maxMarks}</TableCell>
                    <TableCell className="font-bold text-gray-800 text-xs">{pct}%</TableCell>
                    <TableCell>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700">
                        {m.grade}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-gray-500 italic">
                      {m.remarks || 'Satisfactory academic progress'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Score vs Class Average (Bar Chart) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-gray-900">
              My Score vs Class Average
            </CardTitle>
            <p className="text-xs text-gray-500">Direct comparison across individual subjects</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="subject" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }}
                    formatter={(v: any) => [`${v}%`]}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="myScore" name="My Score" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="classAverage" name="Class Average" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Trajectory Line Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold text-gray-900">
              Improvement Trajectory Across Terms
            </CardTitle>
            <p className="text-xs text-gray-500">Historical performance progress curve</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examTrajectory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="exam" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }}
                    formatter={(v: any) => [`${v}%`]}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="score" name="My Overall Score" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="classAvg" name="Class Benchmark" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
