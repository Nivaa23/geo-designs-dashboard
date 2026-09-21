export type UserRole = 
  | 'Employee'
  | 'Team Lead'
  | 'HR / Admin'
  | 'Management'
  | 'Client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  title?: string;
  isFirstLogin: boolean;
  avatarUrl?: string;
  accountStatus: 'active' | 'disabled' | 'locked';
  lastLoginAt?: string;
}

export type AuthScreenView = 
  | 'login'
  | 'force-password-change'
  | 'forgot-password'
  | 'forgot-password-success'
  | 'reset-password'
  | 'reset-password-success'
  | 'dashboard'
  | 'error-state-showcase';

export type AuthErrorCode = 
  | 'INVALID_CREDENTIALS'
  | 'ACCOUNT_DISABLED'
  | 'ACCOUNT_LOCKED'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_INVALID'
  | 'SESSION_EXPIRED'
  | 'NETWORK_ERROR'
  | 'TOO_MANY_ATTEMPTS'
  | 'WEAK_PASSWORD'
  | 'PASSWORD_MISMATCH';

export interface AuthErrorState {
  code: AuthErrorCode;
  title: string;
  message: string;
  details?: string;
}

export interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  notSameAsOld: boolean;
}
