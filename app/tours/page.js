'use client';

import { useState } from 'react';
import Image from 'next/image';
import { INITIAL_TOURS } from '../../lib/data/tours';

export default function ToursPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [customCityInput, setCustomCityInput] = useState('');
  const [toursList, setToursList] = useState(INITIAL_TOURS);

  const categories = ['all', 'Expedition & Treks', 'Family & Leisure', 'Honeymoon & Luxury', 'Short Getaways'];
  const cities = ['all', 'Islamabad', 'Lahore', 'Karachi', 'Peshawar', 'Quetta', 'Multan'];

  const handleBookAnyCity = (cityName) => {
    const cleanCity = (cityName || customCityInput).trim();
    if (!cleanCity) {
      alert('Please enter any city, valley or town name in Pakistan to book your tour!');
      return;
    }
    const formatted = cleanCity.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    
    // Check if matching tour already exists
    const existing = toursList.find(t => t.destinationName?.toLowerCase() === formatted.toLowerCase() || t.title?.toLowerCase().includes(formatted.toLowerCase()));
    if (existing) {
      alert(`Tour package for ${formatted} found: "${existing.title}". Proceeding to booking!`);
      return;
    }

    // Create on-demand synthetic tour package for this custom city
    const newTour = {
      id: `tour-${cleanCity.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-custom`,
      title: `${formatted} Guided Discovery & Adventure Expedition`,
      category: 'Domestic Guided Tour',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      durationDays: 4,
      durationNights: 3,
      departureCities: ['Islamabad', 'Lahore', 'Karachi', 'Peshawar'],
      pricePKR: 45000,
      overview: `Complete, fully escorted tour package to ${formatted}. Includes dedicated AC transport, verified deluxe hotel stays, daily breakfasts, dinners, and certified local guide.`,
      highlights: [`${formatted} Sightseeing`, 'Scenic Panoramic Viewpoint', 'Local Food Trail', 'AC Transport & Hotel Included']
    };

    setToursList([newTour, ...toursList]);
    setCustomCityInput('');
    alert(`🎉 Custom Tour Created for ${formatted}!\n\nPackage: ${newTour.title}\nDuration: 4 Days / 3 Nights\nPrice: PKR 45,000 / person\nAC Transport & Hotel Included.\n\nReady for checkout!`);
  };

  const filtered = toursList.filter((tour) => {
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
          Fixed departure dates and private custom itineraries across every city in Pakistan — Gilgit-Baltistan, Swat, Kumrat, Kaghan, Kashmir, Chitral, Murree, Cholistan, Lahore, and Balochistan.
          All bookings backed by PTDC verified operators and escrow protection.
        </p>
      </div>

      {/* Any-City Custom Tour Booking Banner */}
      <div className="glass-panel" style={{ margin: '20px 0', padding: '22px 24px', borderRadius: '18px', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.85) 100%)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', fontWeight: '700', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          <i className="fa-solid fa-plane-departure"></i> 100% Nationwide Coverage • Any City in Pakistan
        </div>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', color: '#fff', fontWeight: '800' }}>Book a Tour to ANY City in Pakistan</h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.5' }}>
          Not restricted to pre-listed cities! Enter <strong>ANY</strong> city or valley you want (e.g. <em>Ziarat, Abbottabad, Muzaffarabad, Gwadar, Chiniot, Bahawalpur, Skardu</em>, etc.) and generate an instant verified guided tour package with dedicated AC transport, hotel stays, and meals in PKR.
        </p>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Type ANY city name (e.g. Ziarat, Abbottabad, Swat, Gwadar)..."
            value={customCityInput}
            onChange={(e) => setCustomCityInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBookAnyCity()}
            style={{ flex: 1, minWidth: '260px', padding: '11px 16px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.9)', color: '#fff', border: '1px solid rgba(16, 185, 129, 0.4)', fontSize: '0.92rem' }}
          />
          <button
            onClick={() => handleBookAnyCity()}
            style={{ padding: '11px 22px', borderRadius: '10px', background: 'var(--pk-emerald, #10b981)', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-bolt"></i> Book This City Tour
          </button>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '12px', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span style={{ color: '#cbd5e1', fontWeight: '600' }}>Quick Suggestions:</span>
          {['Hunza', 'Skardu', 'Swat', 'Ziarat', 'Gwadar', 'Abbottabad', 'Chitral', 'Neelum Valley', 'Fairy Meadows', 'Murree', 'Kumrat', 'Bahawalpur'].map(city => (
            <button
              key={city}
              type="button"
              onClick={() => handleBookAnyCity(city)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#f1f5f9', padding: '3px 9px', borderRadius: '14px', cursor: 'pointer', fontSize: '0.78rem' }}
            >
              {city}
            </button>
          ))}
        </div>
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
