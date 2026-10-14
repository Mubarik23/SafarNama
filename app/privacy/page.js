import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | SafarNama PK',
  description: 'Privacy Policy for SafarNama PK, outlining data handling practices, security protocols, and traveler rights.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page-container">
      <div className="container-inner" style={{ maxWidth: '860px', padding: '48px 20px' }}>
        <div className="breadcrumb-bar" style={{ marginBottom: '24px' }}>
          <Link href="/">Home</Link>
          <span className="separator">/</span>
          <span className="current">Privacy Policy</span>
        </div>

        <header className="policy-header" style={{ marginBottom: '36px' }}>
          <h1 className="page-title" style={{ fontSize: '2.25rem', marginBottom: '12px' }}>
            Privacy Policy
          </h1>
          <p className="policy-effective-date" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Effective Date: October 14, 2026 | Last Updated: October 2026
          </p>
        </header>

        <article className="policy-body" style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              1. Introduction
            </h2>
            <p>
              SafarNama PK (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the SafarNama platform accessible via safarnama.pk. This Privacy Policy describes how we handle, collect, protect, and process user information when you browse destination guides, check northern highway clearance, save travel itineraries, or use our travel discovery services.
            </p>
            <p>
              We respect your personal privacy. We do not sell your personal data to third-party data brokers or advertisers.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              2. Information We Collect
            </h2>
            <p>We collect only the information necessary to provide reliable travel discovery and planning services:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>Account Credentials:</strong> If you register or authenticate via our secure Supabase authentication provider, we store your email address and encrypted authentication tokens.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Travel Preferences &amp; Saved Places:</strong> Destinations, resorts, and itineraries that you bookmark are stored locally in your browser storage (localStorage) or associated securely with your authenticated profile.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Technical &amp; Log Data:</strong> Standard server logs, IP addresses, browser types, referring pages, and device specifications collected for site stability, fraud prevention, and performance telemetry.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              3. How We Use Collected Information
            </h2>
            <p>Your information is used strictly for the following purposes:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li style={{ marginBottom: '8px' }}>Delivering real-time transit alerts and northern pass advisories (KKH, Babusar Pass, Jaglot-Skardu).</li>
              <li style={{ marginBottom: '8px' }}>Maintaining your saved destinations list and custom travel itineraries across sessions.</li>
              <li style={{ marginBottom: '8px' }}>Responding to customer inquiries, support tickets, and verification requests.</li>
              <li style={{ marginBottom: '8px' }}>Preventing malicious activity, automated scraping, and unauthorized system access.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              4. Cookies and Local Storage
            </h2>
            <p>
              SafarNama PK uses browser local storage (localStorage) and essential session cookies to remember your visual theme preference (light or dark mode) and your pinned travel destinations. We do not use third-party invasive cross-site tracking cookies.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              5. Third-Party Service Providers
            </h2>
            <p>
              We collaborate with reputable technology partners who adhere to rigorous data privacy standards:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li style={{ marginBottom: '8px' }}>
                <strong>OpenStreetMap and CARTO:</strong> Map tiles and spatial coordinate rendering for interactive Pakistan geography.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>Supabase:</strong> Cloud database infrastructure, row-level security, and encrypted authentication services.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong>National Highway &amp; Motorway Police (NHMP):</strong> Public domain advisory data for transit conditions.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              6. Data Security and Retention
            </h2>
            <p>
              All traffic is encrypted in transit using standard Transport Layer Security (TLS 1.3 / HTTPS). Account records are protected with database-level row security policies. You may clear your locally stored travel records at any time directly through your browser settings or by clicking &quot;Clear All&quot; on the Saved Places dashboard.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              7. Your Legal Rights
            </h2>
            <p>
              You maintain the right to inspect, correct, export, or permanently erase your profile and stored itinerary records. To request account deletion or data clarification, contact our compliance officer at privacy@safarnama.pk.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              8. Contact Details
            </h2>
            <p>
              If you have questions regarding this Privacy Policy or data governance practices, please contact:
            </p>
            <div style={{ background: 'var(--bg-surface)', padding: '18px 24px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginTop: '12px' }}>
              <p style={{ margin: '0 0 6px' }}><strong>SafarNama PK Privacy &amp; Legal Compliance</strong></p>
              <p style={{ margin: '0 0 6px' }}>Email: privacy@safarnama.pk</p>
              <p style={{ margin: '0 0 6px' }}>Helpline: (051) 111-72327</p>
              <p style={{ margin: 0 }}>Islamabad, Pakistan</p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
