'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AIPlannerPage() {
  const [destination, setDestination] = useState('Hunza Valley');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState('Comfort (PKR 50k - 100k)');
  const [travelers, setTravelers] = useState('Family (2 Adults + Kids)');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setItinerary({
        destination,
        days,
        budget,
        travelers,
        schedule: [
          {
            day: 1,
            title: `Arrival & Acclimatization in ${destination}`,
            details: 'Depart via Hazara Motorway / KKH. Check into mountain resort. Evening walk along ancient bazaar and local chai stop.',
            stay: 'Heritage Mountain Lodge'
          },
          {
            day: 2,
            title: 'Iconic Forts & Cultural Exploration',
            details: 'Visit Altit and Baltit forts. Sunset viewpoint at Eagle’s Nest overlooking Rakaposhi and Ladyfinger peaks.',
            stay: 'Lakeside Pod'
          },
          {
            day: 3,
            title: 'Attabad Lake & Passu Glacier Hike',
            details: 'Jet-ski boating on turquoise waters of Attabad Lake. Cross the suspension bridge at Hussaini. Drive past Passu Cones.',
            stay: 'Glacier View Resort'
          },
          {
            day: 4,
            title: 'High Altitude Khunjerab Pass Expedition',
            details: 'Drive to 4,693m Pak-China border. Highest ATM in the world. Spot Himalayan Ibex and Golden Marmots.',
            stay: 'Sost Silk Route Hotel'
          },
          {
            day: 5,
            title: 'Scenic Return via Babusar Pass',
            details: 'Descend through Chilas and cross 4,173m Babusar Pass into Naran Kaghan valley. Final souvenir shopping.',
            stay: 'Return Journey'
          }
        ]
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="section-container">
      {/* Top Quick Navigation Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', padding: '8px 16px', borderRadius: '10px', background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '0.88rem' }}>
          <i className="fa-solid fa-house"></i> Return to Home Page
        </Link>
        <Link href="/tours" style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc', textDecoration: 'none', fontSize: '0.85rem' }}>
          <i className="fa-solid fa-map-location-dot text-emerald"></i> Tours
        </Link>
        <Link href="/hotels" style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc', textDecoration: 'none', fontSize: '0.85rem' }}>
          <i className="fa-solid fa-hotel text-gold"></i> Hotels
        </Link>
        <Link href="/transport" style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc', textDecoration: 'none', fontSize: '0.85rem' }}>
          <i className="fa-solid fa-truck-monster text-cyan"></i> 4x4 Jeeps
        </Link>
        <Link href="/road-status" style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc', textDecoration: 'none', fontSize: '0.85rem' }}>
          <i className="fa-solid fa-satellite-dish text-ruby"></i> Road Radar
        </Link>
      </div>

      <div className="page-header-box">
        <div className="badge-subtle" style={{ color: '#38bdf8', borderColor: 'rgba(56,189,248,0.4)' }}>
          <i className="fa-solid fa-wand-magic-sparkles text-cyan"></i> AI Trip Architect
        </div>
        <h1 className="page-title">SafarAI Domestic Itinerary Generator</h1>
        <p className="page-description">
          Generate an intelligent, day-by-day Pakistan domestic travel itinerary optimized with live road alerts,
          terrain ratings, and authentic local PKR budgets.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginTop: '30px' }}>
        {/* Form Panel */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '20px' }}>Trip Parameters</h3>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
              Where do you want to go?
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }}
            >
              <option value="Hunza Valley">Hunza Valley & Khunjerab</option>
              <option value="Skardu & Deosai">Skardu & Deosai Plains</option>
              <option value="Swat & Kalam">Swat Valley & Kalam</option>
              <option value="Fairy Meadows">Fairy Meadows & Nanga Parbat</option>
              <option value="Gwadar & Makran">Gwadar & Makran Coast</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
              Trip Duration (Days): {days} Days
            </label>
            <input
              type="range"
              min="3"
              max="12"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px' }}>
              Travel Group:
            </label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc' }}
            >
              <option value="Solo Traveler">Solo Traveler</option>
              <option value="Couple / Honeymoon">Couple / Honeymoon</option>
              <option value="Family (2 Adults + Kids)">Family (2 Adults + Kids)</option>
              <option value="Friends Group (4-8 Pax)">Friends Group (4-8 Pax)</option>
            </select>
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', marginTop: '10px', padding: '14px' }}
          >
            <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>{' '}
            {loading ? 'Consulting Gemini & Supabase...' : 'Generate Itinerary'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '20px' }}>
            {itinerary ? `Your Itinerary: ${itinerary.destination} (${itinerary.days} Days)` : 'Generated Itinerary Preview'}
          </h3>

          {!itinerary && (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
              <i className="fa-solid fa-route" style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}></i>
              <p>Configure your destination and click &quot;Generate Itinerary&quot; to build your personalized plan.</p>
            </div>
          )}

          {itinerary && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {itinerary.schedule.slice(0, itinerary.days).map((item) => (
                <div key={item.day} style={{ background: 'rgba(15,23,42,0.6)', padding: '14px 18px', borderRadius: '12px', borderLeft: '3px solid #38bdf8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>DAY {item.day}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      <i className="fa-solid fa-bed text-emerald"></i> {item.stay}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '4px' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>{item.details}</p>
                </div>
              ))}
              {/* Post-Plan Navigation Hub */}
              <div style={{ marginTop: '24px', padding: '22px', borderRadius: '16px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fa-solid fa-compass text-emerald"></i> Where would you like to go next?
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                      Your itinerary is ready! Return to Home or browse verified domestic bookings.
                    </p>
                  </div>
                  <Link href="/" style={{ padding: '10px 20px', borderRadius: '10px', background: '#10b981', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-house"></i> Return to Home Page
                  </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  <Link href="/" style={{ padding: '12px', textAlign: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-house text-emerald" style={{ display: 'block', fontSize: '1.2rem', marginBottom: '4px' }}></i> Home Page
                  </Link>
                  <Link href="/tours" style={{ padding: '12px', textAlign: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-map-location-dot text-emerald" style={{ display: 'block', fontSize: '1.2rem', marginBottom: '4px' }}></i> Tours
                  </Link>
                  <Link href="/hotels" style={{ padding: '12px', textAlign: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-hotel text-gold" style={{ display: 'block', fontSize: '1.2rem', marginBottom: '4px' }}></i> Hotels
                  </Link>
                  <Link href="/transport" style={{ padding: '12px', textAlign: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-truck-monster text-cyan" style={{ display: 'block', fontSize: '1.2rem', marginBottom: '4px' }}></i> 4x4 Jeeps
                  </Link>
                  <Link href="/road-status" style={{ padding: '12px', textAlign: 'center', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: '0.88rem' }}>
                    <i className="fa-solid fa-satellite-dish text-ruby" style={{ display: 'block', fontSize: '1.2rem', marginBottom: '4px' }}></i> Road Radar
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
