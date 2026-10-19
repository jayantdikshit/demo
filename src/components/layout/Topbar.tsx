import { useAppStore } from '@/store/useAppStore';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';
import { Bell, Search, Menu, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getInitials, formatDateTime } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import type { UserRole } from '@/types';

const roleDisplayMap: Record<UserRole, { label: string; name: string; badgeColor: string }> = {
  management: { label: 'Management', name: 'School Admin', badgeColor: 'bg-blue-100 text-blue-800' },
  teacher: { label: 'Teacher', name: 'Anita Deshmukh', badgeColor: 'bg-emerald-100 text-emerald-800' },
  student: { label: 'Student', name: 'Aarav Sharma', badgeColor: 'bg-purple-100 text-purple-800' },
  accounts: { label: 'Accounts', name: 'Accounts Head', badgeColor: 'bg-amber-100 text-amber-800' },
};

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const {
    currentRole,
    setRole,
    currentSchoolId,
    schoolConfigs,
    getSchoolConfig,
    notifications,
    markNotificationRead,
    getUnreadNotificationCount,
  } = useAppStore();

  const navigate = useNavigate();
  const { schoolPath, schoolSlug } = useSchoolSlug();
  const schoolConfig = getSchoolConfig();
  const unreadCount = getUnreadNotificationCount();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const roleRef = useRef<HTMLDivElement>(null);
  const schoolRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
      if (schoolRef.current && !schoolRef.current.contains(e.target as Node)) {
        setSchoolDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setRoleDropdownOpen(false);
    const pathMap: Record<UserRole, string> = {
      management: '/management/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
      accounts: '/accounts/dashboard',
    };
    navigate(schoolPath(pathMap[newRole]));
  };

  const handleSchoolSwitch = (newSchoolSlug: string) => {
    setSchoolDropdownOpen(false);
    // Navigate to the same role dashboard in the new school
    const rolePath = currentRole ? `/${currentRole}/dashboard` : '/login';
    navigate(`/school/${newSchoolSlug}${rolePath}`);
  };

  const currentRoleInfo = roleDisplayMap[currentRole || 'management'];
  const schoolNotifications = notifications.filter(n => n.schoolId === currentSchoolId).slice(0, 5);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200/80 shadow-xs flex items-center justify-between px-4 md:px-6">
      {/* Left: Mobile Menu + School Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>

        {/* School Switcher Dropdown */}
        <div className="relative" ref={schoolRef}>
          <button
            onClick={() => setSchoolDropdownOpen(!schoolDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-gray-100 text-left transition-colors cursor-pointer"
          >
            <span className="text-xl leading-none">{schoolConfig.logo}</span>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-gray-900 leading-none block">
                {schoolConfig.shortName}
              </span>
              <span className="text-[10px] text-gray-500 font-medium leading-none block">
                {schoolConfig.name.length > 22 ? `${schoolConfig.name.slice(0, 20)}...` : schoolConfig.name}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {schoolDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white border border-gray-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Switch School (Isolated Tenant)
              </p>
              {schoolConfigs.map(config => (
                <button
                  key={config.schoolId}
                  onClick={() => handleSchoolSwitch(config.slug)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{config.logo}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{config.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">/school/{config.slug}</p>
                    </div>
                  </div>
                  {currentSchoolId === config.schoolId && (
                    <Check size={16} className="text-blue-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center max-w-sm flex-1 mx-6">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students, staff, modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-gray-200 bg-gray-50/60 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Demo Mode + Role Switcher + Notifications + Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Subtle Demo Mode Indicator with Tooltip */}
        <div className="group relative hidden sm:block">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] font-semibold cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>🔵 Demo Mode</span>
          </div>
          {/* Tooltip on hover */}
          <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block z-50 w-56 p-2 rounded-xl bg-slate-900 text-slate-200 text-[11px] shadow-xl border border-slate-700 pointer-events-none animate-in fade-in">
            Multi-tenant demo — each school is fully isolated at /school/{schoolSlug}
          </div>
        </div>

        {/* Quick Role Switcher Pill */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50/80 hover:bg-blue-100/80 text-blue-800 transition-colors cursor-pointer text-xs font-semibold"
          >
            <Sparkles size={12} className="text-blue-600" />
            <span>Role: {currentRoleInfo.label}</span>
            <ChevronDown size={12} className="text-blue-500" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-gray-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Switch Role (Instant Demo)
              </p>
              {(Object.keys(roleDisplayMap) as UserRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-left hover:bg-gray-50 transition-colors cursor-pointer text-xs"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{roleDisplayMap[r].label}</p>
                    <p className="text-[10px] text-gray-500">{roleDisplayMap[r].name}</p>
                  </div>
                  {currentRole === r && <Check size={14} className="text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute 1 top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-gray-200 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 px-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <Link
                  to={schoolPath('/management/notifications')}
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="py-2 space-y-2 max-h-72 overflow-y-auto">
                {schoolNotifications.length === 0 ? (
                  <p className="text-xs text-center text-gray-400 py-6">No notifications</p>
                ) : (
                  schoolNotifications.map(n => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-gray-900 line-clamp-1">{n.title}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {formatDateTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                      {!n.isRead && (
                        <button
                          onClick={() => markNotificationRead(n.id)}
                          className="mt-1.5 text-[10px] text-blue-600 font-semibold hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {getInitials(currentRoleInfo.name)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-gray-900 leading-tight">{currentRoleInfo.name}</p>
            <p className="text-[10px] text-gray-400 capitalize">{currentRoleInfo.label}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
