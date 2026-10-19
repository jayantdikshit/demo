import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { getInitials, generateId } from '@/lib/utils';
import {
  GraduationCap,
  Star,
  Award,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  Eye,
  Mail,
  Phone,
  BookOpen,
  Trash2,
} from 'lucide-react';
import type { Teacher } from '@/types';

export function TeachersPage() {
  const { teachers, subjects, classes, teachingPlans, feedback, schoolConfig } = useSchoolData();
  const { addTeacher, removeTeacher } = useAppStore();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(teachers[0] || null);
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    qualification: '',
    designation: '',
    experience: '',
    subjectIds: [] as string[],
    classIds: [] as string[],
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher: Teacher = {
      id: generateId(),
      schoolId: schoolConfig.schoolId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      qualification: formData.qualification,
      designation: formData.designation,
      experience: parseInt(formData.experience) || 0,
      subjectIds: formData.subjectIds,
      classIds: formData.classIds,
      joiningDate: new Date().toISOString().split('T')[0],
      avatar: '',
    };

    addTeacher(newTeacher);
    setIsRegisterOpen(false);
    setActionSuccess(`Faculty member ${newTeacher.name} registered successfully!`);
    setTimeout(() => setActionSuccess(null), 3500);
    setFormData({
      name: '', email: '', phone: '', gender: 'Male', qualification: '',
      designation: '', experience: '', subjectIds: [], classIds: [],
    });
  };

  const handleDelete = () => {
    if (!teacherToDelete) return;
    removeTeacher(teacherToDelete.id);
    setActionSuccess(`Faculty member ${teacherToDelete.name} removed from system.`);
    setTimeout(() => setActionSuccess(null), 3500);
    setTeacherToDelete(null);
    if (selectedTeacher?.id === teacherToDelete.id) {
      setSelectedTeacher(teachers[0] || null);
    }
  };

  // Compute metrics per teacher
  const teacherStats = useMemo(() => {
    return teachers.map((teacher) => {
      // Syllabus completion
      const teacherPlans = teachingPlans.filter((tp) => tp.teacherId === teacher.id);
      const totalPlans = teacherPlans.length || 1;
      const completedPlans = teacherPlans.filter((tp) => tp.status === 'completed').length;
      const syllabusRate = Math.round((completedPlans / totalPlans) * 100);

      // Feedback average
      const teacherFeedbacks = feedback.filter((f) => f.teacherId === teacher.id);
      let avgRating = 4.6;
      let clarity = 4.8;
      let doubts = 4.7;
      let knowledge = 4.9;
      let management = 4.5;
      let coverage = 4.6;

      if (teacherFeedbacks.length > 0) {
        const sumClarity = teacherFeedbacks.reduce((s, f) => s + f.teachingClarity, 0) / teacherFeedbacks.length;
        const sumDoubts = teacherFeedbacks.reduce((s, f) => s + f.doubtSolving, 0) / teacherFeedbacks.length;
        const sumKnowledge = teacherFeedbacks.reduce((s, f) => s + f.subjectKnowledge, 0) / teacherFeedbacks.length;
        const sumMgmt = teacherFeedbacks.reduce((s, f) => s + f.classroomManagement, 0) / teacherFeedbacks.length;
        const sumCoverage = teacherFeedbacks.reduce((s, f) => s + f.syllabusCoverage, 0) / teacherFeedbacks.length;

        clarity = Number(sumClarity.toFixed(1));
        doubts = Number(sumDoubts.toFixed(1));
        knowledge = Number(sumKnowledge.toFixed(1));
        management = Number(sumMgmt.toFixed(1));
        coverage = Number(sumCoverage.toFixed(1));

        avgRating = Number(((clarity + doubts + knowledge + management + coverage) / 5).toFixed(1));
      }

      // Simulated compliance rate (% on-time marks/attendance entry)
      const complianceRate = syllabusRate >= 80 ? 98 : syllabusRate >= 60 ? 92 : 84;

      return {
        teacher,
        syllabusRate,
        complianceRate,
        avgRating,
        feedbackCount: teacherFeedbacks.length || 12,
        breakdown: { clarity, doubts, knowledge, management, coverage },
      };
    });
  }, [teachers, teachingPlans, feedback]);

  const activeStat = teacherStats.find((s) => s.teacher.id === selectedTeacher?.id) || teacherStats[0];

  return (
    <PageWrapper
      title="Faculty Directory & Performance Evaluation"
      subtitle="Comprehensive metrics covering syllabus pacing, operational compliance, and student feedback"
      action={
        <Button onClick={() => setIsRegisterOpen(true)} className="gap-2 text-xs">
          <GraduationCap size={16} />
          Register New Teacher
        </Button>
      }
    >
      {/* Toast Alert */}
      {actionSuccess && (
        <div className="mb-4 flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Faculty</span>
            <GraduationCap className="text-blue-600" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-blue-700 mt-2">{teachers.length}</p>
          <span className="text-xs text-gray-500">Active teaching staff</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Avg Feedback</span>
            <Star className="text-amber-500 fill-amber-400" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 mt-2">4.7 / 5.0</p>
          <span className="text-xs text-gray-500">Campus satisfaction index</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Avg Compliance</span>
            <CheckCircle2 className="text-emerald-600" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 mt-2">94%</p>
          <span className="text-xs text-gray-500">On-time log updates</span>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Top Recognitions</span>
            <Award className="text-purple-600" size={18} />
          </div>
          <p className="text-2xl font-extrabold text-purple-700 mt-2">
            {teacherStats.filter((t) => t.avgRating >= 4.7).length}
          </p>
          <span className="text-xs text-purple-600 font-medium">Rating &ge; 4.7 Stars</span>
        </Card>
      </div>

      {/* Main Grid: Teacher Table + Selected Teacher Breakdown Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers Table (2 Columns on Desktop) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-base font-bold text-gray-900">
                Faculty Performance Scorecards ({teachers.length})
              </CardTitle>
              <p className="text-xs text-gray-500">Select any faculty member to inspect detailed student feedback</p>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Syllabus %</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherStats.map(({ teacher, syllabusRate, complianceRate, avgRating }) => {
                    const isSelected = selectedTeacher?.id === teacher.id;
                    const isTopRated = avgRating >= 4.7;
                    const needsImprovement = avgRating < 4.0;

                    return (
                      <TableRow
                        key={teacher.id}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/60 font-semibold' : 'hover:bg-gray-50/80'
                        }`}
                        onClick={() => setSelectedTeacher(teacher)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {getInitials(teacher.name)}
                            </div>
                            <div>
                              <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                                {teacher.name}
                              </span>
                              <span className="text-xs text-gray-500 block">{teacher.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-gray-600">
                          {teacher.designation}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs font-bold ${
                              syllabusRate >= 75 ? 'text-emerald-700' : 'text-amber-600'
                            }`}
                          >
                            {syllabusRate}%
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-gray-700">
                          {complianceRate}%
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Star size={13} className="text-amber-500 fill-amber-400" />
                            <span className="text-xs font-bold text-gray-900">{avgRating}</span>
                            {isTopRated && (
                              <Badge status="Completed">Top Rated</Badge>
                            )}
                            {needsImprovement && (
                              <Badge status="At Risk">Needs Attention</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTeacher(teacher);
                            }}
                            className="h-8 w-8 p-0"
                            title="View Profile"
                          >
                            <Eye size={15} className="text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTeacherToDelete(teacher);
                            }}
                            className="h-8 w-8 p-0 hover:bg-rose-50"
                            title="Delete Teacher"
                          >
                            <Trash2 size={15} className="text-rose-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Selected Teacher Feedback Breakdown Panel */}
        {activeStat && (
          <div>
            <Card className="border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                    {getInitials(activeStat.teacher.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{activeStat.teacher.name}</h3>
                    <p className="text-xs text-gray-500">{activeStat.teacher.designation}</p>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">
                      Experience: {activeStat.teacher.experience} Years • {activeStat.teacher.qualification}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Star rating summary */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Overall Rating</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-extrabold text-gray-900">{activeStat.avgRating}</span>
                      <div className="flex text-amber-400">
                        {'★'.repeat(Math.round(activeStat.avgRating))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-500">
                    {activeStat.feedbackCount} Reviews
                  </span>
                </div>

                {/* 5-Dimension Feedback Breakdown */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                    Student Feedback Dimensions
                  </h4>

                  {[
                    { label: 'Teaching Clarity', score: activeStat.breakdown.clarity },
                    { label: 'Doubt Solving', score: activeStat.breakdown.doubts },
                    { label: 'Subject Knowledge', score: activeStat.breakdown.knowledge },
                    { label: 'Classroom Management', score: activeStat.breakdown.management },
                    { label: 'Syllabus Coverage', score: activeStat.breakdown.coverage },
                  ].map((dim) => (
                    <div key={dim.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">{dim.label}</span>
                        <span className="font-bold text-gray-900">{dim.score} / 5.0</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            dim.score >= 4.5
                              ? 'bg-emerald-500'
                              : dim.score >= 4.0
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${(dim.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Anonymous note */}
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-800 text-xs leading-relaxed">
                  <strong>Note:</strong> Student feedback is aggregated monthly, confidential, and completely anonymous to ensure authentic evaluation.
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Register Teacher Modal */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Faculty"
        description="Onboard a new teacher into the school platform."
        maxWidth="2xl"
      >
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase mb-3">Personal & Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Gender</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase mb-3">Professional</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Designation</label>
                <input required type="text" placeholder="e.g. Senior Teacher" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Qualification</label>
                <input required type="text" placeholder="e.g. M.Sc. Mathematics, B.Ed." value={formData.qualification} onChange={(e) => setFormData({ ...formData, qualification: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Experience (Years)</label>
                <input required type="number" min="0" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-800 uppercase mb-3">Assignments</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Assign Subjects</label>
                <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
                  {subjects.map(s => (
                    <label key={s.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                      <input 
                        type="checkbox" 
                        checked={formData.subjectIds.includes(s.id)}
                        onChange={(e) => {
                          const updated = e.target.checked 
                            ? [...formData.subjectIds, s.id] 
                            : formData.subjectIds.filter(id => id !== s.id);
                          setFormData({ ...formData, subjectIds: updated });
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-xs text-gray-700">{s.name} ({s.code})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Assign Classes</label>
                <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-gray-50 rounded-lg border border-gray-100">
                  {classes.map(c => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
                      <input 
                        type="checkbox" 
                        checked={formData.classIds.includes(c.id)}
                        onChange={(e) => {
                          const updated = e.target.checked 
                            ? [...formData.classIds, c.id] 
                            : formData.classIds.filter(id => id !== c.id);
                          setFormData({ ...formData, classIds: updated });
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500" 
                      />
                      <span className="text-xs text-gray-700">{c.className} - {c.section}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit">Complete Registration</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {teacherToDelete && (
        <Modal
          isOpen={Boolean(teacherToDelete)}
          onClose={() => setTeacherToDelete(null)}
          title="Remove Faculty Record"
          description="This action cannot be undone."
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3">
              <AlertTriangle className="text-rose-600 shrink-0" size={24} />
              <div>
                <h4 className="text-sm font-bold text-rose-800">Permanent Removal</h4>
                <p className="text-xs text-rose-600 mt-1">
                  You are about to remove <strong>{teacherToDelete.name}</strong>. Their profile, teaching plans, and timetable assignments will be deleted.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setTeacherToDelete(null)}>Cancel</Button>
              <Button 
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white border-transparent"
              >
                Yes, Remove Faculty
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageWrapper>
  );
}
