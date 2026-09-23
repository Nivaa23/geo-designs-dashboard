import React from 'react';
import { PROJECT_PROGRESS_DATA } from '../../data/mockDashboardData';
import { Briefcase, ArrowUpRight, Clock, Building } from 'lucide-react';

export const ProjectProgressSection: React.FC = () => {
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
            <Briefcase size={16} style={{ color: 'var(--color-accent-500)' }} />
            Active Project Execution
          </h3>
          <p style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '2px' }}>
            Real-time milestone progress across survey, geotechnical, and structural contracts.
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
          View All
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {PROJECT_PROGRESS_DATA.map((proj) => {
          let statusBg = '#F0F9FF';
          let statusColor = '#0284C7';
          let statusBorder = '#BAE6FD';

          if (proj.status === 'Milestone Review') {
            statusBg = '#FFFBEB';
            statusColor = '#B45309';
            statusBorder = '#FDE68A';
          } else if (proj.status === 'Pending Sign-off') {
            statusBg = '#F3E8FF';
            statusColor = '#7E22CE';
            statusBorder = '#E9D5FF';
          } else if (proj.status === 'On Schedule') {
            statusBg = '#ECFDF5';
            statusColor = '#047857';
            statusBorder = '#A7F3D0';
          }

          return (
            <div
              key={proj.id}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem'
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.66rem', fontFamily: 'monospace', color: '#64748B', fontWeight: 650 }}>
                      {proj.code}
                    </span>
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: '4px',
                        fontSize: '0.64rem',
                        fontWeight: 650,
                        backgroundColor: '#E2E8F0',
                        color: '#334155'
                      }}
                    >
                      {proj.sector}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 650, color: '#0F172A', lineHeight: 1.3 }}>
                    {proj.name}
                  </h4>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span
                    style={{
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: statusBg,
                      border: `1px solid ${statusBorder}`,
                      color: statusColor,
                      fontSize: '0.66rem',
                      fontWeight: 650,
                      display: 'inline-block'
                    }}
                  >
                    {proj.status}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#0F172A', marginTop: '3px', fontWeight: 700 }}>
                    {proj.totalValuation}
                  </div>
                </div>
              </div>

              {/* Progress bar line */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748B', marginBottom: '3px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building size={12} /> {proj.client} &bull; <Clock size={12} /> Target: {proj.deadline}
                  </span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{proj.progressPercentage}%</span>
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
                      width: `${proj.progressPercentage}%`,
                      backgroundColor: 'var(--color-accent-500)',
                      borderRadius: '3px',
                      transition: 'width 0.4s ease'
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
