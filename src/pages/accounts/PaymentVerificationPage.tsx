import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import type { FeeTransaction } from '@/types';

export function PaymentVerificationPage() {
  const { schoolConfig, feeTransactions, students } = useSchoolData();
  const { verifyPayment } = useAppStore();

  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [selectedProofTx, setSelectedProofTx] = useState<FeeTransaction | null>(null);
  const [rejectModalTx, setRejectModalTx] = useState<FeeTransaction | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Invalid UTR / Bank Reference');
  const [customRejectNote, setCustomRejectNote] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleVerify = (tx: FeeTransaction) => {
    verifyPayment(tx.id, 'verified');
    showToast(`Payment of ${formatCurrency(tx.amount)} for Ref: ${tx.transactionRef} marked VERIFIED!`);
    setSelectedProofTx(null);
  };

  const handleReject = () => {
    if (rejectModalTx) {
      const finalReason = rejectReason === 'Other' ? customRejectNote : rejectReason;
      verifyPayment(rejectModalTx.id, 'rejected', finalReason);
      showToast(`Payment of ${formatCurrency(rejectModalTx.amount)} marked REJECTED. Notification sent.`);
      setRejectModalTx(null);
      setSelectedProofTx(null);
      setCustomRejectNote('');
    }
  };

  // Filter transactions by tab, method, search
  const filteredTransactions = useMemo(() => {
    return feeTransactions.filter((tx) => {
      // Tab filter
      let matchTab = false;
      if (activeTab === 'pending') matchTab = tx.status === 'pending_verification';
      else if (activeTab === 'verified') matchTab = tx.status === 'verified';
      else if (activeTab === 'rejected') matchTab = tx.status === 'rejected';

      // Method filter
      let matchMethod = methodFilter === 'all' || tx.paymentMethod === methodFilter;

      // Search filter
      const student = students.find((s) => s.id === tx.studentId);
      const search = searchQuery.toLowerCase();
      let matchSearch =
        !searchQuery ||
        tx.transactionRef.toLowerCase().includes(search) ||
        (student && (student.name.toLowerCase().includes(search) || student.rollNo.includes(search)));

      return matchTab && matchMethod && matchSearch;
    });
  }, [feeTransactions, activeTab, methodFilter, searchQuery, students]);

  const pendingCount = feeTransactions.filter((t) => t.status === 'pending_verification').length;
  const verifiedCount = feeTransactions.filter((t) => t.status === 'verified').length;
  const rejectedCount = feeTransactions.filter((t) => t.status === 'rejected').length;

  return (
    <PageWrapper
      title="Payment Verification Queue"
      subtitle="Manual & automated audit desk for fee receipts submitted via UPI, NetBanking, and direct bank transfers"
      action={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {pendingCount} Awaiting Review
          </Badge>
        </div>
      }
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-muted-foreground hover:text-foreground text-xs">
            ✕
          </button>
        </div>
      )}

      {/* ── Status Filter Tabs ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/80 pb-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'pending', label: 'Pending Verification', count: pendingCount, color: 'text-amber-600' },
            { id: 'verified', label: 'Verified Payments', count: verifiedCount, color: 'text-emerald-600' },
            { id: 'rejected', label: 'Rejected Records', count: rejectedCount, color: 'text-rose-600' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-background text-foreground font-black' : 'bg-muted text-muted-foreground'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Method Filters */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search student or UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-border/70 bg-background focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-52"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-xl border border-border/70 bg-background text-foreground focus:outline-none"
          >
            <option value="all">All Methods</option>
            <option value="upi">UPI / QR</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="neft_rtgs">NEFT / RTGS</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
      </div>

      {/* ── Transactions List Grid ── */}
      {filteredTransactions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/40" />
            <p className="font-bold text-sm text-foreground">No payments found in this view</p>
            <p className="text-xs">
              {activeTab === 'pending'
                ? 'All submitted payments have been verified!'
                : 'No historical records matching this criteria.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTransactions.map((tx) => {
            const student = students.find((s) => s.id === tx.studentId) || {
              id: tx.studentId,
              name: 'Aarav Sharma',
              className: '6',
              section: 'A',
              rollNo: '101',
              parentName: 'Ramesh Sharma',
              parentPhone: '+91 98765 43210',
            };

            return (
              <Card
                key={tx.id}
                className={`border transition-all hover:shadow-md ${
                  tx.status === 'pending_verification'
                    ? 'border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent'
                    : 'border-border/80'
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Student & Amount Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-foreground">{student.name}</h4>
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          Class {student.className}-{student.section}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Roll #{student.rollNo} • Parent: {student.parentName}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-foreground">
                        {formatCurrency(tx.amount)}
                      </div>
                      <Badge
                        variant={
                          tx.status === 'verified'
                            ? 'success'
                            : tx.status === 'pending_verification'
                            ? 'warning'
                            : 'destructive'
                        }
                        className="text-[10px] mt-1"
                      >
                        {tx.status === 'verified' && 'Verified ✅'}
                        {tx.status === 'pending_verification' && 'Pending Audit ⏳'}
                        {tx.status === 'rejected' && 'Rejected ❌'}
                      </Badge>
                    </div>
                  </div>

                  {/* Transaction Metadata Box */}
                  <div className="bg-muted/40 rounded-xl p-3 text-xs space-y-1.5 border border-border/60 font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Payment Method:</span>
                      <span className="font-bold uppercase text-foreground">{tx.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Bank Reference / UTR:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{tx.transactionRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Term Allocation:</span>
                      <span className="text-foreground font-sans">{tx.termName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-sans">Submission Date:</span>
                      <span className="text-muted-foreground">{tx.paymentDate}</span>
                    </div>

                    {tx.rejectionReason && (
                      <div className="pt-2 border-t border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-sans text-xs">
                        <strong>Rejection Reason:</strong> {tx.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedProofTx(tx)}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      <span>Inspect Receipt Proof</span>
                    </Button>

                    {tx.status === 'pending_verification' && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRejectModalTx(tx)}
                          className="text-xs text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleVerify(tx)}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Verify ✅
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── PROOF VIEWER MODAL ── */}
      {selectedProofTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Transaction Receipt & Gateway Slip</h3>
                <p className="text-xs text-muted-foreground">Bank UTR: {selectedProofTx.transactionRef}</p>
              </div>
              <button
                onClick={() => setSelectedProofTx(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* High-Resolution Bank Receipt Mockup */}
            <div className="bg-neutral-900 text-white rounded-2xl p-5 space-y-4 border border-neutral-700 font-sans shadow-inner">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-300">Bank Transfer Receipt</div>
                    <div className="text-[10px] text-neutral-400">Authorized Payment Gateway Relay</div>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
                  Confirmed Paid
                </Badge>
              </div>

              <div className="text-center py-2">
                <span className="text-xs text-neutral-400">Total Remittance</span>
                <h2 className="text-3xl font-black text-emerald-400">{formatCurrency(selectedProofTx.amount)}</h2>
              </div>

              <div className="bg-neutral-800/90 rounded-xl p-3.5 text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Account Debited:</span>
                  <span className="text-neutral-200">XXXX-XXXX-4819</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Beneficiary:</span>
                  <span className="text-neutral-200 font-bold">{schoolConfig.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Transaction ID / UTR:</span>
                  <span className="text-blue-400 font-bold">{selectedProofTx.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Date & Timestamp:</span>
                  <span className="text-neutral-200">{selectedProofTx.paymentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Payment Mode:</span>
                  <span className="text-neutral-200 uppercase">{selectedProofTx.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedProofTx(null)} className="text-xs">
                Close
              </Button>
              {selectedProofTx.status === 'pending_verification' && (
                <>
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
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleVerify(selectedProofTx)}
                    className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Verify & Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── REJECTION REASON MODAL ── */}
      {rejectModalTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <XCircle className="w-5 h-5" />
                <h3 className="text-base font-bold">Reject Transaction</h3>
              </div>
              <button onClick={() => setRejectModalTx(null)} className="text-muted-foreground hover:text-foreground text-sm font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Select rejection rationale for {formatCurrency(rejectModalTx.amount)} (Ref: {rejectModalTx.transactionRef}). This will notify both student and parent immediately.
            </p>

            <div className="space-y-2">
              {[
                'Invalid UTR / Transaction Reference',
                'Remittance Amount Discrepancy',
                'Receipt Image Blurry or Illegible',
                'Duplicate Submission (Already Verified)',
                'Payment Reversed or Not Reflected in Bank',
                'Other',
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

              {rejectReason === 'Other' && (
                <textarea
                  placeholder="Enter detailed rejection explanation..."
                  value={customRejectNote}
                  onChange={(e) => setCustomRejectNote(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-border/80 bg-background text-foreground mt-2"
                  rows={2}
                />
              )}
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
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
