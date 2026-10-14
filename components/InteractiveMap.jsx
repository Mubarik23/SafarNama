'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { INITIAL_DESTINATIONS } from '../lib/data/destinations';
import { INITIAL_HOTELS } from '../lib/data/hotels';
import { INITIAL_ROAD_ALERTS } from '../lib/data/roadAlerts';

export default function InteractiveMap({ initialFocusId = null, height = 'calc(100vh - 160px)' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'destinations' | 'hotels' | 'roads'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'map-only' | 'list-only'
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Pakistan geographical center & default zoom
  const PAKISTAN_CENTER = [30.3753, 69.3451];
  const DEFAULT_ZOOM = 6;

  // Initialize Leaflet map safely
  useEffect(() => {
    let checkInterval = null;
    let attempts = 0;

    const initMap = () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = window.L;

      if (!L) {
        attempts++;
        if (attempts > 30) {
          setMapError('Interactive map engine could not load. Please check your network connection.');
        }
        return;
      }

      if (checkInterval) clearInterval(checkInterval);

      // Clean up previous map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      try {
        const map = L.map(mapContainerRef.current, {
          center: PAKISTAN_CENTER,
          zoom: DEFAULT_ZOOM,
          minZoom: 4,
          maxZoom: 18,
          scrollWheelZoom: true,
          zoomControl: true,
        });

        // Add Carto Voyager / OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);
        markersGroupRef.current = markersGroup;
        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Invalidate size on mount
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
      } catch (err) {
        console.error('Leaflet initialization error:', err);
        setMapError('Failed to initialize map tiles. Showing list view fallback.');
      }
    };

    if (window.L) {
      initMap();
    } else {
      checkInterval = setInterval(initMap, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filter, search, or mapLoaded changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;

    if (!group) return;
    group.clearLayers();

    const q = searchQuery.toLowerCase().trim();

    // 1. Destinations Markers
    if (activeFilter === 'all' || activeFilter === 'destinations') {
      INITIAL_DESTINATIONS.forEach((dest) => {
        if (!dest.coordinates) return;
        const matches = !q || dest.name.toLowerCase().includes(q) || dest.region.toLowerCase().includes(q);
        if (!matches) return;

        const customIcon = L.divIcon({
          className: 'custom-map-marker marker-destination',
          html: `<div class="marker-pin marker-pin-dest" title="${dest.name}"><i class="fa-solid fa-mountain"></i></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -34],
        });

        const marker = L.marker(dest.coordinates, { icon: customIcon });

        const popupContent = `
          <div class="map-popup-card">
            <div class="popup-title">${dest.name}</div>
            <div class="popup-sub"><i class="fa-solid fa-location-dot"></i> ${dest.region}</div>
            <div class="popup-tag">${dest.category || 'Tourist Destination'}</div>
            <div class="popup-actions">
              <a href="/destinations/${dest.id}" class="popup-btn-primary">View Details</a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${dest.coordinates[0]},${dest.coordinates[1]}" target="_blank" rel="noopener noreferrer" class="popup-btn-secondary">Directions</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedPlace({ ...dest, type: 'destination' });
        });

        group.addLayer(marker);
      });
    }

    // 2. Hotel / Resort Markers
    if (activeFilter === 'all' || activeFilter === 'hotels') {
      INITIAL_HOTELS.forEach((hotel) => {
        if (!hotel.coordinates) return;
        const matches = !q || hotel.name.toLowerCase().includes(q) || hotel.destinationName.toLowerCase().includes(q);
        if (!matches) return;

        const hotelIcon = L.divIcon({
          className: 'custom-map-marker marker-hotel',
          html: `<div class="marker-pin marker-pin-hotel" title="${hotel.name}"><i class="fa-solid fa-hotel"></i></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -34],
        });

        const marker = L.marker(hotel.coordinates, { icon: hotelIcon });

        const popupContent = `
          <div class="map-popup-card">
            <div class="popup-title">${hotel.name}</div>
            <div class="popup-sub"><i class="fa-solid fa-location-dot"></i> ${hotel.destinationName}</div>
            <div class="popup-tag text-emerald">PKR ${hotel.pricePerNightPKR.toLocaleString()} / night</div>
            <div class="popup-actions">
              <a href="/hotels" class="popup-btn-primary">Explore Stays</a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${hotel.coordinates[0]},${hotel.coordinates[1]}" target="_blank" rel="noopener noreferrer" class="popup-btn-secondary">Directions</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedPlace({ ...hotel, type: 'hotel' });
        });

        group.addLayer(marker);
      });
    }

    // 3. Road Status Markers
    if (activeFilter === 'all' || activeFilter === 'roads') {
      INITIAL_ROAD_ALERTS.forEach((road) => {
        if (!road.coordinates) return;
        const matches = !q || road.highway.toLowerCase().includes(q) || road.section.toLowerCase().includes(q);
        if (!matches) return;

        const isSuccess = road.statusLevel === 'success' || road.status.includes('OPEN');
        const roadIcon = L.divIcon({
          className: 'custom-map-marker marker-road',
          html: `<div class="marker-pin ${isSuccess ? 'marker-pin-road-open' : 'marker-pin-road-alert'}" title="${road.highway}"><i class="fa-solid fa-route"></i></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -34],
        });

        const marker = L.marker(road.coordinates, { icon: roadIcon });

        const popupContent = `
          <div class="map-popup-card">
            <div class="popup-title">${road.highway}</div>
            <div class="popup-sub">${road.section}</div>
            <div class="popup-status ${isSuccess ? 'text-emerald' : 'text-amber'}"><strong>Status:</strong> ${road.status}</div>
            <div class="popup-tag">${road.weather} (${road.temperature})</div>
            <div class="popup-actions">
              <a href="/road-status" class="popup-btn-primary">Road Details</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedPlace({ ...road, type: 'road' });
        });

        group.addLayer(marker);
      });
    }

    // If initialFocusId provided, focus on that destination
    if (initialFocusId) {
      const target = INITIAL_DESTINATIONS.find((d) => d.id === initialFocusId);
      if (target && target.coordinates) {
        map.flyTo(target.coordinates, 10, { duration: 1.5 });
        setSelectedPlace({ ...target, type: 'destination' });
      }
    }
  }, [mapLoaded, activeFilter, searchQuery, initialFocusId]);

  const resetToPakistanCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(PAKISTAN_CENTER, DEFAULT_ZOOM, { duration: 1 });
      setSelectedPlace(null);
    }
  };

  const focusItem = (item, type = 'destination') => {
    setSelectedPlace({ ...item, type });
    if (mapInstanceRef.current && item.coordinates) {
      mapInstanceRef.current.flyTo(item.coordinates, 11, { duration: 1.2 });
    }
  };

  // Filtered lists for the sidebar drawer
  const filteredDestinations = INITIAL_DESTINATIONS.filter((d) => {
    const q = searchQuery.toLowerCase();
    return !q || d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q);
  });

  const filteredHotels = INITIAL_HOTELS.filter((h) => {
    const q = searchQuery.toLowerCase();
    return !q || h.name.toLowerCase().includes(q) || h.destinationName.toLowerCase().includes(q);
  });

  const filteredRoads = INITIAL_ROAD_ALERTS.filter((r) => {
    const q = searchQuery.toLowerCase();
    return !q || r.highway.toLowerCase().includes(q) || r.section.toLowerCase().includes(q);
  });

  return (
    <div className="yt-map-wrapper" style={{ height }}>
      {/* Top Filter and Search Control Bar */}
      <div className="map-toolbar">
        <div className="map-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="map-search-input"
            placeholder="Search destination, resort, or highway..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="map-search-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="map-filter-pills">
          <button
            className={`map-pill ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <i className="fa-solid fa-layer-group"></i> All Places
          </button>
          <button
            className={`map-pill ${activeFilter === 'destinations' ? 'active' : ''}`}
            onClick={() => setActiveFilter('destinations')}
          >
            <i className="fa-solid fa-mountain"></i> Destinations ({filteredDestinations.length})
          </button>
          <button
            className={`map-pill ${activeFilter === 'hotels' ? 'active' : ''}`}
            onClick={() => setActiveFilter('hotels')}
          >
            <i className="fa-solid fa-hotel"></i> Resorts & Stays ({filteredHotels.length})
          </button>
          <button
            className={`map-pill ${activeFilter === 'roads' ? 'active' : ''}`}
            onClick={() => setActiveFilter('roads')}
          >
            <i className="fa-solid fa-triangle-exclamation"></i> Road Status ({filteredRoads.length})
          </button>
        </div>

        {/* Action Controls */}
        <div className="map-view-actions">
          <button
            className="btn-outline-sm"
            onClick={resetToPakistanCenter}
            title="Reset map view to entire Pakistan"
          >
            <i className="fa-solid fa-arrows-to-dot"></i> Whole Pakistan
          </button>

          <div className="view-mode-toggle">
            <button
              className={`mode-btn ${viewMode === 'split' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('split');
                setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
              }}
              title="Split View (List + Map)"
            >
              <i className="fa-solid fa-table-columns"></i>
            </button>
            <button
              className={`mode-btn ${viewMode === 'map-only' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('map-only');
                setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
              }}
              title="Full Map View"
            >
              <i className="fa-solid fa-map"></i>
            </button>
            <button
              className={`mode-btn ${viewMode === 'list-only' ? 'active' : ''}`}
              onClick={() => setViewMode('list-only')}
              title="List View"
            >
              <i className="fa-solid fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Body: Sidebar List + Map View */}
      <div className={`map-content-layout view-${viewMode}`}>
        {/* Sidebar Destination & Point Explorer */}
        {viewMode !== 'map-only' && (
          <aside className="map-sidebar-drawer" aria-label="Destination List">
            <div className="sidebar-header">
              <span className="sidebar-count-label">
                Showing{' '}
                {activeFilter === 'all'
                  ? filteredDestinations.length + filteredHotels.length + filteredRoads.length
                  : activeFilter === 'destinations'
                  ? filteredDestinations.length
                  : activeFilter === 'hotels'
                  ? filteredHotels.length
                  : filteredRoads.length}{' '}
                locations
              </span>
              {selectedPlace && (
                <button
                  className="btn-link-sm"
                  onClick={() => setSelectedPlace(null)}
                >
                  Clear Selection
                </button>
              )}
            </div>

            <div className="sidebar-list-scroll">
              {/* Selected Place Highlight Card */}
              {selectedPlace && (
                <div className="selected-place-feature-card">
                  <div className="feature-header">
                    <span className="feature-badge">
                      <i className="fa-solid fa-crosshairs"></i> Selected Location
                    </span>
                    <button
                      className="close-feature-btn"
                      onClick={() => setSelectedPlace(null)}
                      title="Deselect"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>

                  {selectedPlace.heroImage || selectedPlace.image ? (
                    <div className="feature-img-wrap">
                      <Image
                        src={selectedPlace.heroImage || selectedPlace.image}
                        alt={selectedPlace.name || selectedPlace.highway}
                        fill
                        sizes="300px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : null}

                  <h3 className="feature-title">
                    {selectedPlace.name || selectedPlace.highway}
                  </h3>
                  <p className="feature-desc">
                    {selectedPlace.region || selectedPlace.destinationName || selectedPlace.section}
                  </p>

                  <div className="feature-actions">
                    {selectedPlace.type === 'destination' && (
                      <Link
                        href={`/destinations/${selectedPlace.id}`}
                        className="btn-primary-sm btn-full"
                      >
                        View Full Destination Details
                      </Link>
                    )}
                    {selectedPlace.type === 'hotel' && (
                      <Link href="/hotels" className="btn-primary-sm btn-full">
                        View Hotel Stays & Rates
                      </Link>
                    )}
                    {selectedPlace.type === 'road' && (
                      <Link href="/road-status" className="btn-primary-sm btn-full">
                        View Highway Road Report
                      </Link>
                    )}
                    {selectedPlace.coordinates && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.coordinates[0]},${selectedPlace.coordinates[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline-sm btn-full"
                      >
                        <i className="fa-solid fa-diamond-turn-right"></i> Get Directions
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Destinations Group */}
              {(activeFilter === 'all' || activeFilter === 'destinations') && (
                <div className="sidebar-group">
                  <h4 className="group-title">
                    <i className="fa-solid fa-mountain text-teal"></i> Tourist Destinations ({filteredDestinations.length})
                  </h4>
                  {filteredDestinations.map((dest) => (
                    <div
                      key={dest.id}
                      className={`map-list-item ${selectedPlace?.id === dest.id ? 'active' : ''}`}
                      onClick={() => focusItem(dest, 'destination')}
                    >
                      <div className="list-item-thumb">
                        <Image
                          src={dest.heroImage}
                          alt={dest.name}
                          fill
                          sizes="60px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="list-item-info">
                        <div className="list-item-name">{dest.name}</div>
                        <div className="list-item-sub">{dest.region}</div>
                        <div className="list-item-meta">
                          <span>{dest.altitude}</span> • <span>{dest.category || 'Scenic Valley'}</span>
                        </div>
                      </div>
                      <button
                        className="btn-focus-arrow"
                        title="Focus on map"
                        aria-label={`Focus ${dest.name} on map`}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  ))}
                  {filteredDestinations.length === 0 && (
                    <div className="map-empty-state">
                      <p>No destinations match your search.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Stays Group */}
              {(activeFilter === 'all' || activeFilter === 'hotels') && (
                <div className="sidebar-group">
                  <h4 className="group-title">
                    <i className="fa-solid fa-hotel text-cyan"></i> Resorts & Mountain Pods ({filteredHotels.length})
                  </h4>
                  {filteredHotels.map((hotel) => (
                    <div
                      key={hotel.id}
                      className={`map-list-item ${selectedPlace?.id === hotel.id ? 'active' : ''}`}
                      onClick={() => focusItem(hotel, 'hotel')}
                    >
                      <div className="list-item-thumb">
                        <Image
                          src={hotel.image}
                          alt={hotel.name}
                          fill
                          sizes="60px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className="list-item-info">
                        <div className="list-item-name">{hotel.name}</div>
                        <div className="list-item-sub">{hotel.destinationName}</div>
                        <div className="list-item-meta text-emerald">
                          PKR {hotel.pricePerNightPKR.toLocaleString()} / night
                        </div>
                      </div>
                      <button
                        className="btn-focus-arrow"
                        title="Focus on map"
                        aria-label={`Focus ${hotel.name} on map`}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Roads Group */}
              {(activeFilter === 'all' || activeFilter === 'roads') && (
                <div className="sidebar-group">
                  <h4 className="group-title">
                    <i className="fa-solid fa-route text-amber"></i> Live Highway Surveillance ({filteredRoads.length})
                  </h4>
                  {filteredRoads.map((road) => (
                    <div
                      key={road.id}
                      className={`map-list-item ${selectedPlace?.id === road.id ? 'active' : ''}`}
                      onClick={() => focusItem(road, 'road')}
                    >
                      <div className="list-item-icon-box">
                        <i className="fa-solid fa-road"></i>
                      </div>
                      <div className="list-item-info">
                        <div className="list-item-name">{road.highway}</div>
                        <div className="list-item-sub">{road.section}</div>
                        <div className="list-item-meta">
                          <span className={`badge-pill-sm ${road.statusLevel || 'success'}`}>
                            {road.status}
                          </span>
                        </div>
                      </div>
                      <button
                        className="btn-focus-arrow"
                        title="Focus on map"
                        aria-label={`Focus ${road.highway} on map`}
                      >
                        <i className="fa-solid fa-chevron-right"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Map Canvas */}
        {viewMode !== 'list-only' && (
          <div className="map-canvas-container">
            {mapError && (
              <div className="map-error-banner">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <span>{mapError}</span>
              </div>
            )}
            <div
              id="pakistan-interactive-map"
              ref={mapContainerRef}
              className="leaflet-map-canvas"
            />
          </div>
        )}
      </div>
    </div>
  );
}
