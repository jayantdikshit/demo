import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import {
  Building2,
  LayoutDashboard,
  School,
  Users,
  CreditCard,
  TrendingUp,
  BarChart3,
  Activity,
  GraduationCap,
  BellRing,
  CheckSquare,
  LifeBuoy,
  ShieldCheck,
  FileText,
  Settings,
  Unplug,
  Cpu,
  LogOut,
  Search,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SuperNavTab {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  category?: string;
}

export const superAdminTabs: SuperNavTab[] = [
  { id: 'overview', label: 'Super Overview', icon: LayoutDashboard, category: 'Main' },
  { id: 'schools', label: 'Schools Management', icon: School, category: 'Operations' },
  { id: 'users', label: 'User Governance & RBAC', icon: Users, category: 'Operations' },
  { id: 'subscriptions', label: 'Subscriptions & Tiers', icon: CreditCard, category: 'Commercial' },
  { id: 'revenue', label: 'Revenue Analytics', icon: TrendingUp, category: 'Commercial' },
  { id: 'sales', label: 'Sales Funnel', icon: BarChart3, category: 'Commercial' },
  { id: 'product-usage', label: 'Product Usage & Adoption', icon: Activity, category: 'Intelligence' },
  { id: 'academic-intel', label: 'Academic Intelligence', icon: GraduationCap, category: 'Intelligence' },
  { id: 'alerts', label: 'Centralized Alert Center', icon: BellRing, category: 'Risk & Support' },
  { id: 'audit-logs', label: 'Immutable Audit Logs', icon: FileText, category: 'Risk & Support' },
  { id: 'security', label: 'Security Operations', icon: ShieldCheck, category: 'Risk & Support' },
  { id: 'system-health', label: 'System Health & Infra', icon: Cpu, category: 'Technical' },
  { id: 'support', label: 'Support & CSAT', icon: LifeBuoy, category: 'Risk & Support' },
  { id: 'config', label: 'Configuration Center', icon: Settings, category: 'Technical' },
  { id: 'integrations', label: 'API & Integrations', icon: Unplug, category: 'Technical' },
];

interface SuperAdminLayoutProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  children: React.ReactNode;
}

export function SuperAdminLayout({ activeTab, setActiveTab, children }: SuperAdminLayoutProps) {
  const navigate = useNavigate();
  const { alerts, schools } = useSuperAdminStore();
  const unackAlerts = alerts.filter((a) => a.status === 'Unacknowledged').length;
  const totalSchoolsCount = schools.length;

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Executive Top Banner */}
      <div className="bg-gradient-to-r from-blue-900/90 via-indigo-950 to-slate-950 border-b border-blue-800/40 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            SUPER ADMIN PLATFORM CONTROL
          </span>
          <span className="hidden md:inline text-slate-400 font-medium">
            Multi-Tenant SaaS Cluster • <span className="text-emerald-400">1,248 Schools Active</span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hidden sm:flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            Cluster Uptime: <strong className="text-white">99.96%</strong>
          </span>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            Switch to School Portal
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sleek Executive Sidebar */}
        <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between shrink-0 hidden lg:flex">
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)] custom-scrollbar space-y-6">
            {/* Header Brand */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/40 font-bold border border-blue-400/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base tracking-tight leading-tight">EduPulse SaaS</h2>
                <p className="text-[11px] text-blue-400 font-semibold">Super Admin Master</p>
              </div>
            </div>

            {/* Quick Multi-Tenant Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search school, user, IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Nav Menu Groups */}
            {['Main', 'Operations', 'Commercial', 'Intelligence', 'Risk & Support', 'Technical'].map((cat) => {
              const catTabs = superAdminTabs.filter((t) => t.category === cat);
              if (catTabs.length === 0) return null;
              return (
                <div key={cat} className="space-y-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">{cat}</div>
                  {catTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer',
                          isActive
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 font-semibold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-blue-400' : 'text-slate-500')} />
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {tab.id === 'alerts' && unackAlerts > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">
                            {unackAlerts}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Super Admin Profile Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs border border-indigo-400">
                SA
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">Rahul Sharma</div>
                <div className="text-[10px] text-slate-500 truncate">superadmin@edupulse.com</div>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              title="Logout / Exit Super Dashboard"
              className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navbar */}
          <header className="bg-slate-900/60 border-b border-slate-800 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                {superAdminTabs.find((t) => t.id === activeTab)?.label || 'Super Dashboard'}
              </h1>
            </div>

            {/* Mobile Tab Selector */}
            <div className="lg:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
              >
                {superAdminTabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('alerts')}
                className="relative p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <BellRing className="w-4 h-4 text-blue-400" />
                {unackAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center">
                    {unackAlerts}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('schools')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/30 transition cursor-pointer"
              >
                <School className="w-3.5 h-3.5" />
                <span>Manage Schools</span>
              </button>
            </div>
          </header>

          {/* Tab View Container */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
