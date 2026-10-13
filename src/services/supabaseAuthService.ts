import type { User, UserRole, AuthErrorState } from '../types/auth';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AuthError, mockAuthService } from './mockAuthService';
import type { User as SupabaseAuthUser } from '@supabase/supabase-js';

export function mapSupabaseUser(sbUser: SupabaseAuthUser): User {
  const metadata = sbUser.user_metadata || {};

  // Do not assume Super Admin. Default to 'Employee' unless explicitly provided in user metadata
  const validRoles: UserRole[] = ['Employee', 'Team Lead', 'HR / Admin', 'Management', 'Client'];
  const role: UserRole = validRoles.includes(metadata.role) ? metadata.role : 'Employee';

  return {
    id: sbUser.id,
    name: metadata.full_name || metadata.name || sbUser.email?.split('@')[0] || 'User',
    email: sbUser.email || '',
    role,
    department: metadata.department || 'Engineering',
    title: metadata.title || 'Specialist',
    isFirstLogin: Boolean(metadata.is_first_login ?? metadata.isFirstLogin ?? false),
    accountStatus: 'active',
    lastLoginAt: sbUser.last_sign_in_at ? new Date(sbUser.last_sign_in_at).toLocaleString() : new Date().toLocaleString()
  };
}

export function mapSupabaseAuthError(error: any): AuthErrorState {
  const msg = (error?.message || '').toLowerCase();

  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return {
      code: 'INVALID_CREDENTIALS',
      title: 'Authentication Failed',
      message: 'The email address or password you entered is incorrect.',
      details: 'Please verify your credentials or check your Supabase user directory.'
    };
  }

  if (msg.includes('email not confirmed')) {
    return {
      code: 'INVALID_CREDENTIALS',
      title: 'Email Unverified',
      message: 'Please confirm your email address before signing in.',
      details: 'Check your email inbox for the verification link sent by Supabase.'
    };
  }

  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return {
      code: 'TOO_MANY_ATTEMPTS',
      title: 'Too Many Attempts',
      message: 'Security threshold reached. Please wait a few moments before trying again.'
    };
  }

  return {
    code: 'NETWORK_ERROR',
    title: 'Connection Error',
    message: error?.message || 'Unable to establish secure connection with Supabase authentication server.',
    details: 'Please check your internet connection or verify your Supabase project status.'
  };
}

export const supabaseAuthService = {
  isConfigured: () => isSupabaseConfigured,

  login: async (email: string, password: string): Promise<{ user: User; requiresPasswordChange: boolean }> => {
    const cleanEmail = email.trim();

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (error) {
          // If Supabase authentication fails with invalid credentials, check if it's one of the local seed/demo users
          // This ensures demo accounts like employee@geodesigns.com / password123 continue to function seamlessly
          try {
            return await mockAuthService.login(cleanEmail, password);
          } catch {
            const mapped = mapSupabaseAuthError(error);
            throw new AuthError(mapped.code, mapped.title, mapped.message, mapped.details);
          }
        }

        if (data.user) {
          const mappedUser = mapSupabaseUser(data.user);
          return {
            user: mappedUser,
            requiresPasswordChange: mappedUser.isFirstLogin
          };
        }
      } catch (err: any) {
        if (err instanceof AuthError) {
          throw err;
        }
        // Fall back to seed users if Supabase throws a network error during local development
        try {
          return await mockAuthService.login(cleanEmail, password);
        } catch {
          const mapped = mapSupabaseAuthError(err);
          throw new AuthError(mapped.code, mapped.title, mapped.message, mapped.details);
        }
      }
    }

    // Default to mockAuthService if Supabase is not configured
    return await mockAuthService.login(cleanEmail, password);
  },

  logout: async (): Promise<void> => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Error signing out of Supabase:', err);
      }
    }
  },

  getCurrentSessionUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) return null;
      return mapSupabaseUser(session.user);
    } catch {
      return null;
    }
  },

  requestPasswordReset: async (email: string): Promise<string> => {
    const cleanEmail = email.trim();
    if (isSupabaseConfigured) {
      try {
        const redirectUrl = `${window.location.origin}/?view=reset-password`;
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: redirectUrl
        });

        if (error) {
          // Fall back to mock if email belongs to mock directory
          try {
            return await mockAuthService.requestPasswordReset(cleanEmail);
          } catch {
            const mapped = mapSupabaseAuthError(error);
            throw new AuthError(mapped.code, mapped.title, mapped.message, mapped.details);
          }
        }
        return cleanEmail;
      } catch (err: any) {
        if (err instanceof AuthError) throw err;
        try {
          return await mockAuthService.requestPasswordReset(cleanEmail);
        } catch {
          const mapped = mapSupabaseAuthError(err);
          throw new AuthError(mapped.code, mapped.title, mapped.message, mapped.details);
        }
      }
    }
    return await mockAuthService.requestPasswordReset(cleanEmail);
  },

  updatePassword: async (newPassword: string): Promise<boolean> => {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) {
          const mapped = mapSupabaseAuthError(error);
          throw new AuthError(mapped.code, mapped.title, mapped.message, mapped.details);
        }
        return true;
      } catch (err: any) {
        if (err instanceof AuthError) throw err;
        const mapped = mapSupabaseAuthError(err);
        throw new AuthError(mapped.code, mapped.title, mapped.message, mapped.details);
      }
    }
    return true;
  }
};
