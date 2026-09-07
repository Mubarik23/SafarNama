/**
 * SafarNama PK - Supabase Client & Backend Integration Layer
 * Provides access to Supabase database, authentication, and storage
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { ENV } from './config.js';

let supabaseClient = null;

/**
 * Checks whether Supabase URL and Anon Key are provided and non-placeholder
 */
export function isSupabaseConfigured() {
  const url = ENV.SUPABASE_URL?.trim();
  const key = ENV.SUPABASE_ANON_KEY?.trim();
  return (
    !!url &&
    !!key &&
    !url.includes('your-project-id') &&
    !key.includes('your-supabase-anon-key-here')
  );
}

/**
 * Initializes or returns the cached Supabase client
 */
export function initSupabase(customUrl = null, customKey = null) {
  let url = (customUrl || ENV.SUPABASE_URL || '').trim();
  const key = (customKey || ENV.SUPABASE_ANON_KEY || '').trim();

  // Clean trailing /rest/v1 or trailing slashes if present
  url = url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

  if (!url || !key || url.includes('your-project-id') || key.includes('your-supabase-anon-key-here')) {
    console.warn(
      '[SafarNama Supabase] Supabase credentials not set or still default placeholders in .env.local.\n' +
      'To connect, add your SUPABASE_URL and SUPABASE_ANON_KEY to .env.local.'
    );
    return null;
  }

  try {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    console.info('[SafarNama Supabase] Client initialized successfully with URL:', url);
    return supabaseClient;
  } catch (err) {
    console.error('[SafarNama Supabase] Initialization error:', err);
    return null;
  }
}

/**
 * Get current Supabase client instance (or initialize if not yet done)
 */
export function getSupabase() {
  if (!supabaseClient) {
    return initSupabase();
  }
  return supabaseClient;
}

/**
 * Tests connectivity to Supabase project
 * Returns { success: boolean, message: string, details?: any }
 */
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      message: 'Supabase is not configured yet. Please enter your SUPABASE_URL and SUPABASE_ANON_KEY in .env.local.'
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Failed to initialize Supabase client. Check your URL and Key syntax.'
    };
  }

  try {
    // Attempt a lightweight ping by checking auth session or querying system health
    const { data, error } = await client.auth.getSession();

    if (error) {
      return {
        success: false,
        message: `Supabase responded with an error: ${error.message}`,
        details: error
      };
    }

    return {
      success: true,
      projectUrl: ENV.SUPABASE_URL,
      message: 'Successfully connected to your Supabase project! 🚀',
      authReady: true,
      currentSession: data?.session ? 'Active' : 'No active session (ready for sign-up/login)'
    };
  } catch (err) {
    return {
      success: false,
      message: `Network or connectivity error: ${err.message}`,
      details: err
    };
  }
}

// Named export of client instance getter
export const supabase = {
  get client() {
    return getSupabase();
  }
};
