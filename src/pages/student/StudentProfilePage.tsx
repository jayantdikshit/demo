import React, { useState } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { getInitials } from '@/lib/utils';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  ShieldCheck,
  FileText,
  Clock,
  Award,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export function StudentProfilePage() {
  const { schoolConfig, students, attendanceRecords, marksRecords } = useSchoolData();
  const [activeTab, setActiveTab] = useState<'general' | 'guardians' | 'health' | 'documents'>('general');

  // Active student: Aarav Sharma (stu-001)
  const student = students[0] || {
    id: 'stu-001',
    schoolId: schoolConfig.schoolId,
    name: 'Aarav Sharma',
    rollNo: '101',
    classId: 'cls-6',
    className: '6',
    section: 'A',
    dateOfBirth: '2014-06-15',
    gender: 'Male' as const,
    avatar: '',
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98765 43210',
    parentEmail: 'ramesh.sharma@example.com',
    address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, UP - 201309',
    admissionDate: '2022-04-10',
    bloodGroup: 'B+',
    emergencyContact: '+91 98765 43211',
  };

  // Academic metrics for profile badges
  const myAttendance = attendanceRecords.filter((r) => r.studentId === student.id);
  const presentDays = myAttendance.filter((r) => r.status === 'present' || r.status === 'late').length;
  const attendanceRate = myAttendance.length > 0 ? Math.round((presentDays / myAttendance.length) * 100) : 82;

  const myMarks = marksRecords.filter((m) => m.studentId === student.id);
  const averageMarks =
    myMarks.length > 0
      ? Math.round(myMarks.reduce((sum, m) => sum + (m.marksObtained / m.maxMarks) * 100, 0) / myMarks.length)
      : 76;

  // Documents list
  const documents = [
    {
      id: 'doc-1',
      title: 'Birth Certificate',
      type: 'PDF',
      size: '1.2 MB',
      uploadDate: '10 Apr 2022',
      status: 'Verified',
    },
    {
      id: 'doc-2',
      title: 'Transfer Certificate (TC)',
      type: 'PDF',
      size: '840 KB',
      uploadDate: '10 Apr 2022',
      status: 'Verified',
    },
    {
      id: 'doc-3',
      title: 'Aadhaar Card Copy',
      type: 'PDF',
      size: '650 KB',
      uploadDate: '12 Apr 2022',
      status: 'Verified',
    },
    {
      id: 'doc-4',
      title: 'Medical Fitness Certificate',
      type: 'PDF',
      size: '1.1 MB',
      uploadDate: '15 Apr 2022',
      status: 'Verified',
    },
    {
      id: 'doc-5',
      title: 'Previous Term Report Card',
      type: 'PDF',
      size: '2.4 MB',
      uploadDate: '10 May 2024',
      status: 'Active',
    },
  ];

  return (
    <PageWrapper
      title="Student Profile"
      subtitle="Official institutional student record, academic standing, and guardian dossier"
      action={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Print ID Dossier
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => alert(`ID Card exported for ${student.name}`)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
          >
            <Download className="w-4 h-4" />
            Download Digital ID
          </Button>
        </div>
      }
    >
      {/* ── Top Hero Identity Card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/20 blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          {/* Avatar with status indicator */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white text-3xl font-bold flex items-center justify-center shadow-lg shadow-indigo-500/25 border-4 border-card ring-2 ring-primary/20">
              {getInitials(student.name)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 border-2 border-card shadow-sm" title="Active Enrollment">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Core identifiers */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{student.name}</h1>
              <Badge variant="success" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20">
                Active Student
              </Badge>
              <Badge variant="outline" className="text-xs font-mono font-semibold">
                UID: {student.id.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>Class <strong className="text-foreground">{student.className}-{student.section}</strong></span>
              <span>•</span>
              <span>Roll Number: <strong className="text-foreground">#{student.rollNo}</strong></span>
              <span>•</span>
              <span>Academic Year: <strong className="text-foreground">2025-2026</strong></span>
              <span>•</span>
              <span>School: <strong className="text-foreground">{schoolConfig.shortName || schoolConfig.name}</strong></span>
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/60">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Attendance:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  attendanceRate >= 80
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                }`}>
                  {attendanceRate}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Grade Standing:</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  {averageMarks}% (Distinction)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Blood Group:</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  {student.bloodGroup || 'B+'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex border-b border-border/80 gap-2 overflow-x-auto pb-0">
        {[
          { key: 'general', label: 'General Information', icon: User },
          { key: 'guardians', label: 'Parents & Guardians', icon: Heart },
          { key: 'health', label: 'Emergency & Medical', icon: ShieldCheck },
          { key: 'documents', label: 'Institutional Documents', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary/5 rounded-t-lg'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Full Legal Name</span>
                <span className="font-semibold text-foreground text-right">{student.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Date of Birth</span>
                <span className="font-semibold text-foreground text-right">{student.dateOfBirth}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-semibold text-foreground text-right">{student.gender}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Admission Date</span>
                <span className="font-semibold text-foreground text-right">{student.admissionDate}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Nationality</span>
                <span className="font-semibold text-foreground text-right">Indian</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <span className="text-muted-foreground">Residential Address</span>
                <span className="font-medium text-foreground text-right leading-relaxed">{student.address}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                Academic & House Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Class & Section</span>
                <span className="font-semibold text-foreground text-right">Grade {student.className} • Section {student.section}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Assigned Roll No.</span>
                <span className="font-semibold text-foreground text-right">{student.rollNo}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">House Allotment</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 text-right">Prithvi Tigers (Blue House)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Class Teacher</span>
                <span className="font-semibold text-foreground text-right">Dr. Rajesh Iyer (Mathematics)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Curriculum Board</span>
                <span className="font-semibold text-foreground text-right">CBSE Affiliated #2130894</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <span className="text-muted-foreground">Current Academic Standing</span>
                <span className="font-semibold text-emerald-600 text-right">Rank #3 in Class (Exemplary)</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'guardians' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                Primary Guardian (Father)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Guardian Name</span>
                <span className="font-semibold text-foreground text-right">{student.parentName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Relationship</span>
                <span className="font-semibold text-foreground text-right">Father / Primary Contact</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Mobile Phone</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 text-right flex items-center justify-end gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {student.parentPhone}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Email Address</span>
                <span className="font-semibold text-foreground text-right flex items-center justify-end gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {student.parentEmail}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Occupation</span>
                <span className="font-semibold text-foreground text-right">Senior Software Architect</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <span className="text-muted-foreground">SMS Alert Authorization</span>
                <span className="font-semibold text-emerald-600 text-right flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enabled (WhatsApp + SMS)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                Secondary Guardian (Mother)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Guardian Name</span>
                <span className="font-semibold text-foreground text-right">Sunita Sharma</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Relationship</span>
                <span className="font-semibold text-foreground text-right">Mother</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Mobile Phone</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400 text-right flex items-center justify-end gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  +91 98765 88910
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Email Address</span>
                <span className="font-semibold text-foreground text-right flex items-center justify-end gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  sunita.sharma@example.com
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Occupation</span>
                <span className="font-semibold text-foreground text-right">Professor of English Literature</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <span className="text-muted-foreground">Emergency Pickup Clearance</span>
                <span className="font-semibold text-emerald-600 text-right flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Authorized Gate Pass
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <Heart className="w-4 h-4" />
                Medical & Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Blood Group</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 text-right">{student.bloodGroup || 'B+'}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Known Allergies</span>
                <span className="font-semibold text-foreground text-right">None Recorded (Mild Dust)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Chronic Conditions</span>
                <span className="font-semibold text-emerald-600 text-right">None</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Regular Medication</span>
                <span className="font-semibold text-foreground text-right">Not Applicable</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Physical Education Clearance</span>
                <span className="font-semibold text-emerald-600 text-right">Full Fitness Approved</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <span className="text-muted-foreground">Annual Health Checkup</span>
                <span className="font-medium text-muted-foreground text-right">Last done: 14 Aug 2024</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                Emergency Protocols & Campus Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Emergency Contact 1</span>
                <span className="font-semibold text-foreground text-right">{student.emergencyContact} (Father)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Emergency Contact 2</span>
                <span className="font-semibold text-foreground text-right">+91 98765 88910 (Mother)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Preferred Hospital</span>
                <span className="font-semibold text-foreground text-right">Max Multi-Speciality Noida</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/50 text-sm">
                <span className="text-muted-foreground">Student Insurance Policy</span>
                <span className="font-mono text-xs font-semibold text-foreground text-right">EDU-SAFE-982143-IN</span>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  In case of medical emergencies, the school infirmary coordinates immediate first aid followed by emergency dispatch with instant SMS notification to both registered guardians.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Institutional & Identity Documents
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Official digitized documents verified by the School Administration Office
                </p>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Upload New Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/60">
                {documents.map((doc) => (
                  <div key={doc.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.type}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{doc.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>Uploaded {doc.uploadDate}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="success" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {doc.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => alert(`Downloading ${doc.title}...`)}
                        title="Download Document"
                      >
                        <Download className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}
