'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { INITIAL_DESTINATIONS } from '../../../lib/data/destinations';
import { INITIAL_HOTELS } from '../../../lib/data/hotels';
import { INITIAL_ROAD_ALERTS } from '../../../lib/data/roadAlerts';
import SaveButton from '../../../components/SaveButton';

export default function DestinationDetailPage({ params }) {
  const { id } = params;

  const destination = useMemo(() => {
    return INITIAL_DESTINATIONS.find((d) => d.id === id);
  }, [id]);

  if (!destination) {
    notFound();
  }

  // Find nearby hotels / resorts for this destination
  const nearbyHotels = useMemo(() => {
    return INITIAL_HOTELS.filter((h) => h.destinationId === destination.id);
  }, [destination.id]);

  // Find relevant road alert for the destination
  const relevantRoad = useMemo(() => {
    return INITIAL_ROAD_ALERTS.find((r) => {
      const text = `${r.highway} ${r.section}`.toLowerCase();
      return (
        text.includes(destination.id.toLowerCase()) ||
        text.includes(destination.name.toLowerCase().split(' ')[0]) ||
        (destination.region.includes('Gilgit') && text.includes('kkh'))
      );
    }) || INITIAL_ROAD_ALERTS[0];
  }, [destination]);

  return (
    <div className="destination-detail-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-bar">
        <div className="container-inner">
          <Link href="/">Home</Link>
          <span className="separator">/</span>
          <Link href="/explore">Explore</Link>
          <span className="separator">/</span>
          <span className="current">{destination.name}</span>
        </div>
      </div>

      <div className="container-inner">
        {/* 1. Hero Image & Header */}
        <section className="detail-hero-section">
          <div className="detail-hero-image-wrap">
            <Image
              src={destination.heroImage}
              alt={destination.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1280px"
              style={{ objectFit: 'cover' }}
            />
            <div className="detail-hero-overlay">
              <div className="hero-overlay-tags">
                <span className="detail-region-pill">
                  <i className="fa-solid fa-location-dot"></i> {destination.region}
                </span>
                <span className="detail-badge-pill">
                  {destination.badge || destination.category}
                </span>
              </div>
              <h1 className="detail-title">{destination.name}</h1>
              <p className="detail-tagline">{destination.tagline}</p>
            </div>
          </div>

          {/* Quick Primary Actions Toolbar */}
          <div className="detail-top-actions-bar">
            <div className="destination-verified-indicator">
              <i className="fa-solid fa-shield-check text-teal"></i>
              <strong>Verified Tourist Destination</strong>
              <span className="reviews-sub">Official Northern Pakistan Corridor</span>
            </div>

            <div className="top-action-buttons">
              <SaveButton
                destinationId={destination.id}
                destinationName={destination.name}
                className="btn-outline"
              />

              <Link
                href={`/map?focus=${destination.id}`}
                className="btn-outline"
                title="View location on Pakistan interactive map"
              >
                <i className="fa-solid fa-map-location-dot text-teal"></i>
                <span>View on Map</span>
              </Link>

              <Link
                href={`/trips?add=${destination.id}`}
                className="btn-primary"
              >
                <i className="fa-solid fa-calendar-plus"></i>
                <span>Plan a Trip</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2-Column Responsive Layout */}
        <div className="detail-content-layout">
          {/* Main Details Column */}
          <div className="detail-main-col">
            {/* Quick Fact Badges Strip */}
            <div className="quick-facts-grid">
              <div className="fact-card">
                <div className="fact-icon text-teal"><i className="fa-solid fa-mountain"></i></div>
                <div className="fact-info">
                  <span className="fact-label">Altitude</span>
                  <span className="fact-val">{destination.altitude || 'Varied terrain'}</span>
                </div>
              </div>

              <div className="fact-card">
                <div className="fact-icon text-cyan"><i className="fa-solid fa-cloud-sun"></i></div>
                <div className="fact-info">
                  <span className="fact-label">Weather / Temp</span>
                  <span className="fact-val">{destination.temperature || 'Pleasant'}</span>
                </div>
              </div>

              <div className="fact-card">
                <div className="fact-icon text-gold"><i className="fa-solid fa-calendar-check"></i></div>
                <div className="fact-info">
                  <span className="fact-label">Best Season</span>
                  <span className="fact-val">{destination.bestSeason || 'Summer / Autumn'}</span>
                </div>
              </div>

              <div className="fact-card">
                <div className="fact-icon text-emerald"><i className="fa-solid fa-route"></i></div>
                <div className="fact-info">
                  <span className="fact-label">Road Transit</span>
                  <span className="fact-val">{destination.roadStatus ? 'Accessible' : 'Check status'}</span>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <section className="detail-section">
              <h2 className="section-heading">Overview</h2>
              <p className="detail-overview-text">
                {destination.tagline}. Located in the heart of {destination.region}, {destination.name} offers travelers breathtaking panoramic landscapes, authentic regional hospitality, pristine alpine waters, and deeply rooted Pakistani cultural heritage. Whether you are traveling for a peaceful mountain retreat or an adventure trek, {destination.name} remains one of the premier domestic destinations in Pakistan.
              </p>
            </section>

            {/* Attractions and Activities */}
            <section className="detail-section">
              <h2 className="section-heading">Key Attractions & Activities</h2>
              <p className="section-subtext">Verified points of interest and top experiences in {destination.name}:</p>
              <div className="highlights-detailed-grid">
                {(destination.highlights || []).map((item, index) => (
                  <div key={index} className="highlight-item-box">
                    <div className="highlight-index">{index + 1}</div>
                    <div className="highlight-text-wrap">
                      <div className="highlight-name">{item}</div>
                      <span className="highlight-status">Recommended Experience</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Photo Gallery (when available) */}
            {destination.gallery && destination.gallery.length > 0 && (
              <section className="detail-section">
                <h2 className="section-heading">Photo Gallery</h2>
                <div className="detail-gallery-grid">
                  {destination.gallery.map((imgUrl, i) => (
                    <div key={i} className="gallery-img-card">
                      <Image
                        src={imgUrl}
                        alt={`${destination.name} scene ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Available Resorts and Stays */}
            <section className="detail-section">
              <div className="section-header-flex">
                <div>
                  <h2 className="section-heading">Verified Resorts & Mountain Stays</h2>
                  <p className="section-subtext">Accommodations with heating, generator backup, and hot water:</p>
                </div>
                <Link href="/hotels" className="btn-link-sm">
                  All Pakistan Resorts &gt;
                </Link>
              </div>

              {nearbyHotels.length > 0 ? (
                <div className="nearby-hotels-list">
                  {nearbyHotels.map((hotel) => (
                    <div key={hotel.id} className="hotel-detail-row-card">
                      <div className="hotel-row-thumb">
                        <Image
                          src={hotel.image}
                          alt={hotel.name}
                          fill
                          sizes="140px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="hotel-row-content">
                        <div className="hotel-badge-tag">{hotel.category}</div>
                        <h3 className="hotel-row-title">{hotel.name}</h3>
                        <div className="hotel-row-amenities">
                          {hotel.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="amenity-chip">✓ {a}</span>
                          ))}
                        </div>
                      </div>
                      <div className="hotel-row-pricing">
                        <span className="price-label">From</span>
                        <div className="hotel-price-num text-teal">
                          PKR {hotel.pricePerNightPKR.toLocaleString()}
                        </div>
                        <span className="price-sub">per night</span>
                        <Link href="/hotels" className="btn-primary-sm" style={{ marginTop: '8px' }}>
                          Check Rooms
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-sub-panel">
                  <i className="fa-solid fa-hotel text-muted"></i>
                  <p>Local guest houses and camping sites are available on site in {destination.name}.</p>
                  <Link href="/hotels" className="btn-outline-sm">Browse All Stays</Link>
                </div>
              )}
            </section>

            {/* Practical Travel Tips & Safety */}
            <section className="detail-section">
              <h2 className="section-heading">Practical Travel Tips & Safety</h2>
              <div className="tips-accordion-box">
                <div className="tip-item">
                  <div className="tip-header">
                    <i className="fa-solid fa-gas-pump text-teal"></i>
                    <strong>Fuel & Vehicle Clearance</strong>
                  </div>
                  <p className="tip-desc">
                    Always refuel at major stations before ascending high passes. Ensure adequate ground clearance; 4x4 vehicles are recommended for remote tributary trails.
                  </p>
                </div>

                <div className="tip-item">
                  <div className="tip-header">
                    <i className="fa-solid fa-money-bill-wave text-gold"></i>
                    <strong>Cash & Connectivity</strong>
                  </div>
                  <p className="tip-desc">
                    Carry sufficient cash in Pakistani Rupees (PKR) as ATMs can face network downtime in higher valleys. SCOM SIM cards are recommended for connectivity across Gilgit-Baltistan and AJK.
                  </p>
                </div>

                <div className="tip-item">
                  <div className="tip-header">
                    <i className="fa-solid fa-shield-heart text-cyan"></i>
                    <strong>Altitude Acclimatization</strong>
                  </div>
                  <p className="tip-desc">
                    Stay well-hydrated and allow at least 24 hours of gradual acclimatization before attempting high-altitude hikes above 3,000 meters.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Action / Route / Budget Column */}
          <aside className="detail-sidebar-col">
            {/* Estimated Travel Budget Card */}
            <div className="sidebar-card budget-estimator-card">
              <h3 className="sidebar-card-title">
                <i className="fa-solid fa-wallet text-teal"></i> Estimated Travel Budget
              </h3>
              <p className="budget-intro-text">
                Average realistic 3 to 5 day budget per person in Pakistani Rupees:
              </p>

              <div className="budget-breakdown-list">
                <div className="budget-line">
                  <span>Guided Tour / Transport</span>
                  <strong>PKR {(destination.averageTourPrice * 0.45).toLocaleString()}</strong>
                </div>
                <div className="budget-line">
                  <span>Resort & Lodging (3 Nights)</span>
                  <strong>PKR {(destination.averageTourPrice * 0.35).toLocaleString()}</strong>
                </div>
                <div className="budget-line">
                  <span>Meals & Local Chai</span>
                  <strong>PKR {(destination.averageTourPrice * 0.12).toLocaleString()}</strong>
                </div>
                <div className="budget-line">
                  <span>Activity / Entry Tickets</span>
                  <strong>PKR {(destination.averageTourPrice * 0.08).toLocaleString()}</strong>
                </div>
                <div className="budget-total-line">
                  <span>Estimated Total (per traveler)</span>
                  <span className="total-num text-teal">PKR {destination.averageTourPrice.toLocaleString()}</span>
                </div>
              </div>

              <Link href={`/trips?add=${destination.id}`} className="btn-primary btn-full" style={{ marginTop: '16px' }}>
                <i className="fa-solid fa-calculator"></i> Build Trip with this Budget
              </Link>
            </div>

            {/* Current Road Condition & Clearance */}
            <div className="sidebar-card road-clearance-card">
              <h3 className="sidebar-card-title">
                <i className="fa-solid fa-route text-emerald"></i> Road & Highway Status
              </h3>
              <div className="road-status-badge-row">
                <span className="badge-pill emerald">
                  <i className="fa-solid fa-circle-check"></i> {destination.roadStatus || 'Accessible via Main Highway'}
                </span>
              </div>
              <p className="road-detail-text">
                {relevantRoad?.advisory || 'National Highways and expressways are operational. Check live advisories before departure.'}
              </p>
              <div className="road-meta-row">
                <span><i className="fa-regular fa-clock"></i> Verified NHMP Feed</span>
                <Link href="/road-status" className="link-sm">
                  View Highway Report &gt;
                </Link>
              </div>
            </div>

            {/* Location & Directions */}
            <div className="sidebar-card location-action-card">
              <h3 className="sidebar-card-title">
                <i className="fa-solid fa-location-crosshairs text-cyan"></i> Geographic Coordinates
              </h3>
              <p className="geo-coords-text">
                {destination.coordinates ? `${destination.coordinates[0]}° N, ${destination.coordinates[1]}° E` : 'Coordinates verified'}
              </p>
              <div className="geo-actions-stack">
                <Link href={`/map?focus=${destination.id}`} className="btn-outline-sm btn-full">
                  <i className="fa-solid fa-map"></i> Open in Pakistan Interactive Map
                </Link>
                {destination.coordinates && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates[0]},${destination.coordinates[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-sm btn-full"
                  >
                    <i className="fa-solid fa-diamond-turn-right"></i> Get Driving Directions
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
