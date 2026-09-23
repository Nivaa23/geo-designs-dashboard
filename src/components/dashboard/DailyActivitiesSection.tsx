import React from 'react';
import { DAILY_CRITICAL_ACTIVITIES_DATA } from '../../data/mockDashboardData';
import { CheckSquare, AlertTriangle, UserCheck, Clock, ArrowRight } from 'lucide-react';

export const DailyActivitiesSection: React.FC = () => {
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
            <CheckSquare size={18} style={{ color: 'var(--color-accent-500)' }} />
            Today's Critical Activities
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
            Time-sensitive engineering, laboratory, and operational tasks for immediate action.
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
          Manage All
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Task items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {DAILY_CRITICAL_ACTIVITIES_DATA.map((act) => {
          let priorityBg = '#F0F9FF';
          let priorityColor = '#0369A1';
          let priorityBorder = '#BAE6FD';

          if (act.priority === 'Critical') {
            priorityBg = '#FEF2F2';
            priorityColor = '#DC2626';
            priorityBorder = '#FCA5A5';
          } else if (act.priority === 'High') {
            priorityBg = '#FFFBEB';
            priorityColor = '#B45309';
            priorityBorder = '#FDE68A';
          }

          return (
            <div
              key={act.id}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.85rem'
              }}
            >
              {/* Column 1: Priority Badge */}
              <div style={{ flexShrink: 0 }}>
                <span
                  style={{
                    padding: '3px 7px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: priorityBg,
                    border: `1px solid ${priorityBorder}`,
                    color: priorityColor,
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  {act.priority === 'Critical' && <AlertTriangle size={11} />}
                  {act.priority}
                </span>
              </div>

              {/* Column 2: Activity Information */}
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
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
                  {act.title}
                </h4>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#64748B',
                    lineHeight: 1.3,
                    marginTop: '2px',
                    textAlign: 'left'
                  }}
                >
                  {act.code} &bull; {act.category}
                </div>
              </div>

              {/* Column 3: Assignee */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    justifyContent: 'flex-end',
                    lineHeight: 1.2
                  }}
                >
                  <UserCheck size={13} style={{ color: 'var(--color-accent-500)' }} />
                  {act.assignedTo}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 400, color: '#64748B', marginTop: '2px', lineHeight: 1.2 }}>
                  {act.department}
                </div>
              </div>

              {/* Column 4: Time Badge */}
              <div
                style={{
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0,
                  whiteSpace: 'nowrap'
                }}
              >
                <Clock size={11} style={{ color: '#B45309' }} />
                {act.targetTime}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
