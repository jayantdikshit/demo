import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';
import { X, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Relative paths per role (same structure, scoped via schoolPath at render) */
const navItems: Record<UserRole, { label: string; relativePath: string }[]> = {
  management: [
    { label: 'Dashboard', relativePath: '/management/dashboard' },
    { label: 'Students', relativePath: '/management/students' },
    { label: 'Teachers', relativePath: '/management/teachers' },
    { label: 'Attendance', relativePath: '/management/attendance' },
    { label: 'Academics', relativePath: '/management/academics' },
    { label: 'Syllabus', relativePath: '/management/syllabus' },
    { label: 'Fees', relativePath: '/management/fees' },
    { label: 'Feedback', relativePath: '/management/feedback' },
    { label: 'Complaints', relativePath: '/management/complaints' },
    { label: 'Notifications', relativePath: '/management/notifications' },
    { label: 'AI Assistant', relativePath: '/management/ai' },
  ],
  teacher: [
    { label: 'Dashboard', relativePath: '/teacher/dashboard' },
    { label: 'Attendance', relativePath: '/teacher/attendance' },
    { label: 'Marks', relativePath: '/teacher/marks' },
    { label: 'Teaching Plan', relativePath: '/teacher/teaching-plan' },
    { label: 'Students', relativePath: '/teacher/students' },
    { label: 'Interventions', relativePath: '/teacher/interventions' },
  ],
  student: [
    { label: 'Dashboard', relativePath: '/student/dashboard' },
    { label: 'Profile', relativePath: '/student/profile' },
    { label: 'Academics', relativePath: '/student/academics' },
    { label: 'Syllabus', relativePath: '/student/syllabus' },
    { label: 'Fees', relativePath: '/student/fees' },
    { label: 'Alerts', relativePath: '/student/alerts' },
    { label: 'Feedback', relativePath: '/student/feedback' },
    { label: 'Complaints', relativePath: '/student/complaints' },
  ],
  accounts: [
    { label: 'Dashboard', relativePath: '/accounts/dashboard' },
    { label: 'Payments', relativePath: '/accounts/payments' },
    { label: 'Verification', relativePath: '/accounts/verification' },
    { label: 'Statements', relativePath: '/accounts/statements' },
    { label: 'Parent Alerts', relativePath: '/accounts/communication' },
  ],
};

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentRole, logout, getSchoolConfig } = useAppStore();
  const { schoolPath, schoolSlug } = useSchoolSlug();
  const location = useLocation();
  const schoolConfig = getSchoolConfig();

  if (!isOpen || !currentRole) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gray-900 text-white z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{schoolConfig.logo}</span>
            <div>
              <h2 className="font-bold text-sm text-white">{schoolConfig.shortName}</h2>
              <p className="text-[11px] text-gray-400 capitalize">{currentRole} Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems[currentRole]?.map((item) => {
            const fullPath = schoolPath(item.relativePath);
            const isActive = location.pathname === fullPath;
            return (
              <Link
                key={item.relativePath}
                to={fullPath}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
              >
                <span>{item.label}</span>
                <ChevronRight size={14} className={cn('opacity-60', isActive && 'opacity-100')} />
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-gray-800 space-y-2">
          <Link
            to={`/school/${schoolSlug}`}
            target="_blank"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-800 transition-colors"
          >
            Visit Public Website ↗
          </Link>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
