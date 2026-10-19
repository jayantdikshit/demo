import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge, type BadgeStatus } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  IndianRupee,
  CreditCard,
  QrCode,
  Building,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Check,
  X,
} from 'lucide-react';
import type { PaymentMethod, FeeTransaction } from '@/types';

export function StudentFeesPage() {
  const { schoolConfig, feeTransactions } = useSchoolData();
  const { submitPayment } = useAppStore();

  const studentId = 'stu-001';
  const totalFeeAnnual = 50000;

  // Student transactions
  const myTransactions = useMemo(() => {
    return feeTransactions.filter((f) => f.studentId === studentId);
  }, [feeTransactions, studentId]);

  const totalPaid = myTransactions
    .filter((f) => f.status === 'verified')
    .reduce((sum, f) => sum + f.amount, 0);

  const pendingAmount = Math.max(0, totalFeeAnnual - totalPaid);

  // Modal states
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(pendingAmount || 15000);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    const ref = transactionRef.trim() || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newTx: FeeTransaction = {
      id: `fee-${Date.now()}`,
      schoolId: schoolConfig.schoolId,
      studentId,
      amount: payAmount,
      paymentMethod: payMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      transactionRef: ref,
      proofUrl: uploadedFileName ? `/receipts/${uploadedFileName}` : 'https://placehold.co/400x600?text=Payment+Receipt',
      status: 'pending_verification',
      verifiedBy: null,
      verifiedAt: null,
      rejectionReason: null,
      termName: 'Term 2 (2026-27)',
      description: `Online ${payMethod.toUpperCase()} installment submitted by student`,
    };

    submitPayment(newTx);
    setPayModalOpen(false);
    setSubmitSuccess('Payment submitted successfully! Awaiting accounts verification.');
    setTransactionRef('');
    setUploadedFileName(null);
    setTimeout(() => setSubmitSuccess(null), 5000);
  };

  const getStatusBadge = (status: FeeTransaction['status']): BadgeStatus => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'pending_verification':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <PageWrapper
      title="Fee Schedule & Payment Gateway"
      subtitle="Tuition fee ledger, online settlement (UPI/Bank Transfer), and proof verification"
      action={
        pendingAmount > 0 ? (
          <Button onClick={() => setPayModalOpen(true)} className="gap-2 text-xs">
            <CreditCard size={14} />
            <span>Pay Dues Now ({formatCurrency(pendingAmount)})</span>
          </Button>
        ) : undefined
      }
    >
      {/* Toast Alert */}
      {submitSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{submitSuccess}</span>
        </div>
      )}

      {/* Fee Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Annual Fee Demand</span>
            <Building size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            {formatCurrency(totalFeeAnnual)}
          </p>
          <span className="text-[11px] text-gray-400">Class 6 Comprehensive Tuition</span>
        </Card>

        <Card className="p-4 bg-white border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase">Paid &amp; Verified</span>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2">
            {formatCurrency(totalPaid)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Receipts certified by Accounts</span>
        </Card>

        <Card className={`p-4 ${pendingAmount > 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase">Outstanding Dues</span>
            <IndianRupee size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-800 mt-2">
            {formatCurrency(pendingAmount)}
          </p>
          <span className="text-[11px] text-amber-700 font-medium">
            {pendingAmount > 0 ? 'Due for Term 2' : 'All clear! Zero pending dues'}
          </span>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-gray-900">
              Payment &amp; Transaction History
            </CardTitle>
            <p className="text-xs text-gray-500">Live ledger reflecting submissions and Accounts approval status</p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
            {myTransactions.length} Transactions
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Mode / Method</TableHead>
                <TableHead>Transaction Reference</TableHead>
                <TableHead>Installment Description</TableHead>
                <TableHead>Verification Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                    No payment transactions logged yet. Click &ldquo;Pay Dues Now&rdquo; to test the live workflow!
                  </TableCell>
                </TableRow>
              ) : (
                myTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-gray-50/80">
                    <TableCell className="text-xs text-gray-600 font-medium">
                      {formatDate(tx.paymentDate)}
                    </TableCell>
                    <TableCell className="font-extrabold text-gray-900 text-xs sm:text-sm">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {tx.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-gray-600">
                      {tx.transactionRef}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      {tx.termName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge status={getStatusBadge(tx.status)}>
                          {tx.status === 'verified'
                            ? 'Verified ✅'
                            : tx.status === 'rejected'
                            ? 'Rejected ❌'
                            : 'Pending Verification ⏳'}
                        </Badge>
                        {tx.rejectionReason && (
                          <span className="text-[10px] text-rose-600 font-semibold italic">
                            Reason: {tx.rejectionReason}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pay Now Modal with UPI / Bank / Proof Upload */}
      {payModalOpen && (
        <Modal
          isOpen={payModalOpen}
          onClose={() => setPayModalOpen(false)}
          title="Fee Settlement Gateway"
          description={`Submit fee payment to ${schoolConfig.name}`}
          maxWidth="lg"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setPayModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSubmitPayment}>
                Submit Payment for Verification
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
            {/* Amount input */}
            <div>
              <label className="font-bold text-gray-800 block mb-1">Payment Amount (INR):</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                <input
                  type="number"
                  min="100"
                  max={totalFeeAnnual}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 text-sm font-bold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="font-bold text-gray-800 block mb-1.5">Select Payment Mode:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: <QrCode size={16} /> },
                  { id: 'bank_transfer', label: 'Bank Transfer', icon: <Building size={16} /> },
                  { id: 'neft_rtgs', label: 'NEFT / RTGS', icon: <CreditCard size={16} /> },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPayMethod(mode.id as PaymentMethod)}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      payMethod === mode.id
                        ? 'border-blue-600 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {mode.icon}
                    <span>{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Details based on Method */}
            {payMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-2">
                <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-gray-300 flex items-center justify-center shadow-xs">
                  <div className="text-center">
                    <QrCode size={80} className="mx-auto text-gray-800" />
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Scan to Pay</span>
                  </div>
                </div>
                <p className="text-gray-600 text-xs">
                  Official UPI ID: <strong>fees.{schoolConfig.shortName.toLowerCase()}@icici</strong>
                </p>
                <p className="text-[10px] text-gray-400">Scan using Google Pay, PhonePe, Paytm, or BHIM</p>
              </div>
            )}

            {(payMethod === 'bank_transfer' || payMethod === 'neft_rtgs') && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5 text-gray-700">
                <p className="font-bold text-gray-900 text-[11px] uppercase mb-1">Beneficiary Account Details:</p>
                <p>Account Name: <strong>{schoolConfig.name} Educational Society</strong></p>
                <p>Account Number: <strong>50200049281920</strong></p>
                <p>IFSC Code: <strong>HDFC0001234</strong></p>
                <p>Bank &amp; Branch: <strong>HDFC Bank, Sector 15 Branch</strong></p>
              </div>
            )}

            {/* Transaction Reference Input */}
            <div>
              <label className="font-bold text-gray-800 block mb-1">
                Transaction Reference / UTR Number:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 423984029102 or UPI Ref ID"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Upload Payment Proof Drag & Drop */}
            <div>
              <label className="font-bold text-gray-800 block mb-1">Upload Payment Screenshot / Receipt:</label>
              <div
                onClick={() => setUploadedFileName('screenshot_payment_success.png')}
                className="p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50/40 text-center cursor-pointer transition-all"
              >
                <UploadCloud size={24} className="mx-auto text-gray-400 mb-1" />
                <p className="font-semibold text-gray-700">
                  {uploadedFileName ? (
                    <span className="text-emerald-700 font-bold flex items-center justify-center gap-1">
                      <Check size={14} />
                      <span>{uploadedFileName} attached</span>
                    </span>
                  ) : (
                    'Click to attach payment receipt or screenshot'
                  )}
                </p>
                <span className="text-[10px] text-gray-400 block mt-0.5">Supports JPG, PNG, PDF up to 5MB</span>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </PageWrapper>
  );
}
