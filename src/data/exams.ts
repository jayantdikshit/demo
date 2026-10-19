import type { Exam } from '@/types';

export const examsData: Exam[] = [
  // School 1
  { id: 'exam-ut1-s1', schoolId: 'school-001', name: 'Unit Test 1', type: 'unit_test', startDate: '2026-05-15', endDate: '2026-05-20', maxMarks: 50 },
  { id: 'exam-mid-s1', schoolId: 'school-001', name: 'Mid Term Examination', type: 'mid_term', startDate: '2026-07-20', endDate: '2026-07-30', maxMarks: 80 },
  { id: 'exam-final-s1', schoolId: 'school-001', name: 'Final Examination', type: 'final', startDate: '2026-02-15', endDate: '2026-02-28', maxMarks: 100 },
  // School 2
  { id: 'exam-ut1-s2', schoolId: 'school-002', name: 'Unit Test 1', type: 'unit_test', startDate: '2026-05-10', endDate: '2026-05-15', maxMarks: 50 },
  { id: 'exam-mid-s2', schoolId: 'school-002', name: 'Mid Term Examination', type: 'mid_term', startDate: '2026-07-15', endDate: '2026-07-25', maxMarks: 80 },
  { id: 'exam-final-s2', schoolId: 'school-002', name: 'Final Examination', type: 'final', startDate: '2026-02-10', endDate: '2026-02-25', maxMarks: 100 },
];
