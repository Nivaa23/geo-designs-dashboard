import React, { type ReactNode } from 'react';
import { GeoBrandLogo } from '../common/GeoBrandLogo';
import { CursorGrid } from '../common/CursorGrid';
import { ThemeToggle } from '../common/ThemeToggle';
import { Users, Briefcase, Clock, Layers, ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

const DraftingCornerTick: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.25, zIndex: 1, ...style }}
    aria-hidden="true"
  >
    <path d="M0 6H12M6 0V12" stroke="var(--text-left-secondary)" strokeWidth="1" />
  </svg>
);

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100svh',
        backgroundColor: 'var(--bg-right-panel)',
        overflowX: 'hidden'
      }}
    >
      <div className="geo-auth-grid">
        {/* LEFT PANEL — Dark Geo Environment (50vw Desktop) */}
        <div className="geo-left-panel bg-geo-grid" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* 1px Engineering Drafting Corner Tick Marks */}
          <DraftingCornerTick style={{ top: '24px', left: '24px' }} />
          <DraftingCornerTick style={{ top: '24px', right: '24px' }} />
          <DraftingCornerTick style={{ bottom: '24px', left: '24px' }} />
          <DraftingCornerTick style={{ bottom: '24px', right: '24px' }} />

          {/* System/Status Component — Anchored to Top-Right of Left Panel */}
          <div className="geo-left-status-tag">
            <span className="geo-status-dot" />
            <span>SECURE NODE</span>
          </div>

          {/* 0. Interactive Engineering CursorGrid Layer (z-index: 0) */}
          <CursorGrid gridSpacing={32} radius={130} />

          {/* 1. Main Content Column — Left Aligned Content Axis (Max-Width 620px, z-index: 1) */}
          <div className="geo-left-content-wrapper" style={{ position: 'relative', zIndex: 1 }}>
            
            {/* BRAND LOCKUP — Left Aligned */}
            <div className="geo-brand-lockup-wrapper">
              <GeoBrandLogo size="lg" showSubTag={true} />
            </div>

            {/* PRODUCT / SYSTEM CLASSIFICATION EYEBROW */}
            <div className="geo-system-eyebrow">
              <span className="geo-status-dot" />
              <span className="geo-eyebrow-text">ENGINEERING OPERATIONS PLATFORM</span>
              <span className="geo-eyebrow-divider">&bull;</span>
              <span className="geo-eyebrow-node">PORTAL v2.4</span>
            </div>

            {/* PRIMARY EDITORIAL HEADLINE — Left Aligned */}
            <h1 className="geo-statement-heading">
              One workspace for engineering, operations &amp; research.
            </h1>

            {/* SUPPORTING DESCRIPTION — Left Aligned (Max-Width 480px) */}
            <p className="geo-statement-desc">
              Manage workforce, project coordination, attendance, and day-to-day operations through a single workspace built for Geo Designs &amp; Research.
            </p>

            {/* CAPABILITY MODULES — 2x2 Structured Grid */}
            <div className="geo-modules-grid">
              {/* Module 1: Workforce */}
              <div className="geo-module-card">
                <div className="geo-module-icon-wrapper geo-icon-blue">
                  <Users size={16} />
                </div>
                <div className="geo-module-info">
                  <h4 className="geo-module-title">Workforce</h4>
                  <p className="geo-module-text">Employee profiles, team hierarchy &amp; roles</p>
                </div>
              </div>

              {/* Module 2: Projects */}
              <div className="geo-module-card">
                <div className="geo-module-icon-wrapper geo-icon-sky">
                  <Briefcase size={16} />
                </div>
                <div className="geo-module-info">
                  <h4 className="geo-module-title">Projects</h4>
                  <p className="geo-module-text">Project coordination, tasks &amp; status</p>
                </div>
              </div>

              {/* Module 3: Operations */}
              <div className="geo-module-card">
                <div className="geo-module-icon-wrapper geo-icon-emerald">
                  <Clock size={16} />
                </div>
                <div className="geo-module-info">
                  <h4 className="geo-module-title">Operations</h4>
                  <p className="geo-module-text">Attendance records &amp; login tracking</p>
                </div>
              </div>

              {/* Module 4: Spatial & Research */}
              <div className="geo-module-card">
                <div className="geo-module-icon-wrapper geo-icon-violet">
                  <Layers size={16} />
                </div>
                <div className="geo-module-info">
                  <h4 className="geo-module-title">Spatial Data</h4>
                  <p className="geo-module-text">Geospatial survey data &amp; research catalog</p>
                </div>
              </div>
            </div>
          </div>

          {/* ENTERPRISE SYSTEM FOOTER — Independent Metadata Bar (z-index: 1) */}
          <div className="geo-left-footer" style={{ position: 'relative', zIndex: 1 }}>
            <div className="geo-footer-left">
              Geo Designs &amp; Research &bull; Enterprise Operations Portal
            </div>
            <div className="geo-footer-right">
              <ShieldCheck size={13} style={{ color: 'var(--color-accent-400)' }} />
              <span>TLS 1.3 / AES-256</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Authentication Gateway Panel (50vw Desktop) */}
        <main className="geo-right-panel" style={{ position: 'relative' }}>
          {/* Integrated Utility Bar */}
          <div className="geo-utility-bar">
            <ThemeToggle />
          </div>

          {/* Mobile/Tablet Compact Brand Header */}
          <div className="mobile-brand-wrapper">
            <GeoBrandLogo size="md" showSubTag={true} />
          </div>

          {/* Centered Auth Form Content Wrapper (Max-Width 420px) */}
          <div className="geo-auth-form-wrapper">
            {children}
          </div>
        </main>
      </div>

      {/* Strict Enterprise Layout & Hierarchy CSS */}
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
          padding: 48px 56px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          border-right: 1px solid var(--border-left-card);
          min-height: 100svh;
          box-sizing: border-box;
          text-align: left;
        }

        .geo-left-content-wrapper {
          width: 100%;
          max-width: 600px;
          margin: auto 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          box-sizing: border-box;
        }

        .geo-brand-lockup-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 32px;
          width: 100%;
        }

        .geo-system-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px;
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          margin-bottom: 20px;
          font-family: var(--font-sans);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-left-secondary);
        }

        .geo-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--color-accent-400);
          box-shadow: 0 0 8px var(--color-accent-400);
        }

        .geo-eyebrow-text {
          color: var(--text-left-primary);
        }

        .geo-eyebrow-divider {
          color: var(--text-left-muted);
        }

        .geo-eyebrow-node {
          color: var(--color-accent-300);
        }

        .geo-statement-heading {
          font-family: var(--font-sans);
          font-size: 1.85rem;
          line-height: 1.25;
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--text-left-primary);
          text-align: left;
          margin-bottom: 14px;
          width: 100%;
        }

        .geo-statement-desc {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          line-height: 1.55;
          color: var(--text-left-secondary);
          text-align: left;
          max-width: 480px;
          margin: 0 0 28px 0;
          font-weight: 400;
        }

        .geo-modules-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .geo-module-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          background-color: var(--bg-left-card);
          border: 1px solid var(--border-left-card);
          border-radius: var(--radius-md);
          box-sizing: border-box;
          backdrop-filter: blur(4px);
          transition: border-color var(--transition-fast), background-color var(--transition-fast);
        }

        .geo-module-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background-color: rgba(255, 255, 255, 0.07);
        }

        .geo-module-icon-wrapper {
          width: 30px;
          height: 30px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .geo-icon-blue {
          background-color: rgba(2, 132, 199, 0.15);
          color: var(--color-accent-400);
        }

        .geo-icon-sky {
          background-color: rgba(14, 165, 233, 0.15);
          color: var(--color-accent-300);
        }

        .geo-icon-emerald {
          background-color: rgba(16, 185, 129, 0.15);
          color: #34D399;
        }

        .geo-icon-violet {
          background-color: rgba(139, 92, 246, 0.15);
          color: #A78BFA;
        }

        .geo-module-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .geo-module-title {
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          color: var(--text-left-primary);
          font-weight: 600;
          margin-bottom: 2px;
          text-align: left;
        }

        .geo-module-text {
          font-family: var(--font-sans);
          font-size: 0.72rem;
          line-height: 1.35;
          color: var(--text-left-secondary);
          font-weight: 400;
          text-align: left;
        }

        .geo-left-footer {
          font-family: var(--font-sans);
          font-size: 0.76rem;
          color: var(--text-left-muted);
          width: 100%;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
        }

        .geo-footer-left {
          color: var(--text-left-secondary);
        }

        .geo-footer-right {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: var(--text-left-muted);
        }

        .geo-right-panel {
          grid-column: 2 / 3;
          background-color: var(--bg-right-panel);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 48px;
          min-height: 100svh;
          box-sizing: border-box;
        }

        .geo-left-status-tag {
          position: absolute;
          top: 24px;
          right: 28px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-sans);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--text-left-secondary);
          padding: 4px 10px;
          background-color: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-sm);
          z-index: 2;
        }

        .geo-utility-bar {
          position: absolute;
          top: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          z-index: 10;
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
            max-width: 520px;
          }
          .geo-statement-heading {
            font-size: 2.1rem;
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
            padding: 40px 24px;
            justify-content: center;
          }
          .mobile-brand-wrapper {
            display: block !important;
          }
          .geo-utility-tag {
            display: none;
          }
          .geo-auth-form-wrapper {
            max-width: 420px;
          }
        }

        @media (max-width: 480px) {
          .geo-right-panel {
            padding: 28px 20px;
          }
        }
      `}</style>
    </div>
  );
};


