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
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
        };
      case 'secondary':
        return {
          background: 'var(--color-brand-800)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color-default)'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--color-brand-600)'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid transparent'
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)'
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '0.45rem 0.85rem', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' };
      case 'lg':
        return { padding: '0.85rem 1.6rem', fontSize: '1.05rem', borderRadius: 'var(--radius-md)' };
      case 'md':
      default:
        return { padding: '0.68rem 1.25rem', fontSize: '0.95rem', borderRadius: 'var(--radius-md)' };
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
        <Loader2 size={18} className="spin-icon" style={{ animation: 'spin 1s linear infinite' }} />
      ) : (
        iconLeft
      )}
      <span>{children}</span>
      {!isLoading && iconRight}
    </button>
  );
};
