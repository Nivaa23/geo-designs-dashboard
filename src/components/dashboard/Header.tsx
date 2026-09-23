import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { ThemeToggle } from '../common/ThemeToggle';
import { NAV_ITEMS } from '../../data/mockDashboardData';
import type { NavModuleId } from '../../types/dashboard';
import {
  Search,
  Bell,
  LogOut,
  Menu,
  ChevronDown,
  Building2,
  Clock
} from 'lucide-react';

interface HeaderProps {
  activeModule: NavModuleId;
  onToggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeModule, onToggleMobileSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeNavItem = NAV_ITEMS.find((n) => n.id === activeModule) || NAV_ITEMS[0];

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxSizing: 'border-box',
        transition: 'background-color var(--transition-fast), border-color var(--transition-fast)'
      }}
    >
      {/* Left Title & Subtitle Area (Change 7) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '4px'
          }}
          className="geo-mobile-menu-btn"
          aria-label="Toggle navigation drawer"
        >
          <Menu size={22} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.2,
              letterSpacing: '-0.015em'
            }}
          >
            {activeNavItem.label}
          </h1>
          {/* Subtitle directly below title, MAXIMUM 12px font size */}
          <p
            style={{
              fontSize: '12px',
              color: '#64748B',
              lineHeight: 1.25,
              marginTop: '2px'
            }}
          >
            {activeNavItem.description}
          </p>
        </div>
      </div>

      {/* Right Controls Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Global Search Box */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
          className="geo-header-search-container"
        >
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '0.75rem',
              color: '#94A3B8',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search projects, inquiries, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              height: '36px',
              width: '230px',
              paddingLeft: '2.2rem',
              paddingRight: '0.75rem',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 'var(--radius-md)',
              color: '#0F172A',
              fontSize: '0.78rem',
              outline: 'none',
              transition: 'all var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-accent-500)';
              e.target.style.backgroundColor = '#FFFFFF';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E2E8F0';
              e.target.style.backgroundColor = '#F8FAFC';
            }}
          />
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          aria-label="View notifications"
          style={{
            position: 'relative',
            height: '36px',
            width: '36px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#0F172A';
            e.currentTarget.style.backgroundColor = '#F1F5F9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#64748B';
            e.currentTarget.style.backgroundColor = '#F8FAFC';
          }}
        >
          <Bell size={16} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent-500)'
            }}
          />
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: '#E2E8F0' }} />

        {/* Theme Selector Integration */}
        <ThemeToggle variant="inline" />

        <div style={{ width: '1px', height: '20px', backgroundColor: '#E2E8F0' }} />

        {/* User Profile Control */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowUserMenu((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 'var(--radius-md)',
              transition: 'background-color var(--transition-fast)'
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-500)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {currentUser?.name ? currentUser.name.charAt(0) : 'V'}
            </div>

            <div style={{ textAlign: 'left' }} className="geo-header-user-info">
              <div style={{ fontSize: '0.8125rem', fontWeight: 650, color: '#0F172A', lineHeight: 1.2 }}>
                {currentUser?.name || 'Dr. Vikram Raman'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B', lineHeight: 1.2 }}>
                {currentUser?.role || 'Senior Director'}
              </div>
            </div>

            <ChevronDown size={14} style={{ color: '#64748B' }} />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '250px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-lg)',
                padding: '0.85rem',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                zIndex: 60
              }}
            >
              <div
                style={{
                  paddingBottom: '0.6rem',
                  borderBottom: '1px solid #F1F5F9'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                  {currentUser?.name || 'Dr. Vikram Raman'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                  {currentUser?.email || 'v.raman@geodesigns.com'}
                </div>
                <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                  {currentUser?.role && <Badge label={currentUser.role} role={currentUser.role} />}
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={13} style={{ color: 'var(--color-accent-500)' }} />
                Dept: {currentUser?.department || 'Research & Engineering Ops'}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} style={{ color: '#059669' }} />
                Shift: 09:00 - 18:00 (Check-in 09:00 AM)
              </div>

              <button
                type="button"
                onClick={logout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '0.78rem',
                  fontWeight: 650,
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <LogOut size={14} />
                Sign Out of Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
