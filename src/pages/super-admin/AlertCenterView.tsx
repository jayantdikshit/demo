import React, { useState } from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { BellRing, ShieldAlert, CheckCircle2, AlertOctagon, Filter, Clock, UserCheck } from 'lucide-react';

export function AlertCenterView() {
  const { alerts, acknowledgeAlert, resolveAlert } = useSuperAdminStore();
  const [severityFilter, setSeverityFilter] = useState('All');

  const filteredAlerts = alerts.filter((a) => severityFilter === 'All' || a.severity === severityFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-red-400" />
            <span>Centralized Platform Alert Center</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Monitor 🔴 Critical, 🟠 High, 🟡 Medium, and 🔵 Info system & tenant notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Filter Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900">All Severities</option>
            <option value="Critical" className="bg-slate-900">🔴 Critical</option>
            <option value="High" className="bg-slate-900">🟠 High</option>
            <option value="Medium" className="bg-slate-900">🟡 Medium</option>
          </select>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alt) => (
          <div
            key={alt.id}
            className={`p-5 rounded-2xl bg-slate-900/90 border transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              alt.severity === 'Critical'
                ? 'border-red-500/40 shadow-red-900/10'
                : alt.severity === 'High'
                ? 'border-amber-500/40'
                : 'border-slate-800'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  alt.severity === 'Critical'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : alt.severity === 'High'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                      alt.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-400'
                        : alt.severity === 'High'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {alt.severity}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">• {alt.schoolName}</span>
                  <span className="text-xs text-slate-500">• {alt.timestamp}</span>
                </div>
                <h3 className="font-bold text-white text-base">{alt.title}</h3>
                <p className="text-xs text-slate-300 max-w-2xl">{alt.description}</p>
                {alt.assignedTo && (
                  <div className="text-[11px] text-indigo-400 font-semibold flex items-center gap-1 mt-1">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assigned to: {alt.assignedTo}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              {alt.status === 'Unacknowledged' ? (
                <button
                  onClick={() => acknowledgeAlert(alt.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Acknowledge & Assign
                </button>
              ) : alt.status === 'Acknowledged' ? (
                <button
                  onClick={() => resolveAlert(alt.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                  Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
