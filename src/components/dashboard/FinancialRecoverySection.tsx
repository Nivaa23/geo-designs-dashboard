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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ textAlign: 'left' }}>
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#0F172A',
              lineHeight: 1.25,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: 0,
              textAlign: 'left'
            }}
          >
            <DollarSign size={18} style={{ color: 'var(--color-accent-500)' }} />
            Financial Commitments & Recovery Tracking
          </h3>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 400,
              color: '#64748B',
              lineHeight: 1.4,
              marginTop: '4px',
              margin: '4px 0 0 0',
              textAlign: 'left'
            }}
          >
            Operational commitments, client receivables clearance, and invoice recovery status.
          </p>
        </div>
        <button
          type="button"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-accent-500)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: 0,
            flexShrink: 0,
            marginTop: '2px'
          }}
        >
          Full Summary
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Financial Category Breakdown Grid — Two Equal Width Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.85rem'
        }}
        className="geo-dashboard-grid-2col"
      >
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
                gap: '0.75rem'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <h4
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0F172A',
                    lineHeight: 1.3,
                    margin: 0,
                    textAlign: 'left'
                  }}
                >
                  {item.category}
                </h4>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: statusBg,
                    border: `1px solid ${statusBorder}`,
                    color: statusColor,
                    fontSize: '11px',
                    fontWeight: 600,
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.status}
                </span>
              </div>

              {/* Metric Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                  backgroundColor: '#FFFFFF',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    COMMITTED EXPENSES
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginTop: '2px' }}>
                    {item.committedExpenses}
                  </div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
                    OUTSTANDING RECOVERY
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#B45309', marginTop: '2px' }}>
                    {item.outstandingRecovery}
                  </div>
                </div>
              </div>

              {/* Progress meter */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    marginBottom: '4px'
                  }}
                >
                  <span style={{ fontWeight: 400, color: '#64748B' }}>Cleared: {item.recoveredAmount}</span>
                  <span style={{ fontWeight: 600, color: '#047857' }}>{item.recoveryRate}% Collection Rate</span>
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
