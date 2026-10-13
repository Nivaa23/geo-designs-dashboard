import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, AuthScreenView, AuthErrorState } from '../types/auth';
import { mockAuthService, AuthError } from '../services/mockAuthService';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { supabaseAuthService, mapSupabaseUser } from '../services/supabaseAuthService';

export type ColorTheme =
  | 'blue'
  | 'green'
  | 'neutral'
  | 'orange'
  | 'red'
  | 'rose'
  | 'violet'
  | 'yellow';

interface AuthContextType {
  currentView: AuthScreenView;
  currentUser: User | null;
  isLoading: boolean;
  errorState: AuthErrorState | null;
  resetTargetEmail: string;
  rememberMe: boolean;
  colorTheme: ColorTheme;
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
  setColorTheme: (colorTheme: ColorTheme) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AuthScreenView>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') || params.get('screen');
    if (viewParam === 'dashboard') {
      return 'dashboard';
    }
    if (viewParam === 'reset-password' || params.get('token')) {
      return 'reset-password';
    }
    if (viewParam === 'force-password-change' || viewParam === 'first-time-login' || viewParam === 'force-password') {
      return 'force-password-change';
    }
    // In development mode, check if a dev session was previously saved
    if (!isSupabaseConfigured) {
      const savedDevUser = localStorage.getItem('geo_dev_user');
      if (savedDevUser) {
        return 'dashboard';
      }
    }
    return 'login';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') || params.get('screen');
    if (!isSupabaseConfigured) {
      const savedDevUser = localStorage.getItem('geo_dev_user');
      if (savedDevUser) {
        try {
          return JSON.parse(savedDevUser);
        } catch {
          localStorage.removeItem('geo_dev_user');
        }
      }
      if (viewParam === 'dashboard') {
        return mockAuthService.getSeedUsers()[0]; // Sarah Jenkins (Senior Civil Engineer)
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<AuthErrorState | null>(null);
  const [resetTargetEmail, setResetTargetEmail] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('geo_color_theme') as ColorTheme;
    const validThemes: ColorTheme[] = ['blue', 'green', 'neutral', 'orange', 'red', 'rose', 'violet', 'yellow'];
    return validThemes.includes(saved) ? saved : 'blue';
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    localStorage.setItem('geo_color_theme', colorTheme);
  }, [colorTheme]);

  // Session restoration and single auth state change listener (only when Supabase is enabled)
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    // Restore active session on initial load
    supabaseAuthService.getCurrentSessionUser().then((sessionUser) => {
      if (isMounted && sessionUser) {
        setCurrentUser(sessionUser);
        setCurrentView((prev) => {
          if (prev === 'reset-password' || prev === 'force-password-change') return prev;
          return sessionUser.isFirstLogin ? 'force-password-change' : 'dashboard';
        });
      }
    });

    // Single Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          const mapped = mapSupabaseUser(session.user);
          setCurrentUser(mapped);
          if (mapped.isFirstLogin) {
            setCurrentView('force-password-change');
          } else {
            setCurrentView((prev) => (prev === 'login' ? 'dashboard' : prev));
          }
        }
      } else if (event === 'PASSWORD_RECOVERY') {
        setCurrentView('reset-password');
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setCurrentView('login');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearError = () => setErrorState(null);

  const handleLogin = async (email: string, pass: string) => {
    setIsLoading(true);
    setErrorState(null);
    try {
      if (isSupabaseConfigured) {
        const { user, requiresPasswordChange } = await supabaseAuthService.login(email, pass);
        setCurrentUser(user);

        if (requiresPasswordChange) {
          setCurrentView('force-password-change');
        } else {
          setCurrentView('dashboard');
        }
      } else {
        // Development/demo access flow: authenticate using mockAuthService
        const { user, requiresPasswordChange } = await mockAuthService.login(email, pass);
        setCurrentUser(user);
        localStorage.setItem('geo_dev_user', JSON.stringify(user));

        if (requiresPasswordChange) {
          setCurrentView('force-password-change');
        } else {
          setCurrentView('dashboard');
        }
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
      // Check if user is a Supabase user (UUID id format)
      if (isSupabaseConfigured && currentUser.id.length > 20) {
        await supabaseAuthService.updatePassword(newPass);
        setCurrentUser({ ...currentUser, isFirstLogin: false });
        setCurrentView('dashboard');
      } else {
        const updatedUser = await mockAuthService.changeMandatoryPassword(
          currentUser.id,
          currentPass,
          newPass
        );
        setCurrentUser(updatedUser);
        if (!isSupabaseConfigured) {
          localStorage.setItem('geo_dev_user', JSON.stringify(updatedUser));
        }
        setCurrentView('dashboard');
      }
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
      const confirmedEmail = isSupabaseConfigured
        ? await supabaseAuthService.requestPasswordReset(email)
        : await mockAuthService.requestPasswordReset(email);
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
      if (isSupabaseConfigured) {
        await supabaseAuthService.updatePassword(newPass);
      } else {
        await mockAuthService.resetPasswordWithToken(token, newPass);
      }
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
    if (isSupabaseConfigured) {
      supabaseAuthService.logout();
    } else {
      localStorage.removeItem('geo_dev_user');
    }
    setCurrentUser(null);
    setErrorState(null);
    setCurrentView('login');
  };

  const switchSeedUser = (user: User) => {
    setCurrentUser(user);
    if (!isSupabaseConfigured) {
      localStorage.setItem('geo_dev_user', JSON.stringify(user));
    }
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
        colorTheme,
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
        triggerSimulatedError,
        setColorTheme
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
