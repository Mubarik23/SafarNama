/**
 * SafarNama PK - Admin Command Center & Real-Time Sync Console
 * Controls live inventory, PKR revenue metrics, booking approvals, and road advisory broadcasts
 */

import { state } from './state.js';

class AdminDashboard {
  constructor() {
    this.activeTab = 'overview';
    this.revenueChart = null;
    this.destChart = null;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    state.subscribe('road_alerts_changed', () => {
      if (this.activeTab === 'roads') this.renderRoadsManager();
    });
    state.subscribe('bookings_changed', () => {
      if (this.activeTab === 'bookings') this.renderBookingsManager();
      if (this.activeTab === 'overview') this.renderOverview();
    });
    state.subscribe('tours_changed', () => {
      if (this.activeTab === 'tours') this.renderToursManager();
    });
  }

  render(tab = 'overview') {
    this.activeTab = tab;
    const adminContainer = document.getElementById('admin-content-area');
    if (!adminContainer) return;

    // Update active nav button
    document.querySelectorAll('.admin-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });

    if (tab === 'overview') {
      this.renderOverview();
    } else if (tab === 'roads') {
      this.renderRoadsManager();
    } else if (tab === 'tours') {
      this.renderToursManager();
    } else if (tab === 'bookings') {
      this.renderBookingsManager();
    }
  }

  renderOverview() {
    const adminContainer = document.getElementById('admin-content-area');
    if (!adminContainer) return;

    const totalBookings = state.bookings.length;
    const totalRevenuePKR = state.bookings.reduce((sum, b) => sum + (b.finalAmountPKR || 0), 0);
    const activeRoadsCount = state.roadAlerts.filter(r => r.statusLevel === 'success').length;
    const totalTravelers = state.bookings.reduce((sum, b) => sum + (b.travelersCount || 1), 0);

    adminContainer.innerHTML = `
      <div class="admin-header-row">
        <div>
          <h2>Executive Command Center 🇵🇰</h2>
          <p class="text-muted">Real-time domestic tourism operations, seat inventories, and northern road surveillance.</p>
        </div>
        <div class="admin-quick-actions">
          <button class="btn btn-sm btn-emerald" onclick="window.adminConsole.openAddTourModal()"><i class="fa-solid fa-plus"></i> New Tour Package</button>
          <button class="btn btn-sm btn-gold" onclick="window.adminConsole.render('roads')"><i class="fa-solid fa-tower-broadcast"></i> Broadcast Road Alert</button>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="admin-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon bg-emerald-glow"><i class="fa-solid fa-money-bill-trend-up text-emerald"></i></div>
          <div class="kpi-data">
            <div class="kpi-label">Gross Domestic Revenue</div>
            <div class="kpi-val">${state.formatPrice(totalRevenuePKR)}</div>
            <div class="kpi-badge positive"><i class="fa-solid fa-arrow-trend-up"></i> +28.4% vs last month</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon bg-glacier-glow"><i class="fa-solid fa-ticket text-glacier"></i></div>
          <div class="kpi-data">
            <div class="kpi-label">Total Domestic Bookings</div>
            <div class="kpi-val">${totalBookings} Completed</div>
            <div class="kpi-badge positive"><i class="fa-solid fa-circle-check"></i> 100% Escrow Verified</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon bg-gold-glow"><i class="fa-solid fa-person-hiking text-gold"></i></div>
          <div class="kpi-data">
            <div class="kpi-label">Active Travelers in North</div>
            <div class="kpi-val">${totalTravelers} Travelers</div>
            <div class="kpi-badge neutral">Gilgit, Skardu & Swat</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon bg-emerald-glow"><i class="fa-solid fa-road-circle-check text-emerald"></i></div>
          <div class="kpi-data">
            <div class="kpi-label">Highway Status</div>
            <div class="kpi-val">${activeRoadsCount} / ${state.roadAlerts.length} Clear</div>
            <div class="kpi-badge positive"><i class="fa-solid fa-shield"></i> NHMP Synced</div>
          </div>
        </div>
      </div>

      <!-- Live Analytics Charts -->
      <div class="admin-charts-grid">
        <div class="chart-card">
          <div class="chart-card-header">
            <h4><i class="fa-solid fa-chart-line text-emerald"></i> Domestic Booking Volume (PKR)</h4>
            <span class="badge-subtle">Real-Time Sync</span>
          </div>
          <div class="chart-canvas-wrap">
            <canvas id="revenueTrendChart"></canvas>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-card-header">
            <h4><i class="fa-solid fa-chart-pie text-gold"></i> Destination Popularity</h4>
            <span class="badge-subtle">2026 Domestic Share</span>
          </div>
          <div class="chart-canvas-wrap">
            <canvas id="destPopularityChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Domestic Bookings Preview -->
      <div class="admin-table-card">
        <div class="table-card-header">
          <h4><i class="fa-solid fa-clock-rotate-left text-emerald"></i> Recent Domestic Bookings</h4>
          <button class="btn btn-sm btn-outline" onclick="window.adminConsole.render('bookings')">View All Records</button>
        </div>
        <div class="table-responsive">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Voucher ID</th>
                <th>Lead Traveler</th>
                <th>Trip / Package</th>
                <th>Date & Pax</th>
                <th>Amount (PKR)</th>
                <th>Gateway</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${state.bookings.slice(0, 5).map(b => `
                <tr>
                  <td class="text-mono text-emerald"><strong>${b.id}</strong></td>
                  <td>
                    <div class="trav-name">${b.leadTraveler.fullName}</div>
                    <div class="trav-cnic text-mono">${b.leadTraveler.cnic}</div>
                  </td>
                  <td>${b.title}</td>
                  <td>${b.travelDate} (${b.travelersCount || 1} Pax)</td>
                  <td class="text-bold">${state.formatPrice(b.finalAmountPKR)}</td>
                  <td><span class="gateway-badge ${b.paymentMethod.toLowerCase()}">${b.paymentMethod}</span></td>
                  <td><span class="status-badge ${b.bookingStatus.toLowerCase()}">${b.bookingStatus}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.renderCharts();
  }

  renderCharts() {
    if (typeof Chart === 'undefined') return;

    // Destroy existing chart instances
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.destChart) this.destChart.destroy();

    const revCtx = document.getElementById('revenueTrendChart');
    if (revCtx) {
      this.revenueChart = new Chart(revCtx, {
        type: 'line',
        data: {
          labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep (Current)'],
          datasets: [{
            label: 'Monthly Bookings (PKR Lakhs)',
            data: [32, 58, 94, 142, 185, 230],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: '#10b981',
            pointRadius: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: 'rgba(255, 255, 255, 0.06)' }, ticks: { color: '#94a3b8' } },
            x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
          }
        }
      });
    }

    const destCtx = document.getElementById('destPopularityChart');
    if (destCtx) {
      this.destChart = new Chart(destCtx, {
        type: 'doughnut',
        data: {
          labels: ['Hunza Valley', 'Skardu & Deosai', 'Swat & Kalam', 'Fairy Meadows', 'Gwadar Coastal'],
          datasets: [{
            data: [35, 28, 18, 12, 7],
            backgroundColor: ['#10b981', '#0284c7', '#f59e0b', '#ef4444', '#8b5cf6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: '#cbd5e1', boxWidth: 12 } }
          }
        }
      });
    }
  }

  renderRoadsManager() {
    const adminContainer = document.getElementById('admin-content-area');
    if (!adminContainer) return;

    adminContainer.innerHTML = `
      <div class="admin-header-row">
        <div>
          <h2><i class="fa-solid fa-tower-broadcast text-gold"></i> Live Northern Road & Weather Broadcaster</h2>
          <p class="text-muted">Instant live broadcast to all travelers across Pakistan. Updates appear immediately on the interactive map & road banner.</p>
        </div>
      </div>

      <div class="admin-cards-list">
        ${state.roadAlerts.map(alert => `
          <div class="admin-road-card" id="admin-road-${alert.id}">
            <div class="road-card-top">
              <div class="road-title-wrap">
                <h3>${alert.highway}</h3>
                <span class="road-section-text">${alert.section}</span>
              </div>
              <div class="status-indicator ${alert.statusLevel}">${alert.status}</div>
            </div>

            <div class="road-edit-grid">
              <div class="form-group">
                <label>Operational Status</label>
                <select id="status-sel-${alert.id}" class="form-select">
                  <option value="OPEN" ${alert.status.includes('OPEN') ? 'selected' : ''}>OPEN (All Vehicles)</option>
                  <option value="OPEN (Daylight 6 AM - 6 PM)" ${alert.status.includes('Daylight') ? 'selected' : ''}>OPEN (Daylight Hours Only)</option>
                  <option value="4x4 MOUNTAIN JEEP ONLY" ${alert.status.includes('4x4') ? 'selected' : ''}>4x4 MOUNTAIN JEEP ONLY</option>
                  <option value="SNOW ADVISORY / SLOW" ${alert.status.includes('SNOW') ? 'selected' : ''}>SNOW ADVISORY / SLOW TRAFFIC</option>
                  <option value="TEMPORARY CLEARANCE IN PROGRESS" ${alert.status.includes('CLEARANCE') ? 'selected' : ''}>TEMPORARY LANDSLIDE CLEARANCE</option>
                </select>
              </div>

              <div class="form-group">
                <label>Severity Level</label>
                <select id="level-sel-${alert.id}" class="form-select">
                  <option value="success" ${alert.statusLevel === 'success' ? 'selected' : ''}>Normal / Green (Safe)</option>
                  <option value="warning" ${alert.statusLevel === 'warning' ? 'selected' : ''}>Caution / Yellow (4x4 or Daylight)</option>
                  <option value="danger" ${alert.statusLevel === 'danger' ? 'selected' : ''}>High Alert / Red (Advisory)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Live Weather & Temp</label>
                <div class="input-inline">
                  <input type="text" id="weather-inp-${alert.id}" value="${alert.weather}" class="form-input" placeholder="e.g. Sunny / Snowing" />
                  <input type="text" id="temp-inp-${alert.id}" value="${alert.temperature}" style="width: 90px;" class="form-input" placeholder="14°C" />
                </div>
              </div>

              <div class="form-group full-width">
                <label>Public Advisory Message (Broadcast to Travelers)</label>
                <input type="text" id="advisory-inp-${alert.id}" value="${alert.advisory}" class="form-input" />
              </div>
            </div>

            <div class="road-card-footer">
              <span class="last-sync"><i class="fa-solid fa-clock"></i> ${alert.lastUpdated}</span>
              <button class="btn btn-sm btn-emerald" onclick="window.adminConsole.saveRoadAlert('${alert.id}')">
                <i class="fa-solid fa-satellite-dish"></i> Broadcast Live Update
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  saveRoadAlert(alertId) {
    const status = document.getElementById(`status-sel-${alertId}`).value;
    const statusLevel = document.getElementById(`level-sel-${alertId}`).value;
    const weather = document.getElementById(`weather-inp-${alertId}`).value;
    const temperature = document.getElementById(`temp-inp-${alertId}`).value;
    const advisory = document.getElementById(`advisory-inp-${alertId}`).value;

    state.updateRoadAlert(alertId, {
      status,
      statusLevel,
      weather,
      temperature,
      advisory
    });

    state.dispatch('notification_toast', {
      title: "Broadcast Published!",
      message: `Road status for ${alertId} broadcasted to all active traveler portals.`,
      type: "road"
    });

    this.renderRoadsManager();
  }

  renderToursManager() {
    const adminContainer = document.getElementById('admin-content-area');
    if (!adminContainer) return;

    adminContainer.innerHTML = `
      <div class="admin-header-row">
        <div>
          <h2><i class="fa-solid fa-boxes-stacked text-emerald"></i> Tour Packages & Seat Inventory</h2>
          <p class="text-muted">Manage PKR pricing, seat allocations, and itinerary details in real-time.</p>
        </div>
        <button class="btn btn-emerald" onclick="window.adminConsole.openAddTourModal()"><i class="fa-solid fa-plus"></i> Add New Package</button>
      </div>

      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Package Title</th>
                <th>Destination</th>
                <th>Duration</th>
                <th>Price (PKR)</th>
                <th>Seat Quota</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.tours.map(t => `
                <tr>
                  <td>
                    <div class="tour-name-admin"><strong>${t.title}</strong></div>
                    <small class="text-muted">${t.badge || 'Standard'}</small>
                  </td>
                  <td>${t.destinationName}</td>
                  <td>${t.durationDays}D / ${t.durationNights}N</td>
                  <td class="text-bold text-emerald">${state.formatPrice(t.pricePKR)}</td>
                  <td>
                    <span class="seat-pill ${t.availableSeats < 5 ? 'critical' : 'good'}">
                      ${t.availableSeats} / ${t.totalSeats || 20} left
                    </span>
                  </td>
                  <td><span class="status-badge ${t.availableSeats > 0 ? 'confirmed' : 'danger'}">${t.availableSeats > 0 ? 'AVAILABLE' : 'SOLD OUT'}</span></td>
                  <td>
                    <div class="table-action-btns">
                      <button class="btn-icon" title="Edit Pricing" onclick="window.adminConsole.editTourPrice('${t.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                      <button class="btn-icon text-ruby" title="Delete Tour" onclick="window.adminConsole.deleteTour('${t.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  editTourPrice(tourId) {
    const tour = state.tours.find(t => t.id === tourId);
    if (!tour) return;
    const newPriceStr = prompt(`Enter new PKR price for "${tour.title}":`, tour.pricePKR);
    if (newPriceStr) {
      const newPrice = parseInt(newPriceStr, 10);
      if (!isNaN(newPrice) && newPrice > 0) {
        state.updateTour(tourId, { pricePKR: newPrice });
        state.dispatch('notification_toast', {
          title: "Pricing Updated",
          message: `${tour.title} is now ${state.formatPrice(newPrice)}`,
          type: "promo"
        });
      }
    }
  }

  deleteTour(tourId) {
    if (confirm('Are you sure you want to remove this tour package from public listings?')) {
      state.deleteTour(tourId);
    }
  }

  renderBookingsManager() {
    const adminContainer = document.getElementById('admin-content-area');
    if (!adminContainer) return;

    adminContainer.innerHTML = `
      <div class="admin-header-row">
        <div>
          <h2><i class="fa-solid fa-receipt text-emerald"></i> Domestic Booking Ledger & Manifest</h2>
          <p class="text-muted">Master database of all traveler bookings with CNIC credentials, QR verification, and payment audit.</p>
        </div>
      </div>

      <div class="admin-table-card">
        <div class="table-responsive">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Lead Traveler & CNIC</th>
                <th>Contact & City</th>
                <th>Trip Item</th>
                <th>Travel Date</th>
                <th>Total PKR</th>
                <th>Gateway & Ref</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.bookings.map(b => `
                <tr>
                  <td class="text-mono text-emerald"><strong>${b.id}</strong></td>
                  <td>
                    <strong>${b.leadTraveler.fullName}</strong>
                    <div class="text-mono text-muted small">${b.leadTraveler.cnic}</div>
                  </td>
                  <td>
                    <div>${b.leadTraveler.phone}</div>
                    <small class="text-muted">${b.departureCity}</small>
                  </td>
                  <td>${b.title}</td>
                  <td>${b.travelDate}</td>
                  <td class="text-bold">${state.formatPrice(b.finalAmountPKR)}</td>
                  <td>
                    <span class="gateway-badge ${b.paymentMethod.toLowerCase()}">${b.paymentMethod}</span>
                    <div class="text-mono small">${b.paymentRef}</div>
                  </td>
                  <td><span class="status-badge ${b.bookingStatus.toLowerCase()}">${b.bookingStatus}</span></td>
                  <td>
                    <button class="btn btn-xs btn-outline" onclick="window.adminConsole.toggleBookingStatus('${b.id}')">
                      Toggle Status
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  toggleBookingStatus(bookingId) {
    const booking = state.bookings.find(b => b.id === bookingId);
    if (!booking) return;
    const nextStatus = booking.bookingStatus === 'CONFIRMED' ? 'COMPLETED' : 'CONFIRMED';
    state.updateBookingStatus(bookingId, nextStatus);
  }

  openAddTourModal() {
    const title = prompt("Enter Tour Package Title (e.g. 6-Day Kumrat Valley & Katora Lake Trek):");
    if (!title) return;
    const priceStr = prompt("Enter Package Price in PKR (e.g. 52000):", "52000");
    const dest = prompt("Destination (hunza, skardu, swat, fairy-meadows, kumrat, neelum, gwadar):", "kumrat");

    const newTour = state.addTour({
      title,
      destinationId: dest,
      destinationName: dest.toUpperCase(),
      region: "Northern Pakistan",
      pricePKR: parseInt(priceStr, 10) || 50000,
      durationDays: 6,
      durationNights: 5,
      departureCities: ["Islamabad", "Lahore"],
      nextDeparture: "2026-09-22",
      totalSeats: 20,
      availableSeats: 20,
      badge: "New Tour",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
      overview: `Exciting adventure to ${dest.toUpperCase()} with guided itinerary and deluxe stays.`
    });

    state.dispatch('notification_toast', {
      title: "New Package Published!",
      message: `"${title}" is now live on SafarNama.`,
      type: "promo"
    });
    this.render('tours');
  }
}

export const adminConsole = new AdminDashboard();
