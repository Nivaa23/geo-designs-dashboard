import React, { type InputHTMLAttributes, useId } from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled,
  id,
  ...props
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  return (
    <label
      htmlFor={checkboxId}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        fontSize: '0.85rem',
        color: '#334155',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{
            position: 'absolute',
            opacity: 0,
            width: 0,
            height: 0
          }}
          {...props}
        />
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '4px',
            border: `1.5px solid ${checked ? '#0F172A' : '#CBD5E1'}`,
            backgroundColor: checked ? '#0F172A' : '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)'
          }}
        >
          {checked && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
        </div>
      </div>
      <span>{label}</span>
    </label>
  );
};
