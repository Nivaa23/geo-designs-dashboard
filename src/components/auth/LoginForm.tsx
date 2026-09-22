import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { Button } from '../common/Button';
import { Checkbox } from '../common/Checkbox';
import { Alert } from '../common/Alert';
import { Mail } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, isLoading, errorState, clearError, rememberMe, setRememberMe, setCurrentView } = useAuth();

  const [email, setEmail] = useState<string>('employee@geodesigns.com');
  const [password, setPassword] = useState<string>('password123');
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Company email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Enter a valid company email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await login(email, password);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem', textAlign: 'left' }}>
      {/* Form Header — LEFT ALIGNED */}
      <div>
        <h2 style={{ fontSize: '1.65rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
          Sign in to your workspace
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 400, lineHeight: 1.5 }}>
          Enter your company credentials to continue.
        </p>
      </div>

      {/* Contextual Error Alert Banner */}
      {errorState && (
        <Alert
          type={
            errorState.code === 'ACCOUNT_DISABLED' || errorState.code === 'ACCOUNT_LOCKED'
              ? 'error'
              : 'warning'
          }
          title={errorState.title}
          message={errorState.message}
          details={errorState.details}
          onClose={clearError}
        />
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} noValidate>
        {/* Field 1: Company Email */}
        <Input
          label="Company Email"
          type="email"
          placeholder="name@geodesigns.com"
          prefixIcon={<Mail size={16} />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
          }}
          error={formErrors.email}
          required
          autoComplete="username"
        />

        {/* Field 2: Password */}
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={formErrors.password}
          required
          autoComplete="current-password"
        />

        {/* Action Row — Same Horizontal Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.85rem'
          }}
        >
          <Checkbox
            label="Remember this device"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />

          <button
            type="button"
            onClick={() => {
              clearError();
              setCurrentView('forgot-password');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284C7',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Forgot Password?
          </button>
        </div>

        {/* Primary Full-Width Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          style={{ marginTop: '0.35rem' }}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};
