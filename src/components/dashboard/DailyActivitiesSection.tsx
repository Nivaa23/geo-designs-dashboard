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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', color: '#0F172A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckSquare size={16} style={{ color: 'var(--color-accent-500)' }} />
            Today's Critical Activities
          </h3>
          <p style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '2px' }}>
            Time-sensitive engineering, laboratory, and operational tasks for immediate action.
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
                gap: '0.75rem'
              }}
            >
              {/* Task Title & Code */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: priorityBg,
                    border: `1px solid ${priorityBorder}`,
                    color: priorityColor,
                    fontSize: '0.64rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  {act.priority === 'Critical' && <AlertTriangle size={11} />}
                  {act.priority}
                </span>

                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 650, color: '#0F172A', lineHeight: 1.3 }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{act.code}</span>
                    <span>&bull;</span>
                    <span>{act.category}</span>
                  </div>
                </div>
              </div>

              {/* Responsible Person + Target Time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.73rem', fontWeight: 650, color: '#334155', display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                    <UserCheck size={12} style={{ color: 'var(--color-accent-500)' }} />
                    {act.assignedTo}
                  </div>
                  <div style={{ fontSize: '0.66rem', color: '#64748B' }}>
                    {act.department}
                  </div>
                </div>

                <div
                  style={{
                    padding: '3px 7px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.7rem',
                    fontWeight: 650,
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Clock size={11} style={{ color: '#B45309' }} />
                  {act.targetTime}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
