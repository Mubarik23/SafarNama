'use client';

import { INITIAL_ROAD_ALERTS } from '../lib/data/roadAlerts';
import Link from 'next/link';

export default function RoadsTicker() {
  const alerts = INITIAL_ROAD_ALERTS.slice(0, 5);

  return (
    <div id="roads-live-ticker" className="roads-ticker-bar">
      <div className="ticker-label">
        <span className="live-pulsing-dot"></span>
        <i className="fa-solid fa-satellite-dish"></i>
        <span>NHMP LIVE ROAD ALERTS:</span>
      </div>
      <div className="ticker-content-track">
        <div className="ticker-scroll-content">
          {alerts.map((alert) => (
            <Link
              key={alert.id}
              href="/road-status"
              className="ticker-item"
              style={{ textDecoration: 'none' }}
            >
              <span className="ticker-road-name">{alert.highway}:</span>
              <span className={`badge-status badge-${alert.statusLevel}`}>
                {alert.status}
              </span>
              <span className="ticker-weather">
                <i className="fa-solid fa-cloud-sun text-cyan"></i> {alert.weather} ({alert.temperature})
              </span>
              <span className="ticker-divider">•</span>
            </Link>
          ))}
        </div>
      </div>
      <Link href="/road-status" className="ticker-cta-link">
        View All 7 Highways <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  );
}
