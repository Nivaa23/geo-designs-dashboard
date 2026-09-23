import React from 'react';
import { NAV_ITEMS } from '../../data/mockDashboardData';
import type { NavModuleId } from '../../types/dashboard';
import { ArrowLeft, Layers, ShieldCheck } from 'lucide-react';

interface ModulePlaceholderViewProps {
  moduleId: NavModuleId;
  onReturnToOverview: () => void;
}

export const ModulePlaceholderView: React.FC<ModulePlaceholderViewProps> = ({
  moduleId,
  onReturnToOverview
}) => {
  const item = NAV_ITEMS.find((n) => n.id === moduleId) || NAV_ITEMS[0];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '0.25rem 0'
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(2, 132, 199, 0.2)',
                color: 'var(--color-accent-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Layers size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent-600)' }}>
                CONTRACTED OPERATIONAL MODULE
              </div>
              <h2 style={{ fontSize: '1.35rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2 }}>
                {item.label}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onReturnToOverview}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '0.8125rem',
              fontWeight: 650,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent-500)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.backgroundColor = '#F8FAFC';
            }}
          >
            <ArrowLeft size={15} />
            Return to Dashboard Overview
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, maxWidth: '800px' }}>
          {item.description}. This module is part of the contracted Geo Designs & Research product roadmap and will be implemented in its dedicated development sprint. The Main Dashboard / Overview reflects high-level summaries for this module.
        </p>

        <div
          style={{
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.78rem',
            color: '#334155'
          }}
        >
          <ShieldCheck size={18} style={{ color: '#059669', flexShrink: 0 }} />
          <span>
            Active module route: <strong>{item.label}</strong>. Global theme engine, header navigation, and layout context remain fully functional.
          </span>
        </div>
      </div>
    </div>
  );
};
