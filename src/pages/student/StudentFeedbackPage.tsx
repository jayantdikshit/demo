import React, { useState } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { getInitials } from '@/lib/utils';
import {
  Star,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import type { TeacherFeedback } from '@/types';

export function StudentFeedbackPage() {
  const { teachers, schoolConfig } = useSchoolData();
  const { submitFeedback } = useAppStore();
  const studentId = 'stu-001';

  const [ratings, setRatings] = useState<
    Record<
      string,
      {
        clarity: number;
        doubts: number;
        knowledge: number;
        management: number;
        coverage: number;
        comment: string;
      }
    >
  >(() => {
    const init: any = {};
    teachers.forEach((t) => {
      init[t.id] = {
        clarity: 5,
        doubts: 5,
        knowledge: 5,
        management: 4,
        coverage: 5,
        comment: '',
      };
    });
    return init;
  });

  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleStarClick = (
    teacherId: string,
    dimension: 'clarity' | 'doubts' | 'knowledge' | 'management' | 'coverage',
    val: number
  ) => {
    if (submitted) return;
    setRatings((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        [dimension]: val,
      },
    }));
  };

  const handleCommentChange = (teacherId: string, comment: string) => {
    if (submitted) return;
    setRatings((prev) => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        comment,
      },
    }));
  };

  const handleSubmitAll = () => {
    const entries: TeacherFeedback[] = teachers.map((t) => {
      const r = ratings[t.id] || { clarity: 5, doubts: 5, knowledge: 5, management: 5, coverage: 5, comment: '' };
      return {
        id: `fb-${Date.now()}-${t.id}`,
        schoolId: schoolConfig.schoolId,
        teacherId: t.id,
        studentId,
        classId: 'cls-6',
        month: 'September 2026',
        teachingClarity: r.clarity,
        doubtSolving: r.doubts,
        subjectKnowledge: r.knowledge,
        classroomManagement: r.management,
        syllabusCoverage: r.coverage,
        comment: r.comment || 'Helpful and structured explanations.',
        submittedAt: new Date().toISOString(),
      };
    });

    submitFeedback(entries);
    setSubmitted(true);
    setSuccessMsg('Thank you! Your feedback has been encrypted and submitted anonymously.');
  };

  return (
    <PageWrapper
      title="Monthly Faculty Feedback & Review"
      subtitle="Rate your subject instructors across key academic dimensions to help improve classroom experience"
    >
      {/* Feedback Notice Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white">
            <Star size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Monthly Feedback Window Open</h4>
            <p className="text-xs text-gray-600">
              Evaluation for September 2026 • Completely Anonymous &amp; Confidential
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
            <Clock size={13} />
            <span>Closes in 20 hours</span>
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-sm text-emerald-950">Feedback Recorded</p>
            <p className="text-emerald-800 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Teachers Evaluation Form */}
      <div className="space-y-6 max-w-4xl">
        {teachers.map((teacher) => {
          const tRating = ratings[teacher.id] || { clarity: 5, doubts: 5, knowledge: 5, management: 4, coverage: 5, comment: '' };

          return (
            <Card key={teacher.id} className={submitted ? 'opacity-90' : ''}>
              <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                    {getInitials(teacher.name)}
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base font-bold text-gray-900">
                      {teacher.name}
                    </CardTitle>
                    <p className="text-xs text-gray-500">{teacher.designation}</p>
                  </div>
                </div>

                <Badge status={submitted ? 'Completed' : 'Pending'}>
                  {submitted ? 'Submitted' : 'Pending Review'}
                </Badge>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* 5-Star Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {[
                    { key: 'clarity' as const, label: '1. Teaching Clarity' },
                    { key: 'doubts' as const, label: '2. Doubt Solving & Patience' },
                    { key: 'knowledge' as const, label: '3. Subject Knowledge Depth' },
                    { key: 'management' as const, label: '4. Classroom Discipline & Engagement' },
                    { key: 'coverage' as const, label: '5. Syllabus Pacing & Regularity' },
                  ].map((dim) => (
                    <div key={dim.key} className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-700">{dim.label}</span>
                        <span className="font-bold text-gray-900">{tRating[dim.key]} / 5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            disabled={submitted}
                            onClick={() => handleStarClick(teacher.id, dim.key, star)}
                            className={`p-1 cursor-pointer transition-transform hover:scale-110 disabled:cursor-default ${
                              star <= tRating[dim.key] ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Box */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Constructive Feedback / Suggestions (Optional):
                  </label>
                  <textarea
                    rows={2}
                    disabled={submitted}
                    placeholder="e.g. Explains practical examples well; more practice exercises before exams would be helpful..."
                    value={tRating.comment}
                    onChange={(e) => handleCommentChange(teacher.id, e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 text-xs bg-white disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Submit Bar */}
        {!submitted ? (
          <div className="flex justify-end pt-2">
            <Button size="lg" onClick={handleSubmitAll} className="gap-2">
              <Send size={16} />
              <span>Submit Anonymous Feedback</span>
            </Button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-gray-100 text-center text-xs text-gray-500 font-medium">
            <ShieldCheck size={18} className="mx-auto text-emerald-600 mb-1" />
            <span>Your feedback for this cycle has been saved and locked. Thank you for helping improve teaching standards!</span>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
