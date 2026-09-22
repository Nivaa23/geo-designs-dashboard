import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  iconLeft,
  iconRight,
  disabled,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: '#0F172A',
          color: '#FFFFFF',
          border: '1px solid #0F172A',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
        };
      case 'secondary':
        return {
          background: '#F1F5F9',
          color: '#0F172A',
          border: '1px solid #E2E8F0'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#0F172A',
          border: '1px solid #CBD5E1'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#475569',
          border: '1px solid transparent'
        };
      case 'danger':
        return {
          background: '#E11D48',
          color: '#FFFFFF',
          border: '1px solid #BE123C'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { height: '38px', padding: '0 0.95rem', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)' };
      case 'lg':
      case 'md':
      default:
        return { height: '48px', padding: '0 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)' };
    }
  };

  const isBtnDisabled = disabled || isLoading;

  return (
    <button
      disabled={isBtnDisabled}
      className={`geo-button geo-button-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        cursor: isBtnDisabled ? 'not-allowed' : 'pointer',
        opacity: isBtnDisabled ? 0.65 : 1,
        transition: 'all var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        outline: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={16} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        iconLeft
      )}
      <span>{children}</span>
      {!isLoading && iconRight}
    </button>
  );
};
