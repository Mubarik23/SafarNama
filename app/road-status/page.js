'use client';

import { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ROAD_ALERTS } from '../../lib/data/roadAlerts';
import { INITIAL_ROUTES } from '../../lib/data/routes';

export default function RoadStatusPage() {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'routes'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'open' | 'restricted'

  const filteredAlerts = INITIAL_ROAD_ALERTS.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.highway.toLowerCase().includes(q) ||
      a.section.toLowerCase().includes(q) ||
      a.advisory.toLowerCase().includes(q);

    const isSuccess = a.statusLevel === 'success' || a.status.includes('OPEN');
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'open' && isSuccess) ||
      (statusFilter === 'restricted' && !isSuccess);

    return matchesSearch && matchesStatus;
  });

  const filteredRoutes = INITIAL_ROUTES.filter((r) => {
    const q = searchQuery.toLowerCase();
    return !q || r.name.toLowerCase().includes(q) || r.overview.toLowerCase().includes(q);
  });

  return (
    <div className="road-status-page-container">
      <div className="container-inner">
        {/* Header */}
        <div className="road-header-box">
          <div className="road-header-top-row">
            <div>
              <div className="badge-subtle">
                <i className="fa-solid fa-satellite-dish text-teal"></i> National Highway & Motorway Police (NHMP)
              </div>
              <h1 className="page-title">Pakistan Highway & Pass Conditions</h1>
              <p className="page-description">
                Surveillance and clearance status for northern mountain passes and national highways (KKH N-35, Babusar N-15, Jaglot-Skardu S-1, Makran Coastal N-10, Lowari Tunnel N-45).
              </p>
            </div>

            {/* Emergency Hotline Box */}
            <div className="emergency-hotline-card">
              <div className="emergency-row">
                <i className="fa-solid fa-phone-volume text-rose-500"></i>
                <div>
                  <span className="emergency-label">NHMP Emergency Helpline</span>
                  <strong className="emergency-number">130</strong>
                </div>
              </div>
              <div className="emergency-row">
                <i className="fa-solid fa-shield-halved text-emerald"></i>
                <div>
                  <span className="emergency-label">SafarNama Traveler Assistance</span>
                  <strong className="emergency-sub">(051) 111-72327</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick KPI Cards Strip */}
        <div className="road-kpi-grid">
          <div className="kpi-card kpi-success">
            <span className="kpi-label">Open & Operational</span>
            <div className="kpi-value text-emerald">
              {INITIAL_ROAD_ALERTS.filter((a) => a.statusLevel === 'success' || a.status.includes('OPEN')).length} Highways
            </div>
            <span className="kpi-sub">Clear for passenger traffic</span>
          </div>

          <div className="kpi-card kpi-warning">
            <span className="kpi-label">Active Advisories</span>
            <div className="kpi-value text-amber">
              {INITIAL_ROAD_ALERTS.filter((a) => a.statusLevel !== 'success' && !a.status.includes('OPEN')).length} Alerts
            </div>
            <span className="kpi-sub">Daylight / weather restrictions</span>
          </div>

          <div className="kpi-card kpi-info">
            <span className="kpi-label">Curated Scenic Routes</span>
            <div className="kpi-value text-cyan">{INITIAL_ROUTES.length} Routes</div>
            <span className="kpi-sub">Major national corridors</span>
          </div>

          <div className="kpi-card kpi-teal">
            <span className="kpi-label">Map Surveillance</span>
            <div className="kpi-value">
              <Link href="/map" className="btn-link-kpi">
                Open Map <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
            <span className="kpi-sub">GPS markers on interactive map</span>
          </div>
        </div>

        {/* Navigation Tabs & Filters */}
        <div className="road-controls-bar">
          <div className="tabs-group">
            <button
              className={`road-tab ${activeTab === 'alerts' ? 'active' : ''}`}
              onClick={() => setActiveTab('alerts')}
            >
              <i className="fa-solid fa-triangle-exclamation"></i> Live Highway Alerts ({INITIAL_ROAD_ALERTS.length})
            </button>
            <button
              className={`road-tab ${activeTab === 'routes' ? 'active' : ''}`}
              onClick={() => setActiveTab('routes')}
            >
              <i className="fa-solid fa-road"></i> Scenic Highway Routes ({INITIAL_ROUTES.length})
            </button>
          </div>

          <div className="search-and-filter-wrap">
            <div className="search-mini">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                placeholder="Search highway (e.g. KKH, Babusar, Skardu)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-mini-input"
              />
            </div>

            {activeTab === 'alerts' && (
              <select
                className="status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open Only</option>
                <option value="restricted">Advisories / Caution</option>
              </select>
            )}
          </div>
        </div>

        {/* TAB 1: Highway Alerts */}
        {activeTab === 'alerts' && (
          <div className="highway-alerts-list">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const isOpen = alert.statusLevel === 'success' || alert.status.includes('OPEN');
                return (
                  <div key={alert.id} className={`highway-alert-card ${isOpen ? 'status-open' : 'status-caution'}`}>
                    <div className="alert-card-header">
                      <div>
                        <div className="highway-title-row">
                          <h3 className="highway-name">{alert.highway}</h3>
                          <span className={`status-pill ${isOpen ? 'open' : 'caution'}`}>
                            {isOpen ? 'OPEN' : alert.status}
                          </span>
                        </div>
                        <p className="highway-section-text">
                          <i className="fa-solid fa-location-dot"></i> {alert.section}
                        </p>
                      </div>

                      <div className="weather-snapshot-badge">
                        <i className="fa-solid fa-cloud-sun text-cyan"></i>
                        <span>{alert.weather}</span>
                        <span className="temp-val">({alert.temperature})</span>
                      </div>
                    </div>

                    <div className="alert-card-body">
                      <div className="advisory-message">
                        <strong>Official Advisory:</strong> {alert.advisory}
                      </div>

                      <div className="alert-specs-row">
                        <div className="spec-item">
                          <i className="fa-solid fa-truck-pickup text-teal"></i>
                          <span><strong>Suitable Vehicles:</strong> {alert.suitableVehicles || 'All vehicles'}</span>
                        </div>
                        <div className="spec-item">
                          <i className="fa-regular fa-clock text-muted"></i>
                          <span><strong>Freshness:</strong> {alert.lastUpdated || 'Verified recently'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="alert-card-footer">
                      <span className="source-label">
                        <i className="fa-solid fa-shield-check text-emerald"></i> Source: NHMP Surveillance & Patrol Feed
                      </span>
                      <Link href={`/map`} className="btn-outline-sm">
                        <i className="fa-solid fa-map-location-dot"></i> View on Map
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-results-box">
                <i className="fa-solid fa-route text-muted"></i>
                <h3 className="empty-title">No highway alerts found</h3>
                <p className="empty-desc">No highways match your search query or filter.</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Scenic Highway Routes */}
        {activeTab === 'routes' && (
          <div className="routes-cards-grid">
            {filteredRoutes.map((route) => (
              <div key={route.id} className="yt-card scenic-route-card">
                <div className="route-header-area">
                  <span className="route-code-badge">{route.code || 'National Route'}</span>
                  <h3 className="route-name">{route.name}</h3>
                  <div className="route-endpoints">
                    <span>{route.startCity}</span>
                    <i className="fa-solid fa-arrow-right-long text-teal"></i>
                    <span>{route.endCity}</span>
                  </div>
                </div>

                <div className="route-body-area">
                  <p className="route-overview-text">{route.overview}</p>
                  <div className="route-stats-strip">
                    <div>
                      <span className="stat-label">Length</span>
                      <strong>{route.totalDistanceKm} km</strong>
                    </div>
                    <div>
                      <span className="stat-label">Travel Time</span>
                      <strong>{route.estimatedTimeHours} hrs</strong>
                    </div>
                    <div>
                      <span className="stat-label">Passes</span>
                      <strong>{route.highMountainPass || 'Scenic Valleys'}</strong>
                    </div>
                  </div>
                </div>

                <div className="route-footer-area">
                  <Link href={`/map`} className="btn-primary-sm btn-full">
                    <i className="fa-solid fa-compass"></i> View Corridor on Map
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
