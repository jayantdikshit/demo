// ============================================================
// SUPER ADMIN TYPES — Multi-Tenant SaaS Platform Governance
// ============================================================

export type SchoolStatus = 'Active' | 'Trial' | 'At Risk' | 'Suspended';
export type PlanTier = 'Starter' | 'Growth' | 'Enterprise';
export type HealthStatus = 'Healthy' | 'At Risk' | 'Critical';
export type AlertSeverity = 'Critical' | 'High' | 'Medium' | 'Info';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Escalated';

export interface SuperSchoolItem {
  schoolId: string;
  name: string;
  slug: string;
  location: string;
  studentsCount: number;
  teachersCount: number;
  parentsCount: number;
  activeUsersCount: number;
  plan: PlanTier;
  status: SchoolStatus;
  health: HealthStatus;
  createdDate: string;
  lastActivity: string;
  renewalDate: string;
  mrr: number;
  contactEmail: string;
  contactPhone: string;
  principalName: string;
  attendanceRate: number;
  syllabusProgress: number;
  dataCompletion: number;
  openAlertsCount: number;
  openActionsCount: number;
  featureFlags: {
    aiAssistant: boolean;
    publicWebsite: boolean;
    parentCommunication: boolean;
    onlinePayment: boolean;
    teacherFeedback: boolean;
    complaintSystem: boolean;
    interventionTracking: boolean;
  };
}

export interface SaaSPlanConfig {
  id: string;
  name: PlanTier;
  monthlyPrice: number;
  annualPrice: number;
  studentLimit: number;
  userLimit: number;
  storageGb: number;
  features: string[];
  activeSchoolsCount: number;
}

export interface SuperUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'School Admin' | 'Principal' | 'Teacher' | 'Student' | 'Parent' | 'Accounts';
  schoolName: string;
  schoolId: string;
  status: 'Active' | 'Disabled' | 'Pending';
  lastLogin: string;
  phone: string;
}

export interface RevenueDataPoint {
  month: string;
  mrr: number;
  arr: number;
  newRevenue: number;
  expansion: number;
  churn: number;
}

export interface SalesFunnelStage {
  stage: string;
  count: number;
  conversionRate: number;
  value: number;
}

export interface ProductUsageMetric {
  category: string;
  metric: string;
  value: string | number;
  change: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface AcademicTrendItem {
  issue: string;
  affectedSchoolsCount: number;
  percentage: number;
  severity: AlertSeverity;
}

export interface SuperAlertItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  schoolName?: string;
  schoolId?: string;
  timestamp: string;
  status: 'Unacknowledged' | 'Acknowledged' | 'Resolved';
  assignedTo?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  schoolName: string;
  targetUser: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
}

export interface SecurityEventItem {
  id: string;
  timestamp: string;
  eventType: 'Failed Login' | 'Suspicious IP' | 'Permission Override' | 'Session Revoked' | 'Password Reset';
  userEmail: string;
  schoolName: string;
  ipAddress: string;
  riskScore: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Investigating' | 'Blocked' | 'Cleared';
}

export interface SystemHealthMetric {
  name: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  uptime: string;
  latency: string;
  errorRate: string;
}

export interface SupportTicketItem {
  id: string;
  schoolName: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  status: TicketStatus;
  createdAt: string;
  lastUpdated: string;
  csatScore?: number;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category: 'Communication' | 'Payment' | 'Storage' | 'Analytics';
  provider: string;
  status: 'Connected' | 'Disconnected' | 'Degraded';
  lastSync: string;
  apiRequestsToday: number;
  errorCount: number;
}
