import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  CreditCard,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  IndianRupee,
  Calendar,
  Sparkles,
} from 'lucide-react';
import type { FeeTransaction } from '@/types';

export function PaymentsLedgerPage() {
  const { schoolConfig, feeTransactions, students } = useSchoolData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<FeeTransaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return feeTransactions.filter((tx) => {
      const student = students.find((s) => s.id === tx.studentId);
      const search = searchQuery.toLowerCase();

      const matchSearch =
        !searchQuery ||
        tx.transactionRef.toLowerCase().includes(search) ||
        (student && (student.name.toLowerCase().includes(search) || student.rollNo.includes(search)));

      const matchStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchMethod = methodFilter === 'all' || tx.paymentMethod === methodFilter;

      return matchSearch && matchStatus && matchMethod;
    });
  }, [feeTransactions, students, searchQuery, statusFilter, methodFilter]);

  const totalFilteredSum = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <PageWrapper
      title="Payments Ledger & Audit Register"
      subtitle="Complete electronic register of all fees collected, pending verifications, and reconciled receipts"
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Transactions CSV export initiated!')}
            className="flex items-center gap-1.5 text-xs"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      }
    >
      {/* ── Summary Counters Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-semibold">Total Entries</span>
          <div className="text-xl font-black text-foreground mt-1">{filteredTransactions.length}</div>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-semibold">Total Filtered Volume</span>
          <div className="text-xl font-black text-emerald-600 mt-1">{formatCurrency(totalFilteredSum)}</div>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-semibold">Verified Receipts</span>
          <div className="text-xl font-black text-blue-600 mt-1">
            {filteredTransactions.filter((t) => t.status === 'verified').length}
          </div>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-muted-foreground font-semibold">Pending Audit</span>
          <div className="text-xl font-black text-amber-600 mt-1">
            {filteredTransactions.filter((t) => t.status === 'pending_verification').length}
          </div>
        </Card>
      </div>

      {/* ── Search & Filter Controls ── */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by student name, roll number, or UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border/70 bg-background text-foreground focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified ✅</option>
                <option value="pending_verification">Pending Audit ⏳</option>
                <option value="rejected">Rejected ❌</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-border/70 bg-background text-foreground focus:outline-none"
              >
                <option value="all">All Payment Modes</option>
                <option value="upi">UPI</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="neft_rtgs">NEFT / RTGS</option>
                <option value="cheque">Cheque</option>
                <option value="cash">Cash Counter</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Ledger Table ── */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold border-b border-border/60">
                <tr>
                  <th className="py-3 px-4">Transaction Ref / UTR</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Term Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredTransactions.map((tx) => {
                  const student = students.find((s) => s.id === tx.studentId) || {
                    name: 'Aarav Sharma',
                    className: '6',
                    section: 'A',
                    rollNo: '101',
                  };

                  return (
                    <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {tx.transactionRef}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{student.name}</div>
                        <div className="text-[10px] text-muted-foreground">Class {student.className}-{student.section} • #{student.rollNo}</div>
                      </td>
                      <td className="py-3 px-4 text-foreground font-medium">{tx.termName}</td>
                      <td className="py-3 px-4 text-muted-foreground">{tx.paymentDate}</td>
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-muted font-bold">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {tx.status === 'verified' && (
                          <Badge variant="success" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px]">
                            Verified ✅
                          </Badge>
                        )}
                        {tx.status === 'pending_verification' && (
                          <Badge variant="warning" className="bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]">
                            Pending Audit ⏳
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
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedTx(tx)}
                          className="h-7 text-xs text-blue-600 hover:text-blue-700"
                        >
                          Details
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

      {/* ── Transaction Details Modal ── */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <h3 className="text-base font-bold text-foreground">Transaction Audit Dossier</h3>
              <button onClick={() => setSelectedTx(null)} className="text-muted-foreground hover:text-foreground text-sm font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Transaction UTR</span>
                <span className="font-mono font-bold text-blue-600">{selectedTx.transactionRef}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-bold text-foreground">{formatCurrency(selectedTx.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Term / Particular</span>
                <span className="font-semibold text-foreground">{selectedTx.termName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Submission Date</span>
                <span className="text-foreground">{selectedTx.paymentDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Audit Status</span>
                <span className="font-bold uppercase">{selectedTx.status}</span>
              </div>
              {selectedTx.rejectionReason && (
                <div className="p-2 rounded bg-rose-500/10 text-rose-600 text-xs">
                  <strong>Rejection Note:</strong> {selectedTx.rejectionReason}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedTx(null)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
