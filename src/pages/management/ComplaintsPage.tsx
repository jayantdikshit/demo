import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge, type BadgeStatus } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { formatDate } from '@/lib/utils';
import {
  FileWarning,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import type { Complaint } from '@/types';

export function ComplaintsPage() {
  const { students, complaints } = useSchoolData();
  const { updateComplaintStatus } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'under_review' | 'resolved' | 'rejected'>('all');
  const [activeComplaint, setActiveComplaint] = useState<Complaint | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [newStatus, setNewStatus] = useState<Complaint['status']>('resolved');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => statusFilter === 'all' || c.status === statusFilter);
  }, [complaints, statusFilter]);

  const openCount = complaints.filter((c) => c.status === 'open').length;
  const underReviewCount = complaints.filter((c) => c.status === 'under_review').length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;

  const handleUpdateStatus = () => {
    if (!activeComplaint) return;
    updateComplaintStatus(activeComplaint.id, newStatus, resolutionNote);
    setActionSuccess(`Complaint #${activeComplaint.id} marked as ${newStatus.toUpperCase()}`);
    setActiveComplaint(null);
    setResolutionNote('');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const getStatusBadge = (status: Complaint['status']): BadgeStatus => {
    switch (status) {
      case 'resolved':
        return 'Completed';
      case 'open':
        return 'At Risk';
      case 'under_review':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <PageWrapper
      title="Complaints, Corrections & Redressal"
      subtitle="Manage student discrepancy tickets regarding attendance logs, exam mark discrepancies, or topic recordings"
    >
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Tickets</span>
            <FileWarning size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">{complaints.length}</p>
          <span className="text-[11px] text-gray-400">All recorded grievances</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Open / New</span>
            <AlertCircle size={18} className="text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">{openCount}</p>
          <span className="text-[11px] text-rose-500 font-medium">Awaiting administrator action</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Under Review</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">{underReviewCount}</p>
          <span className="text-[11px] text-gray-400">Verifying with class teacher</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Resolved</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Closed & corrected</span>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Grievances ({complaints.length})</option>
              <option value="open">Open ({openCount})</option>
              <option value="under_review">Under Review ({underReviewCount})</option>
              <option value="resolved">Resolved ({resolvedCount})</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <span className="text-xs text-gray-400">Click any row to resolve or update status</span>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            Student Grievance Tickets ({filteredComplaints.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Issue Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Filed Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    No complaints found in this view.
                  </TableCell>
                </TableRow>
              ) : (
                filteredComplaints.map((c) => {
                  const student = students.find((s) => s.id === c.studentId);
                  return (
                    <TableRow key={c.id} className="hover:bg-gray-50/80">
                      <TableCell>
                        <span className="font-bold text-gray-900 text-xs block">
                          {student?.name || 'Student'}
                        </span>
                        <span className="text-[10px] text-gray-400 block">
                          {student ? `Class ${student.className}-${student.section}` : ''}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800 capitalize">
                          {c.type.replace('_', ' ')}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 max-w-xs truncate">
                        {c.description}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">{formatDate(c.date)}</TableCell>
                      <TableCell>
                        <Badge status={getStatusBadge(c.status)}>
                          {c.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveComplaint(c);
                            setNewStatus(c.status === 'open' ? 'under_review' : 'resolved');
                            setResolutionNote(c.resolutionNote || '');
                          }}
                          className="h-8 text-xs gap-1.5"
                        >
                          <Eye size={13} />
                          <span>Review & Act</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Complaint Resolution Modal */}
      {activeComplaint && (
        <Modal
          isOpen={Boolean(activeComplaint)}
          onClose={() => setActiveComplaint(null)}
          title={`Grievance Ticket #${activeComplaint.id}`}
          description={`Filed by ${students.find((s) => s.id === activeComplaint.studentId)?.name || 'Student'}`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setActiveComplaint(null)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpdateStatus}>
                Update Grievance Status
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-gray-800 uppercase tracking-wider text-[10px] block mb-1">
                Student&rsquo;s Explanation:
              </span>
              <p className="text-gray-700 leading-relaxed italic">
                &ldquo;{activeComplaint.description}&rdquo;
              </p>
              <p className="text-[10px] text-gray-400 mt-2">Category: {activeComplaint.type.replace('_', ' ')}</p>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1.5">Update Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved (Correct Record)</option>
                <option value="rejected">Rejected (Invalid Request)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1.5">Resolution / Investigation Note:</label>
              <textarea
                rows={3}
                placeholder="Enter corrective action details or explanation..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
}
