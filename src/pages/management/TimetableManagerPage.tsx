import React, { useState, useMemo } from 'react';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { generateId } from '@/lib/utils';
import { Calendar, Plus, Trash2, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import type { TimetableEntry, DayOfWeek } from '@/types';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export function TimetableManagerPage() {
  const { classes, subjects, teachers, schoolConfig } = useSchoolData();
  const { timetables, addTimetableEntries, removeTimetableEntry } = useAppStore();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday' as DayOfWeek,
    periodNumber: 1,
    startTime: '08:30 AM',
    endTime: '09:15 AM',
    subjectId: '',
    teacherId: '',
    room: '',
  });

  const classTimetable = useMemo(() => {
    return timetables.filter((tt) => tt.classId === selectedClassId && tt.schoolId === schoolConfig.schoolId);
  }, [timetables, selectedClassId, schoolConfig.schoolId]);

  const getEntry = (day: DayOfWeek, period: number) => {
    return classTimetable.find((tt) => tt.dayOfWeek === day && tt.periodNumber === period);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.teacherId) return;

    // Check if entry already exists, delete it first to replace
    const existing = getEntry(formData.dayOfWeek, formData.periodNumber);
    if (existing) {
      removeTimetableEntry(existing.id);
    }

    const newEntry: TimetableEntry = {
      id: generateId(),
      schoolId: schoolConfig.schoolId,
      classId: selectedClassId,
      dayOfWeek: formData.dayOfWeek,
      periodNumber: formData.periodNumber,
      startTime: formData.startTime,
      endTime: formData.endTime,
      subjectId: formData.subjectId,
      teacherId: formData.teacherId,
      room: formData.room || 'TBA',
    };

    addTimetableEntries([newEntry]);
    setIsAddModalOpen(false);
    setActionSuccess('Timetable entry updated successfully!');
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <PageWrapper
      title="Class Timetable Manager"
      subtitle="Schedule subjects, assign teachers, and manage class periods"
      action={
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 text-xs">
          <Calendar size={16} />
          Add Period Entry
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

      {/* Class Selector */}
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-700">Select Class & Section:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                Class {c.className} - {c.section}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Timetable Grid */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="p-3 border-b border-r border-gray-100 bg-gray-50 font-bold text-gray-700 text-xs text-center w-24">
                  Day / Period
                </th>
                {PERIODS.map((p) => (
                  <th key={p} className="p-3 border-b border-r border-gray-100 bg-gray-50 font-bold text-gray-700 text-xs text-center min-w-[120px]">
                    Period {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day} className="border-b border-gray-100">
                  <td className="p-3 border-r border-gray-100 bg-gray-50/50 font-bold text-gray-800 text-xs text-center">
                    {day}
                  </td>
                  {PERIODS.map((period) => {
                    const entry = getEntry(day, period);
                    return (
                      <td key={`${day}-${period}`} className="p-2 border-r border-gray-100 align-top relative group h-24">
                        {entry ? (
                          <div className="h-full flex flex-col justify-between p-2 rounded-lg bg-blue-50/50 border border-blue-100 hover:border-blue-300 transition-colors">
                            <div>
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-blue-900 text-[11px] leading-tight">
                                  {subjects.find(s => s.id === entry.subjectId)?.name || 'Unknown'}
                                </span>
                                <button
                                  onClick={() => removeTimetableEntry(entry.id)}
                                  className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <span className="text-[10px] font-medium text-gray-600 block">
                                {teachers.find(t => t.id === entry.teacherId)?.name || 'Unknown'}
                              </span>
                            </div>
                            <div className="mt-2 space-y-0.5">
                              <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                <Clock size={10} />
                                <span>{entry.startTime} - {entry.endTime}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                <MapPin size={10} />
                                <span>{entry.room}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="h-full w-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg bg-gray-50/30 text-gray-400 hover:bg-gray-50 hover:text-blue-500 hover:border-blue-300 cursor-pointer transition-all"
                            onClick={() => {
                              setFormData({ ...formData, dayOfWeek: day, periodNumber: period });
                              setIsAddModalOpen(true);
                            }}
                          >
                            <Plus size={16} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Period Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Assign Period"
        description="Schedule a class period with subject and teacher."
        maxWidth="md"
      >
        <form onSubmit={handleAddEntry} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Day of Week</label>
              <select required value={formData.dayOfWeek} onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value as DayOfWeek })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Period Number</label>
              <select required value={formData.periodNumber} onChange={(e) => setFormData({ ...formData, periodNumber: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                {PERIODS.map(p => <option key={p} value={p}>Period {p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Start Time</label>
              <input required type="text" placeholder="08:30 AM" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">End Time</label>
              <input required type="text" placeholder="09:15 AM" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
              <select required value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Teacher</label>
              <select required value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name} ({t.designation})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Room / Location</label>
              <input required type="text" placeholder="e.g. Room 101, Science Lab" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Period</Button>
          </div>
        </form>
      </Modal>
    </PageWrapper>
  );
}
