import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainDashboardView } from './MainDashboardView';
import { InquiryManagementView } from './InquiryManagementView';
import { ToDoListView } from './ToDoListView';
import { StrategicMarketingView } from './StrategicMarketingView';
import { ProjectTrackingView } from './ProjectTrackingView';
import { MajorProjectsView } from './MajorProjectsView';
import { AccountExpensesView } from './AccountExpensesView';
import { FinanceRecoveryView } from './FinanceRecoveryView';
import { ModulePlaceholderView } from './ModulePlaceholderView';
import type { NavModuleId } from '../../types/dashboard';

export const AppShell: React.FC = () => {
  const [activeModule, setActiveModule] = useState<NavModuleId>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('geo_sidebar_collapsed') === 'true';
  });

  const handleToggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('geo_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        overflow: 'hidden'
      }}
    >
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Area — Independently Scrollable Right Pane */}
      <div
        style={{
          flex: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Prevents flex child overflow
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Top Header */}
        <Header
          activeModule={activeModule}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={handleToggleSidebarCollapse}
        />

        {/* Dynamic Main Body Workspace */}
        <main
          style={{
            flex: 1,
            padding: '1.25rem 1.5rem 2rem 1.5rem',
            maxWidth: '1600px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
          className="geo-main-workspace"
        >
          {activeModule === 'overview' ? (
            <MainDashboardView />
          ) : activeModule === 'inquiry-management' ? (
            <InquiryManagementView onReturnToOverview={() => setActiveModule('overview')} />
          ) : activeModule === 'daily-critical-activities' ? (
            <ToDoListView onReturnToOverview={() => setActiveModule('overview')} />
          ) : activeModule === 'strategic-marketing' ? (
            <StrategicMarketingView onReturnToOverview={() => setActiveModule('overview')} />
          ) : activeModule === 'project-tracking' ? (
            <ProjectTrackingView onReturnToOverview={() => setActiveModule('overview')} />
          ) : activeModule === 'major-projects' ? (
            <MajorProjectsView onReturnToOverview={() => setActiveModule('overview')} />
          ) : activeModule === 'account-expenses' ? (
            <AccountExpensesView onReturnToOverview={() => setActiveModule('overview')} />
          ) : activeModule === 'finance-recovery' ? (
            <FinanceRecoveryView onReturnToOverview={() => setActiveModule('overview')} />
          ) : (
            <ModulePlaceholderView
              moduleId={activeModule}
              onReturnToOverview={() => setActiveModule('overview')}
            />
          )}
        </main>
      </div>
    </div>
  );
};
