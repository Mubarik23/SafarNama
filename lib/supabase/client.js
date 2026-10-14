import { createBrowserClient } from '@supabase/ssr';

let client = null;

export function createClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey || url.includes('your-project-id')) {
    return null;
  }

  try {
    client = createBrowserClient(url, anonKey);
  } catch (err) {
    console.warn('[Supabase SSR Client] Initialization failed:', err.message);
    client = null;
  }
  return client;
}
