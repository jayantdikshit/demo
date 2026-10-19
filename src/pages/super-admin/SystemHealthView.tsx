import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { Cpu, Activity, Clock, AlertTriangle, CheckCircle2, Server, Database, HardDrive, Zap } from 'lucide-react';

export function SystemHealthView() {
  const { systemHealth } = useSuperAdminStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <span>Technical Super Dashboard — Infrastructure Observability</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Real-time cloud observability: API Uptime (99.96%), Latency (182ms), Error Rate (0.21%), and Worker Queues.
        </p>
      </div>

      {/* Primary Technical Metric Cards (Section 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">API Gateway Uptime</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">99.96% Uptime</div>
          <div className="text-[11px] text-slate-500 mt-1">SLA Target: 99.90%</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Average Response Latency</div>
          <div className="text-2xl font-black text-blue-400 mt-2">182 ms</div>
          <div className="text-[11px] text-slate-500 mt-1">p95 Latency: 240ms</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Global System Error Rate</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">0.21% Errors</div>
          <div className="text-[11px] text-slate-500 mt-1">HTTP 5xx & Timeout Ratio</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Database Cluster Load</div>
          <div className="text-2xl font-black text-indigo-400 mt-2">32% CPU Load</div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">🟢 Healthy Pool</div>
        </div>
      </div>

      {/* Cluster Component Telemetry Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-4">Cluster Subsystem Telemetry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">Subsystem Component</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Uptime</th>
                <th className="pb-3">Average Latency</th>
                <th className="pb-3 text-right">Error Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {systemHealth.map((sys, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>{sys.name}</span>
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        sys.status === 'Healthy'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {sys.status === 'Healthy' ? '🟢 Healthy' : '🟠 Degraded'}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-mono">{sys.uptime}</td>
                  <td className="py-3.5 text-slate-300 font-mono">{sys.latency}</td>
                  <td className="py-3.5 text-right font-mono text-slate-400">{sys.errorRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
