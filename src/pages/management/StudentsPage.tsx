import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { formatCurrency, getInitials, getGrade, generateId } from '@/lib/utils';
import {
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  Receipt,
  GraduationCap,
  Sparkles,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import type { Student } from '@/types';

export function StudentsPage() {
  const {
    students,
    classes,
    attendanceRecords,
    marksRecords,
    feeTransactions,
    notifications,
    schoolConfig,
  } = useSchoolData();
  
  const { addStudent, removeStudent } = useAppStore();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    classId: '',
    dateOfBirth: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    emergencyContact: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCls = classes.find((c) => c.id === formData.classId);
    if (!selectedCls) return;

    const newStudent: Student = {
      id: generateId(),
      schoolId: schoolConfig.schoolId,
      name: formData.name,
      rollNo: formData.rollNo,
      classId: selectedCls.id,
      className: selectedCls.className,
      section: selectedCls.section,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      parentEmail: formData.parentEmail,
      address: formData.address,
      emergencyContact: formData.emergencyContact,
      admissionDate: new Date().toISOString().split('T')[0],
      avatar: '',
    };

    addStudent(newStudent);
    setIsRegisterOpen(false);
    setActionSuccess(`Student ${newStudent.name} registered successfully!`);
    setTimeout(() => setActionSuccess(null), 3500);
    setFormData({
      name: '', rollNo: '', classId: '', dateOfBirth: '', gender: 'Male', bloodGroup: '',
      parentName: '', parentPhone: '', parentEmail: '', address: '', emergencyContact: '',
    });
  };

  const handleDelete = () => {
    if (!studentToDelete) return;
    removeStudent(studentToDelete.id);
    setActionSuccess(`Student ${studentToDelete.name} deleted permanently.`);
    setTimeout(() => setActionSuccess(null), 3500);
    setStudentToDelete(null);
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
      const matchesSection = selectedSection === 'all' || student.section === selectedSection;
      const matchesSearch =
        searchQuery.trim() === '' ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSection && matchesSearch;
    });
  }, [students, selectedClass, selectedSection, searchQuery]);

  // Helper to compute student metrics
  const getStudentMetrics = (studentId: string) => {
    const attRecords = attendanceRecords.filter((r) => r.studentId === studentId);
    const totalDays = attRecords.length;
    const presentDays = attRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 85;

    const marks = marksRecords.filter((m) => m.studentId === studentId);
    const avgMarks =
      marks.length > 0
        ? Math.round(
            marks.reduce((sum, m) => sum + (m.marksObtained / m.maxMarks) * 100, 0) / marks.length
          )
        : 74;

    const fees = feeTransactions.filter((f) => f.studentId === studentId);
    const hasPending = fees.some((f) => f.status === 'pending' || f.status === 'pending_verification');
    const feeStatus: 'Paid' | 'Pending' | 'Partial' = hasPending ? 'Pending' : 'Paid';

    const isAtRisk = attendanceRate < schoolConfig.attendanceThreshold || avgMarks < schoolConfig.marksThreshold;
    const riskLevel: 'High' | 'Medium' | 'Low' =
      attendanceRate < schoolConfig.attendanceThreshold && avgMarks < schoolConfig.marksThreshold
        ? 'High'
        : isAtRisk
        ? 'Medium'
        : 'Low';

    return {
      attendanceRate,
      avgMarks,
      feeStatus,
      isAtRisk,
      riskLevel,
    };
  };

  return (
    <PageWrapper
      title="Student Directory & Profiles"
      subtitle={`Manage and review ${students.length} enrolled students across classes & streams`}
      action={
        <Button onClick={() => setIsRegisterOpen(true)} className="gap-2 text-xs">
          <GraduationCap size={16} />
          Register New Student
        </Button>
      }
    >
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Class:</span>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Classes</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      Class {c.className}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Section:</span>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Students List ({filteredStudents.length})
            </CardTitle>
            <p className="text-xs text-gray-500">Comprehensive real-time student academic status</p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Attendance %</TableHead>
                <TableHead>Avg Marks</TableHead>
                <TableHead>Fee Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-gray-400 text-sm">
                    No students found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => {
                  const { attendanceRate, avgMarks, feeStatus, riskLevel } = getStudentMetrics(student.id);
                  return (
                    <TableRow key={student.id} className="hover:bg-gray-50/80">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(student.name)}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block text-xs sm:text-sm">
                              {student.name}
                            </span>
                            <span className="text-xs text-gray-500 block">{student.parentName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-gray-600">
                        {student.rollNo}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                          {student.className}-{student.section}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-xs font-bold ${
                            attendanceRate < schoolConfig.attendanceThreshold
                              ? 'text-rose-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {attendanceRate}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-bold text-gray-800">
                          {avgMarks}% ({getGrade(avgMarks)})
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge status={feeStatus === 'Paid' ? 'Verified' : 'Pending'}>
                          {feeStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {riskLevel === 'High' ? (
                          <Badge status="At Risk">High Risk</Badge>
                        ) : riskLevel === 'Medium' ? (
                          <Badge status="Late">Medium Risk</Badge>
                        ) : (
                          <Badge status="Completed">Low</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetailStudent(student)}
                          className="h-8 w-8 p-0"
                          title="View 360 Profile"
                        >
                          <Eye size={15} className="text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStudentToDelete(student)}
                          className="h-8 w-8 p-0 hover:bg-rose-50"
                          title="Delete Student"
                        >
                          <Trash2 size={15} className="text-rose-600" />
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

      {/* Student 360 Detail Modal */}
      {detailStudent && (
        <Modal
          isOpen={Boolean(detailStudent)}
          onClose={() => setDetailStudent(null)}
          title={`${detailStudent.name} — Student Profile`}
          description={`Class ${detailStudent.className}-${detailStudent.section} | Roll No: ${detailStudent.rollNo}`}
          maxWidth="2xl"
          footer={
            <Button variant="outline" size="sm" onClick={() => setDetailStudent(null)}>
              Close Profile
            </Button>
          }
        >
          <div className="space-y-5">
            {/* Header info card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                {getInitials(detailStudent.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-gray-900">{detailStudent.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-600 mt-1 flex-wrap">
                  <span>Parent: <strong>{detailStudent.parentName}</strong></span>
                  <span>•</span>
                  <span>DOB: {detailStudent.dateOfBirth}</span>
                  <span>•</span>
                  <span>Blood Group: {detailStudent.bloodGroup}</span>
                </div>
              </div>
              <Badge status={getStudentMetrics(detailStudent.id).isAtRisk ? 'At Risk' : 'Completed'}>
                {getStudentMetrics(detailStudent.id).isAtRisk ? 'Requires Attention' : 'Active'}
              </Badge>
            </div>

            {/* Metric stat boxes */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <CalendarCheck size={14} className="text-blue-600" />
                  <span>Attendance</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {getStudentMetrics(detailStudent.id).attendanceRate}%
                </p>
                <p className="text-xs text-gray-500">Campus compliance</p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <TrendingUp size={14} className="text-emerald-600" />
                  <span>Academic Average</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {getStudentMetrics(detailStudent.id).avgMarks}%
                </p>
                <p className="text-xs text-gray-500">Term score index</p>
              </div>

              <div className="p-3.5 rounded-xl border border-gray-100 bg-white shadow-xs">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Receipt size={14} className="text-amber-600" />
                  <span>Fee Dues</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {getStudentMetrics(detailStudent.id).feeStatus}
                </p>
                <p className="text-xs text-gray-500">Financial status</p>
              </div>
            </div>

            {/* Subject Marks Breakdown */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-2.5">
                Recent Examination Performance
              </h4>
              <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100 bg-white text-xs">
                {marksRecords
                  .filter((m) => m.studentId === detailStudent.id)
                  .map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between p-3">
                      <div>
                        <span className="font-semibold text-gray-900">Subject: {rec.subjectId}</span>
                        <p className="text-xs text-gray-500">{rec.remarks || 'Standard evaluation'}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">
                          {rec.marksObtained} / {rec.maxMarks}
                        </span>
                        <span className="ml-2 font-semibold text-blue-600">({rec.grade})</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Contact & Parent Information */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 text-xs space-y-2">
              <h4 className="font-bold text-gray-800 uppercase tracking-wider text-xs">
                Emergency & Parent Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-gray-400" />
                  <span>Parent Phone: <strong>{detailStudent.parentPhone}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-gray-400" />
                  <span>Email: {detailStudent.parentEmail}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin size={13} className="text-gray-400 shrink-0" />
                  <span>Address: {detailStudent.address}</span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Register Student Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Student"
        description="Enroll a new student to the institution."
        maxWidth="2xl"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Roll No / Admission No</label>
              <input required type="text" value={formData.rollNo} onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Class & Section</label>
              <select required value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.className} - {c.section}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
              <input required type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
              <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Blood Group</label>
              <input type="text" value={formData.bloodGroup} onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase mb-3">Parent / Guardian Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Parent Name</label>
                <input required type="text" value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Parent Phone</label>
                <input required type="tel" value={formData.parentPhone} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Parent Email</label>
                <input required type="email" value={formData.parentEmail} onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Emergency Contact</label>
                <input required type="tel" value={formData.emergencyContact} onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Address</label>
              <textarea required rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit">Complete Registration</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <Modal
          isOpen={Boolean(studentToDelete)}
          onClose={() => setStudentToDelete(null)}
          title="Delete Student Record"
          description="This action cannot be undone."
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3">
              <AlertTriangle className="text-rose-600 shrink-0" size={24} />
              <div>
                <h4 className="text-sm font-bold text-rose-800">Permanent Deletion</h4>
                <p className="text-xs text-rose-600 mt-1">
                  You are about to delete <strong>{studentToDelete.name}</strong> (Roll: {studentToDelete.rollNo}). This will also permanently remove their attendance, marks, and fee records.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStudentToDelete(null)}>Cancel</Button>
              <Button 
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white border-transparent"
              >
                Yes, Delete Student
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
}
