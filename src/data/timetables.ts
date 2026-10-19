import type { TimetableEntry } from '@/types';

// Demo timetables for Vidya Public School (school-001)
// Classes: Class 6-A (cls-6a-s1), Class 6-B (cls-6b-s1), Class 7-A (cls-7a-s1)

export const timetablesData: TimetableEntry[] = [
  // ── Class 6-A Timetable ──
  // Monday
  { id: 'tt-6a-m1', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subjectId: 'sub-math-s1', teacherId: 'tch-001', room: 'Room 102' },
  { id: 'tt-6a-m2', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Monday', periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subjectId: 'sub-eng-s1', teacherId: 'tch-009', room: 'Room 102' },
  { id: 'tt-6a-m3', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Monday', periodNumber: 3, startTime: '10:00 AM', endTime: '10:45 AM', subjectId: 'sub-sci-s1', teacherId: 'tch-011', room: 'Science Lab 1' },
  { id: 'tt-6a-m4', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Monday', periodNumber: 4, startTime: '11:05 AM', endTime: '11:50 AM', subjectId: 'sub-sst-s1', teacherId: 'tch-006', room: 'Room 102' },
  { id: 'tt-6a-m5', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Monday', periodNumber: 5, startTime: '11:50 AM', endTime: '12:35 PM', subjectId: 'sub-hin-s1', teacherId: 'tch-013', room: 'Room 102' },
  { id: 'tt-6a-m6', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Monday', periodNumber: 6, startTime: '01:15 PM', endTime: '02:00 PM', subjectId: 'sub-san-s1', teacherId: 'tch-010', room: 'Room 102' },
  { id: 'tt-6a-m7', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Monday', periodNumber: 7, startTime: '02:00 PM', endTime: '02:45 PM', subjectId: 'sub-pe-s1', teacherId: 'tch-012', room: 'Playground' },
  { id: 'tt-6a-m8', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Monday', periodNumber: 8, startTime: '02:45 PM', endTime: '03:30 PM', subjectId: 'sub-comp-s1', teacherId: 'tch-008', room: 'Computer Lab 1' },

  // Wednesday
  { id: 'tt-6a-w1', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Wednesday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subjectId: 'sub-math-s1', teacherId: 'tch-001', room: 'Room 102' },
  { id: 'tt-6a-w2', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Wednesday', periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subjectId: 'sub-sci-s1', teacherId: 'tch-011', room: 'Science Lab 1' },
  { id: 'tt-6a-w3', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Wednesday', periodNumber: 3, startTime: '10:00 AM', endTime: '10:45 AM', subjectId: 'sub-eng-s1', teacherId: 'tch-009', room: 'Room 102' },
  { id: 'tt-6a-w4', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Wednesday', periodNumber: 4, startTime: '11:05 AM', endTime: '11:50 AM', subjectId: 'sub-sst-s1', teacherId: 'tch-006', room: 'Room 102' },
  { id: 'tt-6a-w5', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Wednesday', periodNumber: 5, startTime: '11:50 AM', endTime: '12:35 PM', subjectId: 'sub-comp-s1', teacherId: 'tch-008', room: 'Computer Lab 1' },
  { id: 'tt-6a-w6', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Wednesday', periodNumber: 6, startTime: '01:15 PM', endTime: '02:00 PM', subjectId: 'sub-hin-s1', teacherId: 'tch-013', room: 'Room 102' },
  { id: 'tt-6a-w7', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Wednesday', periodNumber: 7, startTime: '02:00 PM', endTime: '02:45 PM', subjectId: 'sub-pe-s1', teacherId: 'tch-012', room: 'Playground' },
  { id: 'tt-6a-w8', schoolId: 'school-001', classId: 'cls-6a-s1', dayOfWeek: 'Wednesday', periodNumber: 8, startTime: '02:45 PM', endTime: '03:30 PM', subjectId: 'sub-san-s1', teacherId: 'tch-010', room: 'Room 102' },

  // ── Class 6-B Timetable ──
  // Monday
  { id: 'tt-6b-m1', schoolId: 'school-001', classId: 'cls-6b-s1', dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subjectId: 'sub-eng-s1', teacherId: 'tch-009', room: 'Room 103' },
  { id: 'tt-6b-m2', schoolId: 'school-001', classId: 'cls-6b-s1', dayOfWeek: 'Monday', periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subjectId: 'sub-math-s1', teacherId: 'tch-001', room: 'Room 103' },
  { id: 'tt-6b-m3', schoolId: 'school-001', classId: 'cls-6b-s1', dayOfWeek: 'Monday', periodNumber: 3, startTime: '10:00 AM', endTime: '10:45 AM', subjectId: 'sub-sst-s1', teacherId: 'tch-006', room: 'Room 103' },
  { id: 'tt-6b-m4', schoolId: 'school-001', classId: 'cls-6b-s1', dayOfWeek: 'Monday', periodNumber: 4, startTime: '11:05 AM', endTime: '11:50 AM', subjectId: 'sub-sci-s1', teacherId: 'tch-002', room: 'Science Lab 2' },
  { id: 'tt-6b-m5', schoolId: 'school-001', classId: 'cls-6b-s1', dayOfWeek: 'Monday', periodNumber: 5, startTime: '11:50 AM', endTime: '12:35 PM', subjectId: 'sub-comp-s1', teacherId: 'tch-015', room: 'Computer Lab 2' },

  // Wednesday
  { id: 'tt-6b-w1', schoolId: 'school-001', classId: 'cls-6b-s1', dayOfWeek: 'Wednesday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subjectId: 'sub-sci-s1', teacherId: 'tch-002', room: 'Science Lab 2' },
  { id: 'tt-6b-w2', schoolId: 'school-001', classId: 'cls-6b-s1', dayOfWeek: 'Wednesday', periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subjectId: 'sub-math-s1', teacherId: 'tch-001', room: 'Room 103' },
  { id: 'tt-6b-w3', schoolId: 'school-001', classId: 'cls-6b-s1', dayOfWeek: 'Wednesday', periodNumber: 3, startTime: '10:00 AM', endTime: '10:45 AM', subjectId: 'sub-sst-s1', teacherId: 'tch-006', room: 'Room 103' },

  // ── Class 7-A Timetable ──
  // Monday
  { id: 'tt-7a-m1', schoolId: 'school-001', classId: 'cls-7a-s1', dayOfWeek: 'Monday', periodNumber: 1, startTime: '08:30 AM', endTime: '09:15 AM', subjectId: 'sub-sci-s1', teacherId: 'tch-011', room: 'Science Lab 1' },
  { id: 'tt-7a-m2', schoolId: 'school-001', classId: 'cls-7a-s1', dayOfWeek: 'Monday', periodNumber: 2, startTime: '09:15 AM', endTime: '10:00 AM', subjectId: 'sub-sst-s1', teacherId: 'tch-006', room: 'Room 201' },
  { id: 'tt-7a-m3', schoolId: 'school-001', classId: 'cls-7a-s1', dayOfWeek: 'Monday', periodNumber: 3, startTime: '10:00 AM', endTime: '10:45 AM', subjectId: 'sub-eng-s1', teacherId: 'tch-003', room: 'Room 201' },
  { id: 'tt-7a-m4', schoolId: 'school-001', classId: 'cls-7a-s1', dayOfWeek: 'Monday', periodNumber: 4, startTime: '11:05 AM', endTime: '11:50 AM', subjectId: 'sub-math-s1', teacherId: 'tch-001', room: 'Room 201' },
];
