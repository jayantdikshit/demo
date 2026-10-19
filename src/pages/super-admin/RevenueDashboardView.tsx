import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { TrendingUp, IndianRupee, ArrowUpRight, ArrowDownRight, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export function RevenueDashboardView() {
  const { revenueHistory } = useSuperAdminStore();

  const mrrFormatted = '₹18.6 Lakhs';
  const arrFormatted = '₹2.23 Crores';
  const arpaFormatted = '₹1,666 / mo';
  const newRevenueFormatted = '₹95,000';
  const expansionFormatted = '₹45,000';
  const churnFormatted = '₹15,000';

  const planRevenueBreakdown = [
    { name: 'Growth Tier (57%)', value: 57, color: '#3b82f6' },
    { name: 'Enterprise Tier (25%)', value: 25, color: '#8b5cf6' },
    { name: 'Starter Tier (18%)', value: 18, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>SaaS Revenue Intelligence & Commercial Metrics</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Company-wide MRR, ARR, ARPA, Expansion, Churn, and Tier-wise Revenue Distribution.
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Monthly Recurring Revenue (MRR)</div>
          <div className="text-2xl font-black text-white mt-2">{mrrFormatted}</div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>↑ 12.3% MoM Growth</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Annual Recurring Revenue (ARR)</div>
          <div className="text-2xl font-black text-white mt-2">{arrFormatted}</div>
          <div className="text-[11px] text-slate-500 mt-1">Contractual Annual Run-rate</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Average Revenue Per Account (ARPA)</div>
          <div className="text-2xl font-black text-white mt-2">{arpaFormatted}</div>
          <div className="text-[11px] text-slate-500 mt-1">Average school contract MRR</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Expansion Revenue</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">{expansionFormatted}</div>
          <div className="text-[11px] text-emerald-300 mt-1">Plan upgrades & Add-ons</div>
        </div>
      </div>

      {/* Financial Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MRR Growth Line Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-white text-base mb-1">MRR & ARR Trajectory (2026)</h3>
          <p className="text-slate-400 text-xs mb-4">Monthly subscription revenue build-up</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(v: any) => [`₹${(Number(v) / 100000).toFixed(2)} Lakhs`, 'MRR']}
                />
                <Line type="monotone" dataKey="mrr" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#34d399' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Plan Pie Chart (Prompt Section 7) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-400" />
              <span>Revenue by Plan Tier</span>
            </h3>
            <p className="text-slate-400 text-xs mb-4">Subscription revenue share</p>

            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planRevenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {planRevenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {planRevenueBreakdown.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
