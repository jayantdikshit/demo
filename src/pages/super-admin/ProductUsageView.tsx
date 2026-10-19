import React from 'react';
import { Activity, Users, CheckSquare, Eye, FileText, Zap, Sparkles } from 'lucide-react';

export function ProductUsageView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <span>Product Usage & Adoption Intelligence</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Source Product Metrics: Teacher Weekly Active Users, Management logins, Data completeness index, and Parent adoption rates.
        </p>
      </div>

      {/* Grid of Usage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Teacher Usage */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Teacher Engagement</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[10px]">
              94.2% Active
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Weekly Active Teachers (WAT):</span>
              <span className="font-bold text-white">4,820 Teachers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Monthly Active Teachers (MAT):</span>
              <span className="font-bold text-white">5,110 Teachers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Daily Attendance Submission:</span>
              <span className="font-bold text-emerald-400">89.4% On Time</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Topic Completion Logging:</span>
              <span className="font-bold text-indigo-400">76.2% On Plan</span>
            </div>
          </div>
        </div>

        {/* Management Usage */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Management Usage</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold text-[10px]">
              High Frequency
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Weekly Management Logins:</span>
              <span className="font-bold text-white">2,140 Logins</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dashboard Views Today:</span>
              <span className="font-bold text-white">14,890 Views</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Reports Generated:</span>
              <span className="font-bold text-purple-400">3,420 PDF Exports</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Actions Created & Closed:</span>
              <span className="font-bold text-emerald-400">81% Closure Rate</span>
            </div>
          </div>
        </div>

        {/* Parent Usage */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Parent App Adoption</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
              89.2% Activated
            </span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Activated Parents:</span>
              <span className="font-bold text-white">68,450 Parents</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Weekly Active Parents:</span>
              <span className="font-bold text-white">52,100 Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Attendance & Marks Views:</span>
              <span className="font-bold text-cyan-400">142,000 Views/wk</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Online Fee Collections:</span>
              <span className="font-bold text-emerald-400">₹4.2 Cr Processed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Completeness Index Heatmap */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-1">Platform-Wide Data Completeness Index</h3>
        <p className="text-slate-400 text-xs mb-4">Percentage of required profile, fee, and academic data filled by schools</p>
        <div className="w-full bg-slate-950 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-300">Overall Platform Completeness Score</div>
          <div className="text-xl font-black text-emerald-400">91.4% Healthy Index</div>
        </div>
      </div>
    </div>
  );
}
