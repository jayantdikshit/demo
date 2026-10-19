import type { Notification } from '@/types';

export const notificationsData: Notification[] = [
  // Absence alerts
  { id: 'notif-001', schoolId: 'school-001', type: 'absence', title: 'Student Absent Today', message: 'Arjun Reddy (Class 6-A) was absent today.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: 'stu-005', isRead: false, createdAt: '2026-09-09T09:30:00', priority: 'high', actionUrl: '/management/attendance' },
  { id: 'notif-002', schoolId: 'school-001', type: 'absence', title: 'Your Child Was Absent', message: 'Dear Parent, your child Arjun Reddy was marked absent today (September 9, 2026).', recipientRole: 'parent', recipientId: 'parent-005', relatedStudentId: 'stu-005', isRead: false, createdAt: '2026-09-09T09:30:00', priority: 'high', actionUrl: null },
  { id: 'notif-003', schoolId: 'school-001', type: 'absence', title: 'Student Absent Today', message: 'Yash Dubey (Class 6-A) was absent today.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: 'stu-015', isRead: false, createdAt: '2026-09-09T09:30:00', priority: 'high', actionUrl: '/management/attendance' },

  // Low attendance alerts
  { id: 'notif-004', schoolId: 'school-001', type: 'low_attendance', title: 'Attendance Below Threshold', message: 'Arjun Reddy (Class 6-A) attendance is 68%, below the 75% threshold.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: 'stu-005', isRead: false, createdAt: '2026-09-08T16:00:00', priority: 'high', actionUrl: '/management/attendance' },
  { id: 'notif-005', schoolId: 'school-001', type: 'low_attendance', title: 'Low Attendance Warning', message: 'Your child\'s attendance is 68%, which is below the school\'s 75% requirement. Please ensure regular attendance.', recipientRole: 'parent', recipientId: 'parent-005', relatedStudentId: 'stu-005', isRead: false, createdAt: '2026-09-08T16:00:00', priority: 'high', actionUrl: null },
  { id: 'notif-006', schoolId: 'school-001', type: 'low_attendance', title: 'Attendance Below Threshold', message: 'Harsh Vardhan (Class 7-A) attendance is 70%, below the 75% threshold.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: 'stu-033', isRead: true, createdAt: '2026-09-07T16:00:00', priority: 'high', actionUrl: '/management/attendance' },
  { id: 'notif-007', schoolId: 'school-001', type: 'low_attendance', title: 'Attendance Below Threshold', message: 'Ritik Puri (Class 10-A) attendance is 72%, below the 75% threshold.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: 'stu-081', isRead: true, createdAt: '2026-09-06T16:00:00', priority: 'medium', actionUrl: '/management/attendance' },

  // Low marks alerts
  { id: 'notif-008', schoolId: 'school-001', type: 'low_marks', title: 'Low Score in Mathematics', message: 'Arjun Reddy (Class 6-A) scored 18/50 in Mathematics Unit Test 1, below the passing threshold.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: 'stu-005', isRead: false, createdAt: '2026-09-05T11:00:00', priority: 'high', actionUrl: '/management/academics' },
  { id: 'notif-009', schoolId: 'school-001', type: 'low_marks', title: 'Performance Below Threshold', message: 'Your child scored below the passing threshold in Mathematics. Please meet the class teacher for guidance.', recipientRole: 'parent', recipientId: 'parent-005', relatedStudentId: 'stu-005', isRead: false, createdAt: '2026-09-05T11:00:00', priority: 'high', actionUrl: null },
  { id: 'notif-010', schoolId: 'school-001', type: 'low_marks', title: 'Low Score in Science', message: 'Viraj Desai (Class 8-A) scored 22/50 in Science Unit Test 1.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: 'stu-049', isRead: true, createdAt: '2026-09-04T11:00:00', priority: 'medium', actionUrl: '/management/academics' },

  // Fee reminders
  { id: 'notif-011', schoolId: 'school-001', type: 'fee_reminder', title: 'Fee Payment Pending', message: 'Fee payment of ₹25,000 for Term 1 is pending for Vihaan Kumar (Class 6-A).', recipientRole: 'student', recipientId: 'stu-003', relatedStudentId: 'stu-003', isRead: false, createdAt: '2026-09-08T08:00:00', priority: 'medium', actionUrl: '/student/fees' },
  { id: 'notif-012', schoolId: 'school-001', type: 'fee_reminder', title: 'Fee Payment Pending', message: 'Term 1 fee payment is still pending. Kindly clear the dues at the earliest.', recipientRole: 'parent', recipientId: 'parent-003', relatedStudentId: 'stu-003', isRead: false, createdAt: '2026-09-08T08:00:00', priority: 'medium', actionUrl: null },

  // Fee submitted
  { id: 'notif-013', schoolId: 'school-001', type: 'fee_submitted', title: 'Payment Submitted', message: 'Myra Chopra (Class 6-A) has submitted a fee payment of ₹25,000 via UPI. Awaiting verification.', recipientRole: 'accounts', recipientId: 'accounts-001', relatedStudentId: 'stu-010', isRead: false, createdAt: '2026-09-01T14:00:00', priority: 'medium', actionUrl: '/accounts/verification' },

  // Syllabus delayed
  { id: 'notif-014', schoolId: 'school-001', type: 'syllabus_delayed', title: 'Topic Overdue', message: 'Fractions - Operations (Mathematics, Class 6-A) is overdue since August 11. Assigned to Anita Deshmukh.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: null, isRead: false, createdAt: '2026-09-08T07:00:00', priority: 'medium', actionUrl: '/management/syllabus' },
  { id: 'notif-015', schoolId: 'school-001', type: 'syllabus_delayed', title: 'Topic Overdue', message: 'Decimals (Mathematics, Class 6-A) is overdue since August 14.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: null, isRead: true, createdAt: '2026-09-07T07:00:00', priority: 'medium', actionUrl: '/management/syllabus' },
  { id: 'notif-016', schoolId: 'school-001', type: 'syllabus_delayed', title: 'Syllabus Delayed', message: 'You have 3 overdue topics in Mathematics (Class 6-A). Please complete them at the earliest.', recipientRole: 'teacher', recipientId: 'tch-001', relatedStudentId: null, isRead: false, createdAt: '2026-09-08T07:00:00', priority: 'high', actionUrl: '/teacher/teaching-plan' },

  // Intervention
  { id: 'notif-017', schoolId: 'school-001', type: 'intervention', title: 'Intervention Review Due', message: 'Remedial class for Arjun Reddy (Mathematics) is due for review. Check student progress.', recipientRole: 'teacher', recipientId: 'tch-001', relatedStudentId: 'stu-005', isRead: false, createdAt: '2026-09-07T09:00:00', priority: 'medium', actionUrl: '/teacher/interventions' },

  // Announcement
  { id: 'notif-018', schoolId: 'school-001', type: 'announcement', title: 'Annual Day Celebration', message: 'Annual Day will be celebrated on October 15, 2026. All students must participate in rehearsals starting September 20.', recipientRole: 'student', recipientId: 'all', relatedStudentId: null, isRead: false, createdAt: '2026-09-05T10:00:00', priority: 'low', actionUrl: null },
  { id: 'notif-019', schoolId: 'school-001', type: 'announcement', title: 'Parent-Teacher Meeting', message: 'PTM scheduled for September 20, 2026 (Saturday), 10:00 AM to 1:00 PM. All parents are requested to attend.', recipientRole: 'parent', recipientId: 'all', relatedStudentId: null, isRead: false, createdAt: '2026-09-04T09:00:00', priority: 'medium', actionUrl: null },

  // Complaint update
  { id: 'notif-020', schoolId: 'school-001', type: 'complaint_update', title: 'Complaint Resolved', message: 'Your complaint regarding incorrect attendance on August 25 has been resolved. The record has been corrected.', recipientRole: 'student', recipientId: 'stu-030', relatedStudentId: 'stu-030', isRead: true, createdAt: '2026-09-03T15:00:00', priority: 'low', actionUrl: '/student/complaints' },

  // Feedback available
  { id: 'notif-021', schoolId: 'school-001', type: 'feedback_available', title: 'Teacher Feedback Window Open', message: 'Monthly teacher feedback for August is now open. Please submit your ratings by September 10.', recipientRole: 'student', recipientId: 'all', relatedStudentId: null, isRead: false, createdAt: '2026-09-01T08:00:00', priority: 'medium', actionUrl: '/student/feedback' },

  // Additional management notifications
  { id: 'notif-022', schoolId: 'school-001', type: 'low_marks', title: 'Multiple Low Scores Detected', message: '7 students scored below passing threshold in Mathematics Unit Test 1 across classes. Review needed.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: null, isRead: false, createdAt: '2026-09-05T12:00:00', priority: 'high', actionUrl: '/management/academics' },
  { id: 'notif-023', schoolId: 'school-001', type: 'fee_reminder', title: 'Fee Collection Update', message: '65% of Term 1 fees collected. 35% pending across all classes. Follow-up recommended.', recipientRole: 'management', recipientId: 'mgmt-001', relatedStudentId: null, isRead: true, createdAt: '2026-09-01T09:00:00', priority: 'medium', actionUrl: '/management/fees' },
];
