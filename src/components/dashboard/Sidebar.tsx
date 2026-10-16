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
  MessageSquare,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeModule: NavModuleId;
  onSelectModule: (id: NavModuleId) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
}

const ICON_MAP: Record<string, (size?: number) => React.ReactNode> = {
  LayoutDashboard: (size = 15) => <LayoutDashboard size={size} />,
  Inbox: (size = 15) => <Inbox size={size} />,
  CheckSquare: (size = 15) => <CheckSquare size={size} />,
  TrendingUp: (size = 15) => <TrendingUp size={size} />,
  Briefcase: (size = 15) => <Briefcase size={size} />,
  Layers: (size = 15) => <Layers size={size} />,
  CreditCard: (size = 15) => <CreditCard size={size} />,
  DollarSign: (size = 15) => <DollarSign size={size} />,
  MessageSquare: (size = 15) => <MessageSquare size={size} />
};

interface NavSection {
  title: string;
  items: NavItemConfig[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false
}) => {
  // Grouped Navigation Structure
  const overviewItems = NAV_ITEMS.filter((i) => i.id === 'overview' || i.id === 'inquiry-management');
  const communicationItems = NAV_ITEMS.filter((i) => i.id === 'internal-chat');
  const operationsItems = NAV_ITEMS.filter((i) => i.id === 'daily-critical-activities' || i.id === 'strategic-marketing');
  const projectItems = NAV_ITEMS.filter((i) => i.id === 'project-tracking' || i.id === 'major-projects');
  const financeItems = NAV_ITEMS.filter((i) => i.id === 'account-expenses' || i.id === 'finance-recovery');

  const navSections: NavSection[] = [
    { title: 'OVERVIEW', items: overviewItems },
    { title: 'COMMUNICATION', items: communicationItems },
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
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          width: isCollapsed ? '70px' : '260px',
          minWidth: isCollapsed ? '70px' : '260px',
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          boxSizing: 'border-box',
          overflow: 'visible',
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className={`geo-sidebar ${isCollapsed ? 'geo-sidebar-collapsed' : ''} ${isOpenMobile ? 'geo-sidebar-mobile-open' : ''}`}
      >
        {/* Top Header — BRANDING & SIDEBAR TOGGLE BUTTON */}
        <div
          style={{
            padding: isCollapsed ? '0.9rem 0.5rem 0.85rem' : '1.1rem 1.15rem 0.9rem 1rem',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isCollapsed ? 'center' : 'flex-start',
            textAlign: isCollapsed ? 'center' : 'left',
            gap: isCollapsed ? '0.5rem' : '0.35rem',
            boxSizing: 'border-box'
          }}
        >
          {isCollapsed ? (
            /* COLLAPSED STATE BRAND */
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                title="Geo Designs & Research"
              >
                <svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" stroke="var(--color-accent-400)" strokeWidth="2.5" strokeLinejoin="round" />
                  <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
                </svg>
              </div>
            </div>
          ) : (
            /* EXPANDED STATE BRAND */
            <>
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
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#0F172A',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    textAlign: 'left'
                  }}
                >
                  Geo Designs &amp; Research
                </div>
              </div>

              {/* Sub-descriptor as ONE HORIZONTAL LINE */}
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.6rem',
                  fontWeight: 650,
                  letterSpacing: '0.03em',
                  color: '#64748B',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'left',
                  paddingRight: '0.5rem'
                }}
              >
                ENGINEERING • SURVEYING • RESEARCH
              </div>
            </>
          )}
        </div>

        {/* Navigation List — Grouped into OVERVIEW, OPERATIONS, PROJECTS, FINANCE */}
        <div
          style={{
            flex: 1,
            padding: isCollapsed ? '0.75rem 0.45rem' : '0.75rem 0.5rem',
            overflowY: 'auto',
            overflowX: 'visible',
            display: 'flex',
            flexDirection: 'column',
            gap: isCollapsed ? '0.5rem' : '0.85rem'
          }}
        >
          {navSections.map((section, sectionIdx) => (
            <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {isCollapsed ? (
                sectionIdx > 0 && (
                  <div
                    style={{
                      height: '1px',
                      backgroundColor: '#E2E8F0',
                      margin: '4px 6px'
                    }}
                    aria-hidden="true"
                  />
                )
              ) : (
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
              )}

              {section.items.map((item) => {
                const isActive = activeModule === item.id;
                const iconRenderer = ICON_MAP[item.iconName] || ((s) => <LayoutDashboard size={s} />);
                const icon = iconRenderer(isCollapsed ? 17 : 15);

                return (
                  <div
                    key={item.id}
                    style={{ position: 'relative' }}
                    className="geo-nav-item-wrapper"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectModule(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      title={item.label}
                      aria-label={item.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'space-between',
                        width: '100%',
                        padding: isCollapsed ? '0.65rem 0' : '0.5rem 0.55rem',
                        borderRadius: '6px',
                        backgroundColor: isActive ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                        color: isActive ? 'var(--color-accent-600)' : '#475569',
                        border: isActive ? '1px solid rgba(2, 132, 199, 0.2)' : '1px solid transparent',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '12px',
                        fontWeight: isActive ? 650 : 500,
                        cursor: 'pointer',
                        textAlign: isCollapsed ? 'center' : 'left',
                        position: 'relative',
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
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: isCollapsed ? 'center' : 'flex-start',
                          gap: '0.55rem',
                          overflow: isCollapsed ? 'visible' : 'hidden',
                          width: isCollapsed ? 'auto' : '100%'
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isActive ? 'var(--color-accent-600)' : '#64748B',
                            position: 'relative',
                            flexShrink: 0
                          }}
                        >
                          {icon}
                          {/* Mini badge dot/counter in collapsed rail mode */}
                          {isCollapsed && item.badgeCount !== undefined && (
                            <span
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-7px',
                                minWidth: '13px',
                                height: '13px',
                                borderRadius: '7px',
                                fontSize: '8.5px',
                                fontWeight: 700,
                                backgroundColor: 'var(--color-accent-600)',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0 2px',
                                lineHeight: 1
                              }}
                            >
                              {item.badgeCount}
                            </span>
                          )}
                        </span>

                        {!isCollapsed && (
                          <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {item.label}
                          </span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
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
                      )}
                    </button>

                    {/* Floating Tooltip in Collapsed Mode */}
                    {isCollapsed && (
                      <div
                        className="geo-nav-tooltip"
                        style={{
                          position: 'absolute',
                          left: 'calc(100% + 8px)',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: '#0F172A',
                          color: '#FFFFFF',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          fontFamily: 'var(--font-sans)',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                          pointerEvents: 'none',
                          zIndex: 100,
                          opacity: 0,
                          visibility: 'hidden',
                          transition: 'opacity 0.15s ease, visibility 0.15s ease'
                        }}
                        role="tooltip"
                      >
                        {item.label}
                        {item.badgeCount !== undefined && ` (${item.badgeCount})`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: isCollapsed ? '0.75rem 0.5rem' : '0.65rem 1rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            color: '#64748B'
          }}
          title={isCollapsed ? 'Geo Designs • Online' : undefined}
        >
          {isCollapsed ? (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#059669',
                boxShadow: '0 0 6px rgba(5, 150, 105, 0.4)'
              }}
            />
          ) : (
            <>
              <span>Geo Designs</span>
              <span style={{ color: '#059669', fontWeight: 650 }}>&bull; Online</span>
            </>
          )}
        </div>
      </aside>
    </>
  );
};
