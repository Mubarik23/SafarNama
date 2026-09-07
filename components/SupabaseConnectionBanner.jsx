'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase/client';

export default function SupabaseConnectionBanner() {
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  async function runTest() {
    setTesting(true);
    try {
      const supabase = createClient();
      const startTime = performance.now();
      const { data, error } = await supabase.auth.getSession();
      const duration = Math.round(performance.now() - startTime);

      if (error) {
        setTestResult({
          success: false,
          message: error.message,
          latency: `${duration}ms`
        });
      } else {
        setTestResult({
          success: true,
          message: 'Connected via @supabase/ssr! Ready for Auth & Database operations.',
          latency: `${duration}ms`,
          session: data.session ? 'Active User Session' : 'Anonymous / Public Access'
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message,
        latency: 'N/A'
      });
    } finally {
      setTesting(false);
    }
  }

  useEffect(() => {
    runTest();
  }, []);

  return (
    <div className="supabase-banner">
      <div className="supabase-banner-left">
        <div className="supabase-banner-icon">
          <i className="fa-solid fa-bolt"></i>
        </div>
        <div>
          <div className="supabase-banner-title">
            <span>Next.js App Router 🤝 Supabase Active</span>
            <span className="badge-subtle" style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.4)' }}>
              Project: mwrkvzcbjrchtmallzml
            </span>
          </div>
          <div className="supabase-banner-subtitle">
            {testResult
              ? `${testResult.message} (${testResult.latency})`
              : 'Initializing Supabase SSR connection...'}
          </div>
        </div>
      </div>
      <div>
        <button
          onClick={runTest}
          disabled={testing}
          className="btn-glass-sm"
          style={{
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '10px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            fontWeight: 600
          }}
        >
          <i className={`fa-solid ${testing ? 'fa-spinner fa-spin' : 'fa-arrows-rotate'}`}></i>{' '}
          {testing ? 'Pinging...' : 'Test Connection'}
        </button>
      </div>
    </div>
  );
}
