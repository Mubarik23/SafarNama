'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase/client';

export default function SupabaseStatusBadge() {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    message: 'Testing connection...',
    projectUrl: ''
  });

  useEffect(() => {
    async function checkConn() {
      try {
        const supabase = createClient();
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        
        if (!supabase) {
          setStatus({
            loading: false,
            connected: false,
            message: 'Local Dataset Mode',
            projectUrl: 'offline'
          });
          return;
        }

        // Ping session or auth settings to verify Supabase connectivity
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus({
            loading: false,
            connected: false,
            message: error.message,
            projectUrl: url
          });
        } else {
          setStatus({
            loading: false,
            connected: true,
            message: 'Connected (SSR & Client)',
            projectUrl: url
          });
        }
      } catch (err) {
        setStatus({
          loading: false,
          connected: false,
          message: err.message,
          projectUrl: ''
        });
      }
    }

    checkConn();
  }, []);

  return (
    <div className="supabase-badge-pill" title={`Supabase Project: ${status.projectUrl || 'mwrkvzcbjrchtmallzml'}`}>
      <span
        className="supabase-status-dot"
        style={{
          backgroundColor: status.connected ? '#10b981' : status.loading ? '#f59e0b' : '#f43f5e',
          boxShadow: status.connected ? '0 0 8px #10b981' : 'none'
        }}
      ></span>
      <span>
        {status.loading ? 'Connecting Supabase...' : status.connected ? 'Supabase Connected' : 'Supabase Offline'}
      </span>
    </div>
  );
}
