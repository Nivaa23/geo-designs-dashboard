import React from 'react';
import { FINANCIAL_RECOVERY_DATA } from '../../data/mockDashboardData';
import { DollarSign, ArrowUpRight } from 'lucide-react';

export const FinancialRecoverySection: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.35rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={16} style={{ color: 'var(--color-accent-500)' }} />
            Financial Commitments & Recovery Tracking
          </h3>
          <p style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '2px' }}>
            Operational commitments, client receivables clearance, and invoice recovery status.
          </p>
        </div>
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-accent-500)',
            fontSize: '0.78rem',
            fontWeight: 650,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          Full Summary
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Financial Category Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '0.75rem' }}>
        {FINANCIAL_RECOVERY_DATA.map((item) => {
          let statusBg = '#ECFDF5';
          let statusColor = '#047857';
          let statusBorder = '#A7F3D0';

          if (item.status === 'Attention Required') {
            statusBg = '#FFFBEB';
            statusColor = '#B45309';
            statusBorder = '#FDE68A';
          }

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>
                  {item.category}
                </span>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: statusBg,
                    border: `1px solid ${statusBorder}`,
                    color: statusColor,
                    fontSize: '0.65rem',
                    fontWeight: 650
                  }}
                >
                  {item.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: '#FFFFFF', padding: '0.55rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.64rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
                    COMMITTED EXPENSES
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginTop: '1px' }}>
                    {item.committedExpenses}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
                    OUTSTANDING RECOVERY
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#B45309', marginTop: '1px' }}>
                    {item.outstandingRecovery}
                  </div>
                </div>
              </div>

              {/* Progress meter */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748B', marginBottom: '3px' }}>
                  <span>Cleared: {item.recoveredAmount}</span>
                  <span style={{ fontWeight: 700, color: '#047857' }}>{item.recoveryRate}% Collection Rate</span>
                </div>
                <div
                  style={{
                    height: '5px',
                    width: '100%',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${item.recoveryRate}%`,
                      backgroundColor: '#059669',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
