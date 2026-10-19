import type { TeacherFeedback } from '@/types';

export const feedbackData: TeacherFeedback[] = [
  // August feedback for Class 6A teachers
  { id: 'fb-001', schoolId: 'school-001', teacherId: 'tch-001', studentId: 'stu-001', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 3, comment: 'Very good teaching', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-002', schoolId: 'school-001', teacherId: 'tch-001', studentId: 'stu-002', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 3, comment: 'Explains concepts well', submittedAt: '2026-09-01T10:30:00' },
  { id: 'fb-003', schoolId: 'school-001', teacherId: 'tch-001', studentId: 'stu-003', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 4, subjectKnowledge: 4, classroomManagement: 3, syllabusCoverage: 3, comment: '', submittedAt: '2026-09-01T11:00:00' },
  { id: 'fb-004', schoolId: 'school-001', teacherId: 'tch-001', studentId: 'stu-004', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 4, comment: 'Best math teacher!', submittedAt: '2026-09-01T11:30:00' },
  { id: 'fb-005', schoolId: 'school-001', teacherId: 'tch-001', studentId: 'stu-005', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 3, doubtSolving: 3, subjectKnowledge: 4, classroomManagement: 3, syllabusCoverage: 2, comment: 'Goes too fast sometimes', submittedAt: '2026-09-01T12:00:00' },
  { id: 'fb-006', schoolId: 'school-001', teacherId: 'tch-011', studentId: 'stu-001', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 4, comment: 'Good lab sessions', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-007', schoolId: 'school-001', teacherId: 'tch-011', studentId: 'stu-002', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 4, comment: 'Amazing teacher', submittedAt: '2026-09-01T10:30:00' },
  { id: 'fb-008', schoolId: 'school-001', teacherId: 'tch-011', studentId: 'stu-003', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 3, doubtSolving: 3, subjectKnowledge: 4, classroomManagement: 3, syllabusCoverage: 3, comment: '', submittedAt: '2026-09-01T11:00:00' },

  // Class 7A feedback for English teacher
  { id: 'fb-009', schoolId: 'school-001', teacherId: 'tch-003', studentId: 'stu-030', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 4, comment: 'Wonderful teacher!', submittedAt: '2026-09-01T09:00:00' },
  { id: 'fb-010', schoolId: 'school-001', teacherId: 'tch-003', studentId: 'stu-031', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 3, comment: '', submittedAt: '2026-09-01T09:30:00' },
  { id: 'fb-011', schoolId: 'school-001', teacherId: 'tch-003', studentId: 'stu-032', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 4, comment: 'Makes English interesting', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-012', schoolId: 'school-001', teacherId: 'tch-003', studentId: 'stu-033', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 3, doubtSolving: 3, subjectKnowledge: 4, classroomManagement: 3, syllabusCoverage: 2, comment: 'Needs to solve more doubts', submittedAt: '2026-09-01T10:30:00' },

  // Hindi teacher feedback (lower rated)
  { id: 'fb-013', schoolId: 'school-001', teacherId: 'tch-004', studentId: 'stu-030', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 2, doubtSolving: 2, subjectKnowledge: 3, classroomManagement: 2, syllabusCoverage: 2, comment: 'Needs improvement', submittedAt: '2026-09-01T09:00:00' },
  { id: 'fb-014', schoolId: 'school-001', teacherId: 'tch-004', studentId: 'stu-031', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 3, doubtSolving: 2, subjectKnowledge: 3, classroomManagement: 2, syllabusCoverage: 2, comment: '', submittedAt: '2026-09-01T09:30:00' },
  { id: 'fb-015', schoolId: 'school-001', teacherId: 'tch-004', studentId: 'stu-032', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 2, doubtSolving: 3, subjectKnowledge: 3, classroomManagement: 3, syllabusCoverage: 2, comment: 'Classes are boring', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-016', schoolId: 'school-001', teacherId: 'tch-004', studentId: 'stu-033', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 3, doubtSolving: 2, subjectKnowledge: 4, classroomManagement: 2, syllabusCoverage: 3, comment: '', submittedAt: '2026-09-01T10:30:00' },

  // More feedback entries for variety
  { id: 'fb-017', schoolId: 'school-001', teacherId: 'tch-005', studentId: 'stu-062', classId: 'cls-9a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 5, comment: 'Best teacher in school', submittedAt: '2026-09-01T09:00:00' },
  { id: 'fb-018', schoolId: 'school-001', teacherId: 'tch-005', studentId: 'stu-063', classId: 'cls-9a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 4, comment: 'Excellent teaching method', submittedAt: '2026-09-01T09:30:00' },
  { id: 'fb-019', schoolId: 'school-001', teacherId: 'tch-005', studentId: 'stu-064', classId: 'cls-9a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 4, comment: '', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-020', schoolId: 'school-001', teacherId: 'tch-005', studentId: 'stu-065', classId: 'cls-9a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 4, comment: 'Very patient with doubts', submittedAt: '2026-09-01T10:30:00' },

  // Class 8A feedback
  { id: 'fb-021', schoolId: 'school-001', teacherId: 'tch-002', studentId: 'stu-046', classId: 'cls-8a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 3, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 4, comment: '', submittedAt: '2026-09-01T09:00:00' },
  { id: 'fb-022', schoolId: 'school-001', teacherId: 'tch-002', studentId: 'stu-047', classId: 'cls-8a-s1', month: '2026-08', teachingClarity: 3, doubtSolving: 3, subjectKnowledge: 4, classroomManagement: 3, syllabusCoverage: 3, comment: '', submittedAt: '2026-09-01T09:30:00' },
  { id: 'fb-023', schoolId: 'school-001', teacherId: 'tch-002', studentId: 'stu-048', classId: 'cls-8a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 3, comment: 'Good but needs more experiments', submittedAt: '2026-09-01T10:00:00' },

  // Computer Science teacher
  { id: 'fb-024', schoolId: 'school-001', teacherId: 'tch-008', studentId: 'stu-001', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 5, comment: 'Love the practical sessions', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-025', schoolId: 'school-001', teacherId: 'tch-008', studentId: 'stu-002', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 5, comment: '', submittedAt: '2026-09-01T10:30:00' },
  { id: 'fb-026', schoolId: 'school-001', teacherId: 'tch-008', studentId: 'stu-077', classId: 'cls-10a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 4, comment: 'Very knowledgeable', submittedAt: '2026-09-01T11:00:00' },

  // SST teacher
  { id: 'fb-027', schoolId: 'school-001', teacherId: 'tch-006', studentId: 'stu-001', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 3, subjectKnowledge: 4, classroomManagement: 4, syllabusCoverage: 4, comment: '', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-028', schoolId: 'school-001', teacherId: 'tch-006', studentId: 'stu-002', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 3, doubtSolving: 3, subjectKnowledge: 4, classroomManagement: 3, syllabusCoverage: 3, comment: '', submittedAt: '2026-09-01T10:30:00' },

  // Sports teacher
  { id: 'fb-029', schoolId: 'school-001', teacherId: 'tch-012', studentId: 'stu-001', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 5, comment: 'Very energetic classes!', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-030', schoolId: 'school-001', teacherId: 'tch-012', studentId: 'stu-030', classId: 'cls-7a-s1', month: '2026-08', teachingClarity: 5, doubtSolving: 5, subjectKnowledge: 5, classroomManagement: 5, syllabusCoverage: 5, comment: 'Best PT class!', submittedAt: '2026-09-01T09:00:00' },

  // Sanskrit teacher
  { id: 'fb-031', schoolId: 'school-001', teacherId: 'tch-010', studentId: 'stu-001', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 4, doubtSolving: 4, subjectKnowledge: 5, classroomManagement: 4, syllabusCoverage: 4, comment: 'Shlokas are taught well', submittedAt: '2026-09-01T10:00:00' },
  { id: 'fb-032', schoolId: 'school-001', teacherId: 'tch-010', studentId: 'stu-002', classId: 'cls-6a-s1', month: '2026-08', teachingClarity: 3, doubtSolving: 3, subjectKnowledge: 5, classroomManagement: 3, syllabusCoverage: 3, comment: '', submittedAt: '2026-09-01T10:30:00' },
];
