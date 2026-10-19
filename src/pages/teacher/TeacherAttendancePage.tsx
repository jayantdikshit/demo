import React, { useState, useMemo, useEffect } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { getInitials } from '@/lib/utils';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  CheckCheck,
  UserX,
  Sparkles,
} from 'lucide-react';
import type { AttendanceStatus, AttendanceRecord } from '@/types';

export function TeacherAttendancePage() {
  const { schoolConfig, students, classes, attendanceRecords } = useSchoolData();
  const { markAttendance } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-6');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-09');
  const [studentStatusMap, setStudentStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Filter students for current class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Initialize roster status from existing records or default to 'present'
  useEffect(() => {
    const initialMap: Record<string, AttendanceStatus> = {};
    classStudents.forEach((st) => {
      const existing = attendanceRecords.find((r) => r.studentId === st.id && r.date === selectedDate);
      initialMap[st.id] = existing ? existing.status : 'present';
    });
    setStudentStatusMap(initialMap);
  }, [classStudents, attendanceRecords, selectedDate]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setStudentStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    classStudents.forEach((st) => {
      updated[st.id] = status;
    });
    setStudentStatusMap(updated);
  };

  const handleSaveAttendance = () => {
    const activeClass = classes.find((c) => c.id === selectedClassId);
    const newRecords: AttendanceRecord[] = classStudents.map((st) => ({
      id: `att-${selectedDate}-${st.id}`,
      schoolId: schoolConfig.schoolId,
      studentId: st.id,
      classId: selectedClassId,
      date: selectedDate,
      status: studentStatusMap[st.id] || 'present',
      markedBy: 'tch-001',
      markedAt: new Date().toISOString(),
    }));

    markAttendance(newRecords);

    const absentCount = Object.values(studentStatusMap).filter((s) => s === 'absent').length;
    setSaveSuccess(
      `Attendance saved for Class ${activeClass?.className}-${activeClass?.section} (${absentCount} absentees logged & alerted)`
    );
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const presentCount = Object.values(studentStatusMap).filter((s) => s === 'present').length;
  const lateCount = Object.values(studentStatusMap).filter((s) => s === 'late').length;
  const absentCount = Object.values(studentStatusMap).filter((s) => s === 'absent').length;

  return (
    <PageWrapper
      title="Daily Classroom Attendance Register"
      subtitle="Mark, verify, and synchronize student attendance with real-time parent notifications"
      action={
        <Button onClick={handleSaveAttendance} className="gap-2 text-xs">
          <Save size={14} />
          <span>Save Attendance</span>
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

      {/* Class & Date Controls + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
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

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-700">Date:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Live Counters */}
        <div className="grid grid-cols-3 gap-2 lg:col-span-2">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs font-bold text-emerald-700 uppercase">Present</span>
            <p className="text-xl font-extrabold text-emerald-900 mt-0.5">{presentCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs font-bold text-amber-700 uppercase">Late</span>
            <p className="text-xl font-extrabold text-amber-900 mt-0.5">{lateCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-xs font-bold text-rose-700 uppercase">Absent</span>
            <p className="text-xl font-extrabold text-rose-900 mt-0.5">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
        <span className="text-xs text-gray-500">
          Showing <strong>{classStudents.length} Students</strong> in Class {selectedClass?.className}-{selectedClass?.section}
        </span>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMarkAll('present')}
            className="text-xs h-8 gap-1 border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
          >
            <CheckCheck size={14} />
            <span>Mark All Present</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMarkAll('absent')}
            className="text-xs h-8 gap-1 border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100"
          >
            <UserX size={14} />
            <span>Mark All Absent</span>
          </Button>
        </div>
      </div>

      {/* Student Attendance Roster Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Roll No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Parent Contact</TableHead>
                <TableHead className="text-center">Attendance Status Selection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classStudents.map((st) => {
                const currentStatus = studentStatusMap[st.id] || 'present';
                return (
                  <TableRow key={st.id} className="hover:bg-gray-50/80">
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
                          <span className="text-[10px] text-gray-400 block">{st.gender}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      <span>{st.parentName}</span>
                      <span className="text-[10px] text-gray-400 block">{st.parentPhone}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        {/* Present Button */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'present')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20'
                              : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <CheckCircle2 size={13} />
                          <span>Present</span>
                        </button>

                        {/* Late Button */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'late')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'late'
                              ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                              : 'bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <Clock size={13} />
                          <span>Late</span>
                        </button>

                        {/* Absent Button */}
                        <button
                          type="button"
                          onClick={() => handleStatusChange(st.id, 'absent')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-500/20'
                              : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <XCircle size={13} />
                          <span>Absent</span>
                        </button>
                      </div>
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
