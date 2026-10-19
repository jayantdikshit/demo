import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import {
  Globe,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Eye,
  Calendar,
  Sparkles,
  Trophy,
  Bell,
  Layers,
  ExternalLink,
} from 'lucide-react';
import type { WebsiteContent, WebsiteNotice, WebsiteEvent, WebsiteAchievement } from '@/types';

export function WebsiteCMSPage() {
  const { schoolConfig, websiteContent } = useSchoolData();
  const { updateWebsiteContent, currentSchoolId } = useAppStore();
  const { schoolSlug } = useSchoolSlug();

  const [activeTab, setActiveTab] = useState<'notices' | 'events' | 'branding' | 'achievements' | 'admissions'>('notices');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active school content
  const activeContent: WebsiteContent = (websiteContent as WebsiteContent[]).find((w) => w.schoolId === currentSchoolId) || websiteContent[0];

  // Forms / state for Notices
  const [notices, setNotices] = useState<WebsiteNotice[]>(activeContent.notices || []);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeDate, setNewNoticeDate] = useState('2026-09-09');

  // Forms / state for Events
  const [events, setEvents] = useState<WebsiteEvent[]>(activeContent.events || []);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-10-10');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');
  const [newEventVenue, setNewEventVenue] = useState('Auditorium');

  // Forms / state for Branding
  const [heroTitle, setHeroTitle] = useState(activeContent.heroTitle || `Welcome to ${schoolConfig.name}`);
  const [heroSubtitle, setHeroSubtitle] = useState(activeContent.heroSubtitle || schoolConfig.tagline);
  const [principalMessage, setPrincipalMessage] = useState(activeContent.principalMessage || schoolConfig.principalMessage);

  // Forms / state for Achievements
  const [achievements, setAchievements] = useState<WebsiteAchievement[]>(activeContent.achievements || []);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchDesc, setNewAchDesc] = useState('');
  const [newAchYear, setNewAchYear] = useState('2026');

  // Forms / state for Admissions
  const [admissionInfo, setAdmissionInfo] = useState(activeContent.admissionInfo || '');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ── NOTICE CMS HANDLERS ──
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;

    const newN: WebsiteNotice = {
      id: `notice-${Date.now()}`,
      title: newNoticeTitle,
      content: newNoticeContent,
      date: newNoticeDate,
      isPublished: true,
    };

    const updated = [newN, ...notices];
    setNotices(updated);
    updateWebsiteContent(currentSchoolId, { notices: updated });

    setNewNoticeTitle('');
    setNewNoticeContent('');
    showToast(`Notice "${newN.title}" published! Live on /school-site immediately.`);
  };

  const handleToggleNoticePublish = (id: string) => {
    const updated = notices.map((n) => (n.id === id ? { ...n, isPublished: !n.isPublished } : n));
    setNotices(updated);
    updateWebsiteContent(currentSchoolId, { notices: updated });
    showToast('Notice publication status toggled.');
  };

  const handleDeleteNotice = (id: string) => {
    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    updateWebsiteContent(currentSchoolId, { notices: updated });
    showToast('Notice deleted.');
  };

  // ── EVENT CMS HANDLERS ──
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newE: WebsiteEvent = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      description: newEventDesc,
      date: newEventDate,
      time: newEventTime,
      venue: newEventVenue,
      isPublished: true,
      type: 'upcoming',
    };

    const updated = [newE, ...events];
    setEvents(updated);
    updateWebsiteContent(currentSchoolId, { events: updated });

    setNewEventTitle('');
    setNewEventDesc('');
    showToast(`Event "${newE.title}" added to public calendar!`);
  };

  const handleToggleEventPublish = (id: string) => {
    const updated = events.map((ev) => (ev.id === id ? { ...ev, isPublished: !ev.isPublished } : ev));
    setEvents(updated);
    updateWebsiteContent(currentSchoolId, { events: updated });
    showToast('Event visibility status updated.');
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((ev) => ev.id !== id);
    setEvents(updated);
    updateWebsiteContent(currentSchoolId, { events: updated });
    showToast('Event removed.');
  };

  // ── BRANDING SAVE ──
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent(currentSchoolId, {
      heroTitle,
      heroSubtitle,
      principalMessage,
    });
    showToast('Hero banner & Principal address updated on public website!');
  };

  // ── ACHIEVEMENTS CMS ──
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) return;

    const newA: WebsiteAchievement = {
      id: `ach-${Date.now()}`,
      title: newAchTitle,
      description: newAchDesc,
      year: newAchYear,
      category: 'Institutional Award',
    };

    const updated = [newA, ...achievements];
    setAchievements(updated);
    updateWebsiteContent(currentSchoolId, { achievements: updated });

    setNewAchTitle('');
    setNewAchDesc('');
    showToast('New achievement showcased on public website!');
  };

  const handleDeleteAchievement = (id: string) => {
    const updated = achievements.filter((a) => a.id !== id);
    setAchievements(updated);
    updateWebsiteContent(currentSchoolId, { achievements: updated });
    showToast('Achievement removed.');
  };

  // ── ADMISSIONS SAVE ──
  const handleSaveAdmissions = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteContent(currentSchoolId, {
      admissionInfo,
    });
    showToast('Admission criteria & dates updated on public portal!');
  };

  return (
    <PageWrapper
      title="Public Website CMS & Content Manager"
      subtitle={`Live administrative publishing portal for ${schoolConfig.name} public portal`}
      action={
        <div className="flex items-center gap-2">
          <Link
            to={`/school/${schoolSlug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border text-xs font-semibold text-blue-600 bg-card hover:bg-muted shadow-xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Open Public Website (Live Preview) ↗</span>
          </Link>
        </div>
      }
    >
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── CMS Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2 overflow-x-auto">
        {[
          { id: 'notices', label: 'Notices & Circulars', icon: Bell },
          { id: 'events', label: 'Events Calendar', icon: Calendar },
          { id: 'branding', label: 'Hero & Branding', icon: Layers },
          { id: 'achievements', label: 'Achievements Showcase', icon: Trophy },
          { id: 'admissions', label: 'Admission Policy', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: NOTICES CMS (Task 7.2.3) ── */}
      {activeTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Notice Form */}
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  Publish New Circular
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddNotice} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Notice Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Parent Teacher Meeting Scheduled"
                      value={newNoticeTitle}
                      onChange={(e) => setNewNoticeTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={newNoticeDate}
                      onChange={(e) => setNewNoticeDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Notice Content</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Full announcement body text..."
                      value={newNoticeContent}
                      onChange={(e) => setNewNoticeContent(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <Button type="submit" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Publish Immediately
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Active Notices List */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  Published Circulars ({notices.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notices.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl border border-border/80 bg-card space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{n.title}</span>
                        <Badge variant={n.isPublished ? 'success' : 'outline'} className="text-[10px]">
                          {n.isPublished ? 'Live' : 'Draft'}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{n.date}</span>
                    </div>

                    <p className="text-muted-foreground text-[11px] leading-relaxed">{n.content}</p>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleNoticePublish(n.id)}
                        className="text-[10px] h-7"
                      >
                        {n.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteNotice(n.id)}
                        className="text-[10px] h-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 2: EVENTS CMS (Task 7.2.3) ── */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  Add Campus Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Annual Science Fair"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold block mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">Time</label>
                      <input
                        type="text"
                        required
                        value={newEventTime}
                        onChange={(e) => setNewEventTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Venue</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Main School Ground"
                      value={newEventVenue}
                      onChange={(e) => setNewEventVenue(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Description</label>
                    <textarea
                      rows={2}
                      required
                      value={newEventDesc}
                      onChange={(e) => setNewEventDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <Button type="submit" size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
                    Add to Calendar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Campus Events Roster ({events.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-xl border border-border/80 bg-card space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{ev.title}</span>
                        <Badge variant={ev.isPublished ? 'success' : 'outline'} className="text-[10px]">
                          {ev.isPublished ? 'Published' : 'Hidden'}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono">{ev.date} • {ev.time}</span>
                    </div>

                    <p className="text-muted-foreground text-[11px]">{ev.description}</p>
                    <div className="text-[11px] text-muted-foreground">Venue: {ev.venue}</div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/60">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleEventPublish(ev.id)}
                        className="text-[10px] h-7"
                      >
                        {ev.isPublished ? 'Hide from Site' : 'Publish to Site'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="text-[10px] h-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB 3: BRANDING & HERO BANNER (Task 7.2.3) ── */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="space-y-6 max-w-3xl">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Hero Banner & Principal Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Hero Main Headline</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Hero Subtitle / Tagline</label>
                <input
                  type="text"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Principal's Address to Prospective Parents</label>
                <textarea
                  rows={4}
                  value={principalMessage}
                  onChange={(e) => setPrincipalMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                />
              </div>

              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Changes to Public Website
              </Button>
            </CardContent>
          </Card>
        </form>
      )}

      {/* ── TAB 4: ACHIEVEMENTS CMS (Task 7.2.3) ── */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-600" />
                  Add Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAchievement} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">Award Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., National Cyber Olympiad Gold Medal"
                      value={newAchTitle}
                      onChange={(e) => setNewAchTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Year</label>
                    <input
                      type="text"
                      required
                      value={newAchYear}
                      onChange={(e) => setNewAchYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold block mb-1">Description</label>
                    <textarea
                      rows={2}
                      required
                      value={newAchDesc}
                      onChange={(e) => setNewAchDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                    />
                  </div>

                  <Button type="submit" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs">
                    Showcase Achievement
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {achievements.map((ach) => (
              <div key={ach.id} className="p-3.5 rounded-xl border border-border/80 bg-card space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground">{ach.title}</h4>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {ach.year}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-[11px]">{ach.description}</p>
                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteAchievement(ach.id)}
                    className="text-[10px] h-7 text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 5: ADMISSION POLICY CMS (Task 7.2.3) ── */}
      {activeTab === 'admissions' && (
        <form onSubmit={handleSaveAdmissions} className="space-y-6 max-w-3xl">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">Admission Criteria & Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Public Admission Instructions</label>
                <textarea
                  rows={4}
                  value={admissionInfo}
                  onChange={(e) => setAdmissionInfo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                />
              </div>

              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                <Save className="w-3.5 h-3.5 mr-1" />
                Update Admission Policy
              </Button>
            </CardContent>
          </Card>
        </form>
      )}
    </PageWrapper>
  );
}
