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
      errors.email = 'Enter a valid email address';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '0.25rem' }}>
          Sign in to your workspace
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Enter your company credentials to continue.
        </p>
      </div>

      {/* Error Alert */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
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

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (formErrors.password) setFormErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={formErrors.password}
          required
          autoComplete="current-password"
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem'
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
              color: 'var(--color-accent-400)',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          style={{ marginTop: '0.25rem' }}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};
