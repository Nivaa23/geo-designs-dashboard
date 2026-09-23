import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainDashboardView } from './MainDashboardView';
import { ModulePlaceholderView } from './ModulePlaceholderView';
import type { NavModuleId } from '../../types/dashboard';

export const AppShell: React.FC = () => {
  const [activeModule, setActiveModule] = useState<NavModuleId>('overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        >
          {activeModule === 'overview' ? (
            <MainDashboardView />
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
