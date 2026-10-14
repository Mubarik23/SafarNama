'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InteractiveMap from '../../components/InteractiveMap';
import Link from 'next/link';

function MapContent() {
  const searchParams = useSearchParams();
  const initialFocus = searchParams.get('focus') || null;

  return (
    <div className="map-page-container">
      <div className="map-page-header">
        <div className="header-meta-row">
          <div className="badge-subtle">
            <i className="fa-solid fa-map-location-dot text-teal"></i> Pakistan Geographic Explorer
          </div>
          <div className="map-breadcrumbs">
            <Link href="/">Home</Link> &gt; <span>Interactive Map</span>
          </div>
        </div>
        <h1 className="page-title">Explore Pakistan on the Map</h1>
        <p className="page-description">
          Find tourist destinations, mountain valleys, lakes, verified stays, and real-time highway clearance across Gilgit-Baltistan, KPK, Balochistan, Punjab, Sindh, and Azad Kashmir.
        </p>
      </div>

      <InteractiveMap initialFocusId={initialFocus} height="calc(100vh - 210px)" />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="page-loading-skeleton">Loading Pakistan Map...</div>}>
      <MapContent />
    </Suspense>
  );
}
