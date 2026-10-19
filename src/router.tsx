import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { SchoolRouteWrapper } from '@/components/layout/SchoolRouteWrapper';
import { SchoolLandingPage } from '@/pages/SchoolLandingPage';
import { LoginPage } from '@/pages/login/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Management Suite Pages (Phase 3 Complete)
import { ManagementDashboard } from '@/pages/management/ManagementDashboard';
import { StudentsPage } from '@/pages/management/StudentsPage';
import { TeachersPage } from '@/pages/management/TeachersPage';
import { TimetableManagerPage } from '@/pages/management/TimetableManagerPage';
import { AttendancePage } from '@/pages/management/AttendancePage';
import { AcademicsPage } from '@/pages/management/AcademicsPage';
import { SyllabusPage } from '@/pages/management/SyllabusPage';
import { FeesPage } from '@/pages/management/FeesPage';
import { FeedbackPage } from '@/pages/management/FeedbackPage';
import { ComplaintsPage } from '@/pages/management/ComplaintsPage';
import { NotificationsPage } from '@/pages/management/NotificationsPage';
import { AIPage } from '@/pages/management/AIPage';
import { WebsiteCMSPage } from '@/pages/management/WebsiteCMSPage';

// Teacher Suite Pages (Phase 4 Complete)
import { TeacherDashboard } from '@/pages/teacher/TeacherDashboard';
import { TeacherAttendancePage } from '@/pages/teacher/TeacherAttendancePage';
import { TeacherMarksPage } from '@/pages/teacher/TeacherMarksPage';
import { TeacherTeachingPlanPage } from '@/pages/teacher/TeacherTeachingPlanPage';
import { TeacherStudentsPage } from '@/pages/teacher/TeacherStudentsPage';
import { TeacherInterventionsPage } from '@/pages/teacher/TeacherInterventionsPage';

// Student Suite Pages (Phase 5 Complete)
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentProfilePage } from '@/pages/student/StudentProfilePage';
import { StudentAcademicsPage } from '@/pages/student/StudentAcademicsPage';
import { StudentSyllabusPage } from '@/pages/student/StudentSyllabusPage';
import { StudentFeesPage } from '@/pages/student/StudentFeesPage';
import { StudentAlertsPage } from '@/pages/student/StudentAlertsPage';
import { StudentFeedbackPage } from '@/pages/student/StudentFeedbackPage';
import { StudentComplaintsPage } from '@/pages/student/StudentComplaintsPage';

// Accounts Suite Pages (Phase 6 Complete)
import { AccountsDashboard } from '@/pages/accounts/AccountsDashboard';
import { PaymentsLedgerPage } from '@/pages/accounts/PaymentsLedgerPage';
import { PaymentVerificationPage } from '@/pages/accounts/PaymentVerificationPage';
import { FeeStatementsPage } from '@/pages/accounts/FeeStatementsPage';
import { AccountsCommunicationPage } from '@/pages/accounts/AccountsCommunicationPage';

// Public Website (Phase 7 Complete)
import { PublicSchoolWebsite } from '@/pages/website/PublicSchoolWebsite';

// Super Admin Suite
import { SuperAdminIndexPage } from '@/pages/super-admin/SuperAdminIndexPage';

export const router = createBrowserRouter([
  // ── Root: School Selection Landing (Demo) ──
  {
    path: '/',
    element: <SchoolLandingPage />,
  },

  // ── Super Admin Master Control Center ──
  {
    path: '/super-admin/*',
    element: <SuperAdminIndexPage />,
  },

  // ── Legacy URL Redirects (backward compatibility) ──
  {
    path: '/login',
    element: <Navigate to="/school/vps/login" replace />,
  },
  {
    path: '/school-site',
    element: <Navigate to="/school/vps" replace />,
  },

  // ── Multi-Tenant School Routes ──
  {
    path: '/school/:schoolSlug',
    element: <SchoolRouteWrapper />,
    children: [
      // Public Website = Landing page for each school
      { index: true, element: <PublicSchoolWebsite /> },

      // School-specific Login Portal
      { path: 'login', element: <LoginPage /> },

      // ── Management Routes ──
      {
        path: 'management',
        element: <AppLayout />,
        children: [
          { path: 'dashboard', element: <ManagementDashboard /> },
          { path: 'students', element: <StudentsPage /> },
          { path: 'teachers', element: <TeachersPage /> },
          { path: 'timetable', element: <TimetableManagerPage /> },
          { path: 'attendance', element: <AttendancePage /> },
          { path: 'academics', element: <AcademicsPage /> },
          { path: 'syllabus', element: <SyllabusPage /> },
          { path: 'fees', element: <FeesPage /> },
          { path: 'feedback', element: <FeedbackPage /> },
          { path: 'complaints', element: <ComplaintsPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'ai', element: <AIPage /> },
          { path: 'website-cms', element: <WebsiteCMSPage /> },
          { index: true, element: <Navigate to="dashboard" replace /> },
        ],
      },

      // ── Teacher Routes ──
      {
        path: 'teacher',
        element: <AppLayout />,
        children: [
          { path: 'dashboard', element: <TeacherDashboard /> },
          { path: 'attendance', element: <TeacherAttendancePage /> },
          { path: 'marks', element: <TeacherMarksPage /> },
          { path: 'teaching-plan', element: <TeacherTeachingPlanPage /> },
          { path: 'students', element: <TeacherStudentsPage /> },
          { path: 'interventions', element: <TeacherInterventionsPage /> },
          { index: true, element: <Navigate to="dashboard" replace /> },
        ],
      },

      // ── Student Routes ──
      {
        path: 'student',
        element: <AppLayout />,
        children: [
          { path: 'dashboard', element: <StudentDashboard /> },
          { path: 'profile', element: <StudentProfilePage /> },
          { path: 'academics', element: <StudentAcademicsPage /> },
          { path: 'syllabus', element: <StudentSyllabusPage /> },
          { path: 'fees', element: <StudentFeesPage /> },
          { path: 'alerts', element: <StudentAlertsPage /> },
          { path: 'feedback', element: <StudentFeedbackPage /> },
          { path: 'complaints', element: <StudentComplaintsPage /> },
          { index: true, element: <Navigate to="dashboard" replace /> },
        ],
      },

      // ── Accounts Routes ──
      {
        path: 'accounts',
        element: <AppLayout />,
        children: [
          { path: 'dashboard', element: <AccountsDashboard /> },
          { path: 'payments', element: <PaymentsLedgerPage /> },
          { path: 'verification', element: <PaymentVerificationPage /> },
          { path: 'statements', element: <FeeStatementsPage /> },
          { path: 'communication', element: <AccountsCommunicationPage /> },
          { index: true, element: <Navigate to="dashboard" replace /> },
        ],
      },
    ],
  },

  // ── 404 ──
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
