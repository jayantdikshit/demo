import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';

export interface AttendanceSummaryCardProps {
  presentCount: number;
  absentCount: number;
  lateCount: number;
  totalStudents: number;
}

export const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  presentCount,
  absentCount,
  lateCount,
  totalStudents,
}) => {
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Today's Attendance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-3xl font-extrabold text-gray-900">{attendanceRate}%</span>
            <p className="text-xs text-gray-500">Overall Attendance Rate</p>
          </div>
          <span className="text-sm font-medium text-gray-500">{presentCount} of {totalStudents} present</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-100">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
            <p className="text-lg font-bold">{presentCount}</p>
            <p className="text-[10px] uppercase font-semibold">Present</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-800">
            <p className="text-lg font-bold">{absentCount}</p>
            <p className="text-[10px] uppercase font-semibold">Absent</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
            <p className="text-lg font-bold">{lateCount}</p>
            <p className="text-[10px] uppercase font-semibold">Late</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
