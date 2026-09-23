import React from 'react';
import { NAV_ITEMS } from '../../data/mockDashboardData';
import type { NavModuleId, NavItemConfig } from '../../types/dashboard';
import {
  LayoutDashboard,
  Inbox,
  CheckSquare,
  TrendingUp,
  Briefcase,
  Layers,
  CreditCard,
  DollarSign,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeModule: NavModuleId;
  onSelectModule: (id: NavModuleId) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={15} />,
  Inbox: <Inbox size={15} />,
  CheckSquare: <CheckSquare size={15} />,
  TrendingUp: <TrendingUp size={15} />,
  Briefcase: <Briefcase size={15} />,
  Layers: <Layers size={15} />,
  CreditCard: <CreditCard size={15} />,
  DollarSign: <DollarSign size={15} />
};

interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpenMobile = false,
  onCloseMobile
}) => {
  // Grouped Navigation Structure
  const overviewItems = NAV_ITEMS.filter((i) => i.id === 'overview' || i.id === 'inquiry-management');
  const operationsItems = NAV_ITEMS.filter((i) => i.id === 'daily-critical-activities' || i.id === 'strategic-marketing');
  const projectItems = NAV_ITEMS.filter((i) => i.id === 'project-tracking' || i.id === 'major-projects');
  const financeItems = NAV_ITEMS.filter((i) => i.id === 'account-expenses' || i.id === 'finance-recovery');

  const navSections: NavSection[] = [
    { title: 'OVERVIEW', items: overviewItems },
    { title: 'OPERATIONS', items: operationsItems },
    { title: 'PROJECTS', items: projectItems },
    { title: 'FINANCE', items: financeItems }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 40
          }}
        />
      )}

      <aside
        style={{
          width: '220px',
          minWidth: '220px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
        className={`geo-sidebar ${isOpenMobile ? 'geo-sidebar-mobile-open' : ''}`}
      >
        {/* Top Header — LEFT ALIGNED BRANDING (Change 2, 3, 4) */}
        <div
          style={{
            padding: '1.1rem 1rem 0.9rem 1rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // LEFT ALIGNED
            textAlign: 'left',
            gap: '0.35rem'
          }}
        >
          {/* Brand Mark + Company Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" stroke="var(--color-accent-400)" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
              </svg>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#0F172A',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                textAlign: 'left'
              }}
            >
              Geo Designs <span style={{ fontWeight: 400, color: '#64748B' }}>&amp; Research</span>
            </div>
          </div>

          {/* Sub-descriptor as ONE HORIZONTAL LINE — STRICT (No dots, no extra badges) */}
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.6rem',
              fontWeight: 650,
              letterSpacing: '0.06em',
              color: '#64748B',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              textAlign: 'left'
            }}
          >
            ENGINEERING • SURVEYING • RESEARCH
          </div>
        </div>

        {/* Navigation List — Grouped into OVERVIEW, OPERATIONS, PROJECTS, FINANCE (Change 5 & 6) */}
        <div
          style={{
            flex: 1,
            padding: '0.75rem 0.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          {navSections.map((section) => (
            <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  fontWeight: 650,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#64748B',
                  padding: '0.2rem 0.5rem',
                  textAlign: 'left'
                }}
              >
                {section.title}
              </div>

              {section.items.map((item) => {
                const isActive = activeModule === item.id;
                const icon = ICON_MAP[item.iconName] || <LayoutDashboard size={15} />;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectModule(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.5rem 0.55rem',
                      borderRadius: '6px',
                      backgroundColor: isActive ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                      color: isActive ? 'var(--color-accent-600)' : '#475569',
                      border: isActive ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid transparent',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '12px', // STRICT 12px
                      fontWeight: isActive ? 650 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                        e.currentTarget.style.color = '#0F172A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#475569';
                      }
                    }}
                    title={item.description}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: isActive ? 'var(--color-accent-600)' : '#64748B'
                        }}
                      >
                        {icon}
                      </span>
                      <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {item.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {item.badgeCount !== undefined && (
                        <span
                          style={{
                            padding: '1px 5px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: isActive ? 'rgba(2, 132, 199, 0.15)' : '#F1F5F9',
                            color: isActive ? 'var(--color-accent-600)' : '#64748B'
                          }}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                      {isActive && <ChevronRight size={13} style={{ color: 'var(--color-accent-500)' }} />}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: '0.65rem 1rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            color: '#64748B'
          }}
        >
          <span>Geo Designs</span>
          <span style={{ color: '#059669', fontWeight: 650 }}>&bull; Online</span>
        </div>
      </aside>
    </>
  );
};
