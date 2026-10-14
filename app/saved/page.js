'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_DESTINATIONS } from '../../lib/data/destinations';
import DestinationCard from '../../components/DestinationCard';

export default function SavedPlacesPage() {
  const [savedIds, setSavedIds] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadSaved = () => {
      try {
        const saved = JSON.parse(localStorage.getItem('yt_saved_places') || '[]');
        setSavedIds(Array.isArray(saved) ? saved : []);
      } catch {
        setSavedIds([]);
      } finally {
        setLoaded(true);
      }
    };

    loadSaved();
    window.addEventListener('storage', loadSaved);
    window.addEventListener('yt_saved_updated', loadSaved);

    return () => {
      window.removeEventListener('storage', loadSaved);
      window.removeEventListener('yt_saved_updated', loadSaved);
    };
  }, []);

  const savedDestinations = INITIAL_DESTINATIONS.filter((d) => savedIds.includes(d.id));

  const clearAllSaved = () => {
    if (confirm('Are you sure you want to remove all saved destinations?')) {
      localStorage.setItem('yt_saved_places', JSON.stringify([]));
      setSavedIds([]);
      window.dispatchEvent(new Event('yt_saved_updated'));
    }
  };

  return (
    <div className="saved-page-container">
      <div className="container-inner">
        <div className="saved-header-box">
          <div className="badge-subtle">
            <i className="fa-solid fa-bookmark text-teal"></i> Travel Wishlist
          </div>
          <div className="saved-title-row">
            <div>
              <h1 className="page-title">Saved Places</h1>
              <p className="page-description">
                Destinations and valleys you have saved for your upcoming trip across Pakistan.
              </p>
            </div>

            {savedDestinations.length > 0 && (
              <div className="saved-actions-row">
                <Link href="/trips" className="btn-primary">
                  <i className="fa-solid fa-calendar-plus"></i> Build Trip with Saved Places
                </Link>
                <button
                  type="button"
                  className="btn-outline-danger"
                  onClick={clearAllSaved}
                >
                  <i className="fa-solid fa-trash-can"></i> Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {loaded && savedDestinations.length > 0 ? (
          <div className="destinations-grid" style={{ marginTop: '24px' }}>
            {savedDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : loaded ? (
          <div className="empty-results-box" style={{ marginTop: '30px' }}>
            <div className="empty-icon-wrap">
              <i className="fa-regular fa-bookmark"></i>
            </div>
            <h3 className="empty-title">Your saved places list is empty</h3>
            <p className="empty-desc">
              You haven&apos;t bookmarked any Pakistani destinations yet. Explore valleys, mountain peaks, and cultural landmarks, then tap the bookmark icon on any card to save them here.
            </p>
            <div className="empty-actions">
              <Link href="/explore" className="btn-primary">
                <i className="fa-solid fa-compass"></i> Explore Destinations
              </Link>
              <Link href="/map" className="btn-outline">
                <i className="fa-solid fa-map"></i> View Map
              </Link>
            </div>
          </div>
        ) : (
          <div className="page-loading-skeleton">Loading saved places...</div>
        )}
      </div>
    </div>
  );
}
