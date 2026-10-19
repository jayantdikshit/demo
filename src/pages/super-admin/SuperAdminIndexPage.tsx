import React, { useState } from 'react';
import { SuperAdminLayout } from './SuperAdminLayout';
import { SuperDashboardOverview } from './SuperDashboardOverview';
import { SchoolsManagementView } from './SchoolsManagementView';
import { GlobalUserManagementView } from './GlobalUserManagementView';
import { SubscriptionManagementView } from './SubscriptionManagementView';
import { RevenueDashboardView } from './RevenueDashboardView';
import { SalesDashboardView } from './SalesDashboardView';
import { ProductUsageView } from './ProductUsageView';
import { AcademicIntelligenceView } from './AcademicIntelligenceView';
import { AlertCenterView } from './AlertCenterView';
import { AuditLogsView } from './AuditLogsView';
import { SecurityCenterView } from './SecurityCenterView';
import { SystemHealthView } from './SystemHealthView';
import { SupportSuccessView } from './SupportSuccessView';
import { ConfigurationCenterView } from './ConfigurationCenterView';
import { IntegrationsView } from './IntegrationsView';

export function SuperAdminIndexPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperDashboardOverview setActiveTab={setActiveTab} />;
      case 'schools':
        return <SchoolsManagementView />;
      case 'users':
        return <GlobalUserManagementView />;
      case 'subscriptions':
        return <SubscriptionManagementView />;
      case 'revenue':
        return <RevenueDashboardView />;
      case 'sales':
        return <SalesDashboardView />;
      case 'product-usage':
        return <ProductUsageView />;
      case 'academic-intel':
        return <AcademicIntelligenceView />;
      case 'alerts':
        return <AlertCenterView />;
      case 'audit-logs':
        return <AuditLogsView />;
      case 'security':
        return <SecurityCenterView />;
      case 'system-health':
        return <SystemHealthView />;
      case 'support':
        return <SupportSuccessView />;
      case 'config':
        return <ConfigurationCenterView />;
      case 'integrations':
        return <IntegrationsView />;
      default:
        return <SuperDashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <SuperAdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderActiveTabContent()}
    </SuperAdminLayout>
  );
}
