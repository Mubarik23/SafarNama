'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { INITIAL_DESTINATIONS } from '../../lib/data/destinations';
import { INITIAL_HOTELS } from '../../lib/data/hotels';
import { INITIAL_ROAD_ALERTS } from '../../lib/data/roadAlerts';

function TripsContent() {
  const searchParams = useSearchParams();
  const addDestinationId = searchParams.get('add');

  // Multi-step trip builder state
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Main Destination, 2: Itinerary & Stops, 3: Review & Costs
  const [selectedDestinationId, setSelectedDestinationId] = useState(addDestinationId || 'hunza');
  const [tripDurationDays, setTripDurationDays] = useState(5);
  const [departureCity, setDepartureCity] = useState('Islamabad');
  const [travelerCount, setTravelerCount] = useState(2);
  const [selectedStops, setSelectedStops] = useState([]);
  const [customDays, setCustomDays] = useState([]);
  const [tripSaved, setTripSaved] = useState(false);

  const selectedDestination = INITIAL_DESTINATIONS.find((d) => d.id === selectedDestinationId) || INITIAL_DESTINATIONS[0];

  // Initialize or update stops and day schedule when destination or duration changes
  useEffect(() => {
    if (selectedDestination) {
      const initialStops = (selectedDestination.highlights || []).slice(0, Math.min(tripDurationDays, 5));
      setSelectedStops(initialStops);

      const daysArr = [];
      for (let i = 1; i <= tripDurationDays; i++) {
        const stopName = initialStops[i - 1] || `${selectedDestination.name} Exploration`;
        daysArr.push({
          day: i,
          title: i === 1 ? `Departure from ${departureCity} to ${selectedDestination.name}` : i === tripDurationDays ? `Return to ${departureCity}` : `Explore ${stopName}`,
          activity: i === 1 ? `Scenic drive via Hazara Motorway / National Highway. Check into mountain resort.` : i === tripDurationDays ? `Pack souvenirs and return journey with tea stop.` : `Guided visit to ${stopName}, photography, and authentic regional dining.`,
          hotel: nearbyStays[0]?.name || 'Standard Mountain Lodge'
        });
      }
      setCustomDays(daysArr);
    }
  }, [selectedDestinationId, tripDurationDays, departureCity]);

  // Nearby stays for budget calculation
  const nearbyStays = INITIAL_HOTELS.filter((h) => h.destinationId === selectedDestinationId);
  const avgStayPrice = nearbyStays[0]?.pricePerNightPKR || 18000;

  // Road advisory for the route
  const roadAlert = INITIAL_ROAD_ALERTS.find((r) => {
    const text = `${r.highway} ${r.section}`.toLowerCase();
    return text.includes(selectedDestinationId) || (selectedDestination?.region.includes('Gilgit') && text.includes('kkh'));
  }) || INITIAL_ROAD_ALERTS[0];

  // Budget calculations
  const transportCost = tripDurationDays * 8500;
  const lodgingCost = (tripDurationDays - 1) * avgStayPrice;
  const foodAndActivitiesCost = tripDurationDays * travelerCount * 3000;
  const totalEstimatedCost = transportCost + lodgingCost + foodAndActivitiesCost;
  const perPersonCost = Math.round(totalEstimatedCost / travelerCount);

  const removeStop = (stopToRemove) => {
    setSelectedStops(selectedStops.filter((s) => s !== stopToRemove));
  };

  const addHighlightToStops = (highlight) => {
    if (!selectedStops.includes(highlight)) {
      setSelectedStops([...selectedStops, highlight]);
    }
  };

  const saveTripLocally = () => {
    try {
      const tripData = {
        destination: selectedDestination.name,
        departureCity,
        days: tripDurationDays,
        travelers: travelerCount,
        stops: selectedStops,
        schedule: customDays,
        estimatedTotalPKR: totalEstimatedCost,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('yt_planned_trip', JSON.stringify(tripData));
      setTripSaved(true);
      setTimeout(() => setTripSaved(false), 4000);
    } catch (err) {
      console.error('Error saving trip:', err);
    }
  };

  return (
    <div className="trips-page-container">
      <div className="container-inner">
        {/* Header */}
        <div className="trips-header-box">
          <div className="badge-subtle">
            <i className="fa-solid fa-map-location-dot text-teal"></i> Simple Step-by-Step Planner
          </div>
          <div className="trips-header-row">
            <div>
              <h1 className="page-title">Plan Your Pakistan Trip</h1>
              <p className="page-description">
                Customize your day-by-day itinerary, organize scenic stops, check live highway clearance, and review realistic local costs.
              </p>
            </div>

            <Link href="/ai-planner" className="btn-outline">
              <i className="fa-solid fa-wand-magic-sparkles text-cyan"></i> Try AI Itinerary Generator
            </Link>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="trip-stepper-bar">
          <div
            className={`step-bubble-item ${currentStep >= 1 ? 'active' : ''} ${currentStep === 1 ? 'current' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <span className="step-num">1</span>
            <span className="step-text">Choose Destination</span>
          </div>
          <div className="step-connector"></div>
          <div
            className={`step-bubble-item ${currentStep >= 2 ? 'active' : ''} ${currentStep === 2 ? 'current' : ''}`}
            onClick={() => setCurrentStep(2)}
          >
            <span className="step-num">2</span>
            <span className="step-text">Daily Itinerary & Stops</span>
          </div>
          <div className="step-connector"></div>
          <div
            className={`step-bubble-item ${currentStep >= 3 ? 'active' : ''} ${currentStep === 3 ? 'current' : ''}`}
            onClick={() => setCurrentStep(3)}
          >
            <span className="step-num">3</span>
            <span className="step-text">Budget & Route Review</span>
          </div>
        </div>

        {/* STEP 1: Select Destination & Parameters */}
        {currentStep === 1 && (
          <div className="trip-step-panel">
            <h2 className="step-panel-title">Step 1: Select Destination & Trip Details</h2>
            <div className="step-params-grid">
              <div className="param-field">
                <label className="param-label">Primary Destination</label>
                <select
                  className="param-select"
                  value={selectedDestinationId}
                  onChange={(e) => setSelectedDestinationId(e.target.value)}
                >
                  {INITIAL_DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.region})
                    </option>
                  ))}
                </select>
              </div>

              <div className="param-field">
                <label className="param-label">Departure City</label>
                <select
                  className="param-select"
                  value={departureCity}
                  onChange={(e) => setDepartureCity(e.target.value)}
                >
                  <option value="Islamabad">Islamabad / Rawalpindi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Peshawar">Peshawar</option>
                  <option value="Faisalabad">Faisalabad</option>
                </select>
              </div>

              <div className="param-field">
                <label className="param-label">Duration: {tripDurationDays} Days</label>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={tripDurationDays}
                  onChange={(e) => setTripDurationDays(Number(e.target.value))}
                  className="param-range"
                />
                <div className="range-marks">
                  <span>3 Days</span>
                  <span>5 Days</span>
                  <span>7 Days</span>
                  <span>10 Days</span>
                </div>
              </div>

              <div className="param-field">
                <label className="param-label">Number of Travelers: {travelerCount}</label>
                <div className="counter-btn-row">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                  >
                    -
                  </button>
                  <span className="counter-val">{travelerCount} Persons</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setTravelerCount(travelerCount + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Destination Preview Card */}
            <div className="destination-selected-preview">
              <div className="dest-preview-thumb">
                <Image
                  src={selectedDestination.heroImage}
                  alt={selectedDestination.name}
                  fill
                  sizes="260px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="dest-preview-info">
                <span className="dest-region-pill">{selectedDestination.region}</span>
                <h3 className="dest-preview-title">{selectedDestination.name}</h3>
                <p className="dest-preview-tagline">{selectedDestination.tagline}</p>
                <div className="dest-preview-meta">
                  <span><i className="fa-solid fa-mountain"></i> {selectedDestination.altitude}</span>
                  <span><i className="fa-solid fa-cloud-sun"></i> {selectedDestination.temperature}</span>
                  <span><i className="fa-solid fa-star text-gold"></i> {selectedDestination.rating}</span>
                </div>
              </div>
            </div>

            <div className="step-actions-footer">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentStep(2)}
              >
                Continue to Itinerary Stops <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Organize Itinerary & Stops */}
        {currentStep === 2 && (
          <div className="trip-step-panel">
            <h2 className="step-panel-title">Step 2: Organize Stops & Daily Activities</h2>
            <p className="step-panel-desc">
              Add or remove scenic attractions and view your day-by-day plan for {selectedDestination.name}:
            </p>

            {/* Stops Selection Tags */}
            <div className="stops-management-section">
              <h3 className="stops-sub-heading">Selected Highlights & Attractions:</h3>
              <div className="active-stops-chips">
                {selectedStops.map((stop, i) => (
                  <span key={i} className="active-stop-chip">
                    <i className="fa-solid fa-check text-teal"></i> {stop}
                    <button
                      type="button"
                      onClick={() => removeStop(stop)}
                      className="remove-stop-btn"
                      title="Remove attraction"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </span>
                ))}
              </div>

              {/* Available Highlights to Add */}
              <div className="add-stops-bar">
                <span className="add-stops-label">Add more from {selectedDestination.name}:</span>
                <div className="available-chips-row">
                  {(selectedDestination.highlights || []).map((hl, i) => {
                    const alreadyAdded = selectedStops.includes(hl);
                    return (
                      <button
                        key={i}
                        type="button"
                        className={`chip-add-btn ${alreadyAdded ? 'added' : ''}`}
                        onClick={() => addHighlightToStops(hl)}
                        disabled={alreadyAdded}
                      >
                        {alreadyAdded ? '✓ Added' : `+ ${hl}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Day by Day Schedule Grid */}
            <div className="daily-schedule-list">
              <h3 className="stops-sub-heading">Day-by-Day Schedule ({tripDurationDays} Days):</h3>
              {customDays.map((d) => (
                <div key={d.day} className="day-schedule-card">
                  <div className="day-badge-col">
                    <span className="day-pill">Day {d.day}</span>
                  </div>
                  <div className="day-content-col">
                    <h4 className="day-plan-title">{d.title}</h4>
                    <p className="day-plan-desc">{d.activity}</p>
                    <div className="day-plan-stay">
                      <i className="fa-solid fa-bed text-teal"></i> Stay: <strong>{d.hotel}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="step-actions-footer">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setCurrentStep(1)}
              >
                <i className="fa-solid fa-arrow-left"></i> Back to Destination
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentStep(3)}
              >
                Review Route & Costs <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review Route & Estimated Costs */}
        {currentStep === 3 && (
          <div className="trip-step-panel">
            <h2 className="step-panel-title">Step 3: Review Route, Road Status & Costs</h2>
            <div className="trip-summary-grid">
              {/* Trip Overview Column */}
              <div className="summary-left-col">
                <div className="summary-card">
                  <h3 className="summary-card-title">Trip Overview</h3>
                  <div className="summary-meta-list">
                    <div className="meta-row">
                      <span className="meta-label">Destination</span>
                      <strong className="meta-val">{selectedDestination.name} ({selectedDestination.region})</strong>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Departure</span>
                      <strong className="meta-val">{departureCity}</strong>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Duration</span>
                      <strong className="meta-val">{tripDurationDays} Days / {tripDurationDays - 1} Nights</strong>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Group Size</span>
                      <strong className="meta-val">{travelerCount} Travelers</strong>
                    </div>
                    <div className="meta-row">
                      <span className="meta-label">Key Stops</span>
                      <strong className="meta-val">{selectedStops.join(', ')}</strong>
                    </div>
                  </div>
                </div>

                {/* Highway Status Alert */}
                <div className="summary-card road-alert-summary">
                  <h3 className="summary-card-title">
                    <i className="fa-solid fa-route text-emerald"></i> Route & Highway Clearance
                  </h3>
                  <div className="road-alert-badge-wrap">
                    <span className="badge-status badge-success">
                      {roadAlert?.highway}: {roadAlert?.status || 'OPEN'}
                    </span>
                  </div>
                  <p className="road-advisory-snippet">
                    {roadAlert?.advisory || 'Highway in normal operational condition. Verified by NHMP.'}
                  </p>
                  <div className="road-quick-links">
                    <Link href="/road-status" className="link-sm">
                      Full Highway Surveillance &gt;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Estimated Budget Column */}
              <div className="summary-right-col">
                <div className="budget-calculation-card">
                  <h3 className="summary-card-title">Estimated Trip Budget</h3>
                  <p className="budget-card-desc">
                    Realistic domestic PKR estimate based on seasonal averages:
                  </p>

                  <div className="budget-rows-box">
                    <div className="calc-row">
                      <span>Transport & Fuel ({tripDurationDays} days)</span>
                      <strong>PKR {transportCost.toLocaleString()}</strong>
                    </div>
                    <div className="calc-row">
                      <span>Lodging ({tripDurationDays - 1} nights)</span>
                      <strong>PKR {lodgingCost.toLocaleString()}</strong>
                    </div>
                    <div className="calc-row">
                      <span>Meals & Activity Passes ({travelerCount} pax)</span>
                      <strong>PKR {foodAndActivitiesCost.toLocaleString()}</strong>
                    </div>
                    <div className="calc-divider"></div>
                    <div className="calc-row total-row">
                      <span>Total Estimated Cost</span>
                      <span className="total-highlight text-teal">PKR {totalEstimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="per-person-note">
                      Approx. <strong>PKR {perPersonCost.toLocaleString()}</strong> per traveler
                    </div>
                  </div>

                  {tripSaved ? (
                    <div className="trip-saved-toast">
                      <i className="fa-solid fa-circle-check"></i> Trip saved to your device!
                    </div>
                  ) : null}

                  <div className="summary-actions-stack">
                    <button
                      type="button"
                      className="btn-primary btn-full"
                      onClick={saveTripLocally}
                    >
                      <i className="fa-solid fa-floppy-disk"></i> Save This Itinerary
                    </button>
                    <button
                      type="button"
                      className="btn-outline btn-full"
                      onClick={() => window.print()}
                    >
                      <i className="fa-solid fa-print"></i> Print / Export Itinerary
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="step-actions-footer">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setCurrentStep(2)}
              >
                <i className="fa-solid fa-arrow-left"></i> Edit Daily Stops
              </button>
              <Link href="/explore" className="btn-outline">
                Explore More Valleys
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TripsPage() {
  return (
    <Suspense fallback={<div className="page-loading-skeleton">Loading Trip Planner...</div>}>
      <TripsContent />
    </Suspense>
  );
}
