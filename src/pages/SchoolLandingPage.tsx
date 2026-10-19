import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { ArrowRight, Globe, Sparkles, Shield, GraduationCap, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Root landing page ("/") for the EduPulse demo.
 * Shows a premium school selection card — investor demo starting point.
 * Each card links to the school's public website at /school/:slug.
 */
export function SchoolLandingPage() {
  const navigate = useNavigate();
  const { schoolConfigs } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden text-slate-100">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-15 bg-blue-600" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-15 bg-purple-600" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Demo Mode Badge */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-blue-300 text-xs font-semibold tracking-wide">🔵 Multi-Tenant SaaS Demo</span>
        </div>
      </div>

      {/* Product Branding */}
      <div className="text-center mb-10 relative z-10 max-w-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-5xl mb-5 shadow-2xl shadow-blue-900/40 border border-blue-500/20">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          EduPulse Platform
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3 font-medium leading-relaxed max-w-lg mx-auto">
          School Digital Intelligence & Management — White-Label Multi-Tenant SaaS.
          Each school gets its own <span className="text-blue-400 font-semibold">isolated URL, public website & admin portal</span>.
        </p>

        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            Tenant Isolation
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            Custom Domains
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI-Powered Analytics
          </span>
        </div>
      </div>

      {/* Super Admin Control Center Quick Launch Banner */}
      <div className="relative z-10 mb-8 max-w-3xl w-full">
        <button
          onClick={() => navigate('/super-admin')}
          className="w-full group relative flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-blue-900/80 via-indigo-950 to-purple-950/80 border border-blue-500/40 backdrop-blur-md shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400 transition-all cursor-pointer text-left overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg border border-blue-400/30 group-hover:scale-105 transition-transform">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">Super Admin Control Center</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold text-[10px] border border-blue-400/30">
                  NEW • SaaS Dashboard
                </span>
              </div>
              <p className="text-slate-300 text-xs mt-0.5">
                Control 1,248 Schools • MRR ₹18.6L • ARR ₹2.23 Cr • RBAC • Audit Logs • System Health
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-blue-300 group-hover:text-white transition-colors relative z-10 shrink-0">
            <span>Open Super Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* School Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full relative z-10">
        {schoolConfigs.map((config) => (
          <button
            key={config.schoolId}
            onClick={() => navigate(`/school/${config.slug}`)}
            className={cn(
              'group relative flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl cursor-pointer',
              'bg-slate-900/70 border border-slate-800/80 backdrop-blur-md',
              'hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 ease-out active:scale-[0.98]',
              'hover:border-blue-500/40 hover:shadow-blue-500/10'
            )}
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/0 via-indigo-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:via-indigo-600/5 group-hover:to-purple-600/5 transition-all duration-300" />

            {/* School Logo */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-4xl mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300 border border-slate-700/50">
              {config.logo}
            </div>

            {/* School Name & Info */}
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-1.5 tracking-tight relative">
              {config.name}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed px-4 font-normal mb-2 relative">
              {config.tagline}
            </p>

            {/* Domain Preview */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/80 text-[11px] text-slate-400 font-mono mb-4 relative">
              <Globe className="w-3 h-3 text-blue-400" />
              <span>{config.domain}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-5 relative">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Est. {config.establishedYear}
              </span>
              <span>•</span>
              <span>{config.shortName} Portal</span>
            </div>

            {/* CTA */}
            <div className="w-full pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-white transition-colors relative">
              <span>Visit School Website</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <footer className="mt-12 text-center relative z-10 space-y-1.5">
        <p className="text-slate-500 text-xs">
          Interactive Investor & Client Demo — Each school operates in complete isolation
        </p>
        <p className="text-slate-600 text-[11px]">
          Architecture: Slug-Based Routing → Subdomain → Custom Domain (3-Layer Progressive)
        </p>
      </footer>
    </div>
  );
}
