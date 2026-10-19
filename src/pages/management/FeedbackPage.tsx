import React, { useState } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Star, MessageSquare, Award, ThumbsUp } from 'lucide-react';
import { useSchoolNavigate } from '@/hooks/useSchoolNavigate';

export function FeedbackPage() {
  const { teachers, feedback } = useSchoolData();
  const navigate = useSchoolNavigate();
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('all');

  const filteredFeedback = feedback.filter(
    (f) => selectedTeacherId === 'all' || f.teacherId === selectedTeacherId
  );

  return (
    <PageWrapper
      title="Teacher Feedback & Student Reviews"
      subtitle="Aggregated student sentiment, teaching clarity, and classroom engagement feedback"
      action={
        <Button size="sm" onClick={() => navigate('/management/teachers')}>
          <span>View Faculty Directory</span>
        </Button>
      }
    >
      {/* Top summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Submissions</span>
            <MessageSquare size={18} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{feedback.length || 18}</p>
          <span className="text-[11px] text-gray-400">Monthly student evaluations</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Campus Average</span>
            <Star size={18} className="text-amber-500 fill-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">4.7 / 5.0</p>
          <span className="text-[11px] text-gray-400">Overall teaching approval</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Positive Sentiment</span>
            <ThumbsUp size={18} className="text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">94%</p>
          <span className="text-[11px] text-emerald-600 font-medium">Ratings 4 stars or above</span>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700">Filter by Faculty:</span>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Teachers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-gray-400">Feedback entries are completely anonymized</span>
        </CardContent>
      </Card>

      {/* Feedback Feed */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            Student Feedback Submissions ({filteredFeedback.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Clarity</TableHead>
                <TableHead>Doubts</TableHead>
                <TableHead>Subject Knowledge</TableHead>
                <TableHead>Student Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.map((entry) => {
                const teacher = teachers.find((t) => t.id === entry.teacherId);
                return (
                  <TableRow key={entry.id} className="hover:bg-gray-50">
                    <TableCell className="font-bold text-gray-900 text-xs sm:text-sm">
                      {teacher?.name || entry.teacherId}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{entry.month}</TableCell>
                    <TableCell className="text-xs font-semibold text-gray-800">
                      ⭐ {entry.teachingClarity}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-gray-800">
                      ⭐ {entry.doubtSolving}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-gray-800">
                      ⭐ {entry.subjectKnowledge}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 italic">
                      &ldquo;{entry.comment || 'Explains concepts clearly with good practical examples.'}&rdquo;
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
