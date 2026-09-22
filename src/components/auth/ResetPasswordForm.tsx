import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../common/PasswordInput';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Lock, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { evaluatePasswordRequirements } from '../../services/mockAuthService';

export const ResetPasswordForm: React.FC = () => {
  const { 
    resetPasswordWithToken, 
    isLoading, 
    errorState, 
    clearError, 
    setCurrentView,
    currentView 
  } = useAuth();

  const [token] = useState<string>('valid-token-xyz');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{ new?: string; confirm?: string }>({});

  const isSuccessState = currentView === 'reset-password-success';

  const validateForm = (): boolean => {
    const errors: { new?: string; confirm?: string } = {};

    if (!newPassword) {
      errors.new = 'New password is required';
    } else {
      const reqs = evaluatePasswordRequirements(newPassword);
      if (!reqs.minLength || !reqs.hasUppercase || !reqs.hasNumber) {
        errors.new = 'Password must be at least 8 characters with an uppercase letter and a number';
      }
    }

    if (!confirmPassword) {
      errors.confirm = 'Confirming your new password is required';
    } else if (newPassword !== confirmPassword) {
      errors.confirm = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await resetPasswordWithToken(token, newPassword);
  };

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
              marginBottom: '12px',
              fontFamily: 'var(--font-sans)'
            }}
          >
            PASSWORD RESET
          </div>

          {/* Refined Small Circular Success Indicator */}
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10B981',
              marginBottom: '12px'
            }}
          >
            <Check size={18} strokeWidth={2.5} />
          </div>

          <h2 style={{ fontSize: '1.3rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            Password reset successful
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 400, lineHeight: 1.45 }}>
            Your password has been updated successfully. You can now sign in using your new password.
          </p>
        </div>

        <div style={{ marginTop: '0.2rem' }}>
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={() => {
              clearError();
              setCurrentView('login');
            }}
            iconRight={<ArrowRight size={15} />}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
      {/* Form Header — PASSWORD RESET */}
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
          PASSWORD RESET
        </div>
        <h2 style={{ fontSize: '1.3rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.25rem', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Create a new password
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 400, lineHeight: 1.45 }}>
          Choose a new password for your Geo Designs &amp; Research account.
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
        {/* Field 1: New Password */}
        <div>
          <PasswordInput
            label="NEW PASSWORD"
            placeholder="Enter your new password"
            prefixIcon={<Lock size={16} style={{ color: 'var(--color-accent-500)' }} />}
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (fieldErrors.new) setFieldErrors((prev) => ({ ...prev, new: undefined }));
            }}
            error={fieldErrors.new}
            required
            autoComplete="new-password"
          />
          <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '4px', fontWeight: 400 }}>
            Must be at least 8 characters with 1 uppercase letter and 1 number.
          </div>
        </div>

        {/* Field 2: Confirm New Password */}
        <PasswordInput
          label="CONFIRM NEW PASSWORD"
          placeholder="Re-enter your new password"
          prefixIcon={<Lock size={16} style={{ color: 'var(--color-accent-500)' }} />}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirm) setFieldErrors((prev) => ({ ...prev, confirm: undefined }));
          }}
          error={fieldErrors.confirm}
          required
          autoComplete="new-password"
        />

        {/* Primary Reset Password Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={isLoading}
          iconRight={<ArrowRight size={15} />}
          style={{ marginTop: '0.2rem' }}
        >
          Reset Password
        </Button>
      </form>

      {/* Secondary Navigation */}
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
