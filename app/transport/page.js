'use client';

import Image from 'next/image';
import { INITIAL_TRANSPORT } from '../../lib/data/transport';

export default function TransportPage() {
  return (
    <div className="section-container">
      <div className="page-header-box">
        <div className="badge-subtle">
          <i className="fa-solid fa-truck-monster text-emerald"></i> Mountain Fleet
        </div>
        <h1 className="page-title">4x4 Mountain Jeeps & Executive Chauffeurs</h1>
        <p className="page-description">
          Vetted high-clearance 4WD vehicles (Toyota Prado, Land Cruiser V8, Revo, and Hiace Cabin)
          with seasoned mountain drivers experienced on Babusar Pass, Deosai, and the Karakoram Highway.
        </p>
      </div>

      <div className="destinations-grid" style={{ marginTop: '30px' }}>
        {INITIAL_TRANSPORT.map((vehicle) => (
          <div key={vehicle.id} className="glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
              <span className="dest-badge" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                {vehicle.category}
              </span>
              <span className="dest-rating" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <i className="fa-solid fa-star text-gold"></i> {vehicle.rating} ({vehicle.tripsCompleted} trips)
              </span>
            </div>

            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '6px' }}>{vehicle.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>
                <strong>Capacity:</strong> {vehicle.capacity} • {vehicle.driverIncluded ? 'Chauffeur Included' : 'Self Drive'}
              </p>

              <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginBottom: '12px' }}>
                <i className="fa-solid fa-route"></i> <strong>Suitable For:</strong> {vehicle.terrainSuitability}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                {vehicle.features.slice(0, 3).map((f, i) => (
                  <span key={i} className="highlight-pill" style={{ fontSize: '0.75rem' }}>
                    ✓ {f}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Rate Per Day</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                    PKR {vehicle.ratePerDayPKR.toLocaleString()}
                  </div>
                </div>
                <button
                  className="btn-primary-sm"
                  onClick={() => alert(`Selected ${vehicle.name}! Driver assigned upon confirmation.`)}
                >
                  Book Vehicle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
