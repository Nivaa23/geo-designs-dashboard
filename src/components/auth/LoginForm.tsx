import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { PasswordInput } from '../common/PasswordInput';
import { Button } from '../common/Button';
import { Checkbox } from '../common/Checkbox';
import { Alert } from '../common/Alert';
import { Mail, Lock, ArrowRight } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      {/* Form Header — LEFT ALIGNED ENTERPRISE GATEWAY */}
      <div>
        <div
          style={{
            fontSize: '0.65rem',
            fontWeight: 650,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-500)',
            marginBottom: '4px',
            fontFamily: 'var(--font-sans)'
          }}
        >
          SECURE AUTHENTICATION GATEWAY
        </div>
        <h2 style={{ fontSize: '1.3rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Sign in to your account
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 400, lineHeight: 1.45 }}>
          Enter your corporate credentials to access the workspace.
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
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }} noValidate>
        {/* Field 1: Company Email */}
        <Input
          label="COMPANY EMAIL ADDRESS"
          type="email"
          placeholder="name@geodesigns.com"
          prefixIcon={<Mail size={16} style={{ color: 'var(--color-accent-500)' }} />}
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
          label="PASSWORD"
          placeholder="Enter your corporate password"
          prefixIcon={<Lock size={16} style={{ color: 'var(--color-accent-500)' }} />}
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
            fontSize: '0.78125rem'
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
              color: 'var(--color-accent-500)',
              fontSize: '0.78125rem',
              fontWeight: 500,
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
          size="md"
          fullWidth
          isLoading={isLoading}
          iconRight={<ArrowRight size={15} />}
          style={{ marginTop: '0.2rem' }}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};
