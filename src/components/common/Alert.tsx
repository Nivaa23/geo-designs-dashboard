import React from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

export interface AlertProps {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  details?: string;
  onClose?: () => void;
  actionButton?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  title,
  message,
  details,
  onClose,
  actionButton
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'var(--color-error-bg)',
          border: 'var(--color-error-border)',
          color: '#FECDD3',
          iconColor: 'var(--color-error)',
          icon: <XCircle size={20} />
        };
      case 'warning':
        return {
          bg: 'var(--color-warning-bg)',
          border: 'var(--color-warning-border)',
          color: '#FDE68A',
          iconColor: 'var(--color-warning)',
          icon: <AlertTriangle size={20} />
        };
      case 'success':
        return {
          bg: 'var(--color-success-bg)',
          border: 'var(--color-success-border)',
          color: '#A7F3D0',
          iconColor: 'var(--color-success)',
          icon: <CheckCircle2 size={20} />
        };
      case 'info':
      default:
        return {
          bg: 'var(--color-info-bg)',
          border: 'var(--color-info-border)',
          color: '#BAE6FD',
          iconColor: 'var(--color-info)',
          icon: <Info size={20} />
        };
    }
  };

  const styleConfig = getAlertStyles();

  return (
    <div
      role="alert"
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.85rem',
        padding: '0.85rem 1rem',
        backgroundColor: styleConfig.bg,
        border: `1px solid ${styleConfig.border}`,
        borderRadius: 'var(--radius-md)',
        color: styleConfig.color,
        fontSize: '0.88rem',
        width: '100%'
      }}
    >
      <div style={{ color: styleConfig.iconColor, flexShrink: 0, marginTop: '2px' }}>
        {styleConfig.icon}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        {title && <strong style={{ fontWeight: 700, fontSize: '0.92rem' }}>{title}</strong>}
        <div>{message}</div>
        {details && (
          <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>
            {details}
          </div>
        )}
        {actionButton && <div style={{ marginTop: '8px' }}>{actionButton}</div>}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close alert"
          style={{
            background: 'none',
            border: 'none',
            color: styleConfig.iconColor,
            cursor: 'pointer',
            padding: '2px',
            borderRadius: 'var(--radius-sm)',
            opacity: 0.8
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
