import React from 'react';
import type { UserRole } from '../../types/auth';

interface BadgeProps {
  label: string;
  variant?: 'role' | 'status' | 'info' | 'success' | 'warning' | 'danger';
  role?: UserRole;
}

interface BadgeStyleConfig {
  bg: string;
  border: string;
  text: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'info', role }) => {
  const getBadgeStyle = (): BadgeStyleConfig => {
    if (role) {
      switch (role) {
        case 'HR / Admin':
          return { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.4)', text: '#C084FC' };
        case 'Management':
          return { bg: 'rgba(234, 179, 8, 0.15)', border: 'rgba(234, 179, 8, 0.4)', text: '#FDE047' };
        case 'Team Lead':
          return { bg: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.4)', text: '#38BDF8' };
        case 'Client':
          return { bg: 'rgba(236, 72, 153, 0.15)', border: 'rgba(236, 72, 153, 0.4)', text: '#F472B6' };
        case 'Employee':
        default:
          return { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.4)', text: '#4ADE80' };
      }
    }

    switch (variant) {
      case 'success':
        return { bg: 'var(--color-success-bg)', border: 'var(--color-success-border)', text: '#34D399' };
      case 'warning':
        return { bg: 'var(--color-warning-bg)', border: 'var(--color-warning-border)', text: '#FBBF24' };
      case 'danger':
        return { bg: 'var(--color-error-bg)', border: 'var(--color-error-border)', text: '#FB7185' };
      case 'info':
      default:
        return { bg: 'var(--color-info-bg)', border: 'var(--color-info-border)', text: '#38BDF8' };
    }
  };

  const styleConfig = getBadgeStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2rem 0.6rem',
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        backgroundColor: styleConfig.bg,
        border: `1px solid ${styleConfig.border}`,
        color: styleConfig.text,
        letterSpacing: '0.02em'
      }}
    >
      {label}
    </span>
  );
};
