import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PasswordInput } from '../common/PasswordInput';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { PasswordStrengthMeter } from '../common/PasswordStrengthMeter';
import { evaluatePasswordRequirements } from '../../services/mockAuthService';

export const ForcePasswordChangeForm: React.FC = () => {
  const { currentUser, changeMandatoryPassword, isLoading, errorState, clearError } = useAuth();

  const [currentPassword, setCurrentPassword] = useState<string>('tempPass2026!');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { current?: string; new?: string; confirm?: string } = {};

    if (!currentPassword) {
      errors.current = 'Current temporary password is required';
    }

    if (!newPassword) {
      errors.new = 'New password is required';
    } else {
      const reqs = evaluatePasswordRequirements(newPassword, currentPassword);
      if (!reqs.minLength || !reqs.hasUppercase || !reqs.hasLowercase || !reqs.hasNumber || !reqs.hasSpecialChar) {
        errors.new = 'Password must meet all complexity requirements';
      } else if (!reqs.notSameAsOld) {
        errors.new = 'New password cannot match your temporary password';
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
    await changeMandatoryPassword(currentPassword, newPassword);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h1 style={{ fontSize: '1.35rem', color: '#F8FAFC', fontWeight: 600, marginBottom: '0.25rem' }}>
          Set Your Permanent Password
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Welcome, <strong>{currentUser?.name || 'Employee'}</strong>. Your account was created with a temporary password. Update it before accessing the workspace.
        </p>
      </div>

      <Alert
        type="info"
        message="Your new password must remain private and should not be shared with other employees."
      />

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
        <PasswordInput
          label="Temporary Password"
          placeholder="Enter received temporary password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            if (fieldErrors.current) setFieldErrors((prev) => ({ ...prev, current: undefined }));
          }}
          error={fieldErrors.current}
          required
        />

        <div>
          <PasswordInput
            label="New Password"
            placeholder="Create new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (fieldErrors.new) setFieldErrors((prev) => ({ ...prev, new: undefined }));
            }}
            error={fieldErrors.new}
            required
          />

          <PasswordStrengthMeter password={newPassword} oldPassword={currentPassword} />
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
          size="md"
          fullWidth
          isLoading={isLoading}
          style={{ marginTop: '0.25rem' }}
        >
          Update Password &amp; Continue
        </Button>
      </form>
    </div>
  );
};
