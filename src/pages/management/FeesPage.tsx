import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertOctagon,
  Search,
  Check,
  X,
  CreditCard,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

export function FeesPage() {
  const { schoolConfig, students, classes, feeTransactions, totalFeesCollected, totalFeesPending } = useSchoolData();
  const { verifyPayment } = useAppStore();

  const [searchStudent, setSearchStudent] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending_verification' | 'rejected'>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Total Fee Demand calculation
  const totalDemand = 2400000; // Expected baseline for demo
  const collectionRate = Math.round((totalFeesCollected / totalDemand) * 100);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return feeTransactions.filter((tx) => {
      const student = students.find((s) => s.id === tx.studentId);
      const matchesSearch =
        searchStudent.trim() === '' ||
        student?.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
        tx.transactionRef.toLowerCase().includes(searchStudent.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [feeTransactions, students, searchStudent, statusFilter]);

  // Donut chart data
  const pieData = [
    { name: 'Verified Collected', value: totalFeesCollected, color: '#10b981' },
    { name: 'Pending Verification', value: totalFeesPending, color: '#f59e0b' },
    { name: 'Overdue Dues', value: Math.max(0, totalDemand - totalFeesCollected - totalFeesPending), color: '#ef4444' },
  ];

  // Class-wise collection summary
  const classCollections = useMemo(() => {
    return classes.map((cls) => {
      const clsStudents = students.filter((s) => s.classId === cls.id);
      const studentIds = new Set(clsStudents.map((s) => s.id));
      const clsFees = feeTransactions.filter((f) => studentIds.has(f.studentId));
      const collected = clsFees
        .filter((f) => f.status === 'verified')
        .reduce((sum, f) => sum + f.amount, 0);
      const expected = clsStudents.length * 30000 || 1;
      const rate = Math.min(100, Math.round((collected / expected) * 100));

      return {
        id: cls.id,
        className: `${cls.className}-${cls.section}`,
        studentsCount: clsStudents.length,
        collected,
        expected,
        rate,
      };
    });
  }, [classes, students, feeTransactions]);

  const handleVerify = (id: string) => {
    verifyPayment(id, 'verified');
    setActionSuccess('Payment verified successfully!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleReject = (id: string) => {
    verifyPayment(id, 'rejected', 'Transaction reference could not be matched with bank statement');
    setActionSuccess('Payment rejected and student notified.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <PageWrapper
      title="Fees Management & Accounts Intelligence"
      subtitle="Track collection targets, verify parent payment receipts, and manage defaulter notifications"
    >
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Fee Demand</span>
            <Building size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900 mt-2">{formatCurrency(totalDemand)}</p>
          <span className="text-[11px] text-gray-400">Academic Year 2026-27</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Collected</span>
            <IndianRupee size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">
            {formatCurrency(totalFeesCollected)}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold">{collectionRate}% of Demand</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Pending Verification</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">
            {formatCurrency(totalFeesPending)}
          </p>
          <span className="text-[11px] text-amber-600 font-semibold">
            {feeTransactions.filter((t) => t.status === 'pending_verification').length} Receipts waiting
          </span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Overdue Balance</span>
            <AlertOctagon size={18} className="text-rose-600" />
          </div>
          <p className="text-2xl font-extrabold text-rose-600 mt-2">
            {formatCurrency(Math.max(0, totalDemand - totalFeesCollected - totalFeesPending))}
          </p>
          <span className="text-[11px] text-rose-500 font-medium">Pending collection</span>
        </Card>
      </div>

      {/* Donut Chart & Class-wise Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Fee Donut Chart */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-gray-900">
                Collection Composition
              </CardTitle>
              <p className="text-xs text-gray-500">Breakdown of campus fee status</p>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val)), 'Amount']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', color: '#fff', fontSize: '11px', border: 'none' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Class-wise fee collection table */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-gray-900">
                Class-Wise Fee Collection
              </CardTitle>
              <p className="text-xs text-gray-500">Progress across active classes</p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Collected</TableHead>
                    <TableHead>Expected</TableHead>
                    <TableHead className="text-right">Collection Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classCollections.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-bold text-gray-900 text-xs">Class {cls.className}</TableCell>
                      <TableCell className="text-xs text-gray-600">{cls.studentsCount}</TableCell>
                      <TableCell className="text-xs font-semibold text-emerald-700">
                        {formatCurrency(cls.collected)}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {formatCurrency(cls.expected)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          {cls.rate}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transactions & Verification Table */}
      <Card>
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-gray-900">
                Fee Transactions & Verification Queue
              </CardTitle>
              <p className="text-xs text-gray-500">Recent student payments, proof receipts, and verification controls</p>
            </div>

            {/* Search & Status Filter */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search student or ref..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="pending_verification">Pending Verification</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Term & Mode</TableHead>
                <TableHead>Ref Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Verification Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => {
                const student = students.find((s) => s.id === tx.studentId);
                return (
                  <TableRow key={tx.id} className="hover:bg-gray-50/80">
                    <TableCell>
                      <span className="font-bold text-gray-900 text-xs block">
                        {student?.name || 'Student'}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {student ? `Class ${student.className}-${student.section}` : ''}
                      </span>
                    </TableCell>
                    <TableCell className="font-extrabold text-gray-900 text-xs sm:text-sm">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600">
                      <span className="block font-medium">{tx.termName}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">
                        {tx.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-gray-600">
                      {tx.transactionRef}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {formatDate(tx.paymentDate)}
                    </TableCell>
                    <TableCell>
                      {tx.status === 'verified' ? (
                        <Badge status="Verified">Verified</Badge>
                      ) : tx.status === 'rejected' ? (
                        <Badge status="Rejected">Rejected</Badge>
                      ) : (
                        <Badge status="Pending">Pending Verification</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {tx.status === 'pending_verification' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleVerify(tx.id)}
                            className="h-7 px-2 text-xs"
                            title="Verify Receipt"
                          >
                            <Check size={13} />
                            <span>Verify</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(tx.id)}
                            className="h-7 px-2 text-xs"
                            title="Reject Receipt"
                          >
                            <X size={13} />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 capitalize">{tx.status}</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
