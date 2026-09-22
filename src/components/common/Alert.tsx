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
          bg: '#FEF2F2',
          border: '#FCA5A5',
          color: '#991B1B',
          iconColor: '#E11D48',
          icon: <XCircle size={18} />
        };
      case 'warning':
        return {
          bg: '#FFFBEB',
          border: '#FDE68A',
          color: '#92400E',
          iconColor: '#D97706',
          icon: <AlertTriangle size={18} />
        };
      case 'success':
        return {
          bg: '#ECFDF5',
          border: '#A7F3D0',
          color: '#065F46',
          iconColor: '#059669',
          icon: <CheckCircle2 size={18} />
        };
      case 'info':
      default:
        return {
          bg: '#F0F9FF',
          border: '#BAE6FD',
          color: '#075985',
          iconColor: '#0284C7',
          icon: <Info size={18} />
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
        gap: '0.75rem',
        padding: '0.75rem 0.95rem',
        backgroundColor: styleConfig.bg,
        border: `1px solid ${styleConfig.border}`,
        borderRadius: 'var(--radius-md)',
        color: styleConfig.color,
        fontSize: '0.85rem',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ color: styleConfig.iconColor, flexShrink: 0, marginTop: '2px' }}>
        {styleConfig.icon}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
        {title && <strong style={{ fontWeight: 700, fontSize: '0.88rem' }}>{title}</strong>}
        <div>{message}</div>
        {details && (
          <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '3px' }}>
            {details}
          </div>
        )}
        {actionButton && <div style={{ marginTop: '6px' }}>{actionButton}</div>}
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
          <X size={15} />
        </button>
      )}
    </div>
  );
};
