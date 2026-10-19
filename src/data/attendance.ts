import type { AttendanceRecord } from '@/types';
import { studentsData } from './students';

// Generate attendance records for last 30 days for all students in school-001
function generateAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  const school1Students = studentsData.filter(s => s.schoolId === 'school-001');
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    const dateStr = date.toISOString().split('T')[0];

    school1Students.forEach(student => {
      // Realistic attendance patterns — some students have lower attendance
      let status: AttendanceRecord['status'] = 'present';
      const rand = Math.random();

      // Students with IDs ending in certain numbers have lower attendance
      const lowAttendanceStudents = ['stu-005', 'stu-015', 'stu-033', 'stu-049', 'stu-065', 'stu-081', 'stu-089'];
      const isLowAttendance = lowAttendanceStudents.includes(student.id);

      if (isLowAttendance) {
        // ~30% absent, ~10% late
        if (rand < 0.30) status = 'absent';
        else if (rand < 0.40) status = 'late';
      } else {
        // ~8% absent, ~5% late
        if (rand < 0.08) status = 'absent';
        else if (rand < 0.13) status = 'late';
      }

      records.push({
        id: `att-${student.id}-${dateStr}`,
        schoolId: student.schoolId,
        studentId: student.id,
        classId: student.classId,
        date: dateStr,
        status,
        markedBy: 'tch-001',
        markedAt: `${dateStr}T09:00:00`,
      });
    });
  }

  // Also generate for school-002 students
  const school2Students = studentsData.filter(s => s.schoolId === 'school-002');
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split('T')[0];

    school2Students.forEach(student => {
      let status: AttendanceRecord['status'] = 'present';
      const rand = Math.random();
      if (rand < 0.10) status = 'absent';
      else if (rand < 0.15) status = 'late';

      records.push({
        id: `att-${student.id}-${dateStr}`,
        schoolId: student.schoolId,
        studentId: student.id,
        classId: student.classId,
        date: dateStr,
        status,
        markedBy: 'tch-s2-001',
        markedAt: `${dateStr}T09:00:00`,
      });
    });
  }

  return records;
}

export const attendanceData: AttendanceRecord[] = generateAttendanceRecords();
