import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { ForcePasswordChangeForm } from './components/auth/ForcePasswordChangeForm';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/auth/ResetPasswordForm';
import { AuthErrorStateView } from './components/auth/AuthErrorStateView';
import { DashboardShellPlaceholder } from './components/dashboard/DashboardShellPlaceholder';
import { DemoControlsBar } from './components/demo/DemoControlsBar';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const { currentView } = useAuth();
  const isDemoEnabled = new URLSearchParams(window.location.search).get('demo') === 'true';

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
        return <DashboardShellPlaceholder />;
      default:
        return <LoginForm />;
    }
  };

  if (currentView === 'dashboard') {
    return (
      <div>
        <DashboardShellPlaceholder />
        {isDemoEnabled && <DemoControlsBar />}
      </div>
    );
  }

  return (
    <div>
      <AuthLayout>{renderActiveView()}</AuthLayout>
      {isDemoEnabled && <DemoControlsBar />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
