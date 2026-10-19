import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { BarChart3, Filter, ArrowRight, CheckCircle2, Clock, Users, IndianRupee } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export function SalesDashboardView() {
  const { salesFunnel } = useSuperAdminStore();

  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <span>SaaS Sales Dashboard & Acquisition Pipeline</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Source Sales Funnel: Lead → Decision Maker → Discovery → Demo → Pilot → Paid Contract → Implementation → Adoption → Renewal.
        </p>
      </div>

      {/* Primary Funnel Ratios */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Total Inbound Leads</div>
          <div className="text-2xl font-black text-white mt-2">580 Leads</div>
          <div className="text-[11px] text-slate-500 mt-1">Organic & Campaign leads</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Qualified Discovery</div>
          <div className="text-2xl font-black text-indigo-400 mt-2">210 Schools</div>
          <div className="text-[11px] text-slate-500 mt-1">36.2% Qualification Rate</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Paid Conversions</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">21 Contracts</div>
          <div className="text-[11px] font-bold text-emerald-300 mt-1">17.5% Overall Win Rate</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Avg Sales Cycle</div>
          <div className="text-2xl font-black text-purple-400 mt-2">18.4 Days</div>
          <div className="text-[11px] text-slate-500 mt-1">First contact to signed contract</div>
        </div>
      </div>

      {/* Visual Funnel Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-1">Interactive Conversion Funnel Stage Analysis</h3>
        <p className="text-slate-400 text-xs mb-4">Pipeline drop-off per conversion stage</p>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesFunnel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={12} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                formatter={(val: any, name: any, item: any) => [`${val} Schools (₹${((item.payload.value || 0)/100000).toFixed(1)}L Pipeline Value)`, 'Count']}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {salesFunnel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complete Sales Lifecycle Cards */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-4">Source Lifecycle Stage Distribution</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center text-xs">
          {[
            'Lead (580)',
            'Decision Maker (340)',
            'Discovery (210)',
            'Demo (120)',
            'Pilot (38)',
            'Paid Contract (21)',
            'Implementation (18)',
            'Adoption (1116)',
            'Renewal (43)',
          ].map((stg, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-semibold text-slate-200">
              <div className="text-blue-400 font-mono text-[10px]">Step {i + 1}</div>
              <div className="mt-1 leading-tight">{stg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
