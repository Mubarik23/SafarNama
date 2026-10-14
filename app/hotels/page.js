'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { INITIAL_HOTELS } from '../../lib/data/hotels';

export default function HotelsPage() {
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedAmenity, setSelectedAmenity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalHotel, setModalHotel] = useState(null);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Available destination filter options from data
  const destinationOptions = [
    { id: 'all', label: 'All Locations' },
    { id: 'hunza', label: 'Hunza Valley' },
    { id: 'skardu', label: 'Skardu' },
    { id: 'swat', label: 'Swat Valley' },
    { id: 'fairy-meadows', label: 'Fairy Meadows' },
    { id: 'neelum', label: 'Neelum Valley' },
    { id: 'kaghan', label: 'Naran / Kaghan' }
  ];

  const amenityOptions = [
    { id: 'all', label: 'All Amenities' },
    { id: 'Backup', label: 'Power Backup / Generator' },
    { id: 'Heated', label: 'Heated Rooms / Water' },
    { id: 'Wi-Fi', label: 'High-Speed Wi-Fi' },
    { id: 'View', label: 'Glacier / Lakeside View' }
  ];

  const filteredHotels = useMemo(() => {
    return INITIAL_HOTELS.filter((hotel) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        hotel.name.toLowerCase().includes(q) ||
        hotel.destinationName.toLowerCase().includes(q) ||
        hotel.category.toLowerCase().includes(q);

      const matchDest =
        selectedDestination === 'all' || hotel.destinationId === selectedDestination;

      const matchAmenity =
        selectedAmenity === 'all' ||
        (hotel.amenities && hotel.amenities.some((a) => a.toLowerCase().includes(selectedAmenity.toLowerCase())));

      return matchQuery && matchDest && matchAmenity;
    });
  }, [searchQuery, selectedDestination, selectedAmenity]);

  const handleInquireSubmit = (e) => {
    e.preventDefault();
    setInquirySuccess(true);
    setTimeout(() => {
      setInquirySuccess(false);
      setModalHotel(null);
    }, 2500);
  };

  return (
    <div className="stays-page-container">
      <div className="container-inner">
        {/* Header */}
        <div className="stays-header-box">
          <div className="badge-subtle">
            <i className="fa-solid fa-hotel text-teal"></i> Verified Stays & Lodges
          </div>
          <h1 className="page-title">Resorts & Mountain Stays Across Pakistan</h1>
          <p className="page-description">
            Explore verified accommodations in northern and scenic regions. Check real facilities such as 24/7 generator backup, heating, and mountain views.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="stays-filter-card">
          <div className="stays-search-wrap">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              className="stays-search-input"
              placeholder="Search by resort name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <div className="stays-filter-controls">
            <div className="filter-field">
              <label className="field-label">Location</label>
              <select
                className="field-select"
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
              >
                {destinationOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label className="field-label">Facility</label>
              <select
                className="field-select"
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
              >
                {amenityOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            {(selectedDestination !== 'all' || selectedAmenity !== 'all' || searchQuery) && (
              <div className="filter-field reset-field">
                <button
                  type="button"
                  className="btn-clear-filters"
                  onClick={() => {
                    setSelectedDestination('all');
                    setSelectedAmenity('all');
                    setSearchQuery('');
                  }}
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Metadata */}
        <div className="stays-results-bar">
          <span>Showing <strong>{filteredHotels.length}</strong> verified resorts & stays</span>
          <Link href="/map" className="btn-link-icon">
            <i className="fa-solid fa-map-location-dot"></i> View Stays on Map
          </Link>
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length > 0 ? (
          <div className="destinations-grid">
            {filteredHotels.map((hotel) => (
              <div key={hotel.id} className="yt-card hotel-card">
                <div className="dest-image-wrap">
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="dest-badge">
                    <i className="fa-solid fa-location-dot"></i> {hotel.destinationName}
                  </span>
                  <span className="dest-verified-tag">
                    <i className="fa-solid fa-shield-check text-emerald"></i> Verified Partner
                  </span>
                </div>

                <div className="dest-body">
                  <div className="hotel-verification-badge">
                    <i className="fa-solid fa-shield-check text-emerald"></i>
                    <span>Verified Mountain Partner</span>
                  </div>

                  <div className="hotel-cat-text">{hotel.category}</div>
                  <h3 className="dest-title">{hotel.name}</h3>

                  <div className="hotel-amenities-chips">
                    {(hotel.amenities || []).slice(0, 3).map((amenity, i) => (
                      <span key={i} className="mini-tag">
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="dest-footer">
                    <div className="dest-price-box">
                      <span className="price-label">Price per night</span>
                      <div className="price-amount text-teal">
                        PKR {hotel.pricePerNightPKR.toLocaleString()}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-primary-sm"
                      onClick={() => setModalHotel(hotel)}
                    >
                      Check Rooms
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-results-box">
            <div className="empty-icon-wrap">
              <i className="fa-solid fa-hotel"></i>
            </div>
            <h3 className="empty-title">No stays found</h3>
            <p className="empty-desc">
              No resorts matched your selected location or facilities. Try resetting your filters.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setSelectedDestination('all');
                setSelectedAmenity('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Modal: Check Rooms & Inquire */}
        {modalHotel && (
          <div className="modal-backdrop" onClick={() => setModalHotel(null)}>
            <div className="modal-dialog-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <span className="badge-pill emerald">
                    <i className="fa-solid fa-circle-check"></i> Verified Partner
                  </span>
                  <h3 className="modal-title">{modalHotel.name}</h3>
                  <p className="modal-subtitle">
                    <i className="fa-solid fa-location-dot"></i> {modalHotel.destinationName}
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setModalHotel(null)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="modal-body">
                {inquirySuccess ? (
                  <div className="inquiry-success-panel">
                    <i className="fa-solid fa-circle-check text-emerald"></i>
                    <h4>Inquiry Received!</h4>
                    <p>The management at {modalHotel.name} will reach out to you within 2 business hours regarding room availability.</p>
                  </div>
                ) : (
                  <form onSubmit={handleInquireSubmit}>
                    <div className="modal-info-strip">
                      <div>
                        <span className="info-label">Nightly Rate</span>
                        <strong className="info-val text-teal">PKR {modalHotel.pricePerNightPKR.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="info-label">Room Types</span>
                        <strong className="info-val">{(modalHotel.roomTypes || ['Standard Mountain Suite']).join(', ')}</strong>
                      </div>
                    </div>

                    <div className="modal-form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          required
                          className="form-input"
                          placeholder="Your name"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Contact Phone / WhatsApp</label>
                        <input
                          type="tel"
                          required
                          className="form-input"
                          placeholder="0300-1234567"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Check-in Date</label>
                        <input
                          type="date"
                          required
                          className="form-input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Guests</label>
                        <select className="form-input">
                          <option>1 Guest</option>
                          <option>2 Guests</option>
                          <option>Family (3-4 Guests)</option>
                          <option>Group (5+ Guests)</option>
                        </select>
                      </div>
                    </div>

                    <div className="modal-actions-footer">
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => setModalHotel(null)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Send Room Inquiry
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
