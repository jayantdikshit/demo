import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';
import { Shield, GraduationCap, BookOpen, Wallet, RotateCcw, Check, Sparkles, AlertTriangle, Globe, ArrowLeft } from 'lucide-react';
import type { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';

interface RoleCardConfig {
  role: UserRole;
  label: string;
  subtitle: string;
  emoji: string;
  icon: React.ReactNode;
  gradient: string;
  borderHover: string;
  shadowHover: string;
}

const roles: RoleCardConfig[] = [
  {
    role: 'management',
    label: 'Management',
    subtitle: 'School Administration & Control',
    emoji: '🏛️',
    icon: <Shield size={36} />,
    gradient: 'from-blue-500 to-indigo-600',
    borderHover: 'hover:border-blue-500/50',
    shadowHover: 'hover:shadow-blue-500/10',
  },
  {
    role: 'teacher',
    label: 'Teacher',
    subtitle: 'Class & Academic Management',
    emoji: '👨‍🏫',
    icon: <GraduationCap size={36} />,
    gradient: 'from-emerald-500 to-teal-600',
    borderHover: 'hover:border-emerald-500/50',
    shadowHover: 'hover:shadow-emerald-500/10',
  },
  {
    role: 'student',
    label: 'Student',
    subtitle: 'My Learning & Progress',
    emoji: '🎓',
    icon: <BookOpen size={36} />,
    gradient: 'from-violet-500 to-purple-600',
    borderHover: 'hover:border-violet-500/50',
    shadowHover: 'hover:shadow-violet-500/10',
  },
  {
    role: 'accounts',
    label: 'Accounts',
    subtitle: 'Fee Collection & Verification',
    emoji: '💰',
    icon: <Wallet size={36} />,
    gradient: 'from-amber-500 to-orange-600',
    borderHover: 'hover:border-amber-500/50',
    shadowHover: 'hover:shadow-amber-500/10',
  },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { setRole, resetDemoData, getSchoolConfig } = useAppStore();
  const { schoolPath, schoolSlug, currentSchool } = useSchoolSlug();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setSelectedRole(role);
    setRole(role);
    const pathMap: Record<UserRole, string> = {
      management: '/management/dashboard',
      teacher: '/teacher/dashboard',
      student: '/student/dashboard',
      accounts: '/accounts/dashboard',
    };
    // Micro transition delay for click effect
    setTimeout(() => {
      navigate(schoolPath(pathMap[role]));
    }, 200);
  };

  const handleConfirmReset = () => {
    resetDemoData();
    setResetModalOpen(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3500);
  };

  const schoolConfig = getSchoolConfig();
  const isGreenTheme = currentSchool?.slug === 'sia';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-100">
      {/* Dynamic Background Glows reflecting school colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none transition-all duration-700">
        <div
          className={cn(
            'absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700',
            isGreenTheme ? 'bg-emerald-500' : 'bg-blue-600'
          )}
        />
        <div
          className={cn(
            'absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700',
            isGreenTheme ? 'bg-teal-500' : 'bg-purple-600'
          )}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Top Bar Controls */}
      <div className="w-full max-w-5xl flex items-center justify-between relative z-20 mb-6 sm:mb-8">
        {/* Back to School Website */}
        <button
          onClick={() => navigate(`/school/${schoolSlug}`)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-medium hover:bg-slate-800 hover:text-slate-200 transition-all backdrop-blur-md cursor-pointer shadow-sm"
          title="Back to school public website"
        >
          <ArrowLeft size={13} className="text-slate-400" />
          <span>← School Website</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Reset Demo Data Button */}
          <button
            onClick={() => setResetModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-medium hover:bg-slate-800 hover:text-slate-200 transition-all backdrop-blur-md cursor-pointer shadow-sm"
            title="Reset simulated data back to initial state"
          >
            <RotateCcw size={13} className="text-slate-400" />
            <span>Reset Demo</span>
          </button>

          {/* Tenant Indicator */}
          <div className="group relative">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md shadow-xs cursor-default">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300 text-xs font-semibold tracking-wide">
                <Globe className="w-3 h-3 inline mr-1" />
                /school/{schoolSlug}
              </span>
            </div>

            {/* Hover tooltip */}
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-30 w-64 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs shadow-xl animate-in fade-in zoom-in-95">
              <p className="font-semibold text-white mb-0.5">Tenant-Isolated Portal</p>
              <p className="text-[11px] text-slate-400 leading-normal">
                This login page is scoped to <strong>{schoolConfig.name}</strong>. Other schools cannot access this portal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Success Toast */}
      {resetSuccess && (
        <div className="fixed top-6 z-50 animate-in slide-in-from-top-4 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-medium shadow-2xl">
          <Check size={16} className="text-emerald-400" />
          <span>Demo data successfully reset to initial factory state!</span>
        </div>
      )}

      {/* Main Branding Header — School-specific, no selector */}
      <div className="text-center mb-8 relative z-10 max-w-xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-900/80 border border-slate-800 text-5xl mb-4 shadow-xl backdrop-blur-md">
          {schoolConfig.logo}
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {schoolConfig.name}
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-2 font-medium">
          {schoolConfig.tagline}
        </p>
        <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
          <Sparkles size={12} className="text-amber-400" />
          <span>School Digital Intelligence & Management Portal</span>
        </div>
      </div>

      {/* 4 Big Animated Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl w-full relative z-10">
        {roles.map(({ role, label, subtitle, emoji, icon, gradient, borderHover, shadowHover }) => {
          const isClicked = selectedRole === role;
          return (
            <button
              key={role}
              onClick={() => handleLogin(role)}
              className={cn(
                'group relative flex flex-col items-center text-center p-6 sm:p-7 rounded-2xl cursor-pointer',
                'bg-slate-900/60 border border-slate-800/80 backdrop-blur-md',
                'hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 ease-out active:scale-95',
                borderHover,
                shadowHover,
                isClicked && 'scale-95 ring-2 ring-blue-400'
              )}
            >
              {/* Soft ambient gradient on hover */}
              <div
                className={cn(
                  'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300',
                  gradient
                )}
              />

              {/* Emoji Tag */}
              <span className="text-2xl mb-2">{emoji}</span>

              {/* Big Icon Container */}
              <div
                className={cn(
                  'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-4',
                  'shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300',
                  gradient
                )}
              >
                {icon}
              </div>

              {/* Role Title & Subtitle */}
              <h3 className="text-white font-bold text-lg sm:text-xl mb-1 tracking-tight">
                {label}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed px-2 font-normal">
                {subtitle}
              </p>

              {/* Enter Button CTA */}
              <div className="mt-5 w-full pt-4 border-t border-slate-800/80 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                <span>Enter Portal</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-center relative z-10 space-y-1">
        <p className="text-slate-500 text-xs">
          Tenant-Isolated Portal for {schoolConfig.name} • Click any role above to enter
        </p>
        <p className="text-slate-600 text-[11px]">
          URL: /school/{schoolSlug} • Domain: {schoolConfig.domain}
        </p>
      </footer>

      {/* Reset Demo Data Confirmation Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Demo Data"
        description="Return all data back to the clean demonstration baseline."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmReset}
            >
              Confirm Reset
            </Button>
          </>
        }
      >
        <div className="space-y-3 py-1">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              This action will erase any demo changes made during your session (custom attendance, newly created interventions, payments, etc.) and restore all initial student, teacher, and fee records.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Are you sure you want to restore factory demo data?
          </p>
        </div>
      </Modal>
    </div>
  );
}
