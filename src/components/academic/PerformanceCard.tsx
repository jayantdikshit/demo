import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { getGrade } from '@/lib/utils';

export interface PerformanceCardProps {
  subjectName: string;
  marksObtained: number;
  maxMarks: number;
  classAverage?: number;
  teacherName?: string;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  subjectName,
  marksObtained,
  maxMarks,
  classAverage,
  teacherName,
}) => {
  const percentage = Math.round((marksObtained / maxMarks) * 100);
  const grade = getGrade(percentage);

  return (
    <Card className="hover:border-blue-200 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{subjectName}</CardTitle>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700">
            Grade {grade}
          </span>
        </div>
        {teacherName && <p className="text-xs text-gray-500">Teacher: {teacherName}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-bold text-gray-900">{marksObtained} <span className="text-sm font-normal text-gray-500">/ {maxMarks}</span></span>
          <span className="text-sm font-semibold text-gray-700">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {classAverage !== undefined && (
          <p className="text-[11px] text-gray-400 mt-2">Class Average: {classAverage}%</p>
        )}
      </CardContent>
    </Card>
  );
};
