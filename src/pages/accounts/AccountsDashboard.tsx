import React, { useState } from 'react';
import { useSchoolNavigate } from '@/hooks/useSchoolNavigate';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  IndianRupee,
  CheckSquare,
  AlertCircle,
  TrendingUp,
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  Mail,
  Send,
  MessageSquare,
  Smartphone,
  Sparkles,
  ArrowRight,
  Printer,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import type { FeeTransaction } from '@/types';

export function AccountsDashboard() {
  const navigate = useSchoolNavigate();
  const { schoolConfig, feeTransactions, students } = useSchoolData();
  const { verifyPayment } = useAppStore();

  const [selectedProofTx, setSelectedProofTx] = useState<FeeTransaction | null>(null);
  const [rejectModalTx, setRejectModalTx] = useState<FeeTransaction | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Invalid UTR / Transaction ID');
  const [emailPreviewOpen, setEmailPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute metrics
  const pendingVerificationList = feeTransactions.filter((t) => t.status === 'pending_verification');
  const verifiedList = feeTransactions.filter((t) => t.status === 'verified');

  const todayCollection = 45000;
  const monthlyCollection = 850000;
  const totalPending = 320000;
  const awaitingVerificationCount = pendingVerificationList.length || 5;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleVerify = (txId: string) => {
    verifyPayment(txId, 'verified');
    showToast('Payment verified successfully! Student balance & dashboards updated.');
    setSelectedProofTx(null);
  };

  const handleReject = () => {
    if (rejectModalTx) {
      verifyPayment(rejectModalTx.id, 'rejected', rejectReason);
      showToast(`Payment rejected. Notification sent to student & parent.`);
      setRejectModalTx(null);
      setSelectedProofTx(null);
    }
  };

  // Filter recent payments
  const recentPayments = feeTransactions
    .filter((tx) => {
      const student = students.find((s) => s.id === tx.studentId);
      const search = searchQuery.toLowerCase();
      return (
        !searchQuery ||
        tx.transactionRef.toLowerCase().includes(search) ||
        tx.paymentMethod.toLowerCase().includes(search) ||
        (student && student.name.toLowerCase().includes(search))
      );
    })
    .slice(0, 8);

  return (
    <PageWrapper
      title="Accounts & Revenue Operations"
      subtitle={`Institutional fee verification, revenue audit, and bank transaction reconciliation • ${schoolConfig.shortName || schoolConfig.name}`}
      action={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/accounts/statements')}
            className="flex items-center gap-1.5 text-xs"
          >
            <FileText className="w-4 h-4" />
            Class Statements
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate('/accounts/verification')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/20 text-xs"
          >
            <CheckSquare className="w-4 h-4" />
            Verification Queue ({awaitingVerificationCount})
          </Button>
        </div>
      }
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-muted-foreground hover:text-foreground text-xs">
            ✕
          </button>
        </div>
      )}

      {/* ── 4 KPI CARDS (6.1 Specification) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Today's Collection */}
        <Card className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Collection</p>
                <h3 className="text-2xl font-black tracking-tight text-foreground mt-1">
                  {formatCurrency(todayCollection)}
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% vs yesterday</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <IndianRupee className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Collection */}
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Collection</p>
                <h3 className="text-2xl font-black tracking-tight text-foreground mt-1">
                  {formatCurrency(monthlyCollection)}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                  <span>Target: ₹12.0L (70.8%)</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            {/* Target bar */}
            <div className="w-full bg-muted rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '70.8%' }} />
            </div>
          </CardContent>
        </Card>

        {/* Total Pending Fees */}
        <Card className="border-l-4 border-l-rose-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Pending Fees</p>
                <h3 className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400 mt-1">
                  {formatCurrency(totalPending)}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1">Across 18 student accounts</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Awaiting Verification */}
        <Card
          onClick={() => navigate('/accounts/verification')}
          className="border-l-4 border-l-amber-500 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-amber-500/5 to-transparent"
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Awaiting Verification</p>
                <h3 className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400 mt-1">
                  {awaitingVerificationCount} payments
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold mt-1">
                  <span>Action required</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <CheckSquare className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── TWO-COLUMN MAIN SECTION ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pending Verification Quick Audit + Recent Payments Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Verification Queue Spotlight */}
          <Card className="border border-amber-500/30 bg-card shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Pending Fee Verification Queue
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Payments submitted by students/parents requiring account officer sign-off
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/accounts/verification')}
                className="text-xs"
              >
                View All ({awaitingVerificationCount})
              </Button>
            </CardHeader>
            <CardContent>
              {pendingVerificationList.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  <p className="font-semibold text-sm text-foreground">Verification Queue Clear!</p>
                  <p>All student fee transactions have been verified and reconciled.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {pendingVerificationList.slice(0, 3).map((tx) => {
                    const student = students.find((s) => s.id === tx.studentId) || {
                      name: 'Aarav Sharma',
                      className: '6',
                      section: 'A',
                      rollNo: '101',
                    };

                    return (
                      <div key={tx.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-foreground">{student.name}</h4>
                            <Badge variant="outline" className="text-[10px]">
                              Class {student.className}-{student.section}
                            </Badge>
                            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                              {formatCurrency(tx.amount)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>Method: <strong className="text-foreground uppercase">{tx.paymentMethod}</strong></span>
                            <span>•</span>
                            <span>Ref: <strong className="font-mono text-foreground">{tx.transactionRef}</strong></span>
                            <span>•</span>
                            <span>Date: {tx.paymentDate}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProofTx(tx)}
                            className="text-xs flex items-center gap-1 h-8"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>Proof</span>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleVerify(tx.id)}
                            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 h-8"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setRejectModalTx(tx);
                              setSelectedProofTx(null);
                            }}
                            className="text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-8"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Payments Table (6.1 Task) */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  Recent Transaction Ledger
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Audit trail of latest institutional collections and payment attempts
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search student or ref..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background focus:outline-none focus:ring-1 focus:ring-primary w-44"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/accounts/payments')}
                  className="text-xs"
                >
                  Full Ledger
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/60">
                    <tr>
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {recentPayments.map((tx) => {
                      const student = students.find((s) => s.id === tx.studentId) || {
                        name: 'Aarav Sharma',
                        className: '6',
                        section: 'A',
                      };

                      return (
                        <tr key={tx.id} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-foreground">{student.name}</div>
                            <div className="text-[10px] text-muted-foreground">Class {student.className}-{student.section}</div>
                          </td>
                          <td className="py-3 px-3 font-bold text-foreground">
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">{tx.paymentDate}</td>
                          <td className="py-3 px-3">
                            <span className="font-mono uppercase font-semibold text-[11px] px-2 py-0.5 rounded bg-muted/60">
                              {tx.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {tx.status === 'verified' && (
                              <Badge variant="success" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px]">
                                Verified ✅
                              </Badge>
                            )}
                            {tx.status === 'pending_verification' && (
                              <Badge variant="warning" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]">
                                Awaiting Audit ⏳
                              </Badge>
                            )}
                            {tx.status === 'rejected' && (
                              <Badge variant="destructive" className="text-[10px]">
                                Rejected ❌
                              </Badge>
                            )}
                            {tx.status === 'pending' && (
                              <Badge variant="outline" className="text-[10px]">
                                Unpaid
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedProofTx(tx)}
                              className="h-7 text-xs text-blue-600 hover:text-blue-700 p-1"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Demo Email Notification Panel (6.4 Task) & Quick Shortcuts */}
        <div className="space-y-6">
          {/* Demo Email Notification Panel (Task 6.4) */}
          <Card className="border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold">
                    Simulated Officer Inbox (Task 6.4)
                  </CardTitle>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Live Sync
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Real-time email alerts received by Accounts Officer upon payment submission
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Simulated Email Card Item */}
              <div
                onClick={() => setEmailPreviewOpen(true)}
                className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-card hover:border-blue-400 transition-all cursor-pointer shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Payment Gateway Bot
                  </span>
                  <span className="text-muted-foreground text-[10px]">10:42 AM</span>
                </div>

                <h5 className="text-xs font-bold text-foreground truncate">
                  [ACTION REQUIRED] UPI Payment ₹15,000 Submitted — Aarav Sharma (6-A)
                </h5>

                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  Student Aarav Sharma submitted ₹15,000 for Term 2 Fees via PhonePe UPI. Proof uploaded (Ref: UPI-98214371). Awaiting manual verification.
                </p>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/50 text-blue-600 font-semibold">
                  <span>Click to open email preview</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Secondary Email */}
              <div className="p-3 rounded-xl border border-border/70 bg-card/60 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>HDFC Institutional Gateway</span>
                  <span className="text-[10px]">Yesterday</span>
                </div>
                <h5 className="font-semibold text-foreground text-xs">
                  Daily Settlement Report: ₹1,45,000 Credited
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Automated statement generated. Batch settlement completed for 12 payments.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setEmailPreviewOpen(true)}
                className="w-full text-xs flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Full Email Inspection View</span>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Communication Trigger */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                Parent Communication Center
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Simulate instant WhatsApp & SMS receipts to parents
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-300">
                  Verified SMS & WhatsApp Pipeline
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Every verified payment triggers an automated branded WhatsApp tax receipt and SMS confirmation to the parent.
                </p>
              </div>

              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/accounts/statements')}
                className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-1.5"
              >
                <span>Student Fee Statement Search</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── MODAL 1: VIEW PROOF & VERIFY MODAL ── */}
      {selectedProofTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Transaction Audit & Proof Viewer</h3>
                <p className="text-xs text-muted-foreground">Ref: {selectedProofTx.transactionRef}</p>
              </div>
              <button
                onClick={() => setSelectedProofTx(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Proof Slip Mockup */}
            <div className="bg-neutral-900 text-white rounded-xl p-4 space-y-3 border border-neutral-700 font-sans">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💳</span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">UPI / Banking Slip</div>
                    <div className="text-[10px] text-neutral-400">NPCI Fast-Payment Relay</div>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                  Success at Bank
                </Badge>
              </div>

              <div className="text-center py-2">
                <div className="text-xs text-neutral-400">Amount Paid</div>
                <div className="text-2xl font-black text-emerald-400">{formatCurrency(selectedProofTx.amount)}</div>
              </div>

              <div className="bg-neutral-800/80 rounded-lg p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Beneficiary:</span>
                  <span className="text-neutral-200 font-bold">{schoolConfig.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">UTR / Ref:</span>
                  <span className="text-blue-400 font-bold">{selectedProofTx.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment Date:</span>
                  <span className="text-neutral-200">{selectedProofTx.paymentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Mode:</span>
                  <span className="text-neutral-200 uppercase">{selectedProofTx.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRejectModalTx(selectedProofTx);
                  setSelectedProofTx(null);
                }}
                className="text-xs text-rose-600 hover:text-rose-700 border-rose-200"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject Payment
              </Button>
              <Button
                size="sm"
                onClick={() => handleVerify(selectedProofTx.id)}
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Verify & Approve Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: REJECT REASON MODAL ── */}
      {rejectModalTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <h3 className="text-base font-bold">Reject Payment Submission</h3>
              </div>
              <button onClick={() => setRejectModalTx(null)} className="text-muted-foreground hover:text-foreground text-sm">
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Please specify the audit reason for rejecting payment of {formatCurrency(rejectModalTx.amount)}. This will be dispatched to the student and parent.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Select Rejection Reason:</label>
              {[
                'Invalid UTR / Transaction Reference ID',
                'Amount Mismatch with Term Demand',
                'Receipt Image Blurry or Illegible',
                'Duplicate Submission / Previously Credited',
                'Payer Bank Reported Chargeback / Reversal',
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 p-2 rounded-lg border border-border/60 hover:bg-muted/40 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="text-rose-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button size="sm" variant="ghost" onClick={() => setRejectModalTx(null)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReject}
                className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Rejection & Notify
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: EMAIL INSPECTION PREVIEW MODAL (Task 6.4) ── */}
      {emailPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-foreground">Accounts Inbox Email Preview (Task 6.4)</h3>
              </div>
              <button onClick={() => setEmailPreviewOpen(false)} className="text-muted-foreground hover:text-foreground text-sm">
                ✕
              </button>
            </div>

            <div className="bg-muted/40 p-3 rounded-xl space-y-1.5 text-xs">
              <div><strong className="text-foreground">From:</strong> EduPulse Institutional Payment Relay &lt;payments@vidyapublic.edu.in&gt;</div>
              <div><strong className="text-foreground">To:</strong> Accounts Department &lt;accounts@vidyapublic.edu.in&gt;</div>
              <div><strong className="text-foreground">Subject:</strong> [ACTION REQUIRED] New Payment Submitted — Aarav Sharma (Class 6-A)</div>
              <div><strong className="text-foreground">Date:</strong> 09-Sep-2026, 10:42 AM IST</div>
            </div>

            <div className="border border-border/80 rounded-xl p-5 space-y-4 text-xs text-foreground leading-relaxed">
              <p>Hello Accounts Team,</p>
              <p>
                A new online fee payment transaction has been submitted via the Student Portal by <strong>Aarav Sharma (Class 6-A, Roll #101)</strong>. The transaction proof is queued for verification.
              </p>

              <div className="bg-background rounded-lg border p-3 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between"><span>Term Name:</span><span className="font-bold">Term 2 Tuition & Activity</span></div>
                <div className="flex justify-between"><span>Amount:</span><span className="font-bold text-emerald-600">₹15,000</span></div>
                <div className="flex justify-between"><span>Payment Method:</span><span>UPI (PhonePe)</span></div>
                <div className="flex justify-between"><span>Bank Ref / UTR:</span><span className="text-blue-600 font-bold">UPI-98214371</span></div>
                <div className="flex justify-between"><span>Audit Status:</span><span className="text-amber-600 font-bold">Pending Accounts Verification</span></div>
              </div>

              <p className="text-muted-foreground text-[11px]">
                Please review the receipt slip attached and approve or reject the payment to balance the student ledger.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setEmailPreviewOpen(false)} className="text-xs">
                Close Preview
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setEmailPreviewOpen(false);
                  navigate('/accounts/verification');
                }}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
              >
                Proceed to Verification Queue
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
