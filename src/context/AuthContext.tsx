import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, AuthScreenView, AuthErrorState } from '../types/auth';
import { mockAuthService, AuthError } from '../services/mockAuthService';

interface AuthContextType {
  currentView: AuthScreenView;
  currentUser: User | null;
  isLoading: boolean;
  errorState: AuthErrorState | null;
  resetTargetEmail: string;
  rememberMe: boolean;
  setCurrentView: (view: AuthScreenView) => void;
  setErrorState: (error: AuthErrorState | null) => void;
  setRememberMe: (val: boolean) => void;
  clearError: () => void;
  login: (email: string, pass: string) => Promise<void>;
  changeMandatoryPassword: (currentPass: string, newPass: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPasswordWithToken: (token: string, newPass: string) => Promise<void>;
  logout: () => void;
  switchSeedUser: (user: User) => void;
  triggerSimulatedError: (errorState: AuthErrorState) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AuthScreenView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<AuthErrorState | null>(null);
  const [resetTargetEmail, setResetTargetEmail] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const clearError = () => setErrorState(null);

  const handleLogin = async (email: string, pass: string) => {
    setIsLoading(true);
    setErrorState(null);
    try {
      const { user, requiresPasswordChange } = await mockAuthService.login(email, pass);
      setCurrentUser(user);

      if (requiresPasswordChange) {
        setCurrentView('force-password-change');
      } else {
        setCurrentView('dashboard');
      }
    } catch (err: any) {
      if (err instanceof AuthError) {
        setErrorState(err.state);
      } else {
        setErrorState({
          code: 'NETWORK_ERROR',
          title: 'System Connection Error',
          message: 'Unable to establish secure handshake with authentication server.',
          details: 'Please check your internet connection and try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMandatoryPasswordChange = async (currentPass: string, newPass: string) => {
    if (!currentUser) return;
    setIsLoading(true);
    setErrorState(null);
    try {
      const updatedUser = await mockAuthService.changeMandatoryPassword(
        currentUser.id,
        currentPass,
        newPass
      );
      setCurrentUser(updatedUser);
      setCurrentView('dashboard');
    } catch (err: any) {
      if (err instanceof AuthError) {
        setErrorState(err.state);
      } else {
        setErrorState({
          code: 'WEAK_PASSWORD',
          title: 'Update Failed',
          message: 'An error occurred while updating your credentials.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setErrorState(null);
    try {
      const confirmedEmail = await mockAuthService.requestPasswordReset(email);
      setResetTargetEmail(confirmedEmail);
      setCurrentView('forgot-password-success');
    } catch (err: any) {
      if (err instanceof AuthError) {
        setErrorState(err.state);
      } else {
        setErrorState({
          code: 'NETWORK_ERROR',
          title: 'Request Failed',
          message: 'Unable to send password recovery email at this moment.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPasswordWithToken = async (token: string, newPass: string) => {
    setIsLoading(true);
    setErrorState(null);
    try {
      await mockAuthService.resetPasswordWithToken(token, newPass);
      setCurrentView('reset-password-success');
    } catch (err: any) {
      if (err instanceof AuthError) {
        setErrorState(err.state);
      } else {
        setErrorState({
          code: 'TOKEN_INVALID',
          title: 'Reset Failed',
          message: 'Invalid or expired password reset link.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setErrorState(null);
    setCurrentView('login');
  };

  const switchSeedUser = (user: User) => {
    setCurrentUser(user);
    setErrorState(null);
    if (user.accountStatus === 'disabled') {
      setCurrentView('login');
      setErrorState({
        code: 'ACCOUNT_DISABLED',
        title: 'Account Suspended',
        message: 'This employee account has been deactivated by Organization Administration.',
        details: 'Contact hr@geodesigns.com for assistance.'
      });
      return;
    }
    if (user.accountStatus === 'locked') {
      setCurrentView('login');
      setErrorState({
        code: 'ACCOUNT_LOCKED',
        title: 'Account Temporarily Locked',
        message: 'Security lock triggered due to 5 consecutive failed login attempts.',
        details: 'Locked for 30 minutes. Reset password to unlock.'
      });
      return;
    }

    if (user.isFirstLogin) {
      setCurrentView('force-password-change');
    } else {
      setCurrentView('dashboard');
    }
  };

  const triggerSimulatedError = (errState: AuthErrorState) => {
    setErrorState(errState);
  };

  return (
    <AuthContext.Provider
      value={{
        currentView,
        currentUser,
        isLoading,
        errorState,
        resetTargetEmail,
        rememberMe,
        setCurrentView,
        setErrorState,
        setRememberMe,
        clearError,
        login: handleLogin,
        changeMandatoryPassword: handleMandatoryPasswordChange,
        requestPasswordReset: handleRequestPasswordReset,
        resetPasswordWithToken: handleResetPasswordWithToken,
        logout,
        switchSeedUser,
        triggerSimulatedError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
