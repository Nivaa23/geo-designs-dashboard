import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { ForcePasswordChangeForm } from './components/auth/ForcePasswordChangeForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { AuthErrorStateView } from './components/auth/AuthErrorStateView';
import { AppShell } from './components/dashboard/AppShell';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const { currentView } = useAuth();

  const renderActiveView = () => {
    switch (currentView) {
      case 'login':
        return <LoginForm />;
      case 'force-password-change':
        return <ForcePasswordChangeForm />;
      case 'forgot-password':
      case 'forgot-password-success':
        return <ForgotPasswordForm />;
      case 'reset-password':
      case 'reset-password-success':
        return <ResetPasswordForm />;
      case 'error-state-showcase':
        return <AuthErrorStateView />;
      case 'dashboard':
        return <AppShell />;
      default:
        return <LoginForm />;
    }
  };

  if (currentView === 'dashboard') {
    return <AppShell />;
  }

  return <AuthLayout>{renderActiveView()}</AuthLayout>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
