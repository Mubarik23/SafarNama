'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { INITIAL_DESTINATIONS } from '../lib/data/destinations';
import { INITIAL_ROAD_ALERTS } from '../lib/data/roadAlerts';
import DestinationCard from '../components/DestinationCard';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Places', icon: 'fa-globe' },
    { id: 'Mountains & Valleys', label: 'Mountains & Valleys', icon: 'fa-mountain' },
    { id: 'Lakes & Waterfalls', label: 'Lakes & Waterfalls', icon: 'fa-water' },
    { id: 'Northern Areas', label: 'Northern Areas', icon: 'fa-compass' },
    { id: 'Historical Places', label: 'Historical Places', icon: 'fa-landmark' },
    { id: 'Cities & Culture', label: 'Cities & Culture', icon: 'fa-city' },
    { id: 'Resorts & Stays', label: 'Resorts & Stays', icon: 'fa-hotel' },
  ];

  // Search submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore');
    }
  };

  // Filter destinations for homepage display
  const displayedDestinations = useMemo(() => {
    return INITIAL_DESTINATIONS.filter((d) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        (d.tagline && d.tagline.toLowerCase().includes(q));

      let matchesCategory = true;
      if (activeCategory === 'Mountains & Valleys') {
        matchesCategory = d.category.includes('Mountain') || d.category.includes('Valley');
      } else if (activeCategory === 'Lakes & Waterfalls') {
        matchesCategory =
          (d.highlights && d.highlights.some((h) => h.toLowerCase().includes('lake') || h.toLowerCase().includes('waterfall'))) ||
          d.name.toLowerCase().includes('lake');
      } else if (activeCategory === 'Northern Areas') {
        matchesCategory = d.region.includes('Gilgit') || d.region.includes('Pakhtunkhwa') || d.region.includes('Kashmir');
      } else if (activeCategory === 'Historical Places') {
        matchesCategory = d.category.includes('Cultural') || d.category.includes('Heritage') || d.category.includes('Historic');
      } else if (activeCategory === 'Cities & Culture') {
        matchesCategory = d.category.includes('Culture') || d.region.includes('Punjab') || d.region.includes('Sindh');
      } else if (activeCategory === 'Resorts & Stays') {
        matchesCategory = true; // Shows destinations with top resorts
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const popularDestinations = displayedDestinations.slice(0, 6);
  const recommendedDestinations = INITIAL_DESTINATIONS.filter((d) => d.featured).slice(0, 3);
  const roadAlertsSnapshot = INITIAL_ROAD_ALERTS.slice(0, 3);

  return (
    <div className="home-page-container">
      {/* HERO SECTION */}
      <section className="yt-hero-section">
        <div className="container-inner">
          <div className="yt-hero-content">
            <div className="yt-hero-badge">
              <i className="fa-solid fa-compass text-teal"></i>
              <span>Pakistan Domestic Tourism Platform</span>
            </div>

            <h1 className="yt-hero-title">
              Pakistan Domestic Travel &amp; Destination Directory
            </h1>

            <p className="yt-hero-subtitle">
              Verified road clearance, mountain valleys, alpine lakes, verified stays, and step-by-step itinerary planning across Gilgit-Baltistan, KPK, Azad Kashmir, and Balochistan.
            </p>

            {/* Prominent Search Bar */}
            <form onSubmit={handleSearchSubmit} className="yt-hero-search-card">
              <div className="hero-search-input-wrap">
                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Search destinations, valleys, lakes, cities, or resorts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search destinations in Pakistan"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="hero-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>

              <div className="hero-search-actions">
                <button type="submit" className="btn-primary">
                  <i className="fa-solid fa-compass"></i>
                  <span>Explore Destinations</span>
                </button>

                <Link href="/map" className="btn-secondary">
                  <i className="fa-solid fa-map-location-dot"></i>
                  <span>Explore Map</span>
                </Link>
              </div>
            </form>

            {/* Quick Core Questions Indicator Strip */}
            <div className="hero-questions-strip">
              <Link href="/explore" className="question-pill">
                <span className="q-tag">Where can I travel?</span>
                <span className="q-link">Browse 14+ Valleys & Regions &rarr;</span>
              </Link>
              <div className="q-divider"></div>
              <Link href="/map" className="question-pill">
                <span className="q-tag">How do I find a place?</span>
                <span className="q-link">Search on Interactive Map &rarr;</span>
              </Link>
              <div className="q-divider"></div>
              <Link href="/trips" className="question-pill">
                <span className="q-tag">How do I plan my trip?</span>
                <span className="q-link">Step-by-Step Trip Builder &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DESTINATION DISCOVERY CATEGORIES */}
      <section className="category-discovery-section">
        <div className="container-inner">
          <div className="category-scroll-track" role="tablist" aria-label="Destination Categories">
            {categories.map((cat) => (
              <button
                key={cat.id}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`category-pill-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <i className={`fa-solid ${cat.icon}`}></i>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR DESTINATIONS */}
      <section className="section-block">
        <div className="container-inner">
          <div className="section-header-flex">
            <div>
              <div className="badge-subtle">
                <i className="fa-solid fa-fire text-amber"></i> Top Tourist Places
              </div>
              <h2 className="section-heading">Popular Destinations</h2>
              <p className="section-subtext">
                Most visited valleys, mountains, and historic regions across Pakistan.
              </p>
            </div>
            <Link href="/explore" className="btn-link-action">
              <span>View All Destinations ({INITIAL_DESTINATIONS.length})</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          {popularDestinations.length > 0 ? (
            <div className="destinations-grid">
              {popularDestinations.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          ) : (
            <div className="empty-results-box">
              <i className="fa-solid fa-mountain text-muted"></i>
              <h3 className="empty-title">No destinations found</h3>
              <p className="empty-desc">Try another place name or reset your category filter.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* RECOMMENDED PLACES & HIGHLIGHTS */}
      <section className="section-block section-alt-bg">
        <div className="container-inner">
          <div className="section-header-flex">
            <div>
              <div className="badge-subtle">
                <i className="fa-solid fa-star text-gold"></i> Handpicked For You
              </div>
              <h2 className="section-heading">Recommended Places to Visit</h2>
              <p className="section-subtext">
                Selected for pristine natural beauty, reliable road access, and verified hospitality.
              </p>
            </div>
            <Link href="/map" className="btn-link-action">
              <span>See on Pakistan Map</span>
              <i className="fa-solid fa-map-location-dot"></i>
            </Link>
          </div>

          <div className="recommended-grid">
            {recommendedDestinations.map((place) => (
              <div key={place.id} className="recommended-card yt-card">
                <div className="recommended-thumb">
                  <Image
                    src={place.heroImage}
                    alt={place.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="recommended-badge">{place.badge || 'Recommended'}</span>
                </div>
                <div className="recommended-body">
                  <div className="recommended-region text-teal">
                    <i className="fa-solid fa-location-dot"></i> {place.region}
                  </div>
                  <h3 className="recommended-title">{place.name}</h3>
                  <p className="recommended-tagline">{place.tagline}</p>
                  
                  <div className="recommended-meta-row">
                    <span><i className="fa-solid fa-mountain"></i> {place.altitude}</span>
                    <span><i className="fa-solid fa-sun"></i> {place.bestSeason}</span>
                  </div>

                  <div className="recommended-footer">
                    <Link href={`/destinations/${place.id}`} className="btn-primary-sm btn-full">
                      View Destination Guide
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO PLAN YOUR TRIP: 3-STEP INTUITIVE WORKFLOW */}
      <section className="section-block">
        <div className="container-inner">
          <div className="planning-guide-card">
            <div className="badge-subtle">
              <i className="fa-solid fa-route text-teal"></i> Simple Travel Guide
            </div>
            <h2 className="section-heading" style={{ marginBottom: '12px' }}>
              How to Plan Your Pakistan Trip with SafarNama PK
            </h2>
            <p className="section-subtext" style={{ maxWidth: '640px', margin: '0 auto 36px' }}>
              Follow three simple steps to discover places, check real highway alerts, and organize your journey.
            </p>

            <div className="planning-steps-grid">
              <div className="planning-step-item">
                <div className="step-circle-icon text-teal">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <div className="step-number-tag">Step 1</div>
                <h3 className="step-item-title">Discover a Destination</h3>
                <p className="step-item-desc">
                  Browse Hunza, Skardu, Swat, Fairy Meadows, or coastal Gwadar. Save the places you love with one click.
                </p>
                <Link href="/explore" className="step-link">
                  Browse Places &rarr;
                </Link>
              </div>

              <div className="planning-step-item">
                <div className="step-circle-icon text-amber">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div className="step-number-tag">Step 2</div>
                <h3 className="step-item-title">Check Highway Status</h3>
                <p className="step-item-desc">
                  View live clearance on KKH, Babusar Pass, Jaglot-Skardu, and Lowari Tunnel verified by NHMP before traveling.
                </p>
                <Link href="/road-status" className="step-link">
                  Check Road Alerts &rarr;
                </Link>
              </div>

              <div className="planning-step-item">
                <div className="step-circle-icon text-cyan">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div className="step-number-tag">Step 3</div>
                <h3 className="step-item-title">Build Your Itinerary</h3>
                <p className="step-item-desc">
                  Organize daily stops, estimate realistic local PKR costs, and export or print your customized travel plan.
                </p>
                <Link href="/trips" className="step-link">
                  Start Planning &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USEFUL TRAVEL INFORMATION & HIGHWAY UPDATES SNAPSHOT */}
      <section className="section-block section-alt-bg">
        <div className="container-inner">
          <div className="section-header-flex">
            <div>
              <div className="badge-subtle">
                <i className="fa-solid fa-satellite-dish text-emerald"></i> Verified NHMP Feed
              </div>
              <h2 className="section-heading">Live Northern Highway Surveillance</h2>
              <p className="section-subtext">
                Real-time transit clearance for major northern corridors and mountain passes.
              </p>
            </div>
            <Link href="/road-status" className="btn-link-action">
              <span>View All 7 Highways</span>
              <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>

          <div className="road-snapshot-grid">
            {roadAlertsSnapshot.map((alert) => {
              const isOpen = alert.statusLevel === 'success' || alert.status.includes('OPEN');
              return (
                <div key={alert.id} className="road-snapshot-card yt-card">
                  <div className="road-snapshot-top">
                    <span className={`status-pill ${isOpen ? 'open' : 'caution'}`}>
                      {isOpen ? 'OPEN' : alert.status}
                    </span>
                    <span className="road-weather-pill">
                      <i className="fa-solid fa-cloud-sun text-cyan"></i> {alert.weather}
                    </span>
                  </div>
                  <h3 className="road-snapshot-title">{alert.highway}</h3>
                  <p className="road-snapshot-section">{alert.section}</p>
                  <p className="road-snapshot-advisory">{alert.advisory}</p>
                  <div className="road-snapshot-footer">
                    <span className="freshness-text">
                      <i className="fa-regular fa-clock"></i> {alert.lastUpdated || 'Verified recently'}
                    </span>
                    <Link href="/road-status" className="btn-link-sm">
                      Details &gt;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
