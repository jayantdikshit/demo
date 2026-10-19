import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { useSchoolData } from '@/hooks/useSchoolData';
import {
  MessageSquare,
  Smartphone,
  Mail,
  CheckCheck,
  Phone,
  ShieldCheck,
  Calendar,
  IndianRupee,
  AlertTriangle,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export interface AlertPreset {
  id: string;
  name: string;
  category: 'Absence' | 'Attendance' | 'Marks' | 'Risk' | 'Fee' | 'Payment' | 'Syllabus' | 'Intervention';
  title: string;
  message: string;
  smsText: string;
  emailSubject: string;
  emailBody: string;
  urgency: 'high' | 'medium' | 'low';
}

export const alertPresets: AlertPreset[] = [
  {
    id: 'student_absent',
    name: '1. Student Absent Today',
    category: 'Absence',
    title: 'Student Unscheduled Absence Notice',
    message: 'Aarav Sharma (Class 6-A, Roll #101) was marked ABSENT for morning attendance today without prior leave slip.',
    smsText: 'VPS ALERT: Aarav Sharma (6-A, #101) is ABSENT today (09-Sep). If unexpected, please contact the class teacher immediately at +91 98765 43210.',
    emailSubject: 'URGENT: Daily Attendance Notification - Aarav Sharma Absent',
    emailBody: 'This is an automated notification from Vidya Public School. Your ward, Aarav Sharma (Class 6-A), has been marked ABSENT today. Please submit a medical certificate or formal leave application if illness or emergency occurred.',
    urgency: 'high',
  },
  {
    id: 'attendance_below_threshold',
    name: '2. Attendance < 75% Alert',
    category: 'Attendance',
    title: 'Critical Attendance Deficit (<75%)',
    message: 'Aarav Sharma current aggregate attendance is 71.4%, which falls below the mandatory 75% CBSE compliance threshold.',
    smsText: 'VPS ADVISORY: Aarav Sharma attendance is 71.4%, below mandatory 75% threshold. Please meet Class Teacher on Saturday to review attendance deficit.',
    emailSubject: 'STATUTORY WARNING: Attendance Shortage Advisory - Aarav Sharma (71.4%)',
    emailBody: 'Under CBSE Regulation Chapter 7, minimum 75% cumulative attendance is mandatory for academic board clearance. Please ensure regular attendance in the upcoming instructional cycle.',
    urgency: 'high',
  },
  {
    id: 'marks_below_threshold',
    name: '3. Marks Below Threshold',
    category: 'Marks',
    title: 'Academic Alert: Score Below Passing Standard',
    message: 'Aarav Sharma scored 14/40 (35.0%) in Mathematics Unit Test 1, which is below the school threshold of 40%.',
    smsText: 'VPS ACADEMICS: Aarav scored 14/40 in Math UT-1 (below 40% benchmark). Remedial doubt-clearing sessions scheduled Tue & Thu 3:30 PM.',
    emailSubject: 'Academic Performance Advisory: Unit Test 1 Mathematics Score',
    emailBody: 'Your child scored 14/40 in Mathematics Unit Test 1. Our academic intelligence system has initiated a focused remedial intervention. Parent-teacher conference is recommended.',
    urgency: 'high',
  },
  {
    id: 'poor_performance',
    name: '4. At-Risk Compound Warning',
    category: 'Risk',
    title: 'Multi-Factor At-Risk Alert',
    message: 'Aarav Sharma flagged with compound academic risk: declining scores in 2 subjects + attendance under 75% in the last 30 days.',
    smsText: 'VPS COUNSELING: Multi-risk indicators flagged for Aarav Sharma (Academics + Attendance). Vice Principal invites parents for consultation on Friday 2 PM.',
    emailSubject: 'Student Academic Advisory & Counseling Invitation - Aarav Sharma',
    emailBody: 'Our digital intelligence monitoring flagged a composite risk profile. We are arranging personal mentoring and request parent participation in the upcoming review meet.',
    urgency: 'high',
  },
  {
    id: 'fee_pending',
    name: '5. Fee Overdue Notice',
    category: 'Fee',
    title: 'Term 2 Fee Overdue Notice',
    message: 'Institutional fee demand of ₹15,000 for Term 2 (Tuition & Laboratory) is pending past the due date (15-Aug).',
    smsText: 'VPS ACCOUNTS: Reminder: Term 2 fee of ₹15,000 for Aarav Sharma is overdue. Pay online at https://vps.edu/pay?stu=101 to avoid late fine.',
    emailSubject: 'Payment Reminder: Outstanding Fee Demand for Term 2 (₹15,000)',
    emailBody: 'The second installment of academic tuition and development fee is overdue. Please settle via our parent online portal or UPI QR scanner to receive instant tax receipts.',
    urgency: 'high',
  },
  {
    id: 'payment_submitted',
    name: '6. Payment Submitted Verification',
    category: 'Payment',
    title: 'Fee Payment Received — In Verification Queue',
    message: 'Fee payment receipt of ₹15,000 via UPI (UTR: 8941208942) has been submitted and is currently being audited by Accounts.',
    smsText: 'VPS PAY: Receipt for ₹15,000 submitted successfully for Aarav Sharma. Verification in progress. Official receipt will be issued in 24 hours.',
    emailSubject: 'Payment Acknowledgment: Transaction Submitted for Verification',
    emailBody: 'Thank you for submitting your fee payment. Our accounts division has placed the transaction in the fast-track verification queue. You will receive an SMS confirmation once verified.',
    urgency: 'medium',
  },
  {
    id: 'syllabus_delayed',
    name: '7. Syllabus Delivery Delay',
    category: 'Syllabus',
    title: 'Curriculum Progression Alert',
    message: 'Mathematics Chapter 4 (Fractions & Decimals) is running 5 instructional days behind the planned academic milestone.',
    smsText: 'VPS CURRICULUM: Extra zero-period classes scheduled this week for Class 6-A to ensure complete coverage of Mathematics syllabus ahead of Term Exam.',
    emailSubject: 'Class 6-A Academic Update: Supplemental Instructional Schedule',
    emailBody: 'To maintain curriculum pace following recent public holidays, supplemental zero-period sessions have been introduced for Class 6-A Mathematics. Regular transport is arranged.',
    urgency: 'medium',
  },
  {
    id: 'intervention_review',
    name: '8. Intervention Review Due',
    category: 'Intervention',
    title: 'Student Remedial Review Milestone',
    message: 'Aarav Sharma 2-week remedial Math intervention is due for milestone assessment and teacher-parent signoff today.',
    smsText: 'VPS PROGRESS: Aarav Sharma has completed the 14-day Math remediation module. Review report card is now available in the student dashboard.',
    emailSubject: 'Remedial Intervention Milestone Report: Aarav Sharma',
    emailBody: 'We are pleased to share that Aarav completed the diagnostic remedial module. His concept clarity scores improved by +24%. Detailed progress dossier is attached.',
    urgency: 'medium',
  },
];

interface SimulatedParentViewProps {
  initialAlertId?: string;
  className?: string;
}

export function SimulatedParentView({ initialAlertId, className = '' }: SimulatedParentViewProps) {
  const { schoolConfig } = useSchoolData();
  const [selectedAlertId, setSelectedAlertId] = useState<string>(initialAlertId || alertPresets[0].id);
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');

  const activeAlert = alertPresets.find((a) => a.id === selectedAlertId) || alertPresets[0];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Alert Preset Selector Bar */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Simulate 8 Parent Alert Scenarios:
            </span>
          </div>
          <Badge variant="outline" className="text-[11px] font-mono">
            {activeAlert.category} Alert
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {alertPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedAlertId(preset.id)}
              className={`text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer truncate ${
                selectedAlertId === preset.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                  : 'border-border/60 hover:bg-muted/50 text-foreground/80'
              }`}
            >
              <div className="truncate">{preset.name}</div>
              <div className="text-[10px] text-muted-foreground font-normal truncate mt-0.5">
                {preset.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Channel Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-border/70 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChannel('whatsapp')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              channel === 'whatsapp'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            WhatsApp Channel
          </button>
          <button
            onClick={() => setChannel('sms')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              channel === 'sms'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            SMS / Cellular Channel
          </button>
          <button
            onClick={() => setChannel('email')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              channel === 'email'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-muted/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Official Email Dispatch
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Simulated Live Delivery Mockup</span>
        </div>
      </div>

      {/* ── Channel View Renderers ── */}

      {/* 1. WHATSAPP MOCKUP */}
      {channel === 'whatsapp' && (
        <div className="max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-neutral-800 bg-[#E5DDD5] dark:bg-[#0B141A] font-sans">
          {/* WhatsApp Header */}
          <div className="bg-[#075E54] dark:bg-[#202C33] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-lg border border-white/30">
                {schoolConfig.logo || '🏫'}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                  <span>{schoolConfig.shortName || 'Vidya Public School'}</span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 text-[8px] text-black flex items-center justify-center font-bold">✓</span>
                </div>
                <p className="text-[10px] text-emerald-200">Verified Institutional Account • Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Phone className="w-4 h-4" />
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="p-4 space-y-3 min-h-[380px] flex flex-col justify-end">
            <div className="self-center bg-[#FFEECD] dark:bg-[#182229] text-amber-900 dark:text-amber-200 px-3 py-1 rounded-lg text-[10px] shadow-xs text-center max-w-[85%] border border-amber-300/40">
              🔒 End-to-end encrypted official communication from {schoolConfig.name}.
            </div>

            {/* School Message Bubble */}
            <div className="self-start max-w-[90%] bg-white dark:bg-[#202C33] text-neutral-900 dark:text-neutral-100 rounded-2xl rounded-tl-xs p-3.5 shadow-md border border-neutral-200/50 dark:border-neutral-700/50 space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-1.5">
                <span className="text-[11px] font-bold text-[#075E54] dark:text-[#25D366]">
                  {activeAlert.title}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold uppercase">
                  {activeAlert.urgency}
                </span>
              </div>

              <p className="text-xs leading-relaxed font-normal">{activeAlert.message}</p>

              <div className="bg-neutral-50 dark:bg-neutral-800/60 p-2 rounded-xl text-[11px] space-y-1 border border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                  <span>Student:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">Aarav Sharma (6-A)</span>
                </div>
                <div className="flex justify-between text-neutral-600 dark:text-neutral-300">
                  <span>Timestamp:</span>
                  <span>Today, 10:45 AM</span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500">
                <span className="text-[#075E54] dark:text-[#25D366] font-semibold flex items-center gap-1 cursor-pointer">
                  <span>Tap to view in Parent Portal</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </span>
                <span className="flex items-center gap-1">
                  10:45 AM <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </span>
              </div>
            </div>

            {/* Quick Action Button in WhatsApp */}
            <div className="self-start w-[90%] bg-[#F0F2F5] dark:bg-[#111B21] border border-neutral-300 dark:border-neutral-700 rounded-xl p-2.5 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 shadow-xs cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center justify-center gap-1.5">
              <span>Acknowledge & Respond to School</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* 2. SMS / CELLULAR MOCKUP */}
      {channel === 'sms' && (
        <div className="max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-neutral-800 bg-neutral-900 font-sans text-neutral-100">
          {/* Phone Header */}
          <div className="bg-neutral-800/80 backdrop-blur px-4 py-3 flex items-center justify-between border-b border-neutral-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                SMS
              </div>
              <div>
                <div className="font-bold text-xs tracking-wide">VK-VIDYAPUB</div>
                <div className="text-[10px] text-neutral-400">Official Institutional SMS Gateway</div>
              </div>
            </div>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
              Delivered
            </Badge>
          </div>

          {/* SMS Body */}
          <div className="p-4 space-y-4 min-h-[380px] bg-neutral-950 flex flex-col justify-between">
            <div className="text-center">
              <span className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-0.5 rounded-full">
                Today 10:45 AM
              </span>
            </div>

            <div className="bg-neutral-800 text-neutral-100 rounded-2xl rounded-tl-xs p-4 shadow-lg space-y-2 border border-neutral-700">
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-bold">
                <Smartphone className="w-3.5 h-3.5" />
                <span>INSTITUTIONAL SMS NOTIFICATION</span>
              </div>
              <p className="text-xs leading-relaxed font-mono text-neutral-200">
                {activeAlert.smsText}
              </p>
              <div className="text-[10px] text-neutral-400 pt-2 border-t border-neutral-700/60">
                Msg ID: VPS-{Date.now().toString().slice(-6)} • Sender: EduPulse Automated Relay
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl text-center text-[10px] text-neutral-400">
              Reply STOP to opt-out. For parent assistance, call school helpline at +91 98765 43210.
            </div>
          </div>
        </div>
      )}

      {/* 3. EMAIL DISPATCH MOCKUP */}
      {channel === 'email' && (
        <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
          {/* Email Client Header */}
          <div className="bg-muted/60 p-4 border-b border-border/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">From:</span>
              <span className="font-semibold text-foreground">
                EduPulse Notifications &lt;alerts@vidyapublic.edu.in&gt;
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">To:</span>
              <span className="font-semibold text-foreground">
                Ramesh Sharma &lt;ramesh.sharma@example.com&gt;
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subject:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {activeAlert.emailSubject}
              </span>
            </div>
          </div>

          {/* HTML Email Template */}
          <div className="p-6 md:p-8 space-y-6">
            {/* School Header Banner */}
            <div className="flex items-center justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl flex items-center justify-center font-bold shadow-md">
                  {schoolConfig.logo || '🏛️'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">{schoolConfig.name}</h2>
                  <p className="text-xs text-muted-foreground">{schoolConfig.address || 'Knowledge Park, Noida, UP'}</p>
                </div>
              </div>
              <Badge variant={activeAlert.urgency === 'high' ? 'destructive' : 'warning'}>
                {activeAlert.urgency.toUpperCase()} PRIORITY
              </Badge>
            </div>

            {/* Email Greeting & Body */}
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <p>Dear Mr. Ramesh Sharma,</p>
              <p>{activeAlert.emailBody}</p>

              {/* Student Context Table */}
              <div className="bg-muted/40 rounded-xl p-4 border border-border/70 space-y-2 text-xs">
                <div className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">
                  Student Record Particulars
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Student Name</span>
                    <span className="font-semibold text-foreground">Aarav Sharma</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Class / Roll No</span>
                    <span className="font-semibold text-foreground">6-A • Roll #101</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Date of Incident</span>
                    <span className="font-semibold text-foreground">09-Sep-2026</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Reference ID</span>
                    <span className="font-mono font-semibold text-blue-600">NOTIF-98214</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                  onClick={() => alert(`Redirecting to official student action portal...`)}
                >
                  Access Parent Intelligence Portal
                  <ExternalLink className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Signoff */}
            <div className="border-t border-border/80 pt-4 text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Office of Academic & Accounts Administration</p>
              <p>{schoolConfig.name} • Contact: {schoolConfig.phone || '+91 98765 43210'}</p>
              <p className="text-[10px] text-muted-foreground/80">
                This is an authenticated system notification generated by the EduPulse Digital Intelligence Platform.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
