import React from 'react';
import { Check, X } from 'lucide-react';
import { evaluatePasswordRequirements, calculatePasswordStrengthScore } from '../../services/mockAuthService';

interface PasswordStrengthMeterProps {
  password: string;
  oldPassword?: string;
  showChecklist?: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  oldPassword,
  showChecklist = true
}) => {
  const reqs = evaluatePasswordRequirements(password, oldPassword);
  const score = calculatePasswordStrengthScore(reqs);

  const getStrengthLabel = () => {
    if (!password) return { text: 'Enter password', color: 'var(--text-right-muted)' };
    if (score < 40) return { text: 'Weak', color: '#E11D48' };
    if (score < 80) return { text: 'Moderate', color: '#D97706' };
    if (score < 100) return { text: 'Strong', color: '#0284C7' };
    return { text: 'Excellent', color: '#059669' };
  };

  const strength = getStrengthLabel();

  const checklistItems = [
    { label: 'Minimum 8 characters long', isValid: reqs.minLength },
    { label: 'At least one uppercase letter (A-Z)', isValid: reqs.hasUppercase },
    { label: 'At least one lowercase letter (a-z)', isValid: reqs.hasLowercase },
    { label: 'At least one number (0-9)', isValid: reqs.hasNumber },
    { label: 'At least one special character (@$!%*?&)', isValid: reqs.hasSpecialChar }
  ];

  if (oldPassword) {
    checklistItems.push({
      label: 'Must not match temporary password',
      isValid: reqs.notSameAsOld
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem' }}>
      {/* Strength Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-right-secondary)' }}>
          <span>Password Strength</span>
          <span style={{ fontWeight: 600, color: strength.color }}>{strength.text}</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', height: '5px' }}>
          {[20, 40, 60, 80, 100].map((step, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                borderRadius: '2px',
                backgroundColor: score >= step ? strength.color : '#E2E8F0',
                transition: 'background-color 0.25s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Checklist */}
      {showChecklist && (
        <div 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem',
            marginTop: '0.3rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-md)'
          }}
        >
          {checklistItems.map((item, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.78rem',
                color: item.isValid ? '#065F46' : '#64748B',
                transition: 'color 0.2s ease'
              }}
            >
              <div
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: item.isValid ? '#ECFDF5' : '#F1F5F9',
                  color: item.isValid ? '#059669' : '#94A3B8',
                  border: `1px solid ${item.isValid ? '#A7F3D0' : '#CBD5E1'}`,
                  flexShrink: 0
                }}
              >
                {item.isValid ? <Check size={9} strokeWidth={3} /> : <X size={9} />}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
