'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SupabaseConnectionBanner from '../components/SupabaseConnectionBanner';
import { INITIAL_DESTINATIONS } from '../lib/data/destinations';
import { INITIAL_TOURS } from '../lib/data/tours';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredDestinations = INITIAL_DESTINATIONS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' ||
      d.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const featuredTours = INITIAL_TOURS.slice(0, 6);

  return (
    <div className="home-view">
      {/* Real-time Supabase Integration Banner */}
      <SupabaseConnectionBanner />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <span className="live-pulsing-dot"></span>
            <span>Real-Time Pakistan Domestic Travel Ecosystem</span>
          </div>

          <h1 className="hero-title">
            Discover Pakistan’s Majestic <br />
            <span className="text-gradient-emerald">Peaks, Valleys & Seas</span>
          </h1>

          <p className="hero-subtitle">
            Instant booking for Hunza, Skardu, Swat, and Fairy Meadows. Live KKH highway road alerts,
            vetted 4x4 mountain jeeps, authentic PKR rates, and SafarAI trip planning powered by Supabase.
          </p>

          {/* Quick Search Bar */}
          <div className="hero-search-glass-card">
            <div className="search-input-group">
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
              <input
                type="text"
                className="hero-search-input"
                placeholder="Search Hunza, Skardu, Deosai, Swat, Gwadar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="search-category-tabs">
              {[
                { id: 'all', label: 'All Places' },
                { id: 'mountains', label: 'Mountains & Valleys' },
                { id: 'coastal', label: 'Coastal & Beaches' },
                { id: 'heritage', label: 'Heritage & Lakes' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="hero-stats-row">
            <div className="stat-item">
              <div className="stat-number text-emerald">100%</div>
              <div className="stat-label">Verified Escrow</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number text-cyan">24/7</div>
              <div className="stat-label">Live NHMP Alerts</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number text-gold">4.95 ★</div>
              <div className="stat-label">Traveler Rating</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number text-emerald">Next.js</div>
              <div className="stat-label">+ Supabase SSR</div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="section-container">
        <div className="section-header-flex">
          <div>
            <div className="badge-subtle">
              <i className="fa-solid fa-compass text-emerald"></i> Curated Destinations
            </div>
            <h2 className="section-title">Explore Northern & Coastal Pakistan</h2>
          </div>
          <Link href="/tours" className="btn-glass-sm">
            View All Tours <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="destinations-grid">
          {filteredDestinations.map((dest) => (
            <div key={dest.id} className="destination-card glass-panel">
              <div className="dest-image-wrap" style={{ position: 'relative', height: '220px', width: '100%' }}>
                <Image
                  src={dest.heroImage}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  priority={dest.featured}
                />
                <span className="dest-badge">{dest.badge || dest.region}</span>
                <span className="dest-rating">
                  <i className="fa-solid fa-star text-gold"></i> {dest.rating}
                </span>
              </div>
              <div className="dest-body">
                <div className="dest-region text-cyan">{dest.region}</div>
                <h3 className="dest-title">{dest.name}</h3>
                <p className="dest-tagline">{dest.tagline}</p>

                <div className="dest-meta-chips">
                  <span className="meta-chip">
                    <i className="fa-solid fa-mountain text-emerald"></i> {dest.altitude}
                  </span>
                  <span className="meta-chip">
                    <i className="fa-solid fa-cloud-sun text-cyan"></i> {dest.temperature}
                  </span>
                </div>

                <div className="dest-footer">
                  <div className="dest-price-box">
                    <span className="price-label">From</span>
                    <span className="price-amount text-emerald">
                      PKR {dest.averageTourPrice.toLocaleString()}
                    </span>
                  </div>
                  <Link href={`/tours`} className="btn-primary-sm">
                    Book Trip
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Tour Packages */}
      <section className="section-container">
        <div className="section-header-flex">
          <div>
            <div className="badge-subtle">
              <i className="fa-solid fa-ticket text-emerald"></i> Fixed & Custom Departures
            </div>
            <h2 className="section-title">Featured Tour Packages</h2>
          </div>
          <Link href="/tours" className="btn-glass-sm">
            All Packages ({INITIAL_TOURS.length}) <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>

        <div className="tours-grid">
          {featuredTours.map((tour) => (
            <div key={tour.id} className="tour-card glass-panel">
              <div className="tour-image-wrap" style={{ position: 'relative', height: '200px', width: '100%' }}>
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
                <span className="tour-category-badge">{tour.category}</span>
                <span className="tour-duration-badge">
                  <i className="fa-solid fa-clock"></i> {tour.durationDays}D / {tour.durationNights}N
                </span>
              </div>

              <div className="tour-body">
                <div className="tour-departure-city">
                  <i className="fa-solid fa-location-dot text-emerald"></i> Departs: {(tour.departureCities || ['Islamabad']).slice(0, 2).join(', ')}
                </div>
                <h3 className="tour-title">{tour.title}</h3>
                <p className="tour-snippet">{tour.overview}</p>

                <div className="tour-highlights-chips">
                  {(tour.inclusions || tour.highlights || []).slice(0, 3).map((hl, i) => (
                    <span key={i} className="highlight-pill">
                      ✓ {hl}
                    </span>
                  ))}
                </div>

                <div className="tour-card-footer">
                  <div className="tour-pricing">
                    <span className="pricing-sub">Total per person</span>
                    <span className="pricing-val text-emerald">
                      PKR {tour.pricePKR.toLocaleString()}
                    </span>
                  </div>
                  <Link href="/tours" className="btn-primary-sm">
                    View Dates & Itinerary
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SafarAI Promo Banner */}
      <section className="section-container">
        <div className="ai-cta-banner glass-panel">
          <div className="ai-cta-content">
            <div className="badge-subtle" style={{ color: '#38bdf8', borderColor: 'rgba(56,189,248,0.3)' }}>
              <i className="fa-solid fa-wand-magic-sparkles text-cyan"></i> SafarAI Smart Assistant
            </div>
            <h2 className="ai-cta-title">
              Generate a Tailored Pakistan Itinerary in 5 Seconds
            </h2>
            <p className="ai-cta-text">
              Tell SafarAI your departure city, family size, dates, and budget. Our Gemini & Supabase powered
              engine crafts full day-by-day itineraries with live road advisories.
            </p>
            <div className="ai-cta-actions">
              <Link href="/ai-planner" className="btn-primary">
                <i className="fa-solid fa-wand-magic-sparkles"></i> Launch SafarAI Planner
              </Link>
              <Link href="/road-status" className="btn-glass">
                <i className="fa-solid fa-triangle-exclamation text-gold"></i> Check Road Status First
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
