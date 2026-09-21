import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { GeoBrandLogo } from '../common/GeoBrandLogo';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { LogOut } from 'lucide-react';

export const DashboardShellPlaceholder: React.FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        color: 'var(--text-primary)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Restrained Top Navigation Bar */}
      <header
        style={{
          height: '60px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-card)',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <GeoBrandLogo size="sm" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>
              {currentUser?.name || 'Authenticated Staff'}
            </span>
            {currentUser?.role && <Badge label={currentUser.role} role={currentUser.role} />}
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-default)' }} />

          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            iconLeft={<LogOut size={14} />}
          >
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main style={{ flex: 1, padding: '2.5rem 1.5rem', maxWidth: '1000px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <h1 style={{ fontSize: '1.4rem', color: '#F8FAFC', marginBottom: '0.35rem' }}>
              Workspace Authenticated
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Session active for <strong>{currentUser?.email}</strong> ({currentUser?.role} &bull; {currentUser?.department || 'Operations'}).
            </p>
          </div>

          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.85rem'
            }}
          >
            <h3 style={{ fontSize: '1rem', color: '#F8FAFC' }}>Phase 1 Scope Completed</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Authentication experience, password change policies, and error handling have been validated. Internal operational modules (Employee Directory, Attendance, Projects, Tasks) will be introduced in subsequent project phases.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};
