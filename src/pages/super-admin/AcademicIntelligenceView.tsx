import React from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import { GraduationCap, ShieldAlert, AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export function AcademicIntelligenceView() {
  const { academicTrends } = useSuperAdminStore();

  const colors = ['#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-purple-400" />
          <span>Academic Intelligence — All Schools Overview</span>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">
          Platform-level academic trends, syllabus delays, attendance warnings, and deviation context monitoring.
        </p>
      </div>

      {/* MANDATORY HUMAN-IN-THE-LOOP SAFEGUARD BANNER (Section 10) */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <div className="font-bold text-white text-sm">
              Critical Architecture Principle: Evidence-Based Human Review Safeguard
            </div>
            <p className="text-slate-300 leading-relaxed">
              System alerts <strong>never automatically declare any teacher or school as a "problem"</strong>. The system provides objective deviation evidence and context. All administrative interventions require human review, contextual investigation, and follow-up before action is taken.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Deviation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Syllabus Delay Risk</div>
          <div className="text-2xl font-black text-amber-400 mt-2">86 Schools</div>
          <div className="text-[11px] text-slate-500 mt-1 font-semibold">42% of total platform issues</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Attendance Risk (&lt;75%)</div>
          <div className="text-2xl font-black text-rose-400 mt-2">42 Schools</div>
          <div className="text-[11px] text-slate-500 mt-1 font-semibold">27% of total platform issues</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Low Data Completeness</div>
          <div className="text-2xl font-black text-purple-400 mt-2">31 Schools</div>
          <div className="text-[11px] text-slate-500 mt-1 font-semibold">18% of total platform issues</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="text-slate-400 text-xs font-medium">Open Management Actions</div>
          <div className="text-2xl font-black text-blue-400 mt-2">174 Actions</div>
          <div className="text-[11px] text-rose-400 font-semibold mt-1">47 Overdue for Follow-up</div>
        </div>
      </div>

      {/* Top Academic Issues Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold text-white text-base mb-4">Cross-School Academic Issues Matrix</h3>
          <div className="space-y-4">
            {academicTrends.map((trd, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{trd.issue}</span>
                  <span className="font-mono text-slate-400">{trd.affectedSchoolsCount} Schools Affected ({trd.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all"
                    style={{ width: `${trd.percentage}%`, backgroundColor: colors[i % colors.length] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Pie Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-4">Issue Share %</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={academicTrends}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="percentage"
                    nameKey="issue"
                  >
                    {academicTrends.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
