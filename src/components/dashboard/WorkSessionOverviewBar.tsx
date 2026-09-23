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
      {/* Greeting Banner — Change 8 (Subtitle font size strictly 14px) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
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

          {/* Subtitle MUST be EXACTLY 14px — Change 8 */}
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

      {/* Structured Operational Snapshot Grid — Cards 1-4 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.85rem',
          width: '100%'
        }}
        className="geo-dashboard-grid-4col"
      >
        {/* Card 1: Today's Check-In — (Change 9: Check Out / Log Out button moved inside and centered) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.65rem'
          }}
        >
          {/* Card Title — Change 13: 14px Semibold */}
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', textAlign: 'left' }}>
            Today's Check-In
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
              {session.checkInTime}
            </div>
            <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '1px' }}>
              {session.shiftHours}
            </div>
          </div>

          {/* Moved Check Out / Log Out Button — Change 9 (Centered inside card) */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '0.2rem' }}>
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

        {/* Card 2: Live Session Duration — (Change 10: Left alignment, 4.5h / 8.5h on same title row, progress bar) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.65rem',
            textAlign: 'left'
          }}
        >
          {/* Same Title Row: Title left, 4.5h / 8.5h right — Change 10 & Change 13 (14px Semibold) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
              Live Session Duration
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent-600)' }}>
              4.5h / 8.5h
            </span>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} style={{ color: 'var(--color-accent-500)' }} />
              {session.sessionDuration}
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
              Ongoing work session progress
            </div>
          </div>

          {/* Daily Work Progress Bar — Change 10 */}
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
                  width: '53%', // 4.5h out of 8.5h
                  backgroundColor: 'var(--color-accent-500)',
                  borderRadius: '3px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Leave Balances — (Change 11: Individual boxes for each leave type) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.65rem',
            textAlign: 'left'
          }}
        >
          {/* Card Title — Change 13: 14px Semibold */}
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
            Leave Balances
          </div>

          {/* Individual Boxes Grid for Leave Types — Change 11 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '4px'
            }}
          >
            {/* Box 1: Casual */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '0.35rem 0.25rem',
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
                padding: '0.35rem 0.25rem',
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
                padding: '0.35rem 0.25rem',
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
                padding: '0.35rem 0.25rem',
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
        </div>

        {/* Card 4: Quick Actions — (Change 12: Exactly 4 equal actions: Apply Leave, Tasks, Calendar, Attendance) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '0.65rem',
            textAlign: 'left'
          }}
        >
          {/* Card Title — Change 13: 14px Semibold */}
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
            Quick Actions
          </div>

          {/* 4 Equal Action Buttons Grid — Change 12 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {/* Action 1: Apply Leave */}
            <button
              type="button"
              style={{
                height: '32px',
                padding: '0 6px',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <CalendarCheck size={12} style={{ color: 'var(--color-accent-500)' }} />
              Apply Leave
            </button>

            {/* Action 2: Tasks */}
            <button
              type="button"
              style={{
                height: '32px',
                padding: '0 6px',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <CheckSquare size={12} style={{ color: 'var(--color-accent-500)' }} />
              Tasks
            </button>

            {/* Action 3: Calendar */}
            <button
              type="button"
              style={{
                height: '32px',
                padding: '0 6px',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Calendar size={12} style={{ color: 'var(--color-accent-500)' }} />
              Calendar
            </button>

            {/* Action 4: Attendance */}
            <button
              type="button"
              style={{
                height: '32px',
                padding: '0 6px',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: '#0F172A',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <UserCheck size={12} style={{ color: 'var(--color-accent-500)' }} />
              Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
