import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { LifeBuoy, Clock, CheckCircle2, Star, AlertTriangle } from 'lucide-react';

export function SupportSuccessView() {
  const { tickets } = useSuperAdminStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <LifeBuoy className="w-5 h-5 text-blue-400" />
          <span>Support & Customer Success Intelligence</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Track open tickets, resolution SLAs (&gt;24h / &gt;72h breach trackers), CSAT scores, and school risk factors.
        </p>
      </div>

      {/* Primary CS Metrics (Section 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Open Support Tickets</div>
          <div className="text-2xl font-black text-white mt-2">24 Tickets</div>
          <div className="text-[11px] text-amber-400 font-semibold mt-1">3 High Priority</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Unresolved &gt; 24 Hours</div>
          <div className="text-2xl font-black text-amber-400 mt-2">1 Ticket</div>
          <div className="text-[11px] text-slate-500 mt-1">SLA Alert Triggered</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Unresolved &gt; 72 Hours</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">0 Tickets</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">🟢 100% SLA Compliant</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Customer Satisfaction (CSAT)</div>
          <div className="text-2xl font-black text-emerald-400 mt-2 flex items-center gap-1">
            <span>4.8 / 5.0</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on 340 ratings</div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-4">Active Customer Success Support Queue</h3>
        <div className="space-y-3 text-xs">
          {tickets.map((tkt) => (
            <div
              key={tkt.id}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[10px]">{tkt.id}</span>
                  <span className="font-bold text-white text-sm">{tkt.schoolName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tkt.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {tkt.priority} Priority
                  </span>
                </div>
                <p className="text-slate-300 mt-1 font-medium">{tkt.subject}</p>
                <div className="text-[10px] text-slate-500 mt-1">
                  Created: {tkt.createdAt} • Updated: {tkt.lastUpdated}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    tkt.status === 'Open'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : tkt.status === 'In Progress'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {tkt.status}
                </span>
                <button
                  onClick={() => alert(`Responding to ticket ${tkt.id}...`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
                >
                  Respond Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
