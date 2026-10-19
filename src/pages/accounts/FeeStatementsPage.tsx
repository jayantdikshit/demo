import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  FileText,
  Search,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  IndianRupee,
  School,
  QrCode,
  ShieldCheck,
  ChevronDown,
  User,
  Users,
} from 'lucide-react';
import type { Student, FeeTransaction } from '@/types';

export function FeeStatementsPage() {
  const { schoolConfig, students, feeTransactions, classes } = useSchoolData();

  const [searchStudent, setSearchStudent] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-001');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'student_statement' | 'class_report'>('student_statement');
  const [printModalOpen, setPrintModalOpen] = useState(false);

  // Selected Student
  const activeStudent = students.find((s) => s.id === selectedStudentId) || students[0] || {
    id: 'stu-001',
    name: 'Aarav Sharma',
    rollNo: '101',
    className: '6',
    section: 'A',
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98765 43210',
    admissionDate: '2022-04-10',
    address: 'Flat 402, Green Valley Apartments, Sector 62, Noida, UP',
  };

  // Student transactions
  const studentTransactions = feeTransactions.filter((tx) => tx.studentId === activeStudent.id);
  const totalPaid = studentTransactions
    .filter((tx) => tx.status === 'verified')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalPending = studentTransactions
    .filter((tx) => tx.status === 'pending' || tx.status === 'pending_verification')
    .reduce((sum, tx) => sum + tx.amount, 0) || 15000;
  const totalDemand = totalPaid + totalPending;

  // Class-wise collection metrics for Task 6.3
  const classCollectionSummary = useMemo(() => {
    return [
      { classNumber: '6', totalStudents: 42, totalDemand: 42 * 45000, collected: 1420000, pending: 470000, rate: 75.1 },
      { classNumber: '7', totalStudents: 38, totalDemand: 38 * 48000, collected: 1350000, pending: 474000, rate: 74.0 },
      { classNumber: '8', totalStudents: 40, totalDemand: 40 * 50000, collected: 1680000, pending: 320000, rate: 84.0 },
      { classNumber: '9', totalStudents: 36, totalDemand: 36 * 55000, collected: 1540000, pending: 440000, rate: 77.8 },
      { classNumber: '10', totalStudents: 45, totalDemand: 45 * 60000, collected: 2350000, pending: 350000, rate: 87.0 },
    ];
  }, []);

  // Filter student dropdown search
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.rollNo.includes(searchStudent) ||
      s.className.includes(searchStudent)
  );

  return (
    <PageWrapper
      title="Fee Statements & Collection Reports"
      subtitle="Audit-ready student financial ledgers, fee demand notices, and class-wise collection performance"
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPrintModalOpen(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <Printer className="w-4 h-4" />
            Download / Print Statement
          </Button>
        </div>
      }
    >
      {/* ── View Switcher Bar ── */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('student_statement')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'student_statement'
                ? 'bg-foreground text-background shadow-xs'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Student-Wise Ledger
          </button>
          <button
            onClick={() => setActiveTab('class_report')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'class_report'
                ? 'bg-foreground text-background shadow-xs'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Class-Wise Collection Report
          </button>
        </div>

        {activeTab === 'student_statement' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">Active Student:</span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search student..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background focus:outline-none w-44"
              />
              {searchStudent && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto p-1">
                  {filteredStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        setSearchStudent('');
                      }}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-muted/60 transition-colors"
                    >
                      <div className="font-semibold text-foreground">{s.name}</div>
                      <div className="text-[10px] text-muted-foreground">Class {s.className}-{s.section} • #{s.rollNo}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── TAB 1: STUDENT STATEMENT ── */}
      {activeTab === 'student_statement' && (
        <div className="space-y-6">
          {/* Student Dossier Strip */}
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xl font-bold flex items-center justify-center shadow-md">
                  {activeStudent.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{activeStudent.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      Class {activeStudent.className}-{activeStudent.section}
                    </Badge>
                    <Badge variant="outline" className="text-xs font-mono">
                      Roll #{activeStudent.rollNo}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Parent: {activeStudent.parentName} ({activeStudent.parentPhone}) • Admission ID: {activeStudent.id.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Financial Balance Counters */}
              <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-border/80 pt-3 md:pt-0 md:pl-6">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Total Demand</span>
                  <div className="text-base font-bold text-foreground">{formatCurrency(totalDemand)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Verified Paid</span>
                  <div className="text-base font-bold text-emerald-600">{formatCurrency(totalPaid)}</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase">Balance Due</span>
                  <div className="text-base font-bold text-rose-600">{formatCurrency(totalPending)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statement Breakdown Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Term-by-Term Financial Ledger
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Chronological record of invoices, online payments, and balance confirmations
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPrintModalOpen(true)}
                className="text-xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Generate Official Bill</span>
              </Button>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-3">Term / Particulars</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Payment Method</th>
                      <th className="py-2.5 px-3">Reference / UTR</th>
                      <th className="py-2.5 px-3 text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {/* Term 1 */}
                    <tr className="hover:bg-muted/30">
                      <td className="py-3 px-3 font-semibold text-foreground">
                        Term 1 — Tuition, Lab & Activities
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">15-Apr-2025</td>
                      <td className="py-3 px-3 font-bold text-foreground">₹30,000</td>
                      <td className="py-3 px-3">
                        <Badge variant="success" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px]">
                          Settled & Verified ✅
                        </Badge>
                      </td>
                      <td className="py-3 px-3 uppercase font-mono">NetBanking HDFC</td>
                      <td className="py-3 px-3 font-mono text-blue-600 font-semibold">HDFC-29481902</td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPrintModalOpen(true)}
                          className="h-7 text-xs text-blue-600 hover:text-blue-700"
                        >
                          Receipt #1082
                        </Button>
                      </td>
                    </tr>

                    {/* Term 2 */}
                    <tr className="hover:bg-muted/30">
                      <td className="py-3 px-3 font-semibold text-foreground">
                        Term 2 — Mid-Term Tuition & Computer Facility
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">15-Aug-2025</td>
                      <td className="py-3 px-3 font-bold text-foreground">₹15,000</td>
                      <td className="py-3 px-3">
                        {studentTransactions.some((t) => t.status === 'verified') ? (
                          <Badge variant="success" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px]">
                            Verified ✅
                          </Badge>
                        ) : studentTransactions.some((t) => t.status === 'pending_verification') ? (
                          <Badge variant="warning" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]">
                            Awaiting Verification ⏳
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">
                            Overdue 🔴
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 uppercase font-mono">UPI / PhonePe</td>
                      <td className="py-3 px-3 font-mono text-blue-600 font-semibold">UPI-98214371</td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPrintModalOpen(true)}
                          className="h-7 text-xs text-blue-600 hover:text-blue-700"
                        >
                          Invoice #2041
                        </Button>
                      </td>
                    </tr>

                    {/* Term 3 */}
                    <tr className="hover:bg-muted/30">
                      <td className="py-3 px-3 font-semibold text-foreground">
                        Term 3 — Annual Assessment & Transport Fee
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">15-Dec-2025</td>
                      <td className="py-3 px-3 font-bold text-foreground">₹18,000</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="text-[10px]">
                          Upcoming Schedule
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground font-mono">—</td>
                      <td className="py-3 px-3 text-muted-foreground font-mono">—</td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-muted-foreground text-[10px]">Pending</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── TAB 2: CLASS-WISE COLLECTION REPORT (6.3 Task) ── */}
      {activeTab === 'class_report' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-500" />
                  Institutional Class Collection Performance Report
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Consolidated fee collection metrics, realization rates, and pending recovery targets
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </Button>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/60">
                    <tr>
                      <th className="py-3 px-4">Class</th>
                      <th className="py-3 px-4">Enrolled Students</th>
                      <th className="py-3 px-4">Total Demand</th>
                      <th className="py-3 px-4">Total Collected</th>
                      <th className="py-3 px-4">Total Pending</th>
                      <th className="py-3 px-4">Realization %</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {classCollectionSummary.map((cls) => (
                      <tr key={cls.classNumber} className="hover:bg-muted/30">
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          Grade {cls.classNumber}
                        </td>
                        <td className="py-3.5 px-4">{cls.totalStudents} students</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                          {formatCurrency(cls.totalDemand)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                          {formatCurrency(cls.collected)}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                          {formatCurrency(cls.pending)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{cls.rate}%</span>
                            <div className="w-20 bg-muted rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-600 h-1.5 rounded-full"
                                style={{ width: `${cls.rate}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert(`Class ${cls.classNumber} detailed fee register exported!`)}
                            className="h-7 text-xs"
                          >
                            Export Register
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── OFFICIAL PRINTABLE STATEMENT MODAL (Task 6.3) ── */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 my-8">
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3 print:hidden">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Printer className="w-4 h-4 text-blue-600" />
                <span>Official Institutional Fee Statement & Tax Invoice</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => window.print()}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Print / Save PDF
                </Button>
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Printable Statement Layout */}
            <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-6 md:p-8 space-y-6 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-900 text-white text-2xl font-bold flex items-center justify-center">
                    {schoolConfig.logo || '🏫'}
                  </div>
                  <div>
                    <h1 className="text-xl font-black uppercase tracking-wide">{schoolConfig.name}</h1>
                    <p className="text-xs text-neutral-500">{schoolConfig.address || 'Knowledge Park, Noida, UP - 201309'}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">CBSE Affiliation #2130894 • School Code: 89410</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold uppercase text-neutral-500">Official Fee Receipt</span>
                  <div className="text-base font-mono font-bold text-neutral-900 dark:text-white">REC-2026-9812</div>
                  <div className="text-xs text-neutral-500 mt-1">Date: 09-Sep-2026</div>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Student Name</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{activeStudent.name}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Class & Section</span>
                  <span className="font-bold">{activeStudent.className}-{activeStudent.section}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Roll Number</span>
                  <span className="font-bold font-mono">#{activeStudent.rollNo}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Guardian Name</span>
                  <span className="font-bold">{activeStudent.parentName}</span>
                </div>
              </div>

              {/* Fee Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="border-b border-neutral-300 dark:border-neutral-700 text-neutral-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2">Fee Head / Description</th>
                      <th className="py-2">Term</th>
                      <th className="py-2 text-right">Amount (INR)</th>
                      <th className="py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    <tr>
                      <td className="py-2 font-semibold">Tuition & Instructional Charges</td>
                      <td className="py-2">Term 1 (2025-26)</td>
                      <td className="py-2 text-right font-mono">₹25,000</td>
                      <td className="py-2 text-right font-bold text-emerald-600">PAID</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Laboratory & Computer Science Facility</td>
                      <td className="py-2">Term 1 (2025-26)</td>
                      <td className="py-2 text-right font-mono">₹5,000</td>
                      <td className="py-2 text-right font-bold text-emerald-600">PAID</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">Term 2 Tuition Installment</td>
                      <td className="py-2">Term 2 (2025-26)</td>
                      <td className="py-2 text-right font-mono">₹15,000</td>
                      <td className="py-2 text-right font-bold text-amber-600">VERIFIED</td>
                    </tr>
                  </tbody>
                  <tfoot className="border-t-2 border-neutral-800 font-bold">
                    <tr>
                      <td colSpan={2} className="py-3 text-right">TOTAL REALIZED AMOUNT:</td>
                      <td className="py-3 text-right font-mono text-base font-black text-emerald-600">₹45,000</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures & Seal */}
              <div className="flex items-end justify-between pt-8 border-t border-neutral-300 dark:border-neutral-700 text-xs">
                <div className="space-y-1">
                  <div className="font-mono text-[10px] text-neutral-400">AUTHENTICATED DIGITAL RECEIPT</div>
                  <div className="text-[10px] text-neutral-500">Authorized by EduPulse Central Fee Clearance System</div>
                </div>
                <div className="text-right space-y-1">
                  <div className="w-32 border-b border-neutral-800 dark:border-neutral-400 mb-1 mx-auto" />
                  <div className="font-bold text-neutral-800 dark:text-neutral-200">Accounts Officer</div>
                  <div className="text-[10px] text-neutral-500">Vidya Public School</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
