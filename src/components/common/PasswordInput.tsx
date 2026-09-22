import React, { useState } from 'react';
import { Input, type InputProps } from './Input';
import { Eye, EyeOff, Lock } from 'lucide-react';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'suffixIcon'> {
  showLockIcon?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  showLockIcon = true,
  prefixIcon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      prefixIcon={prefixIcon || (showLockIcon ? <Lock size={16} /> : undefined)}
      suffixIcon={
        <button
          type="button"
          onClick={toggleVisibility}
          aria-label={showPassword ? 'Hide password text' : 'Show password text'}
          title={showPassword ? 'Hide password' : 'Show password'}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'color var(--transition-fast)'
          }}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
      {...props}
    />
  );
};
