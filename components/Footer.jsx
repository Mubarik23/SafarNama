import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-grid">
        <div className="footer-brand-col">
          <div className="header-brand">
            <div className="brand-logo-icon">
              <i className="fa-solid fa-mountain-sun"></i>
            </div>
            <div className="brand-text">
              <div className="brand-name">
                SafarNama <span className="brand-badge-pk">PK 🇵🇰</span>
              </div>
              <div className="brand-tagline">Next.js & Supabase Powered</div>
            </div>
          </div>
          <p>
            Pakistan&apos;s premier unified domestic tourism ecosystem. Real-time seat inventories,
            authentic PKR pricing, live northern road alerts, and SafarAI domestic trip planning.
          </p>
          <div className="footer-socials">
            <span className="badge-subtle">
              <i className="fa-solid fa-shield-check text-emerald"></i> Licensed by Pakistan Tourism Development Corporation (PTDC)
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Top Destinations</h4>
          <ul>
            <li><Link href="/tours">Hunza Valley & Passu</Link></li>
            <li><Link href="/tours">Skardu & Deosai Plains</Link></li>
            <li><Link href="/tours">Swat & Malam Jabba Ski</Link></li>
            <li><Link href="/tours">Fairy Meadows & Nanga Parbat</Link></li>
            <li><Link href="/tours">Gwadar & Kund Malir</Link></li>
            <li><Link href="/tours">Neelum Valley Kashmir</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Services & Ecosystem</h4>
          <ul>
            <li><Link href="/tours">Guided Tour Packages</Link></li>
            <li><Link href="/hotels">Mountain Resorts & Pods</Link></li>
            <li><Link href="/transport">4x4 Mountain Jeeps & Fleet</Link></li>
            <li><Link href="/road-status">Live Highway Surveillance</Link></li>
            <li><Link href="/ai-planner">SafarAI Itinerary Generator</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>24/7 Domestic Support</h4>
          <ul>
            <li>
              <i className="fa-solid fa-phone-volume text-emerald"></i> <strong>(051) 111-SAFAR (72327)</strong>
            </li>
            <li>
              <i className="fa-solid fa-location-dot text-gold"></i> Islamabad / Skardu, Pakistan
            </li>
            <li>
              <i className="fa-solid fa-database text-cyan"></i> Supabase: <code>mwrkvzcbjrchtmallzml</code>
            </li>
            <li>
              <i className="fa-solid fa-building-columns text-emerald"></i> JazzCash / Easypaisa / Raast
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 SafarNama PK. Built for Pakistan with 💚 using Next.js & Supabase.</div>
        <div className="footer-bottom-links">
          <Link href="/road-status">NHMP Highway Alerts</Link> •
          <Link href="/tours">Verified Operators</Link> •
          <span>Escrow Protected</span>
        </div>
      </div>
    </footer>
  );
}
