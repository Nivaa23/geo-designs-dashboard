import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../common/Alert';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { AuthErrorCode } from '../../types/auth';
import { ShieldAlert, AlertTriangle, Lock, RefreshCw, WifiOff, ArrowLeft } from 'lucide-react';

export const AuthErrorStateView: React.FC = () => {
  const { setCurrentView } = useAuth();
  const [selectedError, setSelectedError] = useState<AuthErrorCode>('SESSION_EXPIRED');
  const [isSessionModalOpen, setIsSessionModalOpen] = useState<boolean>(false);

  const errorPresets: { code: AuthErrorCode; title: string; desc: string; type: 'error' | 'warning' | 'info' }[] = [
    {
      code: 'INVALID_CREDENTIALS',
      title: 'Invalid Credentials',
      desc: 'The email or password provided does not match company records.',
      type: 'warning'
    },
    {
      code: 'ACCOUNT_DISABLED',
      title: 'Account Disabled',
      desc: 'Account deactivated by HR / System Administrator.',
      type: 'error'
    },
    {
      code: 'ACCOUNT_LOCKED',
      title: 'Account Locked Out',
      desc: '5 consecutive failed attempts triggered security lockout.',
      type: 'error'
    },
    {
      code: 'TOKEN_EXPIRED',
      title: 'Reset Link Expired',
      desc: 'Security recovery token exceeded 15 minute lifespan.',
      type: 'warning'
    },
    {
      code: 'SESSION_EXPIRED',
      title: 'Session Timeout',
      desc: 'Inactivity timeout occurred. Re-authentication required.',
      type: 'info'
    },
    {
      code: 'NETWORK_ERROR',
      title: 'Server Connection Timeout',
      desc: 'Unable to reach Geo Designs & Research auth cluster.',
      type: 'error'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent-400)', fontSize: '0.85rem', fontWeight: 600 }}>
          <ShieldAlert size={16} /> Edge Case Testing Sandbox
        </div>
        <h2 style={{ fontSize: '1.5rem', marginTop: '0.2rem', marginBottom: '0.35rem', color: '#F8FAFC' }}>
          Authentication &amp; Session States
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Preview all reusable system error banners, modal dialogs, and edge case notifications.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
        {errorPresets.map((preset) => (
          <button
            key={preset.code}
            type="button"
            onClick={() => {
              setSelectedError(preset.code);
              if (preset.code === 'SESSION_EXPIRED') {
                setIsSessionModalOpen(true);
              }
            }}
            style={{
              padding: '0.75rem',
              textAlign: 'left',
              backgroundColor: selectedError === preset.code ? 'var(--color-brand-850)' : 'rgba(15, 23, 42, 0.5)',
              border: `1px solid ${selectedError === preset.code ? 'var(--color-accent-500)' : 'var(--border-color-default)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC' }}>{preset.title}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{preset.desc}</span>
          </button>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border-color-subtle)', paddingTop: '1rem' }}>
        <h4 style={{ fontSize: '0.88rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
          Active State Render:
        </h4>

        {selectedError === 'INVALID_CREDENTIALS' && (
          <Alert
            type="warning"
            title="Authentication Failure"
            message="The email address or password you entered is incorrect."
            details="Ensure your Caps Lock is off and check for email typos."
          />
        )}

        {selectedError === 'ACCOUNT_DISABLED' && (
          <Alert
            type="error"
            title="Account Suspended"
            message="This employee account has been deactivated by Organization Administration."
            details="Reach out to HR Operations at hr@geodesigns.com for support."
          />
        )}

        {selectedError === 'ACCOUNT_LOCKED' && (
          <Alert
            type="error"
            title="Account Temporarily Blocked"
            message="Security lock triggered after 5 consecutive failed login attempts."
            details="Account locked for 30 minutes. You can reset your password to unlock immediately."
            actionButton={
              <Button size="sm" variant="outline" iconLeft={<Lock size={14} />}>
                Reset Password to Unlock
              </Button>
            }
          />
        )}

        {selectedError === 'TOKEN_EXPIRED' && (
          <Alert
            type="warning"
            title="Security Link Expired"
            message="This password reset link expired after 15 minutes of inactivity."
            actionButton={
              <Button size="sm" variant="outline" iconLeft={<RefreshCw size={14} />}>
                Request New Reset Link
              </Button>
            }
          />
        )}

        {selectedError === 'NETWORK_ERROR' && (
          <Alert
            type="error"
            title="Authentication Cluster Unavailable"
            message="Unable to reach the Geo Designs & Research identity server."
            details="Error Code: ERR_CONNECTION_REFUSED. Please verify network connectivity."
            actionButton={
              <Button size="sm" variant="outline" iconLeft={<WifiOff size={14} />}>
                Retry Connection
              </Button>
            }
          />
        )}

        {selectedError === 'SESSION_EXPIRED' && (
          <Alert
            type="info"
            title="Session Expired Modal Active"
            message="Click below to open the re-authentication session timeout dialog overlay."
            actionButton={
              <Button size="sm" variant="primary" onClick={() => setIsSessionModalOpen(true)}>
                Open Session Expired Dialog
              </Button>
            }
          />
        )}
      </div>

      <Modal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        title="Session Expired"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'center' }}>
          <div style={{ margin: '0 auto', color: 'var(--color-warning)' }}>
            <AlertTriangle size={48} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', color: '#F8FAFC' }}>
              Your Session Has Timed Out
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              For your security and to protect confidential geotechnical project data, inactive sessions are automatically locked after 15 minutes.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsSessionModalOpen(false)}
            >
              Dismiss
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setIsSessionModalOpen(false);
                setCurrentView('login');
              }}
            >
              Sign In Again
            </Button>
          </div>
        </div>
      </Modal>

      <Button
        variant="ghost"
        size="md"
        fullWidth
        onClick={() => setCurrentView('login')}
        iconLeft={<ArrowLeft size={16} />}
      >
        Return to Login Form
      </Button>
    </div>
  );
};
