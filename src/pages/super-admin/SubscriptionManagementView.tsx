import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { CreditCard, Check, Sparkles, AlertTriangle, ShieldCheck, Zap, ArrowRight, ShieldAlert } from 'lucide-react';

export function SubscriptionManagementView() {
  const { plans, schools } = useSuperAdminStore();

  const trialSchools = schools.filter((s) => s.status === 'Trial');
  const paidSchools = schools.filter((s) => s.status === 'Active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span>SaaS Subscriptions & Plan Tier Controls</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Manage commercial tier plans, feature limits, student/storage quotas, and subscription lifecycle.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Launching New Plan Configuration Modal')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/40 transition cursor-pointer"
          >
            + Add New Tier
          </button>
        </div>
      </div>

      {/* Commercial Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Paid Active Subscribers</div>
          <div className="text-2xl font-black text-emerald-400 mt-2">1,116 Schools</div>
          <div className="text-[11px] text-slate-500 mt-1">89.4% Commercial Conversion</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Active Pilot Trials</div>
          <div className="text-2xl font-black text-purple-400 mt-2">74 Schools</div>
          <div className="text-[11px] text-slate-500 mt-1">14-Day Free Pilot Active</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Expiring within 30 Days</div>
          <div className="text-2xl font-black text-rose-400 mt-2">43 Schools</div>
          <div className="text-[11px] text-slate-500 mt-1">Automated Reminders Active</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-slate-400 text-xs font-medium">Avg Contract Value (ARPA)</div>
          <div className="text-2xl font-black text-indigo-400 mt-2">₹1,666 / mo</div>
          <div className="text-[11px] text-slate-500 mt-1">Weighted across tiers</div>
        </div>
      </div>

      {/* Plans Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-slate-900/90 border rounded-3xl p-6 flex flex-col justify-between transition hover:shadow-2xl relative ${
              plan.name === 'Growth' ? 'border-blue-500 shadow-blue-900/20' : 'border-slate-800'
            }`}
          >
            {plan.name === 'Growth' && (
              <span className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                Most Popular
              </span>
            )}

            <div>
              <h3 className="text-xl font-black text-white">{plan.name} Tier</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">₹{plan.annualPrice.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-medium">/ year / school</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Or ₹{plan.monthlyPrice.toLocaleString()} / month billed monthly
              </div>

              {/* Limits */}
              <div className="my-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Student Limit:</span>
                  <span className="font-bold text-white">{plan.studentLimit.toLocaleString()} Students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Storage Quota:</span>
                  <span className="font-bold text-white">{plan.storageGb} GB Cloud Storage</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Subscribers:</span>
                  <span className="font-bold text-emerald-400">{plan.activeSchoolsCount} Schools</span>
                </div>
              </div>

              {/* Included Features */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="font-bold text-slate-400 text-[11px] uppercase tracking-wider mb-2">Included Features</div>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => alert(`Opening Plan Edit Console for ${plan.name}`)}
              className={`w-full mt-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                plan.name === 'Growth'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              Configure {plan.name} Tier Settings
            </button>
          </div>
        ))}
      </div>

      {/* Trial to Paid Conversion Queue */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-3">Trial & Expiring Subscription Queue</h3>
        <div className="space-y-3 text-xs">
          {trialSchools.map((sch) => (
            <div
              key={sch.schoolId}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-white">{sch.name}</div>
                <div className="text-[11px] text-slate-400">
                  Trial Started: {sch.createdDate} • Contact: {sch.contactEmail}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
                  Trial Active
                </span>
                <button
                  onClick={() => alert(`Converted ${sch.name} to Paid Growth Plan!`)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Convert to Paid
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
