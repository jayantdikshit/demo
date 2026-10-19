import React from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { NotificationCenter } from '@/components/communication/NotificationCenter';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { MessageSquare, Smartphone, Mail, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export function AccountsCommunicationPage() {
  return (
    <PageWrapper
      title="Parent Communication & Automated Alert Center"
      subtitle="Simulated multi-channel delivery pipeline (WhatsApp, SMS, Email) across all 8 institutional alert triggers"
      statusBadge={
        <Badge variant="success" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
          8 Channels Active
        </Badge>
      }
    >
      {/* ── Architecture Pipeline Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>EduPulse Digital Communication Engine (Task 6.5 & 6.6)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black">
            Detect → Alert → Action → Follow-up → Improvement
          </h2>
          <p className="text-xs md:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Every institutional event (unscheduled absence, exam marks below 40%, fee payment submission, or syllabus delay) is automatically evaluated against school thresholds and dispatched across WhatsApp, SMS, and Email in real time.
          </p>
        </div>
      </div>

      {/* ── Notification Center & Parent View Component ── */}
      <NotificationCenter roleFilter="accounts" showSimulateTrigger={true} />
    </PageWrapper>
  );
}
