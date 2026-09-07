'use client';

import { useState } from 'react';
import Image from 'next/image';
import { INITIAL_HOTELS } from '../../lib/data/hotels';

export default function HotelsPage() {
  const [selectedDestination, setSelectedDestination] = useState('all');

  const filtered = INITIAL_HOTELS.filter((h) => {
    return selectedDestination === 'all' || h.destinationId === selectedDestination;
  });

  return (
    <div className="section-container">
      <div className="page-header-box">
        <div className="badge-subtle">
          <i className="fa-solid fa-hotel text-emerald"></i> Mountain Resorts & Glamping
        </div>
        <h1 className="page-title">Handpicked Northern Resorts & Pods</h1>
        <p className="page-description">
          Verified heating, generator backup, heated water, and breathtaking views of Rakaposhi, Lower Kachura, and Swat River.
        </p>
      </div>

      <div className="destinations-grid" style={{ marginTop: '30px' }}>
        {filtered.map((hotel) => (
          <div key={hotel.id} className="hotel-card glass-panel" style={{ overflow: 'hidden', borderRadius: '20px' }}>
            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
              <span className="dest-badge" style={{ position: 'absolute', top: '12px', left: '12px' }}>
                {hotel.destinationName}
              </span>
              <span className="dest-rating" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <i className="fa-solid fa-star text-gold"></i> {hotel.rating} ({hotel.reviewsCount})
              </span>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>{hotel.category}</div>
              <h3 style={{ fontSize: '1.2rem', margin: '6px 0', color: '#f8fafc' }}>{hotel.name}</h3>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '12px 0' }}>
                {hotel.amenities.slice(0, 3).map((amenity, i) => (
                  <span key={i} className="highlight-pill" style={{ fontSize: '0.75rem' }}>
                    ✓ {amenity}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Per Night</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
                    PKR {hotel.pricePerNightPKR.toLocaleString()}
                  </div>
                </div>
                <button
                  className="btn-primary-sm"
                  onClick={() => alert(`Reserving ${hotel.name}! Verified rooms available.`)}
                >
                  Check Rooms
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
