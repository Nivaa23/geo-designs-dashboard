import React from 'react';
import { EMPLOYEE_WORK_SESSION_DATA, LEAVE_BALANCE_DATA } from '../../data/mockDashboardData';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  LogOut,
  MapPin,
  CheckCircle2,
  CalendarCheck,
  CheckSquare,
  Calendar,
  UserCheck
} from 'lucide-react';

export const WorkSessionOverviewBar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const session = EMPLOYEE_WORK_SESSION_DATA;
  const leave = LEAVE_BALANCE_DATA;

  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const userName = currentUser?.name || 'Dr. Vikram Raman';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        width: '100%'
      }}
    >
      {/* Greeting Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', color: '#0F172A', fontWeight: 700, lineHeight: 1.2 }}>
              {timeGreeting}, {userName}
            </h2>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#047857',
                fontSize: '11px',
                fontWeight: 650,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CheckCircle2 size={12} />
              {session.attendanceState}
            </span>
          </div>

          <p
            style={{
              fontSize: '14px',
              color: '#64748B',
              marginTop: '4px',
              lineHeight: 1.3,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Here is your daily engineering workflow overview.</span>
            <span>&bull;</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '13px' }}>
              <MapPin size={12} style={{ color: 'var(--color-accent-500)' }} />
              {session.location}
            </span>
          </p>
        </div>
      </div>

      {/* ONE LARGE UNIFIED CARD — TODAY'S OVERVIEW */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* Unified Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.6rem' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            TODAY'S OVERVIEW
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
            {session.shiftHours}
          </span>
        </div>

        {/* Four Internal Sections Arranged Horizontally with Subtle Vertical Dividers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1.2fr 1.05fr 1fr',
            gap: '0',
            width: '100%'
          }}
          className="geo-todays-overview-grid"
        >
          {/* SECTION 1 — TODAY'S CHECK-IN */}
          <div
            style={{
              paddingRight: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
              textAlign: 'left'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
              Today's Check-In
            </div>

            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                {session.checkInTime}
              </div>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                {session.attendanceState}
              </div>
            </div>

            {/* Check Out / Log Out Button (Centered inside Section 1) */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <button
                type="button"
                onClick={logout}
                style={{
                  width: '100%',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '6px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <LogOut size={13} />
                Check Out / Log Out
              </button>
            </div>
          </div>

          {/* SECTION 2 — LIVE SESSION / WORK HOURS */}
          <div
            style={{
              paddingLeft: '1rem',
              paddingRight: '1rem',
              borderLeft: '1px solid #F1F5F9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
              textAlign: 'left'
            }}
            className="geo-overview-section"
          >
            {/* Title Row: Title left, 4.5h / 8.5h right */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                Live Session Duration
              </span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)' }}>
                4.5h / 8.5h
              </span>
            </div>

            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} style={{ color: 'var(--color-accent-500)' }} />
                {session.sessionDuration}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                Ongoing work session progress
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div
                style={{
                  height: '6px',
                  width: '100%',
                  backgroundColor: '#E2E8F0',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '53%',
                    backgroundColor: 'var(--color-accent-500)',
                    borderRadius: '3px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3 — LEAVE BALANCE */}
          <div
            style={{
              paddingLeft: '1rem',
              paddingRight: '1rem',
              borderLeft: '1px solid #F1F5F9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
              textAlign: 'left'
            }}
            className="geo-overview-section"
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
              Leave Balances
            </div>

            {/* Centered Group of 4 Leave Boxes */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px',
                  width: '100%',
                  maxWidth: '220px'
                }}
              >
                {/* Box 1: Casual */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '0.35rem 0.2rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.1 }}>
                    {leave.casual}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                    Casual
                  </div>
                </div>

                {/* Box 2: Medical */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '0.35rem 0.2rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.1 }}>
                    {leave.medical}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                    Medical
                  </div>
                </div>

                {/* Box 3: Earned */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '0.35rem 0.2rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.1 }}>
                    {leave.earned}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                    Earned
                  </div>
                </div>

                {/* Box 4: Pending */}
                <div
                  style={{
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '6px',
                    padding: '0.35rem 0.2rem',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#B45309', lineHeight: 1.1 }}>
                    {leave.pendingApproval}
                  </div>
                  <div style={{ fontSize: '10px', color: '#B45309', fontWeight: 600, marginTop: '2px' }}>
                    Pending
                  </div>
                </div>
              </div>

              {/* Supporting Line — Dynamic Total Annual Allocation */}
              <div
                style={{
                  fontSize: '11px',
                  color: '#64748B',
                  fontWeight: 500,
                  marginTop: '6px',
                  textAlign: 'center'
                }}
              >
                {leave.totalAnnualAllocation || 25} Total Annual Allocation
              </div>
            </div>
          </div>

          {/* SECTION 4 — QUICK ACTIONS */}
          <div
            style={{
              paddingLeft: '1rem',
              borderLeft: '1px solid #F1F5F9',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.65rem',
              textAlign: 'left'
            }}
            className="geo-overview-section"
          >
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
              Quick Actions
            </div>

            {/* Exactly 4 Equal Actions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '5px' }}>
              <button
                type="button"
                style={{
                  height: '32px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '6px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <CalendarCheck size={13} style={{ color: 'var(--color-accent-500)', flexShrink: 0 }} />
                <span>Apply Leave</span>
              </button>

              <button
                type="button"
                style={{
                  height: '32px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '6px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <CheckSquare size={13} style={{ color: 'var(--color-accent-500)', flexShrink: 0 }} />
                <span>Tasks</span>
              </button>

              <button
                type="button"
                style={{
                  height: '32px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '6px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Calendar size={13} style={{ color: 'var(--color-accent-500)', flexShrink: 0 }} />
                <span>Calendar</span>
              </button>

              <button
                type="button"
                style={{
                  height: '32px',
                  padding: '0 8px',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  color: '#0F172A',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '6px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <UserCheck size={13} style={{ color: 'var(--color-accent-500)', flexShrink: 0 }} />
                <span>Attendance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
