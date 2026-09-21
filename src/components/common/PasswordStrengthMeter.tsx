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
    if (!password) return { text: 'Enter password', color: 'var(--text-muted)' };
    if (score < 40) return { text: 'Weak', color: '#F43F5E' };
    if (score < 80) return { text: 'Moderate', color: '#F59E0B' };
    if (score < 100) return { text: 'Strong', color: '#38BDF8' };
    return { text: 'Enterprise Grade (Excellent)', color: '#10B981' };
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
      label: 'Must not match your temporary/current password',
      isValid: reqs.notSameAsOld
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
      {/* Strength Bar Gauge */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span>Password Strength</span>
          <span style={{ fontWeight: 600, color: strength.color }}>{strength.text}</span>
        </div>

        <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
          {[20, 40, 60, 80, 100].map((step, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                borderRadius: '2px',
                backgroundColor: score >= step ? strength.color : 'var(--color-brand-800)',
                transition: 'background-color 0.25s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Requirements Checklist */}
      {showChecklist && (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '0.4rem', 
            marginTop: '0.4rem',
            padding: '0.65rem 0.85rem',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-color-subtle)',
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
                color: item.isValid ? '#A7F3D0' : 'var(--text-secondary)',
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
                  backgroundColor: item.isValid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: item.isValid ? '#10B981' : 'var(--text-muted)',
                  flexShrink: 0
                }}
              >
                {item.isValid ? <Check size={10} strokeWidth={3} /> : <X size={10} />}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
