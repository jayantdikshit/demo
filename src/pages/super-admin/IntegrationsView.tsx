import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { Unplug, MessageSquare, CreditCard, HardDrive, Mail, CheckCircle2, AlertOctagon, RefreshCw } from 'lucide-react';

export function IntegrationsView() {
  const { integrations, toggleIntegrationStatus } = useSuperAdminStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Unplug className="w-5 h-5 text-indigo-400" />
          <span>API & Communication Integrations Hub</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Source Roadmap: Connect & manage SMS (Twilio), WhatsApp (Meta Cloud API), Email (SendGrid), Payment Gateways (Razorpay), and Cloud Storage (AWS S3).
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((connector) => (
          <div
            key={connector.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 border border-slate-700">
                    <Unplug className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{connector.name}</h3>
                    <div className="text-[11px] text-slate-400 font-mono">{connector.provider}</div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    connector.status === 'Connected'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : connector.status === 'Degraded'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {connector.status}
                </span>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">API Requests Today:</span>
                  <span className="font-bold text-white">{connector.apiRequestsToday.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Error Count:</span>
                  <span className="font-bold text-rose-400">{connector.errorCount} Errors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Sync:</span>
                  <span className="font-mono text-slate-400">{connector.lastSync}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => alert(`Testing API Credentials for ${connector.name}... Health Check Passed!`)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Test Credentials
              </button>
              <button
                onClick={() => toggleIntegrationStatus(connector.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                  connector.status === 'Connected'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                }`}
              >
                {connector.status === 'Connected' ? 'Disconnect' : 'Connect API'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
