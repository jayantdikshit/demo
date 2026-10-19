import React, { useState, useMemo, useEffect } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { getInitials, getGrade } from '@/lib/utils';
import {
  PenLine,
  Save,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import type { MarksRecord } from '@/types';

export function TeacherMarksPage() {
  const { schoolConfig, students, classes, subjects, exams, marksRecords } = useSchoolData();
  const { saveMarks } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-6');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-1');
  const [selectedExamId, setSelectedExamId] = useState<string>(exams[0]?.id || 'exam-001');

  const [studentMarksMap, setStudentMarksMap] = useState<Record<string, number>>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const activeExam = exams.find((e) => e.id === selectedExamId) || exams[0];
  const maxMarks = activeExam?.maxMarks || 100;

  // Filter students for selected class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Load existing marks into state
  useEffect(() => {
    const marksMap: Record<string, number> = {};
    classStudents.forEach((st) => {
      const existing = marksRecords.find(
        (m) =>
          m.studentId === st.id &&
          m.classId === selectedClassId &&
          m.subjectId === selectedSubjectId &&
          m.examId === selectedExamId
      );
      marksMap[st.id] = existing ? existing.marksObtained : 70;
    });
    setStudentMarksMap(marksMap);
  }, [classStudents, marksRecords, selectedClassId, selectedSubjectId, selectedExamId]);

  const handleScoreChange = (studentId: string, value: string) => {
    const numeric = Math.min(maxMarks, Math.max(0, Number(value) || 0));
    setStudentMarksMap((prev) => ({
      ...prev,
      [studentId]: numeric,
    }));
  };

  const handleSaveMarks = () => {
    const recordsToSave: MarksRecord[] = classStudents.map((st) => {
      const obtained = studentMarksMap[st.id] !== undefined ? studentMarksMap[st.id] : 70;
      const pct = (obtained / maxMarks) * 100;
      return {
        id: `m-${selectedExamId}-${st.id}-${selectedSubjectId}`,
        schoolId: schoolConfig.schoolId,
        studentId: st.id,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        examId: selectedExamId,
        marksObtained: obtained,
        maxMarks,
        grade: getGrade(pct),
        remarks: pct < schoolConfig.marksThreshold ? 'Requires Remedial Support' : 'Good Performance',
        enteredBy: 'tch-001',
        enteredAt: new Date().toISOString(),
      };
    });

    saveMarks(recordsToSave);

    const belowCount = Object.values(studentMarksMap).filter(
      (score) => (score / maxMarks) * 100 < schoolConfig.marksThreshold
    ).length;

    setSaveSuccess(
      `Examination marks saved successfully! (${belowCount} students below threshold alerted)`
    );
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // Stats for current class & subject
  const currentScores = Object.values(studentMarksMap);
  const classAvg =
    currentScores.length > 0
      ? Math.round(currentScores.reduce((sum, s) => sum + s, 0) / currentScores.length)
      : 70;
  const underThresholdCount = currentScores.filter(
    (s) => (s / maxMarks) * 100 < schoolConfig.marksThreshold
  ).length;

  return (
    <PageWrapper
      title="Examination Marks Entry & Grade Book"
      subtitle="Input student scores, automatically identify performance drop-offs, and generate remedial alerts"
      action={
        <Button onClick={handleSaveMarks} className="gap-2 text-xs">
          <Save size={14} />
          <span>Save Marks Register</span>
        </Button>
      }
    >
      {/* Toast Alert */}
      {saveSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Cascading Filter Selection Controls */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Class */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">1. Select Class:</label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    Class {c.className}-{c.section}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">2. Select Subject:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Exam */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">3. Select Examination:</label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} (Max: {ex.maxMarks})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-700 uppercase">Maximum Marks</span>
            <p className="text-xl font-extrabold text-blue-900 mt-0.5">{maxMarks} Marks</p>
          </div>
          <Award size={20} className="text-blue-600" />
        </div>

        <div className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase">Class Average</span>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">{classAvg} / {maxMarks}</p>
          </div>
          <Sparkles size={20} className="text-emerald-500" />
        </div>

        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-700 uppercase">Below Threshold (&lt; {schoolConfig.marksThreshold}%)</span>
            <p className="text-xl font-extrabold text-rose-800 mt-0.5">{underThresholdCount} Students</p>
          </div>
          <AlertTriangle size={20} className="text-rose-600" />
        </div>
      </div>

      {/* Marks Input Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Class Roster &amp; Score Input
            </CardTitle>
            <p className="text-xs text-gray-500">Inputs turn red when score is below passing threshold</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
            {classStudents.length} Students
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Marks Obtained (out of {maxMarks})</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Evaluation Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((st) => {
                const score = studentMarksMap[st.id] !== undefined ? studentMarksMap[st.id] : 70;
                const pct = Math.round((score / maxMarks) * 100);
                const isUnderThreshold = pct < schoolConfig.marksThreshold;

                return (
                  <TableRow key={st.id} className={isUnderThreshold ? 'bg-rose-50/40' : 'hover:bg-gray-50/80'}>
                    <TableCell className="font-bold text-gray-600 text-xs">{st.rollNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(st.name)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-xs sm:text-sm block">
                            {st.name}
                          </span>
                          <span className="text-[10px] text-gray-400 block">{st.parentName}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={maxMarks}
                          value={score}
                          onChange={(e) => handleScoreChange(st.id, e.target.value)}
                          className={`w-24 px-3 py-1.5 rounded-lg border text-sm font-bold text-center transition-all ${
                            isUnderThreshold
                              ? 'border-rose-400 bg-rose-50 text-rose-700 ring-2 ring-rose-300/30'
                              : 'border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                          }`}
                        />
                        <span className="text-xs text-gray-400">/ {maxMarks}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold ${isUnderThreshold ? 'text-rose-600' : 'text-gray-900'}`}>
                        {pct}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {getGrade(pct)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {isUnderThreshold ? (
                        <Badge status="At Risk">Remedial Flagged</Badge>
                      ) : (
                        <Badge status="Completed">Passing</Badge>
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
