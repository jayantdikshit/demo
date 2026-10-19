import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useSchoolData() {
  const {
    currentSchoolId,
    students,
    teachers,
    classes,
    subjects,
    exams,
    attendanceRecords,
    marksRecords,
    teachingPlans,
    feeTransactions,
    notifications,
    feedback,
    complaints,
    websiteContent,
    schoolConfigs,
    getSchoolConfig,
  } = useAppStore();

  const schoolConfig = getSchoolConfig();

  // Filtered by current school
  const schoolStudents = useMemo(
    () => students.filter((s) => s.schoolId === currentSchoolId),
    [students, currentSchoolId]
  );

  const schoolTeachers = useMemo(
    () => teachers.filter((t) => t.schoolId === currentSchoolId),
    [teachers, currentSchoolId]
  );

  const schoolClasses = useMemo(
    () => classes.filter((c) => c.schoolId === currentSchoolId),
    [classes, currentSchoolId]
  );

  const schoolSubjects = useMemo(
    () => subjects.filter((s) => s.schoolId === currentSchoolId),
    [subjects, currentSchoolId]
  );

  const schoolFees = useMemo(
    () => feeTransactions.filter((f) => f.schoolId === currentSchoolId),
    [feeTransactions, currentSchoolId]
  );

  const schoolNotifications = useMemo(
    () => notifications.filter((n) => n.schoolId === currentSchoolId),
    [notifications, currentSchoolId]
  );

  // Aggregates
  const totalFeesCollected = useMemo(
    () =>
      schoolFees
        .filter((f) => f.status === 'verified')
        .reduce((sum, f) => sum + f.amount, 0),
    [schoolFees]
  );

  const totalFeesPending = useMemo(
    () =>
      schoolFees
        .filter((f) => f.status === 'pending' || f.status === 'pending_verification')
        .reduce((sum, f) => sum + f.amount, 0),
    [schoolFees]
  );

  return {
    schoolConfig,
    students: schoolStudents,
    teachers: schoolTeachers,
    classes: schoolClasses,
    subjects: schoolSubjects,
    exams,
    attendanceRecords,
    marksRecords,
    teachingPlans,
    feeTransactions: schoolFees,
    notifications: schoolNotifications,
    feedback,
    complaints,
    websiteContent,
    schoolConfigs,
    totalFeesCollected,
    totalFeesPending,
  };
}
