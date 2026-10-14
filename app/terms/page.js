import Link from 'next/link';

export const metadata = {
  title: 'Terms and Conditions | SafarNama PK',
  description: 'Terms of Service and Conditions of Use for SafarNama PK, governing platform access, road alerts, and travel information.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="policy-page-container">
      <div className="container-inner" style={{ maxWidth: '860px', padding: '48px 20px' }}>
        <div className="breadcrumb-bar" style={{ marginBottom: '24px' }}>
          <Link href="/">Home</Link>
          <span className="separator">/</span>
          <span className="current">Terms and Conditions</span>
        </div>

        <header className="policy-header" style={{ marginBottom: '36px' }}>
          <h1 className="page-title" style={{ fontSize: '2.25rem', marginBottom: '12px' }}>
            Terms and Conditions
          </h1>
          <p className="policy-effective-date" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Effective Date: October 14, 2026 | Governing Law: Islamic Republic of Pakistan
          </p>
        </header>

        <article className="policy-body" style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              1. Agreement to Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the SafarNama PK website located at safarnama.pk or any associated services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with these terms, you must discontinue your use of the platform immediately.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              2. Nature of Services and Geographic Scope
            </h2>
            <p>
              SafarNama PK provides digital tools, geographic maps, verified valley guides, accommodation directory listings, and consolidated highway clearance information for domestic tourism across the provinces and administrative territories of Pakistan, including Gilgit-Baltistan, Khyber Pakhtunkhwa, Azad Jammu &amp; Kashmir, Balochistan, Punjab, and Sindh.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              3. Road Condition and Weather Advisories Disclaimer
            </h2>
            <p>
              Highway clearance reports (including status for the Karakoram Highway N-35, Babusar Pass N-15, Jaglot-Skardu Expressway S-1, and Lowari Tunnel N-45) are aggregated from official communications provided by the National Highway &amp; Motorway Police (NHMP), National Highway Authority (NHA), and regional administrative authorities.
            </p>
            <p style={{ background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: '8px', borderLeft: '4px solid #f59e0b', color: 'var(--text-primary)' }}>
              <strong>Important Mountain Travel Notice:</strong> Weather and geological conditions in high-altitude mountain corridors can alter unpredictably. Flash floods, avalanches, heavy snowfall, and landslides may occur without warning. SafarNama PK does not guarantee unobstructed road passage. Travelers must exercise personal discretion, verify clearance via official NHMP emergency helplines (130), and equip their vehicles with suitable emergency provisions.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              4. Independent Tour Operators and Accommodations
            </h2>
            <p>
              Listings for third-party hotels, mountain resorts, guest houses, 4x4 transport providers, and tour operators are provided for informative and comparative purposes. SafarNama PK is an independent travel information directory:
            </p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li style={{ marginBottom: '8px' }}>We do not own, manage, or operate third-party hotels or vehicle fleets.</li>
              <li style={{ marginBottom: '8px' }}>Direct contractual arrangements, deposits, and room bookings made with third-party vendors are governed by those vendors&apos; specific terms of service and cancellation policies.</li>
              <li style={{ marginBottom: '8px' }}>We encourage travelers to inspect facilities and verify amenities directly prior to financial transactions.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              5. Intellectual Property
            </h2>
            <p>
              The design, layout, editorial copy, interactive map interfaces, curation algorithms, and brand assets of SafarNama PK are the exclusive intellectual property of SafarNama PK and protected by copyright, trademark, and trade dress regulations under Pakistani and international law. You may not reproduce, mirror, republish, or commercially exploit any platform content without prior written permission.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              6. Acceptable Use Policy
            </h2>
            <p>When using SafarNama PK, you agree not to:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li style={{ marginBottom: '8px' }}>Deploy automated web spiders, scrapers, or bots to harvest destination datasets or rates without authorization.</li>
              <li style={{ marginBottom: '8px' }}>Introduce malicious software, Trojan horses, or automated denial-of-service payloads.</li>
              <li style={{ marginBottom: '8px' }}>Impersonate official transport authorities, NHMP representatives, or hospitality managers.</li>
              <li style={{ marginBottom: '8px' }}>Post fraudulent inquiries, spam messages, or defamatory content.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, SafarNama PK and its directors, employees, and affiliates shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from your travel activities, road closures, schedule disruptions, mechanical vehicle breakdowns, or personal injuries incurred during transit in Pakistani travel corridors.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              8. Dispute Resolution and Governing Law
            </h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the substantive laws of the Islamic Republic of Pakistan. Any legal proceeding arising out of or related to these terms shall be submitted exclusively to the competent courts located in Islamabad, Pakistan.
            </p>
          </section>

          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              9. Contact and Notices
            </h2>
            <p>
              For formal legal notices, questions, or clarification of these terms, please contact:
            </p>
            <div style={{ background: 'var(--bg-surface)', padding: '18px 24px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginTop: '12px' }}>
              <p style={{ margin: '0 0 6px' }}><strong>SafarNama PK Legal Operations</strong></p>
              <p style={{ margin: '0 0 6px' }}>Email: legal@safarnama.pk</p>
              <p style={{ margin: '0 0 6px' }}>Helpline: (051) 111-72327</p>
              <p style={{ margin: 0 }}>Islamabad, Pakistan</p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
}
