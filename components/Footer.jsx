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
              <span className="brand-name">
                SafarNama <span className="brand-badge-pk">PK</span>
              </span>
              <span className="brand-tagline">Pakistan Domestic Tourism Directory</span>
            </div>
          </div>
          <p className="footer-description">
            Pakistan&apos;s domestic tourism discovery platform. Verified northern valley guides, mountain resorts, interactive spatial maps, and live highway clearance reports.
          </p>
          <div className="footer-badges-list">
            <span className="footer-badge-item">
              <i className="fa-solid fa-shield-check text-teal"></i> Verified Domestic Tourism Platform
            </span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Destinations</h4>
          <ul>
            <li><Link href="/destinations/hunza">Hunza Valley &amp; Passu</Link></li>
            <li><Link href="/destinations/skardu">Skardu &amp; Deosai Plains</Link></li>
            <li><Link href="/destinations/swat">Swat &amp; Malam Jabba</Link></li>
            <li><Link href="/destinations/fairy-meadows">Fairy Meadows &amp; Nanga Parbat</Link></li>
            <li><Link href="/destinations/gwadar">Gwadar &amp; Makran Coast</Link></li>
            <li><Link href="/destinations/neelum">Neelum Valley Kashmir</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Explore &amp; Plan</h4>
          <ul>
            <li><Link href="/explore">All Destinations Directory</Link></li>
            <li><Link href="/map">Interactive Pakistan Map</Link></li>
            <li><Link href="/hotels">Verified Resorts &amp; Stays</Link></li>
            <li><Link href="/road-status">Live Highway Alerts (NHMP)</Link></li>
            <li><Link href="/trips">Step-by-Step Trip Builder</Link></li>
            <li><Link href="/saved">My Saved Places</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Traveler Support &amp; Legal</h4>
          <ul>
            <li>
              <i className="fa-solid fa-phone-volume text-teal"></i> <strong>(051) 111-TRAVEL (872835)</strong>
            </li>
            <li>
              <i className="fa-solid fa-shield-halved text-amber"></i> NHMP Highway Helpline: <strong>130</strong>
            </li>
            <li>
              <i className="fa-solid fa-location-dot text-cyan"></i> Islamabad / Gilgit / Karachi
            </li>
            <li>
              <i className="fa-solid fa-envelope text-teal"></i> info@safarnama.pk
            </li>
            <li>
              <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="footer-legal-link">Terms and Conditions</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>&copy; 2026 SafarNama PK. Dedicated to authentic, sustainable domestic tourism across Pakistan.</div>
        <div className="footer-bottom-links">
          <Link href="/privacy">Privacy Policy</Link>
          <span className="dot-sep">&bull;</span>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <span className="dot-sep">&bull;</span>
          <Link href="/road-status">Highway Conditions</Link>
          <span className="dot-sep">&bull;</span>
          <Link href="/map">Pakistan Map</Link>
          <span className="dot-sep">&bull;</span>
          <Link href="/explore">Destinations</Link>
          <span className="dot-sep">&bull;</span>
          <Link href="/trips">Plan a Trip</Link>
        </div>
      </div>
    </footer>
  );
}
