import type { MarksRecord } from '@/types';
import { studentsData } from './students';

function generateMarksRecords(): MarksRecord[] {
  const records: MarksRecord[] = [];
  const subjects = [
    { id: 'sub-math-s1', name: 'Mathematics' },
    { id: 'sub-sci-s1', name: 'Science' },
    { id: 'sub-eng-s1', name: 'English' },
    { id: 'sub-hin-s1', name: 'Hindi' },
    { id: 'sub-sst-s1', name: 'Social Studies' },
  ];
  const exams = [
    { id: 'exam-ut1-s1', maxMarks: 50 },
    { id: 'exam-mid-s1', maxMarks: 80 },
  ];

  // Certain students are low performers
  const lowPerformers = ['stu-005', 'stu-015', 'stu-033', 'stu-049', 'stu-065', 'stu-081', 'stu-089'];
  const topPerformers = ['stu-001', 'stu-002', 'stu-030', 'stu-046', 'stu-062', 'stu-077', 'stu-078'];

  const school1Students = studentsData.filter(s => s.schoolId === 'school-001');

  school1Students.forEach(student => {
    subjects.forEach(subject => {
      exams.forEach(exam => {
        let basePercentage: number;

        if (topPerformers.includes(student.id)) {
          basePercentage = 80 + Math.random() * 18; // 80-98%
        } else if (lowPerformers.includes(student.id)) {
          basePercentage = 20 + Math.random() * 25; // 20-45%
        } else {
          basePercentage = 45 + Math.random() * 40; // 45-85%
        }

        // Some subject variation
        if (subject.id === 'sub-math-s1' && lowPerformers.includes(student.id)) {
          basePercentage = Math.max(15, basePercentage - 10); // Extra weak in math
        }

        const marks = Math.round((basePercentage / 100) * exam.maxMarks);
        const percentage = (marks / exam.maxMarks) * 100;
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else if (percentage >= 35) grade = 'D';

        records.push({
          id: `marks-${student.id}-${subject.id}-${exam.id}`,
          schoolId: 'school-001',
          studentId: student.id,
          classId: student.classId,
          subjectId: subject.id,
          examId: exam.id,
          marksObtained: marks,
          maxMarks: exam.maxMarks,
          grade,
          remarks: percentage < 35 ? 'Needs Improvement' : percentage >= 80 ? 'Excellent' : '',
          enteredBy: 'tch-001',
          enteredAt: '2026-08-01T10:00:00',
        });
      });
    });
  });

  // School 2 marks
  const s2Subjects = [
    { id: 'sub-math-s2' },
    { id: 'sub-sci-s2' },
    { id: 'sub-eng-s2' },
  ];
  const s2Exams = [
    { id: 'exam-ut1-s2', maxMarks: 50 },
    { id: 'exam-mid-s2', maxMarks: 80 },
  ];

  const school2Students = studentsData.filter(s => s.schoolId === 'school-002');
  school2Students.forEach(student => {
    s2Subjects.forEach(subject => {
      s2Exams.forEach(exam => {
        const basePercentage = 40 + Math.random() * 50;
        const marks = Math.round((basePercentage / 100) * exam.maxMarks);
        const percentage = (marks / exam.maxMarks) * 100;
        let grade = 'F';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else if (percentage >= 40) grade = 'D';

        records.push({
          id: `marks-${student.id}-${subject.id}-${exam.id}`,
          schoolId: 'school-002',
          studentId: student.id,
          classId: student.classId,
          subjectId: subject.id,
          examId: exam.id,
          marksObtained: marks,
          maxMarks: exam.maxMarks,
          grade,
          remarks: '',
          enteredBy: 'tch-s2-001',
          enteredAt: '2026-08-01T10:00:00',
        });
      });
    });
  });

  return records;
}

export const marksData: MarksRecord[] = generateMarksRecords();
