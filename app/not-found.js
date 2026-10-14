import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-inner" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <div className="empty-results-box">
        <div className="empty-icon-wrap" style={{ color: 'var(--pk-primary)' }}>
          <i className="fa-solid fa-compass"></i>
        </div>
        <h1 className="page-title" style={{ fontSize: '2rem' }}>404: Destination Not Found</h1>
        <p className="page-description" style={{ margin: '0 auto 24px' }}>
          The valley, destination, or guide you were looking for does not exist or has moved.
        </p>
        <div className="empty-actions">
          <Link href="/" className="btn-primary">
            <i className="fa-solid fa-house"></i> Return Home
          </Link>
          <Link href="/explore" className="btn-outline">
            <i className="fa-solid fa-compass"></i> Browse Destinations
          </Link>
        </div>
      </div>
    </div>
  );
}
