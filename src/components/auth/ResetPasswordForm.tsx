import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../common/PasswordInput';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { PasswordStrengthMeter } from '../common/PasswordStrengthMeter';
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
        errors.new = 'Password does not meet required complexity';
      }
    }

    if (!confirmPassword) {
      errors.confirm = 'Confirm your new password';
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.025em' }}>
            Password updated
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
            Your account password has been reset. You can now sign in with your new credentials.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => {
            clearError();
            setCurrentView('login');
          }}
        >
          Sign In to Workspace
        </Button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: 800, marginBottom: '0.35rem', letterSpacing: '-0.025em' }}>
          Set new password
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
          Create a new permanent password for your workspace account.
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
        <div>
          <PasswordInput
            label="New Password"
            placeholder="Min 8 chars, uppercase & number"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (fieldErrors.new) setFieldErrors((prev) => ({ ...prev, new: undefined }));
            }}
            error={fieldErrors.new}
            required
          />

          <PasswordStrengthMeter password={newPassword} />
        </div>

        <PasswordInput
          label="Confirm New Password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirm) setFieldErrors((prev) => ({ ...prev, confirm: undefined }));
          }}
          error={fieldErrors.confirm}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
};
