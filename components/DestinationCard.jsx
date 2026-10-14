'use client';

import Image from 'next/image';
import Link from 'next/link';
import SaveButton from './SaveButton';

export default function DestinationCard({ destination }) {
  if (!destination) return null;

  return (
    <article className="yt-card destination-card">
      <div className="dest-image-wrap">
        <Image
          src={destination.heroImage || 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'}
          alt={`${destination.name}, ${destination.region}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          loading="lazy"
        />
        
        {/* Category / Region Badge */}
        <span className="dest-badge">
          {destination.badge || destination.category || destination.region}
        </span>

        {/* Verified Season Tag (Replacing fake ratings/reviews) */}
        {destination.bestSeason && (
          <span className="dest-season-badge">
            <i className="fa-regular fa-calendar-check"></i>
            <span>{destination.bestSeason.split('(')[0].trim()}</span>
          </span>
        )}

        {/* Bookmark / Save Action */}
        <div className="dest-save-wrap">
          <SaveButton
            destinationId={destination.id}
            destinationName={destination.name}
            iconOnly={true}
          />
        </div>
      </div>

      <div className="dest-body">
        <div className="dest-location-row">
          <span className="dest-region">
            <i className="fa-solid fa-location-dot"></i> {destination.region}
          </span>
          {destination.altitude && (
            <span className="dest-altitude">
              <i className="fa-solid fa-mountain"></i> {destination.altitude}
            </span>
          )}
        </div>

        <h3 className="dest-title">
          <Link href={`/destinations/${destination.id}`}>
            {destination.name}
          </Link>
        </h3>

        <p className="dest-tagline">
          {destination.tagline || 'Experience scenic mountain vistas, local hospitality, and historic cultural landmarks.'}
        </p>

        {/* Highlights Preview */}
        {destination.highlights && destination.highlights.length > 0 && (
          <div className="dest-highlights-preview">
            {destination.highlights.slice(0, 2).map((item, i) => (
              <span key={i} className="mini-tag">
                <i className="fa-solid fa-check"></i> {item}
              </span>
            ))}
          </div>
        )}

        <div className="dest-footer">
          <div className="dest-price-box">
            {destination.averageTourPrice ? (
              <>
                <span className="price-label">Estimated Tour</span>
                <span className="price-amount">
                  PKR {destination.averageTourPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="price-label text-muted">Free public access</span>
            )}
          </div>

          <div className="dest-actions-group">
            <Link
              href={`/map?focus=${destination.id}`}
              className="btn-icon-map"
              title={`View ${destination.name} on Interactive Map`}
              aria-label={`View ${destination.name} on Interactive Map`}
            >
              <i className="fa-solid fa-map-location-dot"></i>
            </Link>

            <Link
              href={`/destinations/${destination.id}`}
              className="btn-primary-sm"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
