import { create } from 'zustand';
import type {
  SuperSchoolItem,
  SaaSPlanConfig,
  SuperAlertItem,
  AuditLogItem,
  SecurityEventItem,
  SystemHealthMetric,
  SupportTicketItem,
  IntegrationConnector,
  SchoolStatus,
  PlanTier,
  HealthStatus,
} from '@/types/superAdmin';
import {
  initialSuperSchools,
  saasPlansData,
  revenueHistoryData,
  salesFunnelData,
  academicTrendsData,
  superAlertsData,
  auditLogsData,
  securityEventsData,
  systemHealthData,
  supportTicketsData,
  integrationsData,
} from '@/data/superAdminData';

interface SuperAdminState {
  schools: SuperSchoolItem[];
  plans: SaaSPlanConfig[];
  alerts: SuperAlertItem[];
  auditLogs: AuditLogItem[];
  securityEvents: SecurityEventItem[];
  systemHealth: SystemHealthMetric[];
  tickets: SupportTicketItem[];
  integrations: IntegrationConnector[];
  revenueHistory: typeof revenueHistoryData;
  salesFunnel: typeof salesFunnelData;
  academicTrends: typeof academicTrendsData;

  // Selected school for modal / drilldown
  selectedSchool: SuperSchoolItem | null;
  setSelectedSchool: (school: SuperSchoolItem | null) => void;

  // School actions
  updateSchoolStatus: (schoolId: string, status: SchoolStatus) => void;
  updateSchoolPlan: (schoolId: string, plan: PlanTier) => void;
  toggleSchoolFeatureFlag: (schoolId: string, featureKey: keyof SuperSchoolItem['featureFlags']) => void;
  createSchool: (newSchool: Partial<SuperSchoolItem>) => void;

  // Alert actions
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;

  // Security actions
  revokeUserSessions: (userEmail: string) => void;

  // Integrations actions
  toggleIntegrationStatus: (integrationId: string) => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set, get) => ({
  schools: initialSuperSchools,
  plans: saasPlansData,
  alerts: superAlertsData,
  auditLogs: auditLogsData,
  securityEvents: securityEventsData,
  systemHealth: systemHealthData,
  tickets: supportTicketsData,
  integrations: integrationsData,
  revenueHistory: revenueHistoryData,
  salesFunnel: salesFunnelData,
  academicTrends: academicTrendsData,

  selectedSchool: null,
  setSelectedSchool: (school) => set({ selectedSchool: school }),

  updateSchoolStatus: (schoolId, status) => {
    const state = get();
    const updated: SuperSchoolItem[] = state.schools.map((s) => {
      if (s.schoolId === schoolId) {
        const health: HealthStatus = status === 'Active' ? 'Healthy' : status === 'At Risk' ? 'At Risk' : 'Critical';
        return { ...s, status, health };
      }
      return s;
    });

    const target = state.schools.find((s) => s.schoolId === schoolId);
    const newAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Super Admin',
      actorRole: 'Super Admin',
      action: `SCHOOL_STATUS_CHANGED_TO_${status.toUpperCase()}`,
      schoolName: target?.name || schoolId,
      targetUser: `Tenant ${schoolId}`,
      oldValue: `Status: ${target?.status}`,
      newValue: `Status: ${status}`,
      ipAddress: '192.168.1.100',
    };

    set({ schools: updated, auditLogs: [newAudit, ...state.auditLogs] });
  },

  updateSchoolPlan: (schoolId, plan) => {
    const state = get();
    const planObj = state.plans.find((p) => p.name === plan);
    const mrr = planObj ? planObj.monthlyPrice : 1250;

    const updated = state.schools.map((s) => (s.schoolId === schoolId ? { ...s, plan, mrr } : s));

    const target = state.schools.find((s) => s.schoolId === schoolId);
    const newAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Super Admin',
      actorRole: 'Super Admin',
      action: 'SCHOOL_PLAN_UPDATED',
      schoolName: target?.name || schoolId,
      targetUser: `Tenant ${schoolId}`,
      oldValue: `Plan: ${target?.plan}`,
      newValue: `Plan: ${plan} (₹${mrr}/mo)`,
      ipAddress: '192.168.1.100',
    };

    set({ schools: updated, auditLogs: [newAudit, ...state.auditLogs] });
  },

  toggleSchoolFeatureFlag: (schoolId, featureKey) => {
    const state = get();
    const updated = state.schools.map((s) => {
      if (s.schoolId === schoolId) {
        const flags = { ...s.featureFlags, [featureKey]: !s.featureFlags[featureKey] };
        return { ...s, featureFlags: flags };
      }
      return s;
    });
    set({ schools: updated });
  },

  createSchool: (newSchool) => {
    const state = get();
    const schoolId = `sch-${Date.now().toString().slice(-4)}`;
    const fullSchool: SuperSchoolItem = {
      schoolId,
      name: newSchool.name || 'New Educational Institution',
      slug: newSchool.slug || 'new-school',
      location: newSchool.location || 'India',
      studentsCount: newSchool.studentsCount || 500,
      teachersCount: newSchool.teachersCount || 30,
      parentsCount: newSchool.parentsCount || 450,
      activeUsersCount: newSchool.activeUsersCount || 350,
      plan: newSchool.plan || 'Growth',
      status: 'Active',
      health: 'Healthy',
      createdDate: new Date().toISOString().split('T')[0],
      lastActivity: 'Just created',
      renewalDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
      mrr: newSchool.plan === 'Enterprise' ? 10000 : newSchool.plan === 'Growth' ? 3750 : 1250,
      contactEmail: newSchool.contactEmail || 'admin@newschool.edu.in',
      contactPhone: newSchool.contactPhone || '+91 98000 00000',
      principalName: newSchool.principalName || 'Principal',
      attendanceRate: 90,
      syllabusProgress: 80,
      dataCompletion: 85,
      openAlertsCount: 0,
      openActionsCount: 0,
      featureFlags: {
        aiAssistant: true,
        publicWebsite: true,
        parentCommunication: true,
        onlinePayment: true,
        teacherFeedback: true,
        complaintSystem: true,
        interventionTracking: true,
      },
    };

    const newAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Super Admin',
      actorRole: 'Super Admin',
      action: 'NEW_SCHOOL_PROVISIONED',
      schoolName: fullSchool.name,
      targetUser: `Tenant ${schoolId}`,
      oldValue: 'None',
      newValue: `Plan: ${fullSchool.plan}, Status: Active`,
      ipAddress: '192.168.1.100',
    };

    set({ schools: [fullSchool, ...state.schools], auditLogs: [newAudit, ...state.auditLogs] });
  },

  acknowledgeAlert: (alertId) => {
    const state = get();
    const updated = state.alerts.map((a) =>
      a.id === alertId ? { ...a, status: 'Acknowledged' as const, assignedTo: 'Super Admin' } : a
    );
    set({ alerts: updated });
  },

  resolveAlert: (alertId) => {
    const state = get();
    const updated = state.alerts.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' as const } : a));
    set({ alerts: updated });
  },

  revokeUserSessions: (userEmail) => {
    const state = get();
    const newAudit: AuditLogItem = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Super Admin',
      actorRole: 'Super Admin',
      action: 'FORCE_REVOKE_USER_SESSIONS',
      schoolName: 'Security Operations Center',
      targetUser: userEmail,
      oldValue: 'Active Sessions: 3',
      newValue: 'Active Sessions: 0 (Revoked)',
      ipAddress: '192.168.1.100',
    };
    set({ auditLogs: [newAudit, ...state.auditLogs] });
  },

  toggleIntegrationStatus: (integrationId) => {
    const state = get();
    const updated = state.integrations.map((i) => {
      if (i.id === integrationId) {
        const status = i.status === 'Connected' ? ('Disconnected' as const) : ('Connected' as const);
        return { ...i, status };
      }
      return i;
    });
    set({ integrations: updated });
  },
}));
