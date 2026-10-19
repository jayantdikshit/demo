import React, { useState } from 'react';
import type { SuperUserRecord } from '@/types/superAdmin';
import {
  Users,
  Search,
  UserPlus,
  Shield,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Lock,
  Key,
  CheckCircle2,
  XCircle,
  Building,
} from 'lucide-react';

const mockGlobalUsers: SuperUserRecord[] = [
  { id: 'usr-001', name: 'Rahul Sharma', email: 'rahul.superadmin@edupulse.com', role: 'Super Admin', schoolName: 'Platform Central', schoolId: 'platform', status: 'Active', lastLogin: '2 mins ago', phone: '+91 98765 00000' },
  { id: 'usr-002', name: 'Dr. Rajesh Sharma', email: 'admin@vidyapublic.edu.in', role: 'School Admin', schoolName: 'Vidya Public School', schoolId: 'sch-vps', status: 'Active', lastLogin: '12 mins ago', phone: '+91 98765 43210' },
  { id: 'usr-003', name: 'Mrs. Sunita Verma', email: 'principal@sunriseacademy.edu.in', role: 'Principal', schoolName: 'Sunrise Academy', schoolId: 'sch-sra', status: 'Active', lastLogin: '45 mins ago', phone: '+91 98123 45678' },
  { id: 'usr-004', name: 'Ramesh Kumar', email: 'ramesh.t@vidyapublic.edu.in', role: 'Teacher', schoolName: 'Vidya Public School', schoolId: 'sch-vps', status: 'Active', lastLogin: '1 hour ago', phone: '+91 99112 23344' },
  { id: 'usr-005', name: 'Aarav Patel', email: 'aarav.student@abcschool.org', role: 'Student', schoolName: 'ABC International School', schoolId: 'sch-abc', status: 'Active', lastLogin: '3 hours ago', phone: '+91 97788 11223' },
  { id: 'usr-006', name: 'Sanjay Patel', email: 'sanjay.parent@abcschool.org', role: 'Parent', schoolName: 'ABC International School', schoolId: 'sch-abc', status: 'Active', lastLogin: 'Yesterday', phone: '+91 97788 99887' },
  { id: 'usr-007', name: 'Anita Roy', email: 'accounts@modernacademy.edu.in', role: 'Accounts', schoolName: 'Modern Education Academy', schoolId: 'sch-mda', status: 'Disabled', lastLogin: '14 days ago', phone: '+91 98444 33221' },
];

export function GlobalUserManagementView() {
  const [usersList, setUsersList] = useState<SuperUserRecord[]>(mockGlobalUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.schoolName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'Active' ? 'Disabled' : 'Active' } : u))
    );
  };

  const handleResetAccess = (email: string) => {
    alert(`Password reset token link sent to ${email} with multi-tenant verification token.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Global User Governance & Multi-Tenant RBAC</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Manage users across 1,248 schools. Enforce Role-Based Access Control (RBAC) and least-privilege access rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting all 84,620 platform users schema to CSV...')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => alert('Launching bulk CSV/Excel User Import Wizard...')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Bulk Import</span>
          </button>
          <button
            onClick={() => alert('Launching Create User Modal')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-900/40 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User</span>
          </button>
        </div>
      </div>

      {/* RBAC Role Architecture Box */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-4 text-xs grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div className="font-bold text-blue-400">Super Admin</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Platform SaaS Scope</div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div className="font-bold text-indigo-400">School Admin</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tenant Admin Scope</div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div className="font-bold text-purple-400">Principal</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Academic Scope</div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div className="font-bold text-emerald-400">Teacher</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Execution Scope</div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div className="font-bold text-amber-400">Student / Parent</div>
          <div className="text-[10px] text-slate-500 mt-0.5">View & Pay Scope</div>
        </div>
        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
          <div className="font-bold text-rose-400">Accounts</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Financial Ledger</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by user name, email, school..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span>Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-slate-900">All Roles</option>
            <option value="Super Admin" className="bg-slate-900">Super Admin</option>
            <option value="School Admin" className="bg-slate-900">School Admin</option>
            <option value="Principal" className="bg-slate-900">Principal</option>
            <option value="Teacher" className="bg-slate-900">Teacher</option>
            <option value="Student" className="bg-slate-900">Student</option>
            <option value="Parent" className="bg-slate-900">Parent</option>
            <option value="Accounts" className="bg-slate-900">Accounts</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">User Details</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Assigned School</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Last Active</th>
                <th className="pb-3 text-right">Security Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-white">
                    <div>{usr.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{usr.email} • {usr.phone}</div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-semibold">
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300 font-medium">{usr.schoolName}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        usr.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {usr.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 text-[11px]">{usr.lastLogin}</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResetAccess(usr.email)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition cursor-pointer flex items-center gap-1"
                      >
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>Reset Access</span>
                      </button>
                      <button
                        onClick={() => toggleUserStatus(usr.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                          usr.status === 'Active'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {usr.status === 'Active' ? 'Disable' : 'Activate'}
                      </button>
                    </div>
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
