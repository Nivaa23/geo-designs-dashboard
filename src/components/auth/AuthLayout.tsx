import React, { type ReactNode } from 'react';
import { GeoBrandLogo } from '../common/GeoBrandLogo';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-page)',
        padding: '2rem 1rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Centered Brand Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <GeoBrandLogo size="md" />
      </div>

      {/* Main Authentication Card Container */}
      <main
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.25rem 2rem',
          boxShadow: 'var(--shadow-card)',
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </main>

      {/* Subtle Operational Footer */}
      <footer
        style={{
          marginTop: '2.5rem',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          textAlign: 'center'
        }}
      >
        Geo Designs &amp; Research &bull; Enterprise Workspace Portal
      </footer>
    </div>
  );
};
