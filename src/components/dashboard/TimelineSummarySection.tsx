import React from 'react';
import { MAJOR_PROJECTS_TIMELINE_DATA } from '../../data/mockDashboardData';
import { Layers, Calendar, MapPin, CheckCircle2, CircleDot, Clock } from 'lucide-react';

export const TimelineSummarySection: React.FC = () => {
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
            <Layers size={16} style={{ color: 'var(--color-accent-500)' }} />
            Major Projects & Timelines
          </h3>
          <p style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '2px' }}>
            Weekly phase tracking for infrastructure & mega-development contracts.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              padding: '2px 7px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '0.7rem',
              fontWeight: 650,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Calendar size={12} style={{ color: 'var(--color-accent-500)' }} />
            WEEK 38 OVERVIEW
          </span>
        </div>
      </div>

      {/* Major Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {MAJOR_PROJECTS_TIMELINE_DATA.map((mp) => {
          return (
            <div
              key={mp.id}
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
              {/* Project Title + Current Milestone */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                    {mp.name}
                  </h4>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <MapPin size={11} /> {mp.location} &bull; <span style={{ color: 'var(--color-accent-600)', fontWeight: 650 }}>{mp.phase}</span>
                  </div>
                </div>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: '10px',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    color: '#047857',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}
                >
                  {mp.completionEst} COMPLETE
                </span>
              </div>

              {/* Weekly Timeline Steps */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.4rem',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.55rem'
                }}
              >
                {mp.weeklyProgress.map((wp, idx) => {
                  let stepColor = '#94A3B8';
                  let icon = <Clock size={12} style={{ color: '#94A3B8' }} />;

                  if (wp.status === 'completed') {
                    stepColor = '#047857';
                    icon = <CheckCircle2 size={12} style={{ color: '#047857' }} />;
                  } else if (wp.status === 'in-progress') {
                    stepColor = 'var(--color-accent-600)';
                    icon = <CircleDot size={12} style={{ color: 'var(--color-accent-500)' }} />;
                  }

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.66rem', fontWeight: 700, color: stepColor }}>
                        {icon}
                        {wp.week}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: wp.status === 'in-progress' ? '#0F172A' : '#64748B', fontWeight: wp.status === 'in-progress' ? 650 : 400 }}>
                        {wp.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
