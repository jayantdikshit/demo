import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';

const routeLabels: Record<string, string> = {
  management: 'Management',
  teacher: 'Teacher',
  student: 'Student',
  accounts: 'Accounts',
  dashboard: 'Dashboard',
  students: 'Students',
  teachers: 'Teachers',
  attendance: 'Attendance',
  academics: 'Academics',
  syllabus: 'Syllabus',
  fees: 'Fees',
  feedback: 'Feedback',
  complaints: 'Complaints',
  notifications: 'Notifications',
  ai: 'AI Assistant',
  marks: 'Marks',
  'teaching-plan': 'Teaching Plan',
  interventions: 'Interventions',
  profile: 'Profile',
  alerts: 'Alerts',
  payments: 'Payments',
  verification: 'Verification',
  statements: 'Statements',
  'school-site': 'Public Website',
  'website-cms': 'Website CMS',
  communication: 'Communication',
};

export function Breadcrumbs() {
  const location = useLocation();
  const { schoolPath } = useSchoolSlug();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Remove 'school' and the slug from breadcrumb display
  // e.g., ['school', 'vps', 'management', 'dashboard'] → ['management', 'dashboard']
  const filteredSegments = pathSegments.filter(
    (seg, idx) => !(seg === 'school' && idx === 0) && !(idx === 1 && pathSegments[0] === 'school')
  );

  if (filteredSegments.length === 0) return null;

  const crumbs = filteredSegments.map((segment, index) => {
    // Build path relative to school slug
    const relativePath = '/' + filteredSegments.slice(0, index + 1).join('/');
    const fullPath = schoolPath(relativePath);
    const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === filteredSegments.length - 1;

    return { fullPath, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 px-4 md:px-6 py-3">
      <Link to={schoolPath('/')} className="hover:text-gray-700 transition-colors" title="School Home">
        <Home size={14} />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.fullPath} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-gray-400" />
          {crumb.isLast ? (
            <span className="text-gray-800 font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.fullPath} className="hover:text-gray-700 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
