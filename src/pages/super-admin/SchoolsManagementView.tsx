import React, { useState } from 'react';
import { useSuperAdminStore } from '@/store/useSuperAdminStore';
import type { SuperSchoolItem, SchoolStatus, PlanTier } from '@/types/superAdmin';
import {
  School,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Settings,
  Eye,
  Sliders,
  RefreshCw,
  TrendingUp,
  GraduationCap,
  Users,
  Calendar,
  Sparkles,
  Lock,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SchoolsManagementView() {
  const {
    schools,
    selectedSchool,
    setSelectedSchool,
    updateSchoolStatus,
    updateSchoolPlan,
    toggleSchoolFeatureFlag,
    createSchool,
  } = useSuperAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFlagsModalOpen, setIsFlagsModalOpen] = useState(false);
  const [editingFlagsSchool, setEditingFlagsSchool] = useState<SuperSchoolItem | null>(null);

  // New school form state
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolSlug, setNewSchoolSlug] = useState('');
  const [newSchoolLocation, setNewSchoolLocation] = useState('');
  const [newSchoolPlan, setNewSchoolPlan] = useState<PlanTier>('Growth');

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesPlan = planFilter === 'All' || s.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName) return;
    createSchool({
      name: newSchoolName,
      slug: newSchoolSlug || newSchoolName.toLowerCase().replace(/\s+/g, '-'),
      location: newSchoolLocation || 'India',
      plan: newSchoolPlan,
    });
    setNewSchoolName('');
    setNewSchoolSlug('');
    setNewSchoolLocation('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <School className="w-5 h-5 text-blue-400" />
            <span>School Management & Tenant Provisioning</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Super Admin multi-tenant governance — Provision, suspend, upgrade plans, and audit administrative actions.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/40 transition cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create / Provision School</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search school name, slug, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All</option>
              <option value="Active" className="bg-slate-900">Active</option>
              <option value="Trial" className="bg-slate-900">Trial</option>
              <option value="At Risk" className="bg-slate-900">At Risk</option>
              <option value="Suspended" className="bg-slate-900">Suspended</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <span>Plan:</span>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All</option>
              <option value="Starter" className="bg-slate-900">Starter</option>
              <option value="Growth" className="bg-slate-900">Growth</option>
              <option value="Enterprise" className="bg-slate-900">Enterprise</option>
            </select>
          </div>
        </div>
      </div>

      {/* School Master Table (Section 3) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">School Details</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Students / Teachers</th>
                <th className="pb-3">Plan Tier</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Health</th>
                <th className="pb-3">Created / Last Active</th>
                <th className="pb-3 text-right">Super Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSchools.map((sch) => (
                <tr key={sch.schoolId} className="hover:bg-slate-800/40 transition">
                  {/* School Name & ID */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center text-blue-400 font-bold border border-slate-700 text-sm">
                        {sch.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{sch.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <span>ID: {sch.schoolId}</span>
                          <span>•</span>
                          <span className="text-blue-400">{sch.slug}.edupulse.com</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-4 text-slate-300">{sch.location}</td>

                  {/* Students & Teachers */}
                  <td className="py-4">
                    <div className="font-semibold text-slate-200">{sch.studentsCount.toLocaleString()} Students</div>
                    <div className="text-[10px] text-slate-500">{sch.teachersCount} Teachers</div>
                  </td>

                  {/* Plan */}
                  <td className="py-4">
                    <select
                      value={sch.plan}
                      onChange={(e) => updateSchoolPlan(sch.schoolId, e.target.value as PlanTier)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Starter" className="bg-slate-900">Starter</option>
                      <option value="Growth" className="bg-slate-900">Growth</option>
                      <option value="Enterprise" className="bg-slate-900">Enterprise</option>
                    </select>
                  </td>

                  {/* Status */}
                  <td className="py-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        sch.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : sch.status === 'Trial'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : sch.status === 'At Risk'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {sch.status}
                    </span>
                  </td>

                  {/* Health */}
                  <td className="py-4">
                    <span className="text-xs font-medium">
                      {sch.health === 'Healthy' ? '🟢 Healthy' : sch.health === 'At Risk' ? '🟠 At Risk' : '🔴 Critical'}
                    </span>
                  </td>

                  {/* Dates */}
                  <td className="py-4">
                    <div className="text-slate-300">{sch.createdDate}</div>
                    <div className="text-[10px] text-slate-500">Active: {sch.lastActivity}</div>
                  </td>

                  {/* Super Admin Control Actions */}
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedSchool(sch)}
                        title="View Complete School Overview"
                        className="p-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold px-2.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Overview</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingFlagsSchool(sch);
                          setIsFlagsModalOpen(true);
                        }}
                        title="Configure Feature Flags"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>

                      {/* State Toggle Dropdown */}
                      <select
                        value={sch.status}
                        onChange={(e) => updateSchoolStatus(sch.schoolId, e.target.value as SchoolStatus)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 focus:outline-none cursor-pointer"
                      >
                        <option value="Active" className="bg-slate-900">Activate</option>
                        <option value="Trial" className="bg-slate-900">Trial</option>
                        <option value="At Risk" className="bg-slate-900">At Risk</option>
                        <option value="Suspended" className="bg-slate-900">Suspend</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4: DEEP SCHOOL OVERVIEW MODAL */}
      {selectedSchool && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {selectedSchool.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedSchool.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {selectedSchool.schoolId} • Domain: {selectedSchool.slug}.edupulse.com
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Demographic Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-slate-400 text-[11px]">Students</div>
                <div className="text-lg font-bold text-white">{selectedSchool.studentsCount.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-slate-400 text-[11px]">Teachers</div>
                <div className="text-lg font-bold text-white">{selectedSchool.teachersCount}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-slate-400 text-[11px]">Parents</div>
                <div className="text-lg font-bold text-white">{selectedSchool.parentsCount.toLocaleString()}</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                <div className="text-slate-400 text-[11px]">Active Users</div>
                <div className="text-lg font-bold text-emerald-400">{selectedSchool.activeUsersCount}</div>
              </div>
            </div>

            {/* Academic Health Ratios & Progress Bars (Prompt Section 4) */}
            <div className="space-y-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5">
              <h4 className="font-bold text-white text-sm flex items-center justify-between">
                <span>Academic & Operations Health Matrix</span>
                <span className="text-xs font-semibold text-emerald-400">
                  Overall Health: {selectedSchool.health === 'Healthy' ? '🟢 Healthy' : '🟠 At Risk'}
                </span>
              </h4>

              {/* Progress 1: Syllabus */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Syllabus Completion Rate</span>
                  <span className="font-bold text-white">{selectedSchool.syllabusProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${selectedSchool.syllabusProgress}%` }}
                  />
                </div>
              </div>

              {/* Progress 2: Attendance */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Student Attendance Rate</span>
                  <span className="font-bold text-white">{selectedSchool.attendanceRate}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${selectedSchool.attendanceRate}%` }}
                  />
                </div>
              </div>

              {/* Progress 3: Data Completion */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Data Completion Index</span>
                  <span className="font-bold text-white">{selectedSchool.dataCompletion}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-purple-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${selectedSchool.dataCompletion}%` }}
                  />
                </div>
              </div>

              {/* Action Closure Rate */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Action Closure Rate</span>
                  <span className="font-bold text-white">81%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-2.5 rounded-full transition-all" style={{ width: '81%' }} />
                </div>
              </div>
            </div>

            {/* Workflow Continuous Tracker */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs space-y-2">
              <div className="font-bold text-indigo-300">Source Continuous Operational Workflow Tracker:</div>
              <div className="flex flex-wrap items-center gap-2 text-slate-300 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Plan</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Execution</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Assessment</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Deviation</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Action</span>
                <span>→</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Follow-up</span>
              </div>
            </div>

            {/* Footer Admin Impersonate Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Open Alerts: <strong className="text-white">{selectedSchool.openAlertsCount}</strong> | Open Actions:{' '}
                <strong className="text-white">{selectedSchool.openActionsCount}</strong>
              </div>
              <button
                onClick={() => {
                  alert(
                    `Bypassing tenant view for ${selectedSchool.name} with Audit Logging enabled... Redirecting to school portal.`
                  );
                  window.location.href = `/school/${selectedSchool.slug}/management/dashboard`;
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Impersonate School Admin (Audited)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SCHOOL MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Provision New School Tenant</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400">School Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Xavier High School"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. st-xavier"
                  value={newSchoolSlug}
                  onChange={(e) => setNewSchoolSlug(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Pune, Maharashtra"
                  value={newSchoolLocation}
                  onChange={(e) => setNewSchoolLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>
              <div>
                <label className="text-slate-400">Initial Subscription Plan</label>
                <select
                  value={newSchoolPlan}
                  onChange={(e) => setNewSchoolPlan(e.target.value as PlanTier)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 mt-1"
                >
                  <option value="Starter">Starter (₹15,000/yr)</option>
                  <option value="Growth">Growth (₹45,000/yr)</option>
                  <option value="Enterprise">Enterprise (₹1,20,000/yr)</option>
                </select>
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer"
              >
                Provision School
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FEATURE FLAGS MODAL */}
      {isFlagsModalOpen && editingFlagsSchool && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Feature Flags: {editingFlagsSchool.name}</h3>
              <button
                onClick={() => setIsFlagsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs">
              {Object.entries(editingFlagsSchool.featureFlags).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <span className="font-semibold text-slate-200 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <button
                    onClick={() => toggleSchoolFeatureFlag(editingFlagsSchool.schoolId, key as any)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                      val
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {val ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsFlagsModalOpen(false)}
              className="w-full py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs cursor-pointer mt-4"
            >
              Done & Save Configuration
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
