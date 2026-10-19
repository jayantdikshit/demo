import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { formatCurrency } from '@/lib/utils';
import { IndianRupee } from 'lucide-react';

export interface FeeSummaryCardProps {
  totalExpected: number;
  totalCollected: number;
  totalPending: number;
  collectionRate: number;
}

export const FeeSummaryCard: React.FC<FeeSummaryCardProps> = ({
  totalExpected,
  totalCollected,
  totalPending,
  collectionRate,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Fee Collection Summary</CardTitle>
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
          <IndianRupee size={18} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalCollected)}</span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {collectionRate}% Collected
            </span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(collectionRate, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
            <div>
              <p className="text-gray-400">Total Expected</p>
              <p className="font-semibold text-gray-800">{formatCurrency(totalExpected)}</p>
            </div>
            <div>
              <p className="text-gray-400">Pending Dues</p>
              <p className="font-semibold text-rose-600">{formatCurrency(totalPending)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
