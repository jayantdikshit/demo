import React, { useState } from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { FileText, Search, Shield, Filter, Download } from 'lucide-react';

export function AuditLogsView() {
  const { auditLogs } = useSuperAdminStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(
    (a) =>
      a.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.schoolName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Immutable Platform Audit Logs & Compliance Trail</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Full auditing of marks, attendance overrides, fee verifications, role changes, and administrative bypasses.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting encrypted immutable audit trail (JSON/CSV)...')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit History</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Admin, Action, or School..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Audit Log Table (Section 12 Format) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">Timestamp (WHEN)</th>
                <th className="pb-3">Admin / Actor (WHO)</th>
                <th className="pb-3">Action Event (WHAT)</th>
                <th className="pb-3">School Tenant</th>
                <th className="pb-3">Target Subject</th>
                <th className="pb-3">Old Value → New Value</th>
                <th className="pb-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-3.5 font-bold text-white">
                    <div>{log.actorName}</div>
                    <div className="text-[10px] text-indigo-400 font-normal">{log.actorRole}</div>
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[10px] border border-blue-500/20 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-medium">{log.schoolName}</td>
                  <td className="py-3.5 text-slate-200">{log.targetUser}</td>
                  <td className="py-3.5">
                    <div className="text-[11px]">
                      <span className="text-red-400 font-mono">{log.oldValue}</span>
                      <span className="text-slate-500 mx-1.5">→</span>
                      <span className="text-emerald-400 font-mono">{log.newValue}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-right font-mono text-slate-500 text-[11px]">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
