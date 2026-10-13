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
  const msg = error?.message || 'Authentication request failed.';
  const lowerMsg = msg.toLowerCase();
  const code = (error?.code || '').toString().toLowerCase();
  const status = error?.status;

  // 1. Configuration Errors: Invalid/missing API key, project reference, or unauthorized header
  if (
    status === 401 ||
    code.includes('apikey') ||
    code.includes('unauthorized') ||
    lowerMsg.includes('api key') ||
    lowerMsg.includes('apikey') ||
    lowerMsg.includes('jwt')
  ) {
    return {
      code: 'CONFIGURATION_ERROR',
      title: 'Configuration Error',
      message: 'The Supabase client could not authenticate using the provided project API key.',
      details: 'Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env.local file.'
    };
  }

  // 2. Invalid Credentials: User does not exist or password mismatch
  if (
    code === 'invalid_credentials' ||
    lowerMsg.includes('invalid login credentials') ||
    lowerMsg.includes('invalid credentials')
  ) {
    return {
      code: 'INVALID_CREDENTIALS',
      title: 'Authentication Failed',
      message: 'The email address or password you entered is incorrect.',
      details: 'Verify your credentials or ensure this user has been created in the Supabase Authentication console.'
    };
  }

  // 3. Email Not Confirmed: Account registered but email confirmation is pending
  if (code === 'email_not_confirmed' || lowerMsg.includes('email not confirmed')) {
    return {
      code: 'INVALID_CREDENTIALS',
      title: 'Email Unverified',
      message: 'Your email address has not been confirmed yet.',
      details: 'Check your email inbox for the verification link sent by Supabase.'
    };
  }

  // 4. Rate Limiting: Too many requests
  if (status === 429 || code === 'over_request_rate_limit' || lowerMsg.includes('rate limit') || lowerMsg.includes('too many requests')) {
    return {
      code: 'TOO_MANY_ATTEMPTS',
      title: 'Too Many Attempts',
      message: 'Security threshold reached. Please wait a few moments before trying again.'
    };
  }

  // 5. Network / Connectivity Errors
  if (
    error?.name === 'AuthRetryableFetchError' ||
    lowerMsg.includes('failed to fetch') ||
    lowerMsg.includes('network') ||
    lowerMsg.includes('connection') ||
    status === 0
  ) {
    return {
      code: 'NETWORK_ERROR',
      title: 'Connection Error',
      message: 'Unable to reach the Supabase authentication server.',
      details: 'Please check your internet connection or verify that the Supabase project is active.'
    };
  }

  // 6. Generic Supabase Auth Error fallback (capturing actual Supabase error message cleanly)
  return {
    code: 'NETWORK_ERROR',
    title: 'Authentication Error',
    message: msg,
    details: status ? `Supabase HTTP ${status}${code ? ` (${code})` : ''}` : undefined
  };
}

export const supabaseAuthService = {
  isConfigured: () => isSupabaseConfigured,

  login: async (email: string, password: string): Promise<{ user: User; requiresPasswordChange: boolean }> => {
    const cleanEmail = email.trim();

    // Verify configuration without silent mock fallback
    if (!isSupabaseConfigured) {
      throw new AuthError(
        'CONFIGURATION_ERROR',
        'Configuration Error',
        'Supabase client is not configured.',
        'Please verify that VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env.local.'
      );
    }

    // Direct Supabase Auth call - no mock interception
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error) {
      const mapped = mapSupabaseAuthError(error);
      throw new AuthError(mapped.code, mapped.title, mapped.message, mapped.details);
    }

    if (!data.user) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Authentication Failed',
        'No user session was returned by Supabase.'
      );
    }

    const mappedUser = mapSupabaseUser(data.user);
    return {
      user: mappedUser,
      requiresPasswordChange: mappedUser.isFirstLogin
    };
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
