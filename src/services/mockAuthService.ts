import type { User, AuthErrorState, AuthErrorCode, PasswordRequirements } from '../types/auth';

// Seed Database of Users
const MOCK_USERS: User[] = [
  {
    id: 'usr-101',
    name: 'Sarah Jenkins',
    email: 'employee@geodesigns.com',
    role: 'Employee',
    department: 'Geotechnical Engineering',
    title: 'Senior Civil Engineer',
    isFirstLogin: false,
    accountStatus: 'active',
    lastLoginAt: '2026-09-20 14:30'
  },
  {
    id: 'usr-102',
    name: 'Alex Rivera',
    email: 'newhire@geodesigns.com',
    role: 'Employee',
    department: 'Structural Surveying',
    title: 'Junior Field Specialist',
    isFirstLogin: true, // Forces mandatory password change
    accountStatus: 'active'
  },
  {
    id: 'usr-103',
    name: 'Marcus Vance',
    email: 'lead@geodesigns.com',
    role: 'Team Lead',
    department: 'Hydrology & Mapping',
    title: 'Principal Team Lead',
    isFirstLogin: false,
    accountStatus: 'active',
    lastLoginAt: '2026-09-21 09:15'
  },
  {
    id: 'usr-104',
    name: 'Elena Rostova',
    email: 'hr@geodesigns.com',
    role: 'HR / Admin',
    department: 'People & Operations',
    title: 'Head of People Operations',
    isFirstLogin: false,
    accountStatus: 'active',
    lastLoginAt: '2026-09-21 16:45'
  },
  {
    id: 'usr-105',
    name: 'David Sterling',
    email: 'management@geodesigns.com',
    role: 'Management',
    department: 'Executive Leadership',
    title: 'VP of Engineering',
    isFirstLogin: false,
    accountStatus: 'active',
    lastLoginAt: '2026-09-21 11:00'
  },
  {
    id: 'usr-106',
    name: 'Rebecca Thorne',
    email: 'client@acme.com',
    role: 'Client',
    department: 'Acme Infrastructure Corp',
    title: 'Project Liaison',
    isFirstLogin: false,
    accountStatus: 'active',
    lastLoginAt: '2026-09-18 10:20'
  },
  {
    id: 'usr-107',
    name: 'Disabled User',
    email: 'disabled@geodesigns.com',
    role: 'Employee',
    department: 'GIS Systems',
    title: 'Former Consultant',
    isFirstLogin: false,
    accountStatus: 'disabled'
  },
  {
    id: 'usr-108',
    name: 'Locked User',
    email: 'locked@geodesigns.com',
    role: 'Employee',
    department: 'Environmental Analysis',
    title: 'Field Technician',
    isFirstLogin: false,
    accountStatus: 'locked'
  }
];

// Helper to simulate realistic async network delay
const delay = (ms: number = 800) => new Promise((res) => setTimeout(res, ms));

export class AuthError extends Error {
  state: AuthErrorState;
  constructor(code: AuthErrorCode, title: string, message: string, details?: string) {
    super(message);
    this.name = 'AuthError';
    this.state = { code, title, message, details };
  }
}

// Password strength calculation utility
export function evaluatePasswordRequirements(
  password: string, 
  oldPassword?: string
): PasswordRequirements {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    notSameAsOld: oldPassword ? password !== oldPassword : true
  };
}

export function calculatePasswordStrengthScore(reqs: PasswordRequirements): number {
  let score = 0;
  if (reqs.minLength) score += 20;
  if (reqs.hasUppercase) score += 20;
  if (reqs.hasLowercase) score += 20;
  if (reqs.hasNumber) score += 20;
  if (reqs.hasSpecialChar) score += 20;
  return score;
}

export const mockAuthService = {
  getSeedUsers: () => MOCK_USERS,

  login: async (email: string, password: string): Promise<{ user: User; requiresPasswordChange: boolean }> => {
    await delay(700);

    const cleanEmail = email.trim().toLowerCase();
    const foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Authentication Failed',
        'The email address or password you entered is incorrect.',
        'Please verify your credentials or contact IT Helpdesk if you continue facing issues.'
      );
    }

    if (foundUser.accountStatus === 'disabled') {
      throw new AuthError(
        'ACCOUNT_DISABLED',
        'Account Suspended',
        'This employee account has been deactivated by Organization Administration.',
        'If you believe this is an error, please reach out to HR Operations at hr@geodesigns.com.'
      );
    }

    if (foundUser.accountStatus === 'locked') {
      throw new AuthError(
        'ACCOUNT_LOCKED',
        'Account Temporarily Locked',
        'Security lock triggered due to too many failed login attempts.',
        'Your account will remain locked for 30 minutes. You can reset your password to unlock immediately.'
      );
    }

    const validPassword = foundUser.isFirstLogin ? 'tempPass2026!' : 'password123';
    if (password !== validPassword && password !== 'password123') {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Invalid Credentials',
        'The email address or password you entered is incorrect.',
        'Note: Passwords are case-sensitive.'
      );
    }

    return {
      user: {
        ...foundUser,
        lastLoginAt: new Date().toLocaleString()
      },
      requiresPasswordChange: foundUser.isFirstLogin
    };
  },

  changeMandatoryPassword: async (
    userId: string, 
    currentPass: string, 
    newPass: string
  ): Promise<User> => {
    await delay(900);

    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      throw new AuthError('INVALID_CREDENTIALS', 'User Not Found', 'Target user account could not be found.');
    }

    if (currentPass !== 'tempPass2026!' && currentPass !== 'password123') {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Incorrect Temporary Password',
        'The current password you entered does not match our records.'
      );
    }

    const reqs = evaluatePasswordRequirements(newPass, currentPass);
    const isAllValid = Object.values(reqs).every(Boolean);

    if (!isAllValid) {
      throw new AuthError(
        'WEAK_PASSWORD',
        'Password Standard Not Met',
        'Your new password must meet all mandatory complexity requirements before proceeding.'
      );
    }

    user.isFirstLogin = false;
    user.lastLoginAt = new Date().toLocaleString();

    return { ...user };
  },

  requestPasswordReset: async (email: string): Promise<string> => {
    await delay(800);
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        'Account Not Found',
        'No active Geo Designs & Research employee or client account associated with this email.',
        'Please check for typos or contact admin@geodesigns.com for assistance.'
      );
    }

    if (foundUser.accountStatus === 'disabled') {
      throw new AuthError(
        'ACCOUNT_DISABLED',
        'Account Suspended',
        'Password recovery cannot be initiated for deactivated accounts.'
      );
    }

    return cleanEmail;
  },

  resetPasswordWithToken: async (token: string, newPass: string): Promise<boolean> => {
    await delay(900);

    if (token === 'expired-token') {
      throw new AuthError(
        'TOKEN_EXPIRED',
        'Security Link Expired',
        'This password reset link expired after 15 minutes of inactivity.',
        'Please request a new recovery link from the Forgot Password page.'
      );
    }

    if (token === 'invalid-token') {
      throw new AuthError(
        'TOKEN_INVALID',
        'Invalid Recovery Token',
        'The password reset security signature is malformed or invalid.',
        'Ensure you copied the complete link from your notification email.'
      );
    }

    const reqs = evaluatePasswordRequirements(newPass);
    if (!reqs.minLength || !reqs.hasUppercase || !reqs.hasNumber) {
      throw new AuthError(
        'WEAK_PASSWORD',
        'Password Standard Not Met',
        'Your new password does not satisfy company security policy guidelines.'
      );
    }

    return true;
  }
};
