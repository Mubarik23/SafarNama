'use client';

import { useState, useEffect } from 'react';

export default function SaveButton({ destinationId, destinationName, className = '', iconOnly = false }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('yt_saved_places') || '[]');
      setIsSaved(Array.isArray(saved) && saved.includes(destinationId));
    } catch {
      setIsSaved(false);
    }
  }, [destinationId]);

  const toggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let saved = JSON.parse(localStorage.getItem('yt_saved_places') || '[]');
      if (!Array.isArray(saved)) saved = [];

      let nextState = false;
      if (saved.includes(destinationId)) {
        saved = saved.filter((id) => id !== destinationId);
        nextState = false;
      } else {
        saved.push(destinationId);
        nextState = true;
      }

      localStorage.setItem('yt_saved_places', JSON.stringify(saved));
      setIsSaved(nextState);

      // Notify other components (Header badge, MobileNav badge)
      window.dispatchEvent(new Event('yt_saved_updated'));
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  return (
    <button
      type="button"
      className={`yt-save-btn ${isSaved ? 'is-saved' : ''} ${className}`}
      onClick={toggleSave}
      title={isSaved ? `Remove ${destinationName || 'destination'} from saved` : `Save ${destinationName || 'destination'}`}
      aria-label={isSaved ? `Remove ${destinationName || 'destination'} from saved` : `Save ${destinationName || 'destination'}`}
    >
      <i className={isSaved ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}></i>
      {!iconOnly && <span>{isSaved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
