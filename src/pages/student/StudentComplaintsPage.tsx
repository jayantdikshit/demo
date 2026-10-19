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
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import type { Complaint, ComplaintType } from '@/types';

export function StudentComplaintsPage() {
  const { complaints, subjects, schoolConfig } = useSchoolData();
  const { submitComplaint } = useAppStore();
  const studentId = 'stu-001';

  const [modalOpen, setModalOpen] = useState(false);
  const [complaintType, setComplaintType] = useState<ComplaintType>('wrong_attendance');
  const [incidentDate, setIncidentDate] = useState<string>('2026-09-08');
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [description, setDescription] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Student's complaints
  const myComplaints = useMemo(() => {
    return complaints.filter((c) => c.studentId === studentId);
  }, [complaints, studentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      schoolId: schoolConfig.schoolId,
      studentId,
      type: complaintType,
      subjectId: complaintType !== 'wrong_attendance' ? subjectId : null,
      date: incidentDate,
      description,
      status: 'open',
      resolutionNote: null,
      resolvedBy: null,
      resolvedAt: null,
      createdAt: new Date().toISOString(),
    };

    submitComplaint(newComplaint);
    setModalOpen(false);
    setDescription('');
    setSubmitSuccess('Your grievance ticket has been filed and routed to School Administration.');
    setTimeout(() => setSubmitSuccess(null), 4000);
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
      title="Discrepancies & Grievance Redressal"
      subtitle="Report errors in attendance recordings, exam marks discrepancies, or topic schedule discrepancies"
      action={
        <Button onClick={() => setModalOpen(true)} className="gap-2 text-xs">
          <Plus size={14} />
          <span>File New Ticket</span>
        </Button>
      }
    >
      {/* Toast Alert */}
      {submitSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {/* Overview Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">My Total Tickets</span>
          <p className="text-2xl font-extrabold text-gray-900 mt-1">{myComplaints.length}</p>
          <span className="text-[11px] text-gray-400">All submitted grievances</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">Open</span>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">
            {myComplaints.filter((c) => c.status === 'open').length}
          </p>
          <span className="text-[11px] text-rose-600 font-medium">Pending initial review</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">Under Review</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">
            {myComplaints.filter((c) => c.status === 'under_review').length}
          </p>
          <span className="text-[11px] text-gray-400">Teacher verification in progress</span>
        </Card>

        <Card className="p-4 bg-white">
          <span className="text-xs font-semibold text-gray-500 uppercase">Resolved</span>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">
            {myComplaints.filter((c) => c.status === 'resolved').length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Records adjusted</span>
        </Card>
      </div>

      {/* Complaints Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            My Grievance History ({myComplaints.length})
          </CardTitle>
          <p className="text-xs text-gray-500">Track resolution feedback and administrative corrections</p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident Date</TableHead>
                <TableHead>Issue Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Administrative Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                    You have no filed grievances. Click &ldquo;File New Ticket&rdquo; to report an issue.
                  </TableCell>
                </TableRow>
              ) : (
                myComplaints.map((c) => (
                  <TableRow key={c.id} className="hover:bg-gray-50/80">
                    <TableCell className="text-xs font-semibold text-gray-700">
                      {formatDate(c.date)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                        {c.type.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-700 max-w-sm">
                      {c.description}
                    </TableCell>
                    <TableCell>
                      <Badge status={getStatusBadge(c.status)}>
                        {c.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs text-gray-600 italic">
                      {c.resolutionNote || 'Pending administrative feedback'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* File Complaint Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="File Grievance or Correction Ticket"
          description="Submit a request for attendance correction, exam re-verification, or syllabus updates"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmit}>
                Submit Grievance
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-800 block mb-1">Discrepancy Category:</label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value as ComplaintType)}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="wrong_attendance">Incorrect Attendance Log (Marked absent when present)</option>
                <option value="wrong_marks">Exam Marks Discrepancy (Totaling or evaluation issue)</option>
                <option value="incorrect_topic">Syllabus Topic Status Discrepancy</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-800 block mb-1">Date of Occurrence:</label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {complaintType !== 'wrong_attendance' && (
                <div>
                  <label className="font-bold text-gray-800 block mb-1">Related Subject:</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 p-2 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="font-bold text-gray-800 block mb-1">Detailed Explanation:</label>
              <textarea
                rows={3}
                required
                placeholder="Explain the discrepancy clearly (e.g., 'I was present in Period 1 and submitted homework, but attendance shows absent')..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </form>
        </Modal>
      )}
    </PageWrapper>
  );
}
