import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';

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
      setEmailError('Company email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Enter a valid company email address');
      return;
    }
    setEmailError(undefined);
    await requestPasswordReset(email);
    setResendTimer(45);
  };

  const isSuccessState = currentView === 'forgot-password-success';

  if (isSuccessState) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
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
            PASSWORD RECOVERY
          </div>
          <h2 style={{ fontSize: '1.3rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            Check your email
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 400, lineHeight: 1.45 }}>
            Reset instructions have been sent to <strong>{resetTargetEmail}</strong>.
          </p>
        </div>

        <Alert
          type="info"
          message="The link expires in 15 minutes. Check your spam folder if you do not receive it."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.2rem' }}>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => setCurrentView('reset-password')}
            iconRight={<ArrowRight size={15} />}
          >
            Open Password Reset Link (Simulated)
          </Button>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            disabled={resendTimer > 0 || isLoading}
            onClick={handleSubmit}
          >
            {resendTimer > 0 ? `Resend Link in ${resendTimer}s` : 'Resend Email'}
          </Button>

          <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
            <button
              type="button"
              onClick={() => {
                clearError();
                setCurrentView('login');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#475569',
                fontSize: '0.78125rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <ArrowLeft size={15} /> Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      {/* Form Header — FORGOT PASSWORD */}
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
          PASSWORD RECOVERY
        </div>
        <h2 style={{ fontSize: '1.3rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Forgot your password?
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 400, lineHeight: 1.45 }}>
          Enter your company email address and we'll send you a link to reset your password.
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }} noValidate>
        <Input
          label="COMPANY EMAIL ADDRESS"
          type="email"
          placeholder="employee@geodesigns.com"
          prefixIcon={<Mail size={16} style={{ color: 'var(--color-accent-500)' }} />}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(undefined);
          }}
          error={emailError}
          required
          autoComplete="email"
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          iconRight={<ArrowRight size={15} />}
          style={{ marginTop: '0.2rem' }}
        >
          Send Reset Link
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
        <button
          type="button"
          onClick={() => {
            clearError();
            setCurrentView('login');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            fontSize: '0.78125rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <ArrowLeft size={15} /> Back to Sign In
        </button>
      </div>
    </div>
  );
};
