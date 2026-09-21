import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockAuthService } from '../../services/mockAuthService';
import type { AuthScreenView } from '../../types/auth';
import { Sliders, User, Monitor, ChevronUp, ChevronDown } from 'lucide-react';

export const DemoControlsBar: React.FC = () => {
  const { currentView, setCurrentView, switchSeedUser, logout, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const seedUsers = mockAuthService.getSeedUsers();

  const screenViews: { view: AuthScreenView; label: string }[] = [
    { view: 'login', label: '1. Login Screen' },
    { view: 'force-password-change', label: '2. First-Time Password Change' },
    { view: 'forgot-password', label: '3. Forgot Password Request' },
    { view: 'forgot-password-success', label: '3b. Forgot Email Confirmation' },
    { view: 'reset-password', label: '4. Reset Password Token' },
    { view: 'error-state-showcase', label: '5. Error & Session States' },
    { view: 'dashboard', label: '6. Authenticated Shell' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: '#070A10',
        borderTop: '1px solid var(--color-accent-500)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.6)',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.45rem 1.25rem',
          backgroundColor: '#0F172A',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-accent-400)' }}>
          <Sliders size={16} />
          <span>PHASE 1 DEMO CONTROLS &amp; AUDIT TOOLBAR</span>
          <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
            Current View: <strong style={{ color: '#F8FAFC' }}>{currentView}</strong>
            {currentUser && ` | Signed in as: ${currentUser.name} (${currentUser.role})`}
          </span>
        </div>

        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem'
          }}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          <span>{isOpen ? 'Minimize Toolbar' : 'Expand Toolbar'}</span>
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            padding: '0.85rem 1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem',
            alignItems: 'center',
            borderTop: '1px solid var(--border-color-subtle)',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={13} /> 1-Click Role Login:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {seedUsers.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => switchSeedUser(u)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: currentUser?.id === u.id ? '1px solid var(--color-accent-400)' : '1px solid var(--color-brand-700)',
                    backgroundColor: currentUser?.id === u.id ? 'var(--color-accent-light)' : 'var(--color-brand-900)',
                    color: currentUser?.id === u.id ? '#38BDF8' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontWeight: currentUser?.id === u.id ? 700 : 400
                  }}
                  title={`${u.email} (${u.role}${u.isFirstLogin ? ' - First Login' : ''})`}
                >
                  {u.name} ({u.role}) {u.isFirstLogin && '⚡'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-color-default)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Monitor size={13} /> Screen Navigation:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {screenViews.map((sv) => (
                <button
                  key={sv.view}
                  type="button"
                  onClick={() => setCurrentView(sv.view)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: currentView === sv.view ? '1px solid var(--color-success)' : '1px solid var(--color-brand-700)',
                    backgroundColor: currentView === sv.view ? 'var(--color-success-bg)' : 'transparent',
                    color: currentView === sv.view ? '#34D399' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: currentView === sv.view ? 700 : 400
                  }}
                >
                  {sv.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginLeft: 'auto' }}>
            <button
              type="button"
              onClick={logout}
              style={{
                padding: '0.4rem 0.8rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-error-border)',
                backgroundColor: 'var(--color-error-bg)',
                color: '#FB7185',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Reset Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
