// ============================================================
// CORE TYPE DEFINITIONS — School Digital Intelligence Platform
// ============================================================

// ── School & Multi-Tenant ──
export interface SchoolConfig {
  schoolId: string;
  slug: string;
  name: string;
  shortName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  attendanceThreshold: number;
  marksThreshold: number;
  feeStructure: FeeStructureItem[];
  featureFlags: FeatureFlags;
  domain: string;
  address: string;
  phone: string;
  email: string;
  principalName: string;
  principalMessage: string;
  tagline: string;
  establishedYear: number;
}

export interface FeeStructureItem {
  id: string;
  schoolId: string;
  classId: string;
  termName: string;
  amount: number;
  dueDate: string;
  description: string;
}

export interface FeatureFlags {
  aiAssistant: boolean;
  publicWebsite: boolean;
  parentCommunication: boolean;
  onlinePayment: boolean;
  teacherFeedback: boolean;
  complaintSystem: boolean;
  interventionTracking: boolean;
}

// ── User & Roles ──
export type UserRole = 'management' | 'teacher' | 'student' | 'accounts';

export interface User {
  id: string;
  schoolId: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar: string;
}

// ── Class & Section ──
export interface ClassSection {
  id: string;
  schoolId: string;
  className: string;
  section: string;
  classTeacherId: string;
  totalStudents: number;
}

// ── Class Timetable ──
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableEntry {
  id: string;
  schoolId: string;
  classId: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  room: string;
}

// ── Subject ──
export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  classIds: string[];
}

// ── Student ──
export interface Student {
  id: string;
  schoolId: string;
  name: string;
  rollNo: string;
  classId: string;
  className: string;
  section: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  avatar: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  admissionDate: string;
  bloodGroup: string;
  emergencyContact: string;
}

// ── Teacher ──
export interface Teacher {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  subjectIds: string[];
  classIds: string[];
  qualification: string;
  experience: number;
  joiningDate: string;
  gender: 'Male' | 'Female' | 'Other';
  designation: string;
}

// ── Attendance ──
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  markedAt: string;
}

// ── Marks & Exams ──
export interface Exam {
  id: string;
  schoolId: string;
  name: string;
  type: 'unit_test' | 'mid_term' | 'final';
  startDate: string;
  endDate: string;
  maxMarks: number;
}

export interface MarksRecord {
  id: string;
  schoolId: string;
  studentId: string;
  classId: string;
  subjectId: string;
  examId: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  remarks: string;
  enteredBy: string;
  enteredAt: string;
}

// ── Teaching Plan & Syllabus ──
export type TopicStatus = 'completed' | 'pending' | 'overdue';

export interface TeachingPlan {
  id: string;
  schoolId: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  topicName: string;
  scheduledDate: string;
  completedDate: string | null;
  status: TopicStatus;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

// ── Fee Transaction ──
export type PaymentMethod = 'upi' | 'bank_transfer' | 'neft_rtgs' | 'cash' | 'cheque';
export type PaymentStatus = 'pending_verification' | 'verified' | 'rejected' | 'pending';

export interface FeeTransaction {
  id: string;
  schoolId: string;
  studentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  transactionRef: string;
  proofUrl: string;
  status: PaymentStatus;
  verifiedBy: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  termName: string;
  description: string;
}

// ── Notifications ──
export type NotificationType =
  | 'absence'
  | 'low_attendance'
  | 'low_marks'
  | 'poor_performance'
  | 'fee_reminder'
  | 'fee_submitted'
  | 'payment_verified'
  | 'payment_rejected'
  | 'syllabus_delayed'
  | 'intervention'
  | 'announcement'
  | 'complaint_update'
  | 'feedback_available';

export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  schoolId: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientRole: UserRole | 'parent';
  recipientId: string;
  relatedStudentId: string | null;
  isRead: boolean;
  createdAt: string;
  priority: NotificationPriority;
  actionUrl: string | null;
}

// ── Teacher Feedback ──
export interface TeacherFeedback {
  id: string;
  schoolId: string;
  teacherId: string;
  studentId: string;
  classId: string;
  month: string;
  teachingClarity: number;
  doubtSolving: number;
  subjectKnowledge: number;
  classroomManagement: number;
  syllabusCoverage: number;
  comment: string;
  submittedAt: string;
}

// ── Complaints ──
export type ComplaintType = 'wrong_attendance' | 'wrong_marks' | 'incorrect_topic';
export type ComplaintStatus = 'open' | 'under_review' | 'resolved' | 'rejected';

export interface Complaint {
  id: string;
  schoolId: string;
  studentId: string;
  type: ComplaintType;
  subjectId: string | null;
  date: string;
  description: string;
  status: ComplaintStatus;
  resolutionNote: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

// ── Interventions ──
export type InterventionType = 'remedial_class' | 'extra_practice' | 'parent_meeting' | 'counseling';
export type InterventionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface Intervention {
  id: string;
  schoolId: string;
  studentId: string;
  teacherId: string;
  type: InterventionType;
  reason: string;
  plannedDate: string;
  completedDate: string | null;
  status: InterventionStatus;
  notes: string;
  createdAt: string;
}

// ── Website Content ──
export interface WebsiteContent {
  schoolId: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  aboutText: string;
  principalPhoto: string;
  principalMessage: string;
  notices: WebsiteNotice[];
  events: WebsiteEvent[];
  achievements: WebsiteAchievement[];
  galleryImages: string[];
  admissionInfo: string;
  admissionProcess: string[];
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  mapUrl: string;
  facilities: WebsiteFacility[];
}

export interface WebsiteNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  isPublished: boolean;
}

export interface WebsiteEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  isPublished: boolean;
  type: 'upcoming' | 'past';
}

export interface WebsiteAchievement {
  id: string;
  title: string;
  description: string;
  year: string;
  category: string;
}

export interface WebsiteFacility {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// ── Navigation ──
export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

// ── Dashboard KPI ──
export interface KPICard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: string;
  link?: string;
}
