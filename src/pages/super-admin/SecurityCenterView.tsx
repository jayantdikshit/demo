import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { ShieldCheck, Lock, AlertOctagon, UserX, Key, Eye } from 'lucide-react';

export function SecurityCenterView() {
  const { securityEvents, revokeUserSessions } = useSuperAdminStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Security Operations Center (SOC)</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Monitor failed login attempts, suspicious IP activity, active session tokens, and force logout controls.
        </p>
      </div>

      {/* Security Actions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Emergency Session Governance</span>
          </h3>
          <p className="text-xs text-slate-400">Force invalidate session tokens across specific tenant or platform-wide.</p>
          <button
            onClick={() => {
              revokeUserSessions('ALL_ACTIVE_SESSIONS');
              alert('Force revoked all active user session tokens across platform!');
            }}
            className="w-full py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 font-bold text-xs transition cursor-pointer"
          >
            Force Revoke All Platform Sessions
          </button>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span>Multi-Factor Authentication (2FA)</span>
          </h3>
          <p className="text-xs text-slate-400">Enforce mandatory TOTP/Hardware Key 2FA for all School Admin & Principal accounts.</p>
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span>2FA Policy Enforcement:</span>
            <span>Mandatory Enabled</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-purple-400" />
            <span>IP Throttling & Rate Limiting</span>
          </h3>
          <p className="text-xs text-slate-400">Automatic IP ban after 5 consecutive failed authentication attempts.</p>
          <div className="flex items-center justify-between text-xs font-semibold text-purple-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span>Rate Limiter Status:</span>
            <span>Active (0 IPs Banned)</span>
          </div>
        </div>
      </div>

      {/* Security Events Feed */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-4">Security Audit Events Feed</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">Timestamp</th>
                <th className="pb-3">Event Type</th>
                <th className="pb-3">Target Email</th>
                <th className="pb-3">School Name</th>
                <th className="pb-3">IP Address</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {securityEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 text-slate-400 font-mono text-[11px]">{evt.timestamp}</td>
                  <td className="py-3 font-bold text-white">{evt.eventType}</td>
                  <td className="py-3 text-slate-300 font-mono">{evt.userEmail}</td>
                  <td className="py-3 text-slate-300">{evt.schoolName}</td>
                  <td className="py-3 font-mono text-slate-400 text-[11px]">{evt.ipAddress}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        evt.riskScore === 'High'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {evt.riskScore} Risk
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => revokeUserSessions(evt.userEmail)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition text-[11px] font-semibold cursor-pointer"
                    >
                      Revoke Sessions
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
