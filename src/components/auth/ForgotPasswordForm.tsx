import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPasswordForm: React.FC = () => {
  const { 
    requestPasswordReset, 
    isLoading, 
    errorState, 
    clearError, 
    setCurrentView,
    resetTargetEmail,
    currentView 
  } = useAuth();

  const [email, setEmail] = useState<string>('employee@geodesigns.com');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [resendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setEmailError('Company email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter a valid email address');
      return;
    }
    setEmailError(undefined);
    await requestPasswordReset(email);
    setResendTimer(45);
  };

  const isSuccessState = currentView === 'forgot-password-success';

  if (isSuccessState) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '0.25rem' }}>
            Check your email
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Recovery instructions have been sent to <strong>{resetTargetEmail}</strong>.
          </p>
        </div>

        <Alert
          type="info"
          message="The link expires in 15 minutes. Check your spam folder if you do not receive it."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.25rem' }}>
          <Button
            variant="secondary"
            size="md"
            fullWidth
            disabled={resendTimer > 0 || isLoading}
            onClick={handleSubmit}
          >
            {resendTimer > 0 ? `Resend Link in ${resendTimer}s` : 'Resend Email'}
          </Button>

          <button
            type="button"
            onClick={() => {
              clearError();
              setCurrentView('login');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              marginTop: '0.25rem'
            }}
          >
            <ArrowLeft size={14} /> Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h1 style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '0.25rem' }}>
          Reset your password
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Enter your company email to receive reset instructions.
        </p>
      </div>

      {errorState && (
        <Alert
          type="error"
          title={errorState.title}
          message={errorState.message}
          details={errorState.details}
          onClose={clearError}
        />
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>
        <Input
          label="Company Email"
          type="email"
          placeholder="name@geodesigns.com"
          prefixIcon={<Mail size={16} />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(undefined);
          }}
          error={emailError}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
        >
          Send Reset Link
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '0.25rem' }}>
        <button
          type="button"
          onClick={() => {
            clearError();
            setCurrentView('login');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <ArrowLeft size={14} /> Back to Sign In
        </button>
      </div>
    </div>
  );
};
