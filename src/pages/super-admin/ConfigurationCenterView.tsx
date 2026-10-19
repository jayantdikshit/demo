import React, { useState } from 'react';
import { Settings, Sliders, Bell, Shield, Sparkles, Check } from 'lucide-react';

export function ConfigurationCenterView() {
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [marksPassThreshold, setMarksPassThreshold] = useState(40);
  const [trialDurationDays, setTrialDurationDays] = useState(14);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-400" />
          <span>Configuration Center — Zero-Code Platform Control</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Source principle: Configuration over custom code. Manage global defaults, notification templates, alert rules, and system limits.
        </p>
      </div>

      {/* Global Defaults Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="font-bold text-white text-base">Global Academic & Warning Defaults</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-200">Mandatory Attendance Threshold (%)</label>
            <p className="text-slate-400 text-[11px]">Triggers parent warning alert when attendance drops below this level.</p>
            <input
              type="number"
              value={attendanceThreshold}
              onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-200">Academic Passing Threshold (%)</label>
            <p className="text-slate-400 text-[11px]">Triggers remedial intervention advisory on test score evaluation.</p>
            <input
              type="number"
              value={marksPassThreshold}
              onChange={(e) => setMarksPassThreshold(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
            />
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <label className="font-bold text-slate-200">Default Pilot Trial Duration (Days)</label>
            <p className="text-slate-400 text-[11px]">Standard evaluation window for new school signups.</p>
            <input
              type="number"
              value={trialDurationDays}
              onChange={(e) => setTrialDurationDays(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
            />
          </div>
        </div>

        <button
          onClick={() => alert('Platform global defaults updated across all 1,248 schools!')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Save Global Configurations</span>
        </button>
      </div>
    </div>
  );
}
