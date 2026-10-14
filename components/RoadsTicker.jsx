'use client';

import { INITIAL_ROAD_ALERTS } from '../lib/data/roadAlerts';
import Link from 'next/link';

export default function RoadsTicker() {
  const alerts = INITIAL_ROAD_ALERTS.slice(0, 6);

  return (
    <div id="roads-live-ticker" className="roads-ticker-bar" role="region" aria-label="Highway Status Updates">
      <div className="ticker-label">
        <span className="live-pulsing-dot"></span>
        <i className="fa-solid fa-shield-halved"></i>
        <span>NHMP HIGHWAY STATUS:</span>
      </div>

      <div className="ticker-content-track">
        <div className="ticker-scroll-content">
          {alerts.map((alert) => (
            <Link
              key={alert.id}
              href="/road-status"
              className="ticker-item"
            >
              <span className="ticker-road-name">{alert.highway}</span>
              <span className={`badge-status badge-${alert.statusLevel || 'success'}`}>
                {alert.status.includes('OPEN') ? 'OPEN' : alert.status}
              </span>
              <span className="ticker-weather">
                <i className="fa-solid fa-cloud-sun"></i> {alert.weather} • {alert.temperature}
              </span>
              <span className="ticker-divider">•</span>
            </Link>
          ))}
        </div>
      </div>

      <Link href="/road-status" className="ticker-cta-link">
        <span>All Highway Updates</span>
        <i className="fa-solid fa-arrow-right"></i>
      </Link>
    </div>
  );
}
