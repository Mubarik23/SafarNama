'use client';

import { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ROAD_ALERTS } from '../../lib/data/roadAlerts';
import { INITIAL_ROUTES } from '../../lib/data/routes';

export default function RoadStatusPage() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'alerts' | 'routes'
  const [expandedRouteId, setExpandedRouteId] = useState(null);

  const openAlertsCount = INITIAL_ROAD_ALERTS.filter((a) => a.statusLevel === 'success').length;
  const warningAlertsCount = INITIAL_ROAD_ALERTS.filter((a) => a.statusLevel === 'warning').length;

  const toggleRouteExpand = (id) => {
    setExpandedRouteId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="section-container">
      {/* Page Header */}
      <div className="page-header-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div className="badge-subtle">
              <i className="fa-solid fa-satellite-dish text-emerald"></i> National Highway & Motorway Police (NHMP) Feed
            </div>
            <h1 className="page-title">Northern Highway Surveillance & Scenic Routes</h1>
            <p className="page-description">
              Live clearance status, real-time weather, high-altitude advisories, and curated national scenic
              highways across Pakistan (KKH N-35, Babusar N-15, Skardu S-1, Makran N-10, Swat M-16, Murree N-75).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 18px', fontSize: '0.82rem' }}>
            <span style={{ color: '#f8fafc' }}>
              <i className="fa-solid fa-phone-volume text-rose-500" style={{ color: '#f43f5e', marginRight: '6px' }}></i>
              NHMP Emergency: <strong style={{ color: '#38bdf8' }}>130</strong>
            </span>
            <span style={{ color: '#f8fafc' }}>
              <i className="fa-solid fa-shield-halved" style={{ color: '#10b981', marginRight: '6px' }}></i>
              SafarNama 24/7 Helpline: <strong style={{ color: '#34d399' }}>(051) 111-SAFAR</strong>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '24px 0' }}>
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Passes Clear & Open</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {openAlertsCount} / {INITIAL_ROAD_ALERTS.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Operational for traffic</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Advisories</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {warningAlertsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Weather / chain cautions</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px', borderLeft: '4px solid #06b6d4' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scenic Highways</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {INITIAL_ROUTES.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Curated national corridors</div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px', borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Peak Altitude</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#c084fc', marginTop: '4px' }}>
            4,693 m
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Khunjerab Pass (N-35)</div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '24px 0 20px 0' }}>
        <button
          className={`cat-pill ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fa-solid fa-layer-group"></i> All Updates & Highways ({INITIAL_ROAD_ALERTS.length + INITIAL_ROUTES.length})
        </button>
        <button
          className={`cat-pill ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fa-solid fa-triangle-exclamation"></i> Live NHMP Alerts ({INITIAL_ROAD_ALERTS.length})
        </button>
        <button
          className={`cat-pill ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveTab('routes')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fa-solid fa-route"></i> Scenic Highways & Expeditions ({INITIAL_ROUTES.length})
        </button>
      </div>

      {/* SECTION 1: Curated Scenic Highways & Expeditions */}
      {(activeTab === 'all' || activeTab === 'routes') && (
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-route text-emerald"></i> Curated National Scenic Highways
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {INITIAL_ROUTES.length} Expeditions
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '22px' }}>
            {INITIAL_ROUTES.map((route) => {
              const isExpanded = expandedRouteId === route.id;
              return (
                <div
                  key={route.id}
                  className="glass-panel"
                  style={{
                    padding: '24px',
                    borderRadius: '18px',
                    borderTop: `4px solid ${route.color || '#10b981'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              background: `${route.color}22`,
                              color: route.color || '#10b981',
                              border: `1px solid ${route.color}66`,
                              padding: '3px 10px',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {route.highwayCode}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{route.type}</span>
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginTop: '8px', color: '#f8fafc', fontWeight: 700 }}>
                          {route.name}
                        </h3>
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: route.status.includes('OPEN') ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                          color: route.status.includes('OPEN') ? '#34d399' : '#fbbf24',
                          border: `1px solid ${route.status.includes('OPEN') ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                          fontWeight: 600,
                          textAlign: 'center',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {route.status.split('(')[0]}
                      </div>
                    </div>

                    {/* Corridor Endpoints */}
                    <div
                      style={{
                        background: 'rgba(15,23,42,0.5)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '0.82rem',
                        color: '#cbd5e1',
                        marginBottom: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <i className="fa-solid fa-location-dot" style={{ color: route.color || '#10b981' }}></i>
                      <span><strong>{route.startPoint}</strong> <i className="fa-solid fa-arrow-right-long text-slate-500" style={{ margin: '0 4px' }}></i> <strong>{route.endPoint}</strong></span>
                    </div>

                    {/* Stats Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        marginBottom: '14px',
                        background: 'rgba(15,23,42,0.3)',
                        padding: '10px',
                        borderRadius: '10px'
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}><i className="fa-solid fa-road"></i> Distance</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>{route.distanceKm} km</div>
                      </div>
                      <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}><i className="fa-solid fa-clock"></i> Drive Time</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>{route.driveTime}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}><i className="fa-solid fa-mountain"></i> Max Altitude</div>
                        <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>{route.altitudeMax.split(' ')[0]} m</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.55, marginBottom: '14px' }}>
                      {route.description}
                    </p>

                    {/* Vehicle suitability */}
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-car-side" style={{ color: '#38bdf8' }}></i>
                      <span><strong>Vehicle:</strong> {route.suitableVehicles}</span>
                    </div>

                    {/* Highlights / Waypoints */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                          Scenic Waypoints & Stops ({route.highlights.length})
                        </span>
                        <button
                          onClick={() => toggleRouteExpand(route.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#38bdf8',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            padding: '2px 6px'
                          }}
                        >
                          {isExpanded ? 'Show fewer' : 'View all stops'}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(isExpanded ? route.highlights : route.highlights.slice(0, 4)).map((stop, i) => (
                          <span
                            key={i}
                            style={{
                              background: 'rgba(15,23,42,0.6)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '6px',
                              padding: '3px 8px',
                              fontSize: '0.74rem',
                              color: '#cbd5e1',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <i className="fa-solid fa-location-pin" style={{ color: route.color || '#10b981', fontSize: '0.68rem' }}></i>
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                    <Link
                      href="/"
                      className="btn btn-outline"
                      style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
                    >
                      <i className="fa-solid fa-map"></i> View on Map
                    </Link>
                    <Link
                      href="/ai-planner"
                      className="btn btn-emerald"
                      style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', padding: '8px 12px' }}
                    >
                      <i className="fa-solid fa-wand-magic-sparkles"></i> Plan Trip
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Live NHMP Road Alerts */}
      {(activeTab === 'all' || activeTab === 'alerts') && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-triangle-exclamation text-amber-400" style={{ color: '#f59e0b' }}></i> Live NHMP Northern Passes Surveillance
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {INITIAL_ROAD_ALERTS.length} Monitored Passes
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {INITIAL_ROAD_ALERTS.map((alert) => (
              <div key={alert.id} className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span className={`badge-status badge-${alert.statusLevel}`}>
                      {alert.status}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', marginTop: '8px', color: '#f8fafc' }}>
                      {alert.highway}
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                      <i className="fa-solid fa-temperature-half"></i> {alert.temperature}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{alert.weather}</div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '14px', lineHeight: 1.5 }}>
                  <strong>Section:</strong> {alert.section}
                </div>

                <div
                  style={{
                    background: 'rgba(15,23,42,0.6)',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    marginBottom: '14px',
                    borderLeft: `3px solid ${alert.statusLevel === 'success' ? '#10b981' : alert.statusLevel === 'warning' ? '#f59e0b' : '#ef4444'}`
                  }}
                >
                  <i className={`fa-solid ${alert.statusLevel === 'success' ? 'fa-circle-info text-emerald' : 'fa-triangle-exclamation'}`} style={{ color: alert.statusLevel === 'success' ? '#10b981' : '#f59e0b', marginRight: '6px' }}></i>
                  <strong>Advisory:</strong> {alert.advisory}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    <i className="fa-solid fa-car text-cyan" style={{ color: '#06b6d4', marginRight: '6px' }}></i> {alert.suitableVehicles}
                  </span>
                  <span style={{ color: '#64748b' }}>
                    <i className="fa-solid fa-clock" style={{ marginRight: '4px' }}></i> {alert.lastUpdated}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

