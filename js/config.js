/**
 * SafarNama PK - Application Environment & API Keys Configuration
 * Automatically loads from .env and provides seamless fallback
 */

export const ENV = {
  // Google AI Studio API key (loaded dynamically via loadEnv() from .env/.env.local or window)
  GEMINI_API_KEY: (typeof window !== 'undefined' && window.GEMINI_API_KEY) || "",
  CARTO_API_KEY: (typeof window !== 'undefined' && window.CARTO_API_KEY) || "",
  // Supabase Configuration (loaded dynamically via loadEnv() from .env/.env.local or window)
  SUPABASE_URL: (typeof window !== 'undefined' && window.SUPABASE_URL) || "",
  SUPABASE_ANON_KEY: (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) || ""
};

/**
 * Parses raw .env content into key-value pairs
 */
function parseEnvContent(text) {
  text.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      const k = key.trim();
      const v = rest.join('=').trim().replace(/^["']|["']$/g, '');

      if (k === 'GEMINI_API_KEY' && v) ENV.GEMINI_API_KEY = v;
      if (k === 'CARTO_API_KEY' && v) ENV.CARTO_API_KEY = v;

      // Supabase URL (supports common aliases and strips trailing /rest/v1 or slashes)
      if (['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL'].includes(k) && v) {
        ENV.SUPABASE_URL = v.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      }

      // Supabase Anon Key (supports common aliases)
      if (['SUPABASE_ANON_KEY', 'SUPABASE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'].includes(k) && v) {
        ENV.SUPABASE_ANON_KEY = v;
      }
    }
  });
}

/**
 * Attempts to read .env followed by .env.local (overrides base .env)
 */
export async function loadEnv() {
  const envFiles = ['.env', '.env.local'];

  for (const file of envFiles) {
    try {
      const res = await fetch(`${file}?t=${Date.now()}`);
      if (res.ok) {
        const text = await res.text();
        parseEnvContent(text);
      }
    } catch {
      // Ignored if file cannot be fetched (e.g., restricted or offline)
    }
  }

  return ENV;
}
