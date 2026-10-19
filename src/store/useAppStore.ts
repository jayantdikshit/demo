import { create } from 'zustand';
import type {
  UserRole, Student, Teacher, ClassSection, Subject, Exam,
  AttendanceRecord, MarksRecord, TeachingPlan, FeeTransaction,
  Notification, NotificationType, NotificationPriority,
  TeacherFeedback, Complaint, Intervention, WebsiteContent, SchoolConfig,
} from '@/types';
import { studentsData } from '@/data/students';
import { teachersData } from '@/data/teachers';
import { classesData } from '@/data/classes';
import { subjectsData } from '@/data/subjects';
import { examsData } from '@/data/exams';
import { attendanceData } from '@/data/attendance';
import { marksData } from '@/data/marks';
import { teachingPlansData } from '@/data/teachingPlans';
import { feesData } from '@/data/fees';
import { notificationsData } from '@/data/notifications';
import { feedbackData } from '@/data/feedback';
import { complaintsData } from '@/data/complaints';
import { websiteContentData } from '@/data/websiteContent';
import { timetablesData } from '@/data/timetables';
import { schoolConfigs, defaultSchoolId } from '@/config/schoolConfig';
import { saveToStorage, loadFromStorage, clearAllStorage, generateId } from '@/lib/utils';

interface AppState {
  // Auth / Role
  currentRole: UserRole | null;
  currentSchoolId: string;
  currentUserId: string;

  // Data
  students: Student[];
  teachers: Teacher[];
  classes: ClassSection[];
  subjects: Subject[];
  exams: Exam[];
  attendanceRecords: AttendanceRecord[];
  marksRecords: MarksRecord[];
  teachingPlans: TeachingPlan[];
  feeTransactions: FeeTransaction[];
  notifications: Notification[];
  feedback: TeacherFeedback[];
  complaints: Complaint[];
  interventions: Intervention[];
  websiteContent: WebsiteContent[];
  schoolConfigs: SchoolConfig[];
  timetables: any[];

  // Actions — Auth
  setRole: (role: UserRole) => void;
  setSchool: (schoolId: string) => void;
  logout: () => void;
  resetDemoData: () => void;

  // Actions — Attendance
  markAttendance: (records: AttendanceRecord[]) => void;

  // Actions — Marks
  saveMarks: (records: MarksRecord[]) => void;

  // Actions — CRUD
  addStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
  addTeacher: (teacher: Teacher) => void;
  removeTeacher: (teacherId: string) => void;

  // Actions — Timetable
  addTimetableEntries: (entries: any[]) => void;
  removeTimetableEntry: (entryId: string) => void;

  // Actions — Teaching Plan
  addTeachingPlans: (plans: TeachingPlan[]) => void;
  removeTeachingPlan: (planId: string) => void;
  updateTopicStatus: (topicId: string, status: TeachingPlan['status'], completedDate?: string) => void;

  // Actions — Fees
  submitPayment: (transaction: FeeTransaction) => void;
  verifyPayment: (transactionId: string, action: 'verified' | 'rejected', reason?: string) => void;

  // Actions — Notifications
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  triggerSimulatedAlert: (
    alertType:
      | 'student_absent'
      | 'attendance_below_threshold'
      | 'marks_below_threshold'
      | 'poor_performance'
      | 'fee_pending'
      | 'payment_submitted'
      | 'syllabus_delayed'
      | 'intervention_review',
    studentId?: string
  ) => void;

  // Actions — Feedback
  submitFeedback: (feedbackEntries: TeacherFeedback[]) => void;

  // Actions — Complaints
  submitComplaint: (complaint: Complaint) => void;
  updateComplaintStatus: (complaintId: string, status: Complaint['status'], resolutionNote?: string) => void;

  // Actions — Interventions
  createIntervention: (intervention: Intervention) => void;
  updateInterventionStatus: (interventionId: string, status: Intervention['status'], notes?: string) => void;

  // Actions — Website CMS
  updateWebsiteContent: (schoolId: string, updates: Partial<WebsiteContent>) => void;

  // Getters
  getSchoolConfig: () => SchoolConfig;
  getSchoolStudents: () => Student[];
  getSchoolTeachers: () => Teacher[];
  getSchoolClasses: () => ClassSection[];
  getUnreadNotificationCount: () => number;
}

const STORAGE_KEY = 'app_state';

function loadInitialState() {
  const saved = loadFromStorage<Partial<AppState>>(STORAGE_KEY);
  if (saved) {
    return {
      students: saved.students || studentsData,
      teachers: saved.teachers || teachersData,
      classes: saved.classes || classesData,
      subjects: saved.subjects || subjectsData,
      exams: saved.exams || examsData,
      attendanceRecords: saved.attendanceRecords || attendanceData,
      marksRecords: saved.marksRecords || marksData,
      teachingPlans: saved.teachingPlans || teachingPlansData,
      feeTransactions: saved.feeTransactions || feesData,
      notifications: saved.notifications || notificationsData,
      feedback: saved.feedback || feedbackData,
      complaints: saved.complaints || complaintsData,
      interventions: saved.interventions || [],
      websiteContent: saved.websiteContent || websiteContentData,
      timetables: saved.timetables || timetablesData,
      currentRole: saved.currentRole || null,
      currentSchoolId: saved.currentSchoolId || defaultSchoolId,
      currentUserId: saved.currentUserId || '',
    };
  }
  return null;
}

const initialSaved = loadInitialState();

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  currentRole: initialSaved?.currentRole || null,
  currentSchoolId: initialSaved?.currentSchoolId || defaultSchoolId,
  currentUserId: initialSaved?.currentUserId || '',
  students: initialSaved?.students || studentsData,
  teachers: initialSaved?.teachers || teachersData,
  classes: initialSaved?.classes || classesData,
  subjects: initialSaved?.subjects || subjectsData,
  exams: initialSaved?.exams || examsData,
  attendanceRecords: initialSaved?.attendanceRecords || attendanceData,
  marksRecords: initialSaved?.marksRecords || marksData,
  teachingPlans: initialSaved?.teachingPlans || teachingPlansData,
  feeTransactions: initialSaved?.feeTransactions || feesData,
  notifications: initialSaved?.notifications || notificationsData,
  feedback: initialSaved?.feedback || feedbackData,
  complaints: initialSaved?.complaints || complaintsData,
  interventions: initialSaved?.interventions || [],
  websiteContent: initialSaved?.websiteContent || websiteContentData,
  timetables: initialSaved?.timetables || timetablesData,
  schoolConfigs: schoolConfigs,

  // ── Auth Actions ──
  setRole: (role) => {
    const userIdMap: Record<UserRole, string> = {
      management: 'mgmt-001',
      teacher: 'tch-001',
      student: 'stu-001',
      accounts: 'accounts-001',
    };
    set({ currentRole: role, currentUserId: userIdMap[role] });
    saveToStorage(STORAGE_KEY, { ...get(), currentRole: role, currentUserId: userIdMap[role] });
  },

  setSchool: (schoolId) => {
    set({ currentSchoolId: schoolId });
    saveToStorage(STORAGE_KEY, { ...get(), currentSchoolId: schoolId });
  },

  logout: () => {
    set({ currentRole: null, currentUserId: '' });
    saveToStorage(STORAGE_KEY, { ...get(), currentRole: null, currentUserId: '' });
  },

  resetDemoData: () => {
    clearAllStorage();
    set({
      students: studentsData,
      teachers: teachersData,
      classes: classesData,
      subjects: subjectsData,
      exams: examsData,
      attendanceRecords: attendanceData,
      marksRecords: marksData,
      teachingPlans: teachingPlansData,
      feeTransactions: feesData,
      notifications: notificationsData,
      feedback: feedbackData,
      complaints: complaintsData,
      interventions: [],
      websiteContent: websiteContentData,
      timetables: timetablesData,
      currentRole: null,
      currentSchoolId: defaultSchoolId,
      currentUserId: '',
    });
  },

  // ── CRUD Actions ──
  addStudent: (student) => {
    set((state) => ({ students: [...state.students, student] }));
    saveToStorage(STORAGE_KEY, get());
  },
  
  removeStudent: (studentId) => {
    set((state) => ({
      students: state.students.filter(s => s.id !== studentId),
      attendanceRecords: state.attendanceRecords.filter(a => a.studentId !== studentId),
      marksRecords: state.marksRecords.filter(m => m.studentId !== studentId),
      feeTransactions: state.feeTransactions.filter(f => f.studentId !== studentId),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  addTeacher: (teacher) => {
    set((state) => ({ teachers: [...state.teachers, teacher] }));
    saveToStorage(STORAGE_KEY, get());
  },

  removeTeacher: (teacherId) => {
    set((state) => ({
      teachers: state.teachers.filter(t => t.id !== teacherId),
      teachingPlans: state.teachingPlans.filter(tp => tp.teacherId !== teacherId),
      timetables: state.timetables.filter(tt => tt.teacherId !== teacherId),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  addTimetableEntries: (entries) => {
    set((state) => ({ timetables: [...state.timetables, ...entries] }));
    saveToStorage(STORAGE_KEY, get());
  },

  removeTimetableEntry: (entryId) => {
    set((state) => ({ timetables: state.timetables.filter(tt => tt.id !== entryId) }));
    saveToStorage(STORAGE_KEY, get());
  },

  addTeachingPlans: (plans) => {
    set((state) => ({ teachingPlans: [...state.teachingPlans, ...plans] }));
    saveToStorage(STORAGE_KEY, get());
  },

  removeTeachingPlan: (planId) => {
    set((state) => ({ teachingPlans: state.teachingPlans.filter(tp => tp.id !== planId) }));
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Attendance ──
  markAttendance: (records) => {
    const state = get();
    const existingIds = new Set(records.map(r => r.id));
    const filtered = state.attendanceRecords.filter(r => !existingIds.has(r.id));
    const newRecords = [...filtered, ...records];

    // Check thresholds and generate alerts
    const schoolConfig = state.schoolConfigs.find(s => s.schoolId === state.currentSchoolId);
    if (schoolConfig) {
      records.forEach(record => {
        if (record.status === 'absent') {
          const student = state.students.find(s => s.id === record.studentId);
          if (student) {
            // Add absence notification
            const notification: Notification = {
              id: generateId(),
              schoolId: state.currentSchoolId,
              type: 'absence',
              title: 'Student Absent Today',
              message: `${student.name} (${student.className}-${student.section}) was absent today.`,
              recipientRole: 'management',
              recipientId: 'mgmt-001',
              relatedStudentId: student.id,
              isRead: false,
              createdAt: new Date().toISOString(),
              priority: 'high',
              actionUrl: '/management/attendance',
            };
            state.notifications.push(notification);

            // Check attendance percentage
            const studentRecords = [...newRecords].filter(r => r.studentId === student.id);
            const totalDays = studentRecords.length;
            const presentDays = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
            const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 100;

            if (percentage < schoolConfig.attendanceThreshold) {
              const alertNotif: Notification = {
                id: generateId(),
                schoolId: state.currentSchoolId,
                type: 'low_attendance',
                title: 'Attendance Below Threshold',
                message: `${student.name} (${student.className}-${student.section}) attendance is ${Math.round(percentage)}%, below the ${schoolConfig.attendanceThreshold}% threshold.`,
                recipientRole: 'management',
                recipientId: 'mgmt-001',
                relatedStudentId: student.id,
                isRead: false,
                createdAt: new Date().toISOString(),
                priority: 'high',
                actionUrl: '/management/attendance',
              };
              state.notifications.push(alertNotif);
            }
          }
        }
      });
    }

    set({ attendanceRecords: newRecords, notifications: [...state.notifications] });
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Marks ──
  saveMarks: (records) => {
    const state = get();
    const existingIds = new Set(records.map(r => r.id));
    const filtered = state.marksRecords.filter(r => !existingIds.has(r.id));
    const newRecords = [...filtered, ...records];

    // Check for low marks and generate alerts
    const schoolConfig = state.schoolConfigs.find(s => s.schoolId === state.currentSchoolId);
    if (schoolConfig) {
      records.forEach(record => {
        const percentage = (record.marksObtained / record.maxMarks) * 100;
        if (percentage < schoolConfig.marksThreshold) {
          const student = state.students.find(s => s.id === record.studentId);
          const subject = state.subjects.find(s => s.id === record.subjectId);
          if (student && subject) {
            const notification: Notification = {
              id: generateId(),
              schoolId: state.currentSchoolId,
              type: 'low_marks',
              title: `Low Score in ${subject.name}`,
              message: `${student.name} (${student.className}-${student.section}) scored ${record.marksObtained}/${record.maxMarks} in ${subject.name}, below the passing threshold.`,
              recipientRole: 'management',
              recipientId: 'mgmt-001',
              relatedStudentId: student.id,
              isRead: false,
              createdAt: new Date().toISOString(),
              priority: 'high',
              actionUrl: '/management/academics',
            };
            state.notifications.push(notification);
          }
        }
      });
    }

    set({ marksRecords: newRecords, notifications: [...state.notifications] });
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Teaching Plan ──
  updateTopicStatus: (topicId, status, completedDate) => {
    const state = get();
    const plans = state.teachingPlans.map(tp =>
      tp.id === topicId ? { ...tp, status, completedDate: completedDate || tp.completedDate } : tp
    );

    // If marked pending/overdue, generate notification
    if (status === 'overdue') {
      const topic = state.teachingPlans.find(tp => tp.id === topicId);
      if (topic) {
        const teacher = state.teachers.find(t => t.id === topic.teacherId);
        const notification: Notification = {
          id: generateId(),
          schoolId: state.currentSchoolId,
          type: 'syllabus_delayed',
          title: 'Topic Overdue',
          message: `${topic.topicName} is overdue since ${topic.scheduledDate}. Assigned to ${teacher?.name || 'Unknown'}.`,
          recipientRole: 'management',
          recipientId: 'mgmt-001',
          relatedStudentId: null,
          isRead: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          actionUrl: '/management/syllabus',
        };
        state.notifications.push(notification);
        set({ notifications: [...state.notifications] });
      }
    }

    set({ teachingPlans: plans });
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Fees ──
  submitPayment: (transaction) => {
    const state = get();
    const newTransactions = [...state.feeTransactions, transaction];

    // Notify accounts
    const student = state.students.find(s => s.id === transaction.studentId);
    if (student) {
      const notification: Notification = {
        id: generateId(),
        schoolId: state.currentSchoolId,
        type: 'fee_submitted',
        title: 'Payment Submitted',
        message: `${student.name} (${student.className}-${student.section}) submitted ₹${transaction.amount.toLocaleString('en-IN')} via ${transaction.paymentMethod.toUpperCase()}. Awaiting verification.`,
        recipientRole: 'accounts',
        recipientId: 'accounts-001',
        relatedStudentId: student.id,
        isRead: false,
        createdAt: new Date().toISOString(),
        priority: 'medium',
        actionUrl: '/accounts/verification',
      };
      state.notifications.push(notification);
    }

    set({ feeTransactions: newTransactions, notifications: [...state.notifications] });
    saveToStorage(STORAGE_KEY, get());
  },

  verifyPayment: (transactionId, action, reason) => {
    const state = get();
    const targetTx = state.feeTransactions.find(t => t.id === transactionId);
    const student = targetTx ? state.students.find(s => s.id === targetTx.studentId) : null;

    const transactions = state.feeTransactions.map(t =>
      t.id === transactionId
        ? {
            ...t,
            status: action as FeeTransaction['status'],
            verifiedBy: state.currentUserId || 'accounts-001',
            verifiedAt: new Date().toISOString(),
            rejectionReason: action === 'rejected' ? (reason || null) : null,
          }
        : t
    );

    const newNotifications = [...state.notifications];

    if (targetTx && student) {
      if (action === 'verified') {
        // Notification for student & parent
        newNotifications.unshift({
          id: generateId(),
          schoolId: state.currentSchoolId,
          type: 'payment_verified',
          title: 'Fee Payment Verified ✅',
          message: `Payment of ₹${targetTx.amount.toLocaleString('en-IN')} for ${targetTx.termName} has been verified by the Accounts Office.`,
          recipientRole: 'student',
          recipientId: student.id,
          relatedStudentId: student.id,
          isRead: false,
          createdAt: new Date().toISOString(),
          priority: 'medium',
          actionUrl: '/student/fees',
        });
        // Notification for management
        newNotifications.unshift({
          id: generateId(),
          schoolId: state.currentSchoolId,
          type: 'payment_verified',
          title: 'Fee Payment Approved',
          message: `Accounts verified payment of ₹${targetTx.amount.toLocaleString('en-IN')} for ${student.name} (${student.className}-${student.section}).`,
          recipientRole: 'management',
          recipientId: 'mgmt-001',
          relatedStudentId: student.id,
          isRead: false,
          createdAt: new Date().toISOString(),
          priority: 'low',
          actionUrl: '/management/fees',
        });
      } else {
        // Rejection notification
        newNotifications.unshift({
          id: generateId(),
          schoolId: state.currentSchoolId,
          type: 'payment_rejected',
          title: 'Fee Payment Rejected ❌',
          message: `Payment of ₹${targetTx.amount.toLocaleString('en-IN')} was rejected. Reason: ${reason || 'Receipt unreadable or transaction details invalid'}.`,
          recipientRole: 'student',
          recipientId: student.id,
          relatedStudentId: student.id,
          isRead: false,
          createdAt: new Date().toISOString(),
          priority: 'high',
          actionUrl: '/student/fees',
        });
      }
    }

    set({ feeTransactions: transactions, notifications: newNotifications });
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Notifications ──
  addNotification: (notification) => {
    const state = get();
    set({ notifications: [notification, ...state.notifications] });
    saveToStorage(STORAGE_KEY, get());
  },

  markNotificationRead: (notificationId) => {
    const state = get();
    const notifications = state.notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    set({ notifications });
    saveToStorage(STORAGE_KEY, get());
  },

  markAllNotificationsRead: () => {
    const state = get();
    const notifications = state.notifications.map(n => ({ ...n, isRead: true }));
    set({ notifications });
    saveToStorage(STORAGE_KEY, get());
  },

  triggerSimulatedAlert: (alertType, studentId) => {
    const state = get();
    const student = (studentId ? state.students.find(s => s.id === studentId) : null) || state.students[0];
    const schoolConfig = state.schoolConfigs.find(s => s.schoolId === state.currentSchoolId) || state.schoolConfigs[0];
    const now = new Date().toISOString();

    const notifMap: Record<string, { title: string; message: string; type: NotificationType; priority: NotificationPriority; recipientRole: UserRole | 'parent'; actionUrl: string }> = {
      student_absent: {
        title: `Absence Notice: ${student.name}`,
        message: `${student.name} (Class ${student.className}-${student.section}) was marked absent for morning assembly without prior leave.`,
        type: 'absence',
        priority: 'high',
        recipientRole: 'parent',
        actionUrl: '/management/attendance',
      },
      attendance_below_threshold: {
        title: `Low Attendance Warning (<${schoolConfig.attendanceThreshold}%)`,
        message: `${student.name}'s attendance has dropped to 71%, violating the mandatory ${schoolConfig.attendanceThreshold}% board regulation.`,
        type: 'low_attendance',
        priority: 'high',
        recipientRole: 'parent',
        actionUrl: '/management/attendance',
      },
      marks_below_threshold: {
        title: 'Academic Alert: Score Below Threshold',
        message: `${student.name} scored 14/40 (35%) in Mathematics Unit Test 1, falling beneath the ${schoolConfig.marksThreshold}% pass standard.`,
        type: 'low_marks',
        priority: 'high',
        recipientRole: 'parent',
        actionUrl: '/management/academics',
      },
      poor_performance: {
        title: 'At-Risk Advisory: Multiple Indicators',
        message: `${student.name} flagged for compound risk: Low attendance (<75%) and low scores across 2 consecutive evaluations.`,
        type: 'poor_performance',
        priority: 'high',
        recipientRole: 'parent',
        actionUrl: '/management/students',
      },
      fee_pending: {
        title: 'Term Fee Overdue Reminder',
        message: `Outstanding tuition fee of ₹15,000 for ${student.name} is past due. Kindly clear dues to avoid late penalty.`,
        type: 'fee_reminder',
        priority: 'high',
        recipientRole: 'parent',
        actionUrl: '/student/fees',
      },
      payment_submitted: {
        title: 'Fee Payment Received (Pending Verification)',
        message: `Payment of ₹15,000 via UPI (UTR: 8941208942) for ${student.name} was received and logged for verification.`,
        type: 'fee_submitted',
        priority: 'medium',
        recipientRole: 'accounts',
        actionUrl: '/accounts/verification',
      },
      syllabus_delayed: {
        title: 'Curriculum Delay: Class 6-A Mathematics',
        message: `Chapter 4: 'Fractions & Decimals' is overdue by 5 instructional days against the scheduled term plan.`,
        type: 'syllabus_delayed',
        priority: 'medium',
        recipientRole: 'management',
        actionUrl: '/management/syllabus',
      },
      intervention_review: {
        title: 'Remedial Intervention Review Due',
        message: `Follow-up evaluation for ${student.name}'s Remedial Mathematics intervention is scheduled for review today.`,
        type: 'intervention',
        priority: 'medium',
        recipientRole: 'teacher',
        actionUrl: '/teacher/interventions',
      },
    };

    const config = notifMap[alertType];
    if (config) {
      const newNotif: Notification = {
        id: generateId(),
        schoolId: state.currentSchoolId,
        type: config.type,
        title: config.title,
        message: config.message,
        recipientRole: config.recipientRole,
        recipientId: student.id,
        relatedStudentId: student.id,
        isRead: false,
        createdAt: now,
        priority: config.priority,
        actionUrl: config.actionUrl,
      };

      set({ notifications: [newNotif, ...state.notifications] });
      saveToStorage(STORAGE_KEY, get());
    }
  },

  // ── Feedback ──
  submitFeedback: (feedbackEntries) => {
    const state = get();
    set({ feedback: [...state.feedback, ...feedbackEntries] });
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Complaints ──
  submitComplaint: (complaint) => {
    const state = get();
    set({ complaints: [...state.complaints, complaint] });
    saveToStorage(STORAGE_KEY, get());
  },

  updateComplaintStatus: (complaintId, status, resolutionNote) => {
    const state = get();
    const complaints = state.complaints.map(c =>
      c.id === complaintId
        ? {
            ...c,
            status,
            resolutionNote: resolutionNote || c.resolutionNote,
            resolvedBy: status === 'resolved' || status === 'rejected' ? state.currentUserId : c.resolvedBy,
            resolvedAt: status === 'resolved' || status === 'rejected' ? new Date().toISOString() : c.resolvedAt,
          }
        : c
    );
    set({ complaints });
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Interventions ──
  createIntervention: (intervention) => {
    const state = get();
    set({ interventions: [...state.interventions, intervention] });
    saveToStorage(STORAGE_KEY, get());
  },

  updateInterventionStatus: (interventionId, status, notes) => {
    const state = get();
    const updated = state.interventions.map((inv) =>
      inv.id === interventionId
        ? {
            ...inv,
            status,
            notes: notes || inv.notes,
            completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : inv.completedDate,
          }
        : inv
    );
    set({ interventions: updated });
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Website CMS ──
  updateWebsiteContent: (schoolId, updates) => {
    const state = get();
    const content = state.websiteContent.map(wc =>
      wc.schoolId === schoolId ? { ...wc, ...updates } : wc
    );
    set({ websiteContent: content });
    saveToStorage(STORAGE_KEY, get());
  },

  // ── Getters ──
  getSchoolConfig: () => {
    const state = get();
    return state.schoolConfigs.find(s => s.schoolId === state.currentSchoolId) || schoolConfigs[0];
  },

  getSchoolStudents: () => {
    const state = get();
    return state.students.filter(s => s.schoolId === state.currentSchoolId);
  },

  getSchoolTeachers: () => {
    const state = get();
    return state.teachers.filter(t => t.schoolId === state.currentSchoolId);
  },

  getSchoolClasses: () => {
    const state = get();
    return state.classes.filter(c => c.schoolId === state.currentSchoolId);
  },

  getUnreadNotificationCount: () => {
    const state = get();
    return state.notifications.filter(n =>
      n.schoolId === state.currentSchoolId && !n.isRead
    ).length;
  },
}));
