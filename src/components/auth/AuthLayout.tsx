import React, { type ReactNode } from 'react';
import { GeoBrandLogo } from '../common/GeoBrandLogo';
import { CursorGrid } from '../common/CursorGrid';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { Users, Briefcase, Clock } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const DraftingCornerTick: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.3, zIndex: 1, ...style }}
    aria-hidden="true"
  >
    <path d="M0 6H12M6 0V12" stroke="var(--text-left-secondary)" strokeWidth="1" />
  </svg>
);

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { theme } = useAuth();

  return (
    <div
      data-theme={theme}
      style={{
        width: '100vw',
        minHeight: '100svh',
        backgroundColor: 'var(--bg-right-panel)',
        overflowX: 'hidden'
      }}
    >
      <div className="geo-auth-grid">
        {/* LEFT PANEL — Dark / Light Geo Environment (50vw Desktop) */}
        <div className="geo-left-panel bg-geo-grid" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Subtle 1px Engineering Drafting Corner Tick Marks */}
          <DraftingCornerTick style={{ top: '24px', left: '24px' }} />
          <DraftingCornerTick style={{ top: '24px', right: '24px' }} />
          <DraftingCornerTick style={{ bottom: '24px', left: '24px' }} />
          <DraftingCornerTick style={{ bottom: '24px', right: '24px' }} />

          {/* 0. Interactive Engineering CursorGrid Layer (z-index: 0) */}
          <CursorGrid gridSpacing={32} radius={130} />

          {/* 1. Main Content Column (Max-Width 620px, Horizontally Centered, z-index: 1) */}
          <div className="geo-left-content-wrapper" style={{ position: 'relative', zIndex: 1 }}>
            {/* BRAND LOCKUP — Centered on Content Axis */}
            <div className="geo-brand-lockup-wrapper">
              <GeoBrandLogo size="md" theme={theme} showSubTag={true} />
            </div>

            {/* MAIN HEADLINE — Centered on Content Axis */}
            <h1 className="geo-statement-heading">
              One workspace for engineering, operations &amp; research.
            </h1>

            {/* SUPPORTING DESCRIPTION — Centered on Content Axis (Max-Width 520px) */}
            <p className="geo-statement-desc">
              Manage workforce, project coordination, attendance, and day-to-day operations through a single workspace built for Geo Designs &amp; Research.
            </p>

            {/* FEATURE CARDS STACK — Identical Widths & Internal Alignments */}
            <div className="geo-cards-stack">
              <div className="geo-product-card">
                <div className="geo-card-icon geo-icon-blue">
                  <Users size={18} />
                </div>
                <div className="geo-card-content">
                  <h4 className="geo-card-title">Workforce</h4>
                  <p className="geo-card-text">Employee profiles, team hierarchy &amp; administrative roles</p>
                </div>
              </div>

              <div className="geo-product-card">
                <div className="geo-card-icon geo-icon-sky">
                  <Briefcase size={18} />
                </div>
                <div className="geo-card-content">
                  <h4 className="geo-card-title">Projects</h4>
                  <p className="geo-card-text">Project tracking, tasks &amp; ongoing workflow status</p>
                </div>
              </div>

              <div className="geo-product-card">
                <div className="geo-card-icon geo-icon-emerald">
                  <Clock size={18} />
                </div>
                <div className="geo-card-content">
                  <h4 className="geo-card-title">Operations</h4>
                  <p className="geo-card-text">Attendance records, login tracking &amp; leave management</p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER — Independent at Bottom (z-index: 1) */}
          <div className="geo-left-footer" style={{ position: 'relative', zIndex: 1 }}>
            Geo Designs &amp; Research &bull; Internal Workspace
          </div>
        </div>

        {/* RIGHT PANEL — Authentication Panel (50vw Desktop) */}
        <main className="geo-right-panel" style={{ position: 'relative' }}>
          {/* Top-Right Theme Toggle */}
          <ThemeToggle />

          {/* Mobile/Tablet Compact Brand Header */}
          <div className="mobile-brand-wrapper">
            <GeoBrandLogo size="md" theme="light" showSubTag={true} />
          </div>

          {/* Centered Auth Form Content Wrapper (Max-Width 420px) */}
          <div className="geo-auth-form-wrapper">
            {children}
          </div>
        </main>
      </div>

      {/* Strict Layout & Precision Alignment CSS */}
      <style>{`
        .geo-auth-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100vw;
          min-height: 100svh;
        }

        .geo-left-panel {
          grid-column: 1 / 2;
          background-color: var(--bg-left-panel);
          color: var(--text-left-primary);
          padding: 48px 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          border-right: 1px solid var(--border-left-card);
          min-height: 100svh;
          box-sizing: border-box;
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        .geo-left-content-wrapper {
          width: 100%;
          max-width: 620px;
          margin: auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
        }

        .geo-brand-lockup-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 44px;
          width: 100%;
        }

        .geo-statement-heading {
          font-family: var(--font-sans);
          font-size: 2.25rem;
          line-height: 1.25;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--text-left-primary);
          text-align: center;
          margin-bottom: 20px;
          width: 100%;
          transition: color var(--transition-fast);
        }

        .geo-statement-desc {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-left-secondary);
          text-align: center;
          max-width: 520px;
          margin: 0 auto 32px auto;
          font-weight: 400;
          transition: color var(--transition-fast);
        }

        .geo-cards-stack {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .geo-product-card {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 1rem 1.25rem;
          background-color: var(--bg-left-card);
          border: 1px solid var(--border-left-card);
          border-radius: var(--radius-md);
          box-sizing: border-box;
          backdrop-filter: blur(2px);
          transition: background-color var(--transition-fast), border-color var(--transition-fast);
        }

        .geo-card-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .geo-icon-blue {
          background-color: rgba(2, 132, 199, 0.15);
          color: #0284C7;
        }

        .geo-icon-sky {
          background-color: rgba(14, 165, 233, 0.15);
          color: #0284C7;
        }

        .geo-icon-emerald {
          background-color: rgba(16, 185, 129, 0.15);
          color: #059669;
        }

        .geo-card-content {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .geo-card-title {
          font-family: var(--font-sans);
          font-size: 0.88rem;
          color: var(--text-left-primary);
          font-weight: 600;
          margin-bottom: 2px;
          text-align: left;
          transition: color var(--transition-fast);
        }

        .geo-card-text {
          font-family: var(--font-sans);
          font-size: 0.78rem;
          color: var(--text-left-secondary);
          font-weight: 400;
          text-align: left;
          transition: color var(--transition-fast);
        }

        .geo-left-footer {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          color: var(--text-left-muted);
          text-align: center;
          padding-top: 2rem;
          width: 100%;
          transition: color var(--transition-fast);
        }

        .geo-right-panel {
          grid-column: 2 / 3;
          background-color: var(--bg-right-panel);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 48px;
          min-height: 100svh;
          box-sizing: border-box;
          transition: background-color var(--transition-fast);
        }

        .mobile-brand-wrapper {
          display: none;
          margin-bottom: 2rem;
          text-align: center;
        }

        .geo-auth-form-wrapper {
          width: 100%;
          max-width: 420px;
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1279px) and (min-width: 1024px) {
          .geo-left-panel {
            padding: 40px 36px;
          }
          .geo-left-content-wrapper {
            max-width: 540px;
          }
          .geo-statement-heading {
            font-size: 1.95rem;
          }
          .geo-right-panel {
            padding: 32px 36px;
          }
          .geo-auth-form-wrapper {
            max-width: 400px;
          }
        }

        @media (max-width: 1023px) {
          .geo-auth-grid {
            grid-template-columns: 1fr;
          }
          .geo-left-panel {
            display: none !important;
          }
          .geo-right-panel {
            grid-column: 1 / 2;
            width: 100%;
            padding: 32px 24px;
            justify-content: center;
          }
          .mobile-brand-wrapper {
            display: block !important;
          }
          .geo-auth-form-wrapper {
            max-width: 420px;
          }
        }

        @media (max-width: 480px) {
          .geo-right-panel {
            padding: 24px 20px;
          }
        }
      `}</style>
    </div>
  );
};

