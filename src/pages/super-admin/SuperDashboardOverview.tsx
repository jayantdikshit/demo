import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import {
  School,
  Users,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Activity,
  Zap,
  Globe,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  setActiveTab: (tabId: string) => void;
}

export function SuperDashboardOverview({ setActiveTab }: Props) {
  const { schools, alerts, revenueHistory, setSelectedSchool } = useSuperAdminStore();

  const totalSchools = 1248;
  const activeSchools = 1116;
  const trialSchools = 74;
  const atRiskSchools = 58;
  const totalUsers = 84620;
  const mrrFormatted = '₹18.6L';
  const arrFormatted = '₹2.23 Cr';
  const renewalDueCount = 43;

  const topSchools = schools.slice(0, 5);
  const unackAlerts = alerts.filter((a) => a.status === 'Unacknowledged');

  return (
    <div className="space-y-6">
      {/* Question Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Tenant Executive Question</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              "Mere poore SaaS platform mein abhi kya ho raha hai, kaha problem hai, aur mujhe kya action lena hai?"
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('alerts')}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold hover:bg-red-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>{unackAlerts.length} Unresolved Alerts</span>
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-900/40 cursor-pointer"
            >
              <School className="w-4 h-4" />
              <span>All 1,248 Schools</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top-Level KPI Cards Grid (Matching Prompt Section 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Schools */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Total Schools</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{totalSchools.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>↑ 8.4% this month</span>
          </div>
        </div>

        {/* Active Schools */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Active Schools</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{activeSchools.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">89.4% Active Retention Ratio</div>
        </div>

        {/* Trial / Pilot Schools */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Trial / Pilot Schools</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{trialSchools}</div>
          <div className="text-[11px] text-purple-300 mt-1">Active Pilot Conversions</div>
        </div>

        {/* Inactive / At Risk */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Inactive / At Risk</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{atRiskSchools}</div>
          <div className="text-[11px] text-amber-400 mt-1">Requires CS Follow-up</div>
        </div>

        {/* Total Users */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Total Users</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{totalUsers.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Teachers, Admins, Students, Parents</div>
        </div>

        {/* MRR */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Monthly Recurring (MRR)</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{mrrFormatted}</div>
          <div className="text-[11px] font-semibold text-emerald-400 mt-1">↑ 12.3% MoM Growth</div>
        </div>

        {/* ARR */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Annualized Run Rate (ARR)</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{arrFormatted}</div>
          <div className="text-[11px] text-indigo-300 mt-1">Projected Annual Pipeline</div>
        </div>

        {/* Renewal Due */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-medium">Renewal Due</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{renewalDueCount} Schools</div>
          <div className="text-[11px] text-rose-300 mt-1">Next 30 Days Expiry</div>
        </div>
      </div>

      {/* Middle Section: Chart & Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">SaaS Revenue Growth Trend</h3>
              <p className="text-slate-400 text-xs">Monthly Recurring Revenue (MRR) trajectory in ₹ Lakhs</p>
            </div>
            <button
              onClick={() => setActiveTab('revenue')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Full Financials</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => [`₹${((Number(value) || 0) / 100000).toFixed(2)} Lakhs`, 'MRR']}
                />
                <Line type="monotone" dataKey="mrr" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#60a5fa' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Centralized Alert Feed */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Critical Platform Alerts</span>
              </h3>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        alt.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : alt.severity === 'High'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {alt.severity}
                    </span>
                    <span className="text-slate-500 text-[10px]">{alt.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate">{alt.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{alt.description}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => setActiveTab('alerts')}
            className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            Open Alert Management Center
          </button>
        </div>
      </div>

      {/* Schools Spotlight Table Quick Preview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white text-base">Key Schools Overview & Health Spotlight</h3>
            <p className="text-slate-400 text-xs">Direct multi-tenant governance controls</p>
          </div>
          <button
            onClick={() => setActiveTab('schools')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold hover:bg-blue-600/30 transition cursor-pointer"
          >
            Explore All 1,248 Schools
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">School Name</th>
                <th className="pb-3">Students</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Health</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topSchools.map((sch) => (
                <tr key={sch.schoolId} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-blue-400 font-bold border border-slate-700">
                      {sch.name[0]}
                    </div>
                    <div>
                      <div>{sch.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{sch.slug}.edupulse.com</div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{sch.studentsCount.toLocaleString()}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold">
                      {sch.plan}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        sch.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : sch.status === 'Trial'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : sch.status === 'At Risk'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {sch.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs">
                      {sch.health === 'Healthy' ? '🟢 Healthy' : sch.health === 'At Risk' ? '🟠 At Risk' : '🔴 Critical'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedSchool(sch);
                        setActiveTab('schools');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer"
                    >
                      View Complete Overview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
