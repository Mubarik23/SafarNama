'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { INITIAL_DESTINATIONS } from '../../lib/data/destinations';
import DestinationCard from '../../components/DestinationCard';
import Link from 'next/link';

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'name-asc' | 'price-asc' | 'price-desc'

  const regions = [
    { id: 'all', label: 'All Pakistan' },
    { id: 'Gilgit-Baltistan', label: 'Gilgit-Baltistan' },
    { id: 'Khyber Pakhtunkhwa', label: 'Khyber Pakhtunkhwa' },
    { id: 'Azad Jammu & Kashmir', label: 'Azad Kashmir' },
    { id: 'Balochistan', label: 'Balochistan' },
    { id: 'Punjab', label: 'Punjab' },
    { id: 'Sindh', label: 'Sindh' }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Mountains & Valleys', label: 'Mountains & Valleys' },
    { id: 'Trekking & Adventure', label: 'Trekking & Adventure' },
    { id: 'Coastal & Beaches', label: 'Coastal & Beaches' },
    { id: 'Cultural & Heritage', label: 'Cultural & Heritage' },
    { id: 'Desert & Culture', label: 'Desert & Culture' }
  ];

  const filteredAndSortedDestinations = useMemo(() => {
    let result = INITIAL_DESTINATIONS.filter((dest) => {
      // Search text match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        dest.name.toLowerCase().includes(q) ||
        dest.region.toLowerCase().includes(q) ||
        (dest.tagline && dest.tagline.toLowerCase().includes(q)) ||
        (dest.highlights && dest.highlights.some((h) => h.toLowerCase().includes(q)));

      // Region match
      const matchesRegion =
        selectedRegion === 'all' ||
        dest.region.toLowerCase().includes(selectedRegion.toLowerCase());

      // Category match
      const matchesCategory =
        selectedCategory === 'all' ||
        dest.category.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesRegion && matchesCategory;
    });

    // Sort logic (Authentic criteria)
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => (a.averageTourPrice || 0) - (b.averageTourPrice || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => (b.averageTourPrice || 0) - (a.averageTourPrice || 0));
    } else {
      // default: featured corridors first
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedRegion, selectedCategory, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedRegion !== 'all' || selectedCategory !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  return (
    <div className="explore-page-container">
      {/* Page Header */}
      <div className="container-inner">
        <div className="explore-header-box">
          <div className="badge-subtle">
            <i className="fa-solid fa-compass text-teal"></i> Pakistan Destination Discovery
          </div>
          <h1 className="page-title">Explore Destinations Across Pakistan</h1>
          <p className="page-description">
            Discover breathtaking valleys, snow-capped peaks, alpine lakes, UNESCO world heritage sites, and coastal wonders from Karakoram to the Arabian Sea.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="explore-filter-card">
          {/* Main Search Input */}
          <div className="explore-search-input-wrap">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              className="explore-search-input"
              placeholder="Search by destination name, valley, lake, or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search text"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Filter Dropdowns & Controls Row */}
          <div className="explore-filters-row">
            {/* Region Filter */}
            <div className="filter-item">
              <label htmlFor="region-select" className="filter-label">Province / Region</label>
              <select
                id="region-select"
                className="filter-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="filter-item">
              <label htmlFor="category-select" className="filter-label">Category</label>
              <select
                id="category-select"
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="filter-item">
              <label htmlFor="sort-select" className="filter-label">Sort By</label>
              <select
                id="sort-select"
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured Corridors</option>
                <option value="name-asc">Name (A to Z)</option>
                <option value="price-asc">Estimated Cost: Low to High</option>
                <option value="price-desc">Estimated Cost: High to Low</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div className="filter-item clear-filters-item">
                <button
                  type="button"
                  className="btn-clear-filters"
                  onClick={clearAllFilters}
                >
                  <i className="fa-solid fa-rotate-left"></i> Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div className="explore-results-meta">
          <span className="results-count">
            Found <strong>{filteredAndSortedDestinations.length}</strong> destinations
          </span>

          <div className="quick-links-group">
            <Link href="/map" className="btn-link-icon">
              <i className="fa-solid fa-map-location-dot"></i> View on Interactive Map
            </Link>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredAndSortedDestinations.length > 0 ? (
          <div className="destinations-grid">
            {filteredAndSortedDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        ) : (
          <div className="empty-results-box">
            <div className="empty-icon-wrap">
              <i className="fa-solid fa-mountain-sun"></i>
            </div>
            <h3 className="empty-title">No destinations found</h3>
            <p className="empty-desc">
              No places matched your search query or filters. Try another destination name or remove some filters.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={clearAllFilters}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="page-loading-skeleton">Loading Destinations...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
