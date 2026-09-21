import React, { type InputHTMLAttributes, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  prefixIcon,
  suffixIcon,
  required = false,
  id,
  className = '',
  style = {},
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>
            {label}
            {required && <span style={{ color: 'var(--color-error)', marginLeft: '4px' }}>*</span>}
          </span>
        </label>
      )}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {prefixIcon && (
          <div
            style={{
              position: 'absolute',
              left: '0.85rem',
              color: error ? 'var(--color-error)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            {prefixIcon}
          </div>
        )}

        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          style={{
            width: '100%',
            padding: '0.72rem 0.95rem',
            paddingLeft: prefixIcon ? '2.5rem' : '0.95rem',
            paddingRight: suffixIcon ? '2.5rem' : '0.95rem',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            border: `1px solid ${error ? 'var(--color-error)' : 'var(--border-color-default)'}`,
            borderRadius: 'var(--radius-md)',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            boxShadow: error ? '0 0 0 1px var(--color-error)' : 'none',
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            ...style
          }}
          className={`geo-input ${error ? 'geo-input-error' : ''} ${className}`}
          {...props}
        />

        {suffixIcon && (
          <div
            style={{
              position: 'absolute',
              right: '0.85rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {suffixIcon}
          </div>
        )}
      </div>

      {error ? (
        <span id={errorId} style={{ fontSize: '0.8rem', color: 'var(--color-error)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span id={helperId} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};
