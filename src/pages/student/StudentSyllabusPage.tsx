import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { formatDate } from '@/lib/utils';
import {
  BookOpenCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  GraduationCap,
} from 'lucide-react';

export function StudentSyllabusPage() {
  const { subjects, teachingPlans, teachers } = useSchoolData();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-1');

  // Filter plans for Class 6 and selected subject
  const subjectPlans = useMemo(() => {
    return teachingPlans.filter(
      (tp) => tp.classId === 'cls-6' && tp.subjectId === selectedSubjectId
    );
  }, [teachingPlans, selectedSubjectId]);

  const completedCount = subjectPlans.filter((p) => p.status === 'completed').length;
  const overdueCount = subjectPlans.filter((p) => p.status === 'overdue').length;
  const totalCount = subjectPlans.length || 1;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const assignedTeacher = teachers.find((t) => t.subjectIds.includes(selectedSubjectId)) || teachers[0];

  return (
    <PageWrapper
      title="My Curriculum & Syllabus Tracking"
      subtitle="Follow lesson topics covered in class, scheduled units, and upcoming syllabus milestones"
    >
      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {subjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          const subPlans = teachingPlans.filter((p) => p.classId === 'cls-6' && p.subjectId === sub.id);
          const subDone = subPlans.filter((p) => p.status === 'completed').length;
          const rate = subPlans.length > 0 ? Math.round((subDone / subPlans.length) * 100) : 75;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{sub.name}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  isSelected ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {rate}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Progress Header */}
      <Card className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              {activeSubject?.name} Curriculum Pace
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              {completedCount} of {subjectPlans.length} Units Completed ({progressPercent}%)
            </h3>
            <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5">
              <User size={13} className="text-gray-400" />
              <span>Subject Teacher: <strong>{assignedTeacher?.name}</strong> ({assignedTeacher?.designation})</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {overdueCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1">
                <AlertTriangle size={13} />
                <span>{overdueCount} Delayed</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-bold border border-emerald-200">
              {completedCount} Covered
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-2.5 overflow-hidden shadow-inner border border-blue-100">
          <div
            className="h-2.5 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </Card>

      {/* Topics List Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="text-base font-bold text-gray-900">
            {activeSubject?.name} — Scheduled Units &amp; Lessons
          </CardTitle>
          <p className="text-xs text-gray-500">Curriculum progression recorded by your teacher</p>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-gray-100">
          {subjectPlans.length === 0 ? (
            <p className="text-xs text-center text-gray-400 py-10">No syllabus units logged for this subject yet.</p>
          ) : (
            subjectPlans.map((plan, index) => {
              const isDone = plan.status === 'completed';
              const isOverdue = plan.status === 'overdue';

              return (
                <div
                  key={plan.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isOverdue ? 'bg-rose-50/20' : 'hover:bg-gray-50/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{plan.topicName}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{plan.notes || 'Core curriculum concept'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <div className="text-left sm:text-right text-xs">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Scheduled</span>
                      <span className="text-gray-700 font-medium">{formatDate(plan.scheduledDate)}</span>
                    </div>

                    <div>
                      {isDone ? (
                        <Badge status="Completed">
                          <CheckCircle2 size={13} className="text-emerald-600 mr-1 inline" />
                          <span>Completed</span>
                        </Badge>
                      ) : isOverdue ? (
                        <Badge status="Overdue">
                          <AlertTriangle size={13} className="text-rose-600 mr-1 inline" />
                          <span>Overdue</span>
                        </Badge>
                      ) : (
                        <Badge status="Pending">
                          <Clock size={13} className="text-amber-500 mr-1 inline" />
                          <span>Upcoming</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
