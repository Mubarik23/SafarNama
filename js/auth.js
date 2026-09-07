/**
 * SafarNama PK - Supabase Cloud Authentication & User Management Engine
 * Connects directly to Supabase Auth for sign-in, registration, email verification,
 * and user profile persistence, with fallback support for local admin.
 */

import { getSupabase, isSupabaseConfigured } from './supabase.js';

const AUTH_STORAGE_KEY = 'safarnama_users_v1';
const SESSION_KEY = 'safarnama_session_v1';

// Built-in Admin Seed for offline / administrative testing
const DEFAULT_ADMIN = {
  id: 'user-admin-01',
  fullName: 'SafarNama Admin',
  email: 'admin@safarnama.pk',
  phone: '+92 300 0000001',
  city: 'Islamabad',
  role: 'admin',
  avatar: 'https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff&size=128',
  passwordPlain: 'Admin@1234',
  createdAt: '2026-01-01T00:00:00Z'
};

export function evaluatePasswordStrength(password) {
  const pw = password || '';
  const result = {
    isValid: false,
    score: 0,
    level: 'weak', // 'weak', 'moderate', 'strong'
    feedback: [],
    checks: {
      length: pw.length >= 8,
      mixedCase: /[a-z]/.test(pw) && /[A-Z]/.test(pw),
      numbers: /[0-9]/.test(pw),
      symbols: /[^a-zA-Z0-9]/.test(pw)
    }
  };

  const commonWeak = [
    'password', '12345678', '123456789', 'admin123', 'admin1234', 'qwerty12',
    'qwerty123', 'pakistan123', 'safarnama', 'pass1234', 'welcome123', '11223344',
    'pakistan', 'ilovepakistan'
  ];

  if (commonWeak.includes(pw.toLowerCase())) {
    result.feedback.push('This password is too common and easily guessed.');
    result.level = 'weak';
    return result;
  }

  let score = 0;
  if (result.checks.length) score += 1;
  if (result.checks.mixedCase) score += 1;
  if (result.checks.numbers) score += 1;
  if (result.checks.symbols) score += 1;

  result.score = score;

  if (pw.length < 8) {
    result.level = 'weak';
    result.feedback.push('Password must be at least 8 characters long.');
  } else if (score < 3) {
    result.level = 'weak';
    result.feedback.push('Weak password. Include both uppercase & lowercase letters and numbers or symbols.');
  } else if (score === 3) {
    result.level = 'moderate';
    result.isValid = true;
  } else {
    result.level = 'strong';
    result.isValid = true;
  }

  result.isValid = pw.length >= 8 && score >= 3 && !commonWeak.includes(pw.toLowerCase());
  return result;
}

class AuthManager {
  constructor() {
    this.session = null;
    this._initialized = false;
    this._authSubscribers = [];
  }

  /**
   * Subscribe to auth state changes (login, logout, email confirmation)
   */
  onAuthChange(callback) {
    if (typeof callback === 'function') {
      this._authSubscribers.push(callback);
    }
  }

  _notifySubscribers(event, user) {
    this._authSubscribers.forEach(cb => {
      try { cb(event, user); } catch (err) { console.error('Auth subscriber error:', err); }
    });
  }

  /**
   * Initialize: restore Supabase session or sessionStorage
   */
  async init() {
    const supabase = getSupabase();

    // 1. Try restoring session from Supabase cloud
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          // Check if email is confirmed
          const isConfirmed = !!u.email_confirmed_at || !!u.confirmed_at;
          if (isConfirmed) {
            this._saveSession({
              id: u.id,
              email: u.email,
              fullName: u.user_metadata?.full_name || u.email.split('@')[0],
              phone: u.user_metadata?.phone || '',
              city: u.user_metadata?.city || '',
              role: u.user_metadata?.role || (u.email === 'admin@safarnama.pk' ? 'admin' : 'traveler'),
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.user_metadata?.full_name || u.email)}&background=10b981&color=fff&size=128`,
              emailConfirmed: true
            });
          }
        }

        // 2. Setup real-time auth state change listener (catches email verification clicks!)
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              const u = session.user;
              const isConfirmed = !!u.email_confirmed_at || !!u.confirmed_at;
              if (isConfirmed) {
                this._saveSession({
                  id: u.id,
                  email: u.email,
                  fullName: u.user_metadata?.full_name || u.email.split('@')[0],
                  phone: u.user_metadata?.phone || '',
                  city: u.user_metadata?.city || '',
                  role: u.user_metadata?.role || (u.email === 'admin@safarnama.pk' ? 'admin' : 'traveler'),
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.user_metadata?.full_name || u.email)}&background=10b981&color=fff&size=128`,
                  emailConfirmed: true
                });
                this._notifySubscribers('SIGNED_IN', this.session);
              }
            }
          } else if (event === 'SIGNED_OUT') {
            this._clearSession();
            this._notifySubscribers('SIGNED_OUT', null);
          }
        });
      } catch (err) {
        console.warn('[AuthManager] Supabase session check warning:', err);
      }
    }

    // 3. Fallback: check sessionStorage if not already set by Supabase
    if (!this.session) {
      try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) {
          this.session = JSON.parse(stored);
        }
      } catch {
        this.session = null;
      }
    }

    this._initialized = true;
    return this.session;
  }

  _saveSession(user) {
    this.session = user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  _clearSession() {
    this.session = null;
    sessionStorage.removeItem(SESSION_KEY);
  }

  get currentUser() {
    return this.session || null;
  }

  get isLoggedIn() {
    return !!this.session;
  }

  get isAdmin() {
    return this.session?.role === 'admin';
  }

  /**
   * Sign In with email & password via Supabase
   * Returns: { success: boolean, user?: object, error?: string, needsVerification?: boolean, email?: string }
   */
  async login(email, password) {
    if (!email || !password) {
      return { success: false, error: 'Please enter your email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Admin bypass option for development / administration
    if (cleanEmail === DEFAULT_ADMIN.email.toLowerCase() && password === DEFAULT_ADMIN.passwordPlain) {
      const adminUser = {
        id: DEFAULT_ADMIN.id,
        fullName: DEFAULT_ADMIN.fullName,
        email: DEFAULT_ADMIN.email,
        phone: DEFAULT_ADMIN.phone,
        city: DEFAULT_ADMIN.city,
        role: 'admin',
        avatar: DEFAULT_ADMIN.avatar,
        emailConfirmed: true
      };
      this._saveSession(adminUser);
      this._notifySubscribers('SIGNED_IN', adminUser);
      return { success: true, user: adminUser };
    }

    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured yet. Please check your credentials.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });

      if (error) {
        // Check if error is due to unverified email
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          return {
            success: false,
            needsVerification: true,
            email: cleanEmail,
            error: 'Your email address is not verified yet. Please check your inbox and click the verification link.'
          };
        }
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Unable to authenticate. Please check your credentials.' };
      }

      // Check email confirmation status
      const isConfirmed = !!data.user.email_confirmed_at || !!data.user.confirmed_at;
      if (!isConfirmed) {
        // Sign out temporary session until confirmed
        await supabase.auth.signOut();
        return {
          success: false,
          needsVerification: true,
          email: cleanEmail,
          error: 'Please verify your email before entering. Check your inbox for the confirmation link.'
        };
      }

      const user = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
        phone: data.user.user_metadata?.phone || '',
        city: data.user.user_metadata?.city || '',
        role: data.user.user_metadata?.role || 'traveler',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.user_metadata?.full_name || data.user.email)}&background=10b981&color=fff&size=128`,
        emailConfirmed: true
      };

      this._saveSession(user);
      this._notifySubscribers('SIGNED_IN', user);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message || 'Network error occurred during login.' };
    }
  }

  /**
   * Register a new traveler account via Supabase Auth
   * Saves profile metadata in Supabase and requires email verification
   */
  async register(fullName, email, password, phone = '', city = '') {
    if (!fullName || !email || !password) {
      return { success: false, error: 'Full name, email, and password are required.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const strength = evaluatePasswordStrength(password);
    if (!strength.isValid || strength.level === 'weak') {
      return {
        success: false,
        error: strength.feedback[0] || 'Weak password is not allowed. Must be at least 8 characters with a mix of uppercase, lowercase, and numbers/symbols.'
      };
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabase = getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured yet. Please check your credentials.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            city: city.trim(),
            role: 'traveler'
          },
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Registration failed. Please try again.' };
      }

      // Check if email confirmation is required
      const isConfirmed = !!data.user.email_confirmed_at || !!data.user.confirmed_at;
      if (!isConfirmed) {
        return {
          success: true,
          needsVerification: true,
          email: cleanEmail,
          message: `Verification link sent to ${cleanEmail}. Please check your inbox and verify your email to activate your account!`
        };
      }

      // Auto-confirmed (if email confirmations are disabled in Supabase project)
      const user = {
        id: data.user.id,
        email: data.user.email,
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        role: 'traveler',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName.trim())}&background=10b981&color=fff&size=128`,
        emailConfirmed: true
      };

      this._saveSession(user);
      this._notifySubscribers('SIGNED_IN', user);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to create account.' };
    }
  }

  /**
   * Resend the email confirmation link via Supabase Auth
   */
  async resendVerificationEmail(email) {
    if (!email) return { success: false, error: 'Email address is required.' };

    const supabase = getSupabase();
    if (!supabase) return { success: false, error: 'Supabase client not initialized.' };

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      });

      if (error) return { success: false, error: error.message };
      return { success: true, message: `Verification email has been resent to ${email.trim()}!` };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to resend verification email.' };
    }
  }

  /**
   * Sign Out and clear session
   */
  async logout() {
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
    this._clearSession();
    this._notifySubscribers('SIGNED_OUT', null);
  }
}

export const authManager = new AuthManager();
