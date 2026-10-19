import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';
import {
  LayoutDashboard, Users, GraduationCap, CalendarCheck, BookOpen, ClipboardList,
  IndianRupee, MessageSquare, AlertCircle, Bell, Bot, School,
  UserCheck, PenLine, BookOpenCheck, HeartPulse,
  User, TrendingUp, Receipt, FileWarning, Star,
  CreditCard, CheckSquare, FileText, LogOut, ChevronLeft, ChevronRight, Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  /** Relative path within a role, e.g. '/management/dashboard' */
  relativePath: string;
  icon: React.ReactNode;
}

const navItemsMap: Record<UserRole, NavItem[]> = {
  management: [
    { label: 'Dashboard', relativePath: '/management/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Students', relativePath: '/management/students', icon: <Users size={20} /> },
    { label: 'Teachers', relativePath: '/management/teachers', icon: <GraduationCap size={20} /> },
    { label: 'Timetable', relativePath: '/management/timetable', icon: <Calendar size={20} /> },
    { label: 'Attendance', relativePath: '/management/attendance', icon: <CalendarCheck size={20} /> },
    { label: 'Academics', relativePath: '/management/academics', icon: <BookOpen size={20} /> },
    { label: 'Syllabus', relativePath: '/management/syllabus', icon: <ClipboardList size={20} /> },
    { label: 'Fees', relativePath: '/management/fees', icon: <IndianRupee size={20} /> },
    { label: 'Feedback', relativePath: '/management/feedback', icon: <MessageSquare size={20} /> },
    { label: 'Complaints', relativePath: '/management/complaints', icon: <AlertCircle size={20} /> },
    { label: 'Notifications', relativePath: '/management/notifications', icon: <Bell size={20} /> },
    { label: 'AI Assistant', relativePath: '/management/ai', icon: <Bot size={20} /> },
    { label: 'Website CMS', relativePath: '/management/website-cms', icon: <School size={20} /> },
  ],
  teacher: [
    { label: 'Dashboard', relativePath: '/teacher/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Attendance', relativePath: '/teacher/attendance', icon: <UserCheck size={20} /> },
    { label: 'Marks', relativePath: '/teacher/marks', icon: <PenLine size={20} /> },
    { label: 'Teaching Plan', relativePath: '/teacher/teaching-plan', icon: <BookOpenCheck size={20} /> },
    { label: 'Students', relativePath: '/teacher/students', icon: <Users size={20} /> },
    { label: 'Interventions', relativePath: '/teacher/interventions', icon: <HeartPulse size={20} /> },
  ],
  student: [
    { label: 'Dashboard', relativePath: '/student/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Profile', relativePath: '/student/profile', icon: <User size={20} /> },
    { label: 'Academics', relativePath: '/student/academics', icon: <TrendingUp size={20} /> },
    { label: 'Syllabus', relativePath: '/student/syllabus', icon: <BookOpen size={20} /> },
    { label: 'Fees', relativePath: '/student/fees', icon: <Receipt size={20} /> },
    { label: 'Alerts', relativePath: '/student/alerts', icon: <Bell size={20} /> },
    { label: 'Feedback', relativePath: '/student/feedback', icon: <Star size={20} /> },
    { label: 'Complaints', relativePath: '/student/complaints', icon: <FileWarning size={20} /> },
  ],
  accounts: [
    { label: 'Dashboard', relativePath: '/accounts/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Payments', relativePath: '/accounts/payments', icon: <CreditCard size={20} /> },
    { label: 'Verification', relativePath: '/accounts/verification', icon: <CheckSquare size={20} /> },
    { label: 'Statements', relativePath: '/accounts/statements', icon: <FileText size={20} /> },
    { label: 'Parent Alerts', relativePath: '/accounts/communication', icon: <MessageSquare size={20} /> },
  ],
};

const roleLabels: Record<UserRole, string> = {
  management: 'Management',
  teacher: 'Teacher',
  student: 'Student',
  accounts: 'Accounts',
};

const roleColors: Record<UserRole, string> = {
  management: 'from-blue-600 to-indigo-700',
  teacher: 'from-emerald-600 to-teal-700',
  student: 'from-violet-600 to-purple-700',
  accounts: 'from-amber-600 to-orange-700',
};

export function Sidebar() {
  const { currentRole, logout, getSchoolConfig } = useAppStore();
  const { schoolPath, schoolSlug } = useSchoolSlug();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const schoolConfig = getSchoolConfig();

  if (!currentRole) return null;

  const items = navItemsMap[currentRole] || [];

  const handleLogout = () => {
    logout();
    navigate(schoolPath('/login'));
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out',
        'bg-gray-900 text-white shadow-xl',
        collapsed ? 'w-[72px]' : 'w-[260px]',
        'max-md:hidden'
      )}
    >
      {/* School Brand */}
      <div className={cn(
        'flex items-center gap-3 px-4 h-16 border-b border-gray-700/50',
        collapsed && 'justify-center px-2'
      )}>
        <span className="text-2xl">{schoolConfig.logo}</span>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-bold truncate">{schoolConfig.shortName}</h1>
            <p className="text-[10px] text-gray-400 truncate">{schoolConfig.name}</p>
          </div>
        )}
      </div>

      {/* Role Badge */}
      <div className={cn(
        'mx-3 mt-3 mb-2 px-3 py-2 rounded-lg bg-gradient-to-r text-white text-center text-sm font-semibold',
        roleColors[currentRole],
        collapsed && 'mx-2 px-1 text-[10px]'
      )}>
        {collapsed ? roleLabels[currentRole].charAt(0) : roleLabels[currentRole]}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.relativePath}
            to={schoolPath(item.relativePath)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                'hover:bg-gray-800/80 hover:text-white',
                isActive
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'text-gray-400',
                collapsed && 'justify-center px-2'
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Public Website Link */}
      <div className="px-2 pb-2">
        <NavLink
          to={`/school/${schoolSlug}`}
          target="_blank"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
            'text-gray-400 hover:bg-gray-800/80 hover:text-white',
            collapsed && 'justify-center px-2'
          )}
          title="Public Website"
        >
          <School size={20} />
          {!collapsed && <span>Public Website</span>}
        </NavLink>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-700/50 p-2 space-y-1">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
            'text-red-400 hover:bg-red-950/50 hover:text-red-300 cursor-pointer',
            collapsed && 'justify-center px-2'
          )}
          title="Logout"
        >
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-50 w-6 h-6 rounded-full bg-gray-700 text-gray-300 flex items-center justify-center hover:bg-gray-600 transition-colors shadow-md"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
