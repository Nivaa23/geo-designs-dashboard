import React from 'react';
import { KPI_SUMMARY_CARDS } from '../../data/mockDashboardData';
import { Briefcase, Inbox, CheckSquare, Layers, DollarSign, TrendingUp } from 'lucide-react';

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase size={18} />,
  Inbox: <Inbox size={18} />,
  CheckSquare: <CheckSquare size={18} />,
  Layers: <Layers size={18} />,
  DollarSign: <DollarSign size={18} />
};

export const KpiCardsGrid: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '0.85rem',
        width: '100%'
      }}
    >
      {KPI_SUMMARY_CARDS.map((card) => {
        const icon = ICON_COMPONENTS[card.iconName] || <Briefcase size={18} />;

        // Light Theme status badge color mapping
        let badgeBg = 'rgba(2, 132, 199, 0.08)';
        let badgeColor = 'var(--color-accent-600)';
        let badgeBorder = 'rgba(2, 132, 199, 0.2)';

        if (card.statusType === 'success') {
          badgeBg = '#ECFDF5';
          badgeColor = '#047857';
          badgeBorder = '#A7F3D0';
        } else if (card.statusType === 'warning') {
          badgeBg = '#FFFBEB';
          badgeColor = '#B45309';
          badgeBorder = '#FDE68A';
        } else if (card.statusType === 'info') {
          badgeBg = '#F0F9FF';
          badgeColor = '#0369A1';
          badgeBorder = '#BAE6FD';
        }

        // Format card title for Change 13
        const titleText = card.id === 'kpi-active-projects' ? 'Active Projects'
          : card.id === 'kpi-pending-inquiries' ? 'Pending Inquiries'
          : card.id === 'kpi-daily-activities' ? "Today's Critical Activities"
          : card.id === 'kpi-major-projects' ? 'Major Projects'
          : 'Outstanding Recovery';

        return (
          <div
            key={card.id}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
              transition: 'all var(--transition-fast)',
              boxSizing: 'border-box'
            }}
          >
            {/* Top row: Title (STRICT 14px Semibold - Change 13) + Icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#0F172A',
                  textAlign: 'left'
                }}
              >
                {titleText}
              </span>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: 'var(--color-accent-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {icon}
              </div>
            </div>

            {/* Middle row: Large Metric + Status Badge */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: 1,
                  letterSpacing: '-0.02em'
                }}
              >
                {card.metric}
              </div>
              <span
                style={{
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: badgeBg,
                  border: `1px solid ${badgeBorder}`,
                  color: badgeColor,
                  fontSize: '11px',
                  fontWeight: 650,
                  whiteSpace: 'nowrap'
                }}
              >
                {card.statusLabel}
              </span>
            </div>

            {/* Bottom Context Line */}
            <div
              style={{
                fontSize: '11px',
                color: '#64748B',
                borderTop: '1px solid #F1F5F9',
                paddingTop: '0.45rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {card.contextLine}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--color-accent-500)', fontWeight: 600 }}>
                <TrendingUp size={11} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
