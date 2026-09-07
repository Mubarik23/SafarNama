'use client';

import { useState } from 'react';
import Image from 'next/image';
import { INITIAL_TOURS } from '../../lib/data/tours';

export default function ToursPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const categories = ['all', 'Expedition & Treks', 'Family & Leisure', 'Honeymoon & Luxury', 'Short Getaways'];
  const cities = ['all', 'Islamabad', 'Lahore', 'Karachi'];

  const filtered = INITIAL_TOURS.filter((tour) => {
    const matchCat = selectedCategory === 'all' || tour.category === selectedCategory;
    const matchCity = selectedCity === 'all' || (tour.departureCities || []).includes(selectedCity);
    return matchCat && matchCity;
  });

  return (
    <div className="section-container">
      <div className="page-header-box">
        <div className="badge-subtle">
          <i className="fa-solid fa-map-location-dot text-emerald"></i> Pakistan Guided Tours
        </div>
        <h1 className="page-title">Verified Tour Packages & Expeditions</h1>
        <p className="page-description">
          Fixed departure dates and private custom itineraries across Gilgit-Baltistan, Swat, Kashmir, and Balochistan.
          All bookings backed by PTDC verified operators and escrow protection.
        </p>
      </div>

      {/* Filter Row */}
      <div className="filter-bar-glass glass-panel" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '16px 20px', borderRadius: '16px', margin: '24px 0' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              className={`cat-pill ${selectedCategory === c ? 'active' : ''}`}
              onClick={() => setSelectedCategory(c)}
            >
              {c === 'all' ? 'All Categories' : c}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Departure:</span>
          <select
            className="filter-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.7)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === 'all' ? 'All Departure Cities' : city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="tours-grid">
        {filtered.map((tour) => (
          <div key={tour.id} className="tour-card glass-panel">
            <div className="tour-image-wrap" style={{ position: 'relative', height: '220px', width: '100%' }}>
              <Image
                src={tour.image}
                alt={tour.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
              <span className="tour-category-badge">{tour.category}</span>
              <span className="tour-duration-badge">
                <i className="fa-solid fa-clock"></i> {tour.durationDays}D / {tour.durationNights}N
              </span>
            </div>

            <div className="tour-body">
              <div className="tour-departure-city">
                <i className="fa-solid fa-location-dot text-emerald"></i> Departs: {(tour.departureCities || ['Islamabad']).join(', ')}
              </div>
              <h3 className="tour-title">{tour.title}</h3>
              <p className="tour-snippet">{tour.overview}</p>

              <div className="tour-highlights-chips">
                {(tour.inclusions || tour.highlights || []).slice(0, 4).map((hl, i) => (
                  <span key={i} className="highlight-pill">✓ {hl}</span>
                ))}
              </div>

              <div className="tour-card-footer">
                <div className="tour-pricing">
                  <span className="pricing-sub">Per Traveler</span>
                  <span className="pricing-val text-emerald">PKR {tour.pricePKR.toLocaleString()}</span>
                </div>
                <button
                  className="btn-primary-sm"
                  onClick={() => alert(`Selected ${tour.title}! Real-time booking integration ready via Supabase.`)}
                >
                  Book Seat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
