/**
 * SafarNama PK - Multi-Step PKR Booking & Digital E-Ticket Engine
 * Supports local Pakistani gateways (JazzCash, Easypaisa, Raast, Cards) with instant QR voucher generation
 */

import { state } from './state.js';

class BookingManager {
  constructor() {
    this.currentBookingData = null;
    this.currentStep = 1;
    this.appliedPromo = null;
  }

  startBooking(type, item, customDetails = {}) {
    let subtotal = 0;
    let title = "";
    let itemReference = "";

    if (type === 'tour') {
      subtotal = (item.pricePKR || 50000) * (customDetails.travelersCount || 1);
      title = item.title;
      itemReference = item.id;
    } else if (type === 'hotel') {
      const nights = customDetails.nights || 2;
      subtotal = (item.pricePerNightPKR || 30000) * nights;
      title = `${item.name} (${customDetails.roomType || 'Deluxe Room'})`;
      itemReference = item.id;
    } else if (type === 'transport') {
      const days = customDetails.days || 3;
      subtotal = (item.ratePerDayPKR || 18000) * days;
      title = item.name;
      itemReference = item.id;
    } else if (type === 'custom_ai') {
      subtotal = item.estimatedCostPKR || 85000;
      title = `Custom ${item.durationDays}-Day Trip to ${item.destination.name}`;
      itemReference = `ai-plan-${item.destination.id}`;
    }

    this.currentBookingData = {
      type,
      itemId: itemReference,
      title,
      rawItem: item,
      departureCity: customDetails.departureCity || (state.user ? state.user.city : "Islamabad"),
      travelDate: customDetails.travelDate || "2026-09-20",
      travelersCount: customDetails.travelersCount || 2,
      nights: customDetails.nights || (item.durationNights || 1),
      basePricePKR: subtotal,
      selectedAddons: [],
      addonsTotalPKR: 0,
      subtotalPKR: subtotal,
      discountPKR: 0,
      finalAmountPKR: subtotal,
      leadTraveler: {
        fullName: state.user ? state.user.fullName : "Muhammad Hamza",
        email: state.user ? state.user.email : "hamza.khan@traveler.pk",
        phone: state.user ? state.user.phone : "+92 300 4567890",
        cnic: state.user ? state.user.cnic : "35201-9876543-1"
      },
      paymentMethod: "JazzCash",
      paymentDetails: {}
    };

    this.currentStep = 1;
    this.appliedPromo = null;
    this.renderBookingModal();
  }

  setStep(step) {
    this.currentStep = step;
    this.renderBookingModal();
  }

  toggleAddon(addonName, addonPricePKR) {
    if (!this.currentBookingData) return;
    const idx = this.currentBookingData.selectedAddons.findIndex(a => a.name === addonName);
    if (idx >= 0) {
      this.currentBookingData.selectedAddons.splice(idx, 1);
    } else {
      this.currentBookingData.selectedAddons.push({ name: addonName, price: addonPricePKR });
    }

    this.recalculateTotal();
    this.renderBookingModal();
  }

  applyPromo(codeStr) {
    if (!this.currentBookingData) return;
    const result = state.applyPromoCode(codeStr, this.currentBookingData.subtotalPKR);
    if (result.valid) {
      this.appliedPromo = result;
      this.currentBookingData.discountPKR = result.discountPKR;
      this.currentBookingData.finalAmountPKR = result.finalAmountPKR;
    } else {
      this.appliedPromo = null;
      this.currentBookingData.discountPKR = 0;
      this.currentBookingData.finalAmountPKR = this.currentBookingData.subtotalPKR;
    }
    return result;
  }

  recalculateTotal() {
    if (!this.currentBookingData) return;
    this.currentBookingData.addonsTotalPKR = this.currentBookingData.selectedAddons.reduce((sum, a) => sum + a.price, 0);
    this.currentBookingData.subtotalPKR = this.currentBookingData.basePricePKR + this.currentBookingData.addonsTotalPKR;

    if (this.appliedPromo && this.appliedPromo.valid) {
      const refreshedPromo = state.applyPromoCode(this.appliedPromo.promo.code, this.currentBookingData.subtotalPKR);
      this.currentBookingData.discountPKR = refreshedPromo.discountPKR;
      this.currentBookingData.finalAmountPKR = refreshedPromo.finalAmountPKR;
    } else {
      this.currentBookingData.discountPKR = 0;
      this.currentBookingData.finalAmountPKR = this.currentBookingData.subtotalPKR;
    }
  }

  processPayment(paymentData) {
    if (!this.currentBookingData) return;

    this.currentBookingData.paymentMethod = paymentData.method;
    this.currentBookingData.paymentDetails = paymentData;

    // Call state to save booking
    const completedBooking = state.createBooking({
      type: this.currentBookingData.type,
      itemId: this.currentBookingData.itemId,
      title: this.currentBookingData.title,
      departureCity: this.currentBookingData.departureCity,
      travelDate: this.currentBookingData.travelDate,
      travelersCount: this.currentBookingData.travelersCount,
      nights: this.currentBookingData.nights,
      leadTraveler: this.currentBookingData.leadTraveler,
      totalAmountPKR: this.currentBookingData.subtotalPKR,
      discountPKR: this.currentBookingData.discountPKR,
      finalAmountPKR: this.currentBookingData.finalAmountPKR,
      paymentMethod: paymentData.method,
      paymentRef: `${paymentData.method.substring(0, 2).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      addons: this.currentBookingData.selectedAddons.map(a => a.name)
    });

    this.currentBookingData.completedBooking = completedBooking;
    this.setStep(4); // Confirmation step
    return completedBooking;
  }

  renderBookingModal() {
    const modalContainer = document.getElementById('booking-modal-container');
    if (!modalContainer) return;

    if (!this.currentBookingData) {
      modalContainer.innerHTML = '';
      modalContainer.classList.remove('active');
      return;
    }

    modalContainer.classList.add('active');
    const data = this.currentBookingData;

    let contentHtml = '';

    if (this.currentStep === 1) {
      // Step 1: Traveler Information
      contentHtml = `
        <div class="booking-step-header">
          <div class="step-indicator">
            <span class="step-pill active">1. Traveler Info</span>
            <span class="step-pill">2. Add-ons & Promo</span>
            <span class="step-pill">3. PKR Payment</span>
            <span class="step-pill">4. E-Ticket</span>
          </div>
          <h3><i class="fa-solid fa-passport text-emerald"></i> Traveler & Trip Details</h3>
          <p class="text-muted">Enter lead traveler credentials for domestic permits and mountain manifest.</p>
        </div>

        <div class="booking-summary-mini">
          <div class="mini-title">${data.title}</div>
          <div class="mini-meta">
            <span><i class="fa-solid fa-users"></i> ${data.travelersCount} Travelers</span>
            <span><i class="fa-solid fa-calendar-check"></i> ${data.travelDate}</span>
            <span><i class="fa-solid fa-money-bill-wave"></i> Total: <strong>${state.formatPrice(data.finalAmountPKR)}</strong></span>
          </div>
        </div>

        <form id="step1-form" class="booking-form-grid" onsubmit="event.preventDefault(); window.bookingEngine.handleStep1Submit();">
          <div class="form-group">
            <label><i class="fa-solid fa-user"></i> Full Name (as per CNIC)</label>
            <input type="text" id="lead-name" required value="${data.leadTraveler.fullName}" placeholder="e.g. Muhammad Hamza Khan" class="form-input" />
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-id-card"></i> Pakistani CNIC / NICOP / Passport</label>
            <input type="text" id="lead-cnic" required value="${data.leadTraveler.cnic}" placeholder="35201-1234567-1" class="form-input" />
            <small class="form-hint">Mandatory for northern security checkpoints (Gilgit/Skardu/KPK).</small>
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-phone"></i> Pakistani Mobile (WhatsApp Alert)</label>
            <input type="tel" id="lead-phone" required value="${data.leadTraveler.phone}" placeholder="+92 300 1234567" class="form-input" />
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-envelope"></i> Email for Digital E-Ticket</label>
            <input type="email" id="lead-email" required value="${data.leadTraveler.email}" placeholder="traveler@gmail.com" class="form-input" />
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-location-dot"></i> Departure City</label>
            <select id="departure-city" class="form-select">
              <optgroup label="── Major Cities ──">
                <option value="Islamabad" ${data.departureCity === 'Islamabad' ? 'selected' : ''}>Islamabad / Rawalpindi</option>
                <option value="Lahore" ${data.departureCity === 'Lahore' ? 'selected' : ''}>Lahore</option>
                <option value="Karachi" ${data.departureCity === 'Karachi' ? 'selected' : ''}>Karachi (Direct / Flight)</option>
                <option value="Peshawar" ${data.departureCity === 'Peshawar' ? 'selected' : ''}>Peshawar</option>
                <option value="Multan" ${data.departureCity === 'Multan' ? 'selected' : ''}>Multan</option>
                <option value="Faisalabad" ${data.departureCity === 'Faisalabad' ? 'selected' : ''}>Faisalabad</option>
              </optgroup>
              <optgroup label="── Balochistan ──">
                <option value="Quetta" ${data.departureCity === 'Quetta' ? 'selected' : ''}>Quetta (Capital)</option>
                <option value="Gwadar" ${data.departureCity === 'Gwadar' ? 'selected' : ''}>Gwadar</option>
                <option value="Turbat" ${data.departureCity === 'Turbat' ? 'selected' : ''}>Turbat</option>
                <option value="Khuzdar" ${data.departureCity === 'Khuzdar' ? 'selected' : ''}>Khuzdar</option>
                <option value="Hub" ${data.departureCity === 'Hub' ? 'selected' : ''}>Hub</option>
                <option value="Chaman" ${data.departureCity === 'Chaman' ? 'selected' : ''}>Chaman</option>
                <option value="Zhob" ${data.departureCity === 'Zhob' ? 'selected' : ''}>Zhob</option>
                <option value="Sibi" ${data.departureCity === 'Sibi' ? 'selected' : ''}>Sibi</option>
                <option value="Dera Bugti" ${data.departureCity === 'Dera Bugti' ? 'selected' : ''}>Dera Bugti</option>
                <option value="Loralai" ${data.departureCity === 'Loralai' ? 'selected' : ''}>Loralai</option>
                <option value="Nushki" ${data.departureCity === 'Nushki' ? 'selected' : ''}>Nushki</option>
                <option value="Dalbandin" ${data.departureCity === 'Dalbandin' ? 'selected' : ''}>Dalbandin</option>
                <option value="Panjgur" ${data.departureCity === 'Panjgur' ? 'selected' : ''}>Panjgur</option>
                <option value="Kharan" ${data.departureCity === 'Kharan' ? 'selected' : ''}>Kharan</option>
                <option value="Awaran" ${data.departureCity === 'Awaran' ? 'selected' : ''}>Awaran</option>
                <option value="Mastung" ${data.departureCity === 'Mastung' ? 'selected' : ''}>Mastung</option>
                <option value="Kalat" ${data.departureCity === 'Kalat' ? 'selected' : ''}>Kalat</option>
                <option value="Lasbela" ${data.departureCity === 'Lasbela' ? 'selected' : ''}>Lasbela (Uthal)</option>
                <option value="Ormara" ${data.departureCity === 'Ormara' ? 'selected' : ''}>Ormara</option>
                <option value="Pasni" ${data.departureCity === 'Pasni' ? 'selected' : ''}>Pasni</option>
                <option value="Surab" ${data.departureCity === 'Surab' ? 'selected' : ''}>Surab</option>
                <option value="Harnai" ${data.departureCity === 'Harnai' ? 'selected' : ''}>Harnai</option>
                <option value="Ziarat" ${data.departureCity === 'Ziarat' ? 'selected' : ''}>Ziarat</option>
                <option value="Bela" ${data.departureCity === 'Bela' ? 'selected' : ''}>Bela</option>
                <option value="Washuk" ${data.departureCity === 'Washuk' ? 'selected' : ''}>Washuk (Basima)</option>
                <option value="Musakhel" ${data.departureCity === 'Musakhel' ? 'selected' : ''}>Musakhel</option>
                <option value="Sherani" ${data.departureCity === 'Sherani' ? 'selected' : ''}>Sherani (Mughal Kot)</option>
                <option value="Kech" ${data.departureCity === 'Kech' ? 'selected' : ''}>Kech (Mand)</option>
                <option value="Jhal Magsi" ${data.departureCity === 'Jhal Magsi' ? 'selected' : ''}>Jhal Magsi</option>
                <option value="Kohlu" ${data.departureCity === 'Kohlu' ? 'selected' : ''}>Kohlu</option>
                <option value="Barkhan" ${data.departureCity === 'Barkhan' ? 'selected' : ''}>Barkhan</option>
                <option value="Duki" ${data.departureCity === 'Duki' ? 'selected' : ''}>Duki</option>
              </optgroup>
            </select>
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-calendar-days"></i> Preferred Travel Date</label>
            <input type="date" id="travel-date" required value="${data.travelDate}" min="2026-09-04" class="form-input" />
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-users"></i> Number of Travelers</label>
            <input type="number" id="travelers-count" min="1" max="30" value="${data.travelersCount}" class="form-input" onchange="window.bookingEngine.updateTravelersCount(this.value)" />
          </div>

          <div class="booking-modal-actions">
            <button type="button" class="btn btn-secondary" onclick="window.bookingEngine.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-emerald">Proceed to Add-ons & Discounts <i class="fa-solid fa-arrow-right"></i></button>
          </div>
        </form>
      `;
    } else if (this.currentStep === 2) {
      // Step 2: Add-ons and Promo Code
      const isAddonActive = (name) => data.selectedAddons.some(a => a.name === name);

      contentHtml = `
        <div class="booking-step-header">
          <div class="step-indicator">
            <span class="step-pill done">1. Traveler Info</span>
            <span class="step-pill active">2. Add-ons & Promo</span>
            <span class="step-pill">3. PKR Payment</span>
            <span class="step-pill">4. E-Ticket</span>
          </div>
          <h3><i class="fa-solid fa-wand-magic-sparkles text-gold"></i> Experience Upgrades & Promo</h3>
          <p class="text-muted">Customize your Pakistan mountain trip with authentic local add-ons.</p>
        </div>

        <div class="addons-grid">
          <div class="addon-card ${isAddonActive('Mountain Emergency Travel Insurance') ? 'selected' : ''}" onclick="window.bookingEngine.toggleAddon('Mountain Emergency Travel Insurance', 3500)">
            <div class="addon-icon"><i class="fa-solid fa-shield-heart text-emerald"></i></div>
            <div class="addon-details">
              <h4>High-Altitude Travel Insurance (State Life)</h4>
              <p>Emergency medical, altitude evacuation & baggage loss coverage across GB & KPK.</p>
              <div class="addon-price">+ Rs. 3,500</div>
            </div>
            <div class="addon-check">${isAddonActive('Mountain Emergency Travel Insurance') ? '<i class="fa-solid fa-circle-check text-emerald"></i>' : '<i class="fa-regular fa-circle"></i>'}</div>
          </div>

          <div class="addon-card ${isAddonActive('Attabad Lake Jet-Ski & Speedboat Pass') ? 'selected' : ''}" onclick="window.bookingEngine.toggleAddon('Attabad Lake Jet-Ski & Speedboat Pass', 5500)">
            <div class="addon-icon"><i class="fa-solid fa-ship text-glacier"></i></div>
            <div class="addon-details">
              <h4>Attabad Lake Speedboat & Jet-Ski Pass</h4>
              <p>VIP fast-track boating and 15-minute guided jet ski ride on turquoise glacial waters.</p>
              <div class="addon-price">+ Rs. 5,500</div>
            </div>
            <div class="addon-check">${isAddonActive('Attabad Lake Jet-Ski & Speedboat Pass') ? '<i class="fa-solid fa-circle-check text-emerald"></i>' : '<i class="fa-regular fa-circle"></i>'}</div>
          </div>

          <div class="addon-card ${isAddonActive('Traditional Bonfire & Live Rubab Music Night') ? 'selected' : ''}" onclick="window.bookingEngine.toggleAddon('Traditional Bonfire & Live Rubab Music Night', 6000)">
            <div class="addon-icon"><i class="fa-solid fa-fire text-gold"></i></div>
            <div class="addon-details">
              <h4>Live Bonfire & Traditional Folk Music Evening</h4>
              <p>Exclusive riverside campfire with local Gilgit/Balti folk musicians and Hunzai herbal chai.</p>
              <div class="addon-price">+ Rs. 6,000</div>
            </div>
            <div class="addon-check">${isAddonActive('Traditional Bonfire & Live Rubab Music Night') ? '<i class="fa-solid fa-circle-check text-emerald"></i>' : '<i class="fa-regular fa-circle"></i>'}</div>
          </div>

          <div class="addon-card ${isAddonActive('Dedicated 4x4 Off-Road Jeep Day Pass') ? 'selected' : ''}" onclick="window.bookingEngine.toggleAddon('Dedicated 4x4 Off-Road Jeep Day Pass', 14000)">
            <div class="addon-icon"><i class="fa-solid fa-truck-monster text-ruby"></i></div>
            <div class="addon-details">
              <h4>Private 4x4 Jeep Safari for Deosai / Mahodand</h4>
              <p>Dedicated high-clearance 4WD with expert mountain driver for untamed off-road lakes.</p>
              <div class="addon-price">+ Rs. 14,000</div>
            </div>
            <div class="addon-check">${isAddonActive('Dedicated 4x4 Off-Road Jeep Day Pass') ? '<i class="fa-solid fa-circle-check text-emerald"></i>' : '<i class="fa-regular fa-circle"></i>'}</div>
          </div>
        </div>

        <div class="promo-box">
          <label><i class="fa-solid fa-tag text-gold"></i> Have a Promo Code?</label>
          <div class="promo-input-group">
            <input type="text" id="promo-input" placeholder="e.g. SAFARPK or NORTHERN10" value="${this.appliedPromo ? this.appliedPromo.promo.code : ''}" class="form-input" />
            <button type="button" class="btn btn-gold" onclick="window.bookingEngine.handleApplyPromo()">Apply Code</button>
          </div>
          ${this.appliedPromo ? `<div class="promo-status success"><i class="fa-solid fa-check"></i> ${this.appliedPromo.message}</div>` : ''}
          <div class="promo-suggestions">
            <span class="chip-promo" onclick="window.bookingEngine.fillPromo('SAFARPK')">SAFARPK (15% Off)</span>
            <span class="chip-promo" onclick="window.bookingEngine.fillPromo('NORTHERN10')">NORTHERN10 (10% Off)</span>
            <span class="chip-promo" onclick="window.bookingEngine.fillPromo('AZADI2026')">AZADI2026 (Rs. 5,000 Off)</span>
          </div>
        </div>

        <div class="order-summary-box">
          <div class="summary-row"><span>Base Plan (${data.travelersCount} Pax):</span> <span>${state.formatPrice(data.basePricePKR)}</span></div>
          ${data.addonsTotalPKR > 0 ? `<div class="summary-row"><span>Add-ons Total:</span> <span>+ ${state.formatPrice(data.addonsTotalPKR)}</span></div>` : ''}
          ${data.discountPKR > 0 ? `<div class="summary-row discount"><span>Promo Discount:</span> <span>- ${state.formatPrice(data.discountPKR)}</span></div>` : ''}
          <div class="summary-row total"><span>Payable Amount:</span> <span>${state.formatPrice(data.finalAmountPKR)}</span></div>
        </div>

        <div class="booking-modal-actions">
          <button type="button" class="btn btn-secondary" onclick="window.bookingEngine.setStep(1)"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <button type="button" class="btn btn-emerald" onclick="window.bookingEngine.setStep(3)">Proceed to Secure Payment <i class="fa-solid fa-lock"></i></button>
        </div>
      `;
    } else if (this.currentStep === 3) {
      // Step 3: Local Pakistani Payment Processing
      contentHtml = `
        <div class="booking-step-header">
          <div class="step-indicator">
            <span class="step-pill done">1. Traveler Info</span>
            <span class="step-pill done">2. Add-ons & Promo</span>
            <span class="step-pill active">3. PKR Payment</span>
            <span class="step-pill">4. E-Ticket</span>
          </div>
          <h3><i class="fa-solid fa-credit-card text-emerald"></i> Instant Payment in PKR</h3>
          <p class="text-muted">Select your preferred Pakistani domestic payment gateway.</p>
        </div>

        <div class="payable-callout">
          <div class="payable-label">Total Amount Due in PKR</div>
          <div class="payable-value">${state.formatPrice(data.finalAmountPKR)}</div>
          <div class="payable-sub">Zero transaction surcharge • 100% Secure Domestic Escrow</div>
        </div>

        <div class="payment-tabs" id="payment-tabs">
          <button type="button" class="payment-tab active" onclick="window.bookingEngine.switchPaymentTab('jazzcash')">
            <span class="pay-logo jazzcash">JazzCash</span>
            <span>Mobile Account</span>
          </button>
          <button type="button" class="payment-tab" onclick="window.bookingEngine.switchPaymentTab('easypaisa')">
            <span class="pay-logo easypaisa">Easypaisa</span>
            <span>QR / Wallet</span>
          </button>
          <button type="button" class="payment-tab" onclick="window.bookingEngine.switchPaymentTab('raast')">
            <span class="pay-logo raast">RAAST</span>
            <span>Instant ID</span>
          </button>
          <button type="button" class="payment-tab" onclick="window.bookingEngine.switchPaymentTab('card')">
            <span class="pay-logo cards"><i class="fa-brands fa-cc-visa"></i> <i class="fa-brands fa-cc-mastercard"></i></span>
            <span>Debit / Credit</span>
          </button>
        </div>

        <div id="payment-tab-content" class="payment-tab-panel">
          <!-- Default: JazzCash -->
          <form id="payment-form" onsubmit="event.preventDefault(); window.bookingEngine.handlePaymentSubmit();">
            <div id="jazzcash-fields" class="pay-fields">
              <div class="alert-info-box">
                <i class="fa-solid fa-mobile-screen"></i> An approval prompt will be sent to your JazzCash Mobile Number.
              </div>
              <div class="form-group">
                <label>JazzCash Registered Mobile Number</label>
                <div class="input-with-icon">
                  <span class="input-prefix">+92</span>
                  <input type="tel" id="jazz-phone" required value="${data.leadTraveler.phone.replace('+92', '').trim()}" placeholder="300 1234567" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label>CNIC Last 6 Digits (Verification)</label>
                <input type="password" id="jazz-cnic-verify" maxlength="6" value="765431" required placeholder="••••••" class="form-input" />
              </div>
            </div>

            <div class="booking-modal-actions">
              <button type="button" class="btn btn-secondary" onclick="window.bookingEngine.setStep(2)"><i class="fa-solid fa-arrow-left"></i> Back</button>
              <button type="submit" id="btn-pay-now" class="btn btn-emerald btn-lg">
                <i class="fa-solid fa-shield-check"></i> Authorize & Pay ${state.formatPrice(data.finalAmountPKR)}
              </button>
            </div>
          </form>
        </div>
      `;
    } else if (this.currentStep === 4) {
      // Step 4: Booking Confirmation & Digital E-Ticket Voucher
      const booking = data.completedBooking || state.bookings[0];

      contentHtml = `
        <div class="booking-confirmation-wrapper">
          <div class="conf-hero">
            <div class="conf-icon"><i class="fa-solid fa-circle-check"></i></div>
            <h2>Mubarak! Your Trip is Confirmed! 🇵🇰</h2>
            <p class="text-muted">Digital E-Ticket and scannable boarding pass has been issued for your Pakistan adventure.</p>
          </div>

          <!-- Printable Digital E-Ticket Card -->
          <div class="e-ticket-card" id="printable-ticket">
            <div class="e-ticket-header">
              <div class="e-ticket-brand">
                <span class="flag">🇵🇰</span>
                <div>
                  <strong>SafarNama Pakistan</strong>
                  <div class="sub">Official Domestic Travel Manifest</div>
                </div>
              </div>
              <div class="e-ticket-badge">STATUS: CONFIRMED</div>
            </div>

            <div class="e-ticket-body">
              <div class="e-ticket-main">
                <h3 class="e-ticket-title">${booking.title}</h3>
                <div class="e-ticket-grid">
                  <div class="e-ticket-item">
                    <span class="label">VOUCHER NUMBER</span>
                    <span class="val text-mono">${booking.id}</span>
                  </div>
                  <div class="e-ticket-item">
                    <span class="label">LEAD TRAVELER</span>
                    <span class="val">${booking.leadTraveler.fullName}</span>
                  </div>
                  <div class="e-ticket-item">
                    <span class="label">CNIC / ID</span>
                    <span class="val text-mono">${booking.leadTraveler.cnic}</span>
                  </div>
                  <div class="e-ticket-item">
                    <span class="label">TRAVEL DATE</span>
                    <span class="val">${booking.travelDate}</span>
                  </div>
                  <div class="e-ticket-item">
                    <span class="label">DEPARTURE CITY</span>
                    <span class="val">${booking.departureCity}</span>
                  </div>
                  <div class="e-ticket-item">
                    <span class="label">TRAVELERS</span>
                    <span class="val">${booking.travelersCount} Person(s)</span>
                  </div>
                  <div class="e-ticket-item">
                    <span class="label">PAYMENT METHOD</span>
                    <span class="val">${booking.paymentMethod} (Ref: ${booking.paymentRef})</span>
                  </div>
                  <div class="e-ticket-item">
                    <span class="label">TOTAL PAID</span>
                    <span class="val text-emerald text-bold">${state.formatPrice(booking.finalAmountPKR)}</span>
                  </div>
                </div>

                ${booking.addons && booking.addons.length > 0 ? `
                  <div class="e-ticket-addons">
                    <span class="label">INCLUDED ADD-ONS:</span>
                    <span class="tags">${booking.addons.map(a => `<span class="tag-pill">${a}</span>`).join(' ')}</span>
                  </div>
                ` : ''}
              </div>

              <div class="e-ticket-qr-section">
                <!-- Live SVG Generated QR Simulation -->
                <div class="qr-box">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(booking.qrCodeData)}&color=059669" alt="Boarding QR Pass" />
                </div>
                <div class="qr-caption">Scan for Quick Mountain Checkpoint Entry</div>
              </div>
            </div>

            <div class="e-ticket-footer">
              <span><i class="fa-solid fa-headset"></i> 24/7 Mountain Helpline: <strong>+92 (051) 111-SAFAR (72327)</strong></span>
              <span><i class="fa-solid fa-shield"></i> Government of Pakistan Tourism Registered</span>
            </div>
          </div>

          <div class="conf-actions">
            <button class="btn btn-secondary" onclick="window.print()"><i class="fa-solid fa-print"></i> Print / Save PDF</button>
            <button class="btn btn-emerald" onclick="window.safarnamaApp.navigateTo('dashboard'); window.bookingEngine.closeModal();">
              <i class="fa-solid fa-user-circle"></i> View in My Dashboard
            </button>
            <button class="btn btn-outline" onclick="window.bookingEngine.closeModal(); window.safarnamaApp.navigateTo('explore');">
              <i class="fa-solid fa-compass"></i> Explore More Trips
            </button>
          </div>
        </div>
      `;
    }

    modalContainer.innerHTML = `
      <div class="modal-backdrop" onclick="window.bookingEngine.closeModal()"></div>
      <div class="modal-card modal-lg">
        <button class="modal-close-btn" onclick="window.bookingEngine.closeModal()"><i class="fa-solid fa-xmark"></i></button>
        ${contentHtml}
      </div>
    `;
  }

  handleStep1Submit() {
    const leadName = document.getElementById('lead-name').value;
    const leadCnic = document.getElementById('lead-cnic').value;
    const leadPhone = document.getElementById('lead-phone').value;
    const leadEmail = document.getElementById('lead-email').value;
    const depCity = document.getElementById('departure-city').value;
    const travelDate = document.getElementById('travel-date').value;

    this.currentBookingData.leadTraveler = {
      fullName: leadName,
      cnic: leadCnic,
      phone: leadPhone,
      email: leadEmail
    };
    this.currentBookingData.departureCity = depCity;
    this.currentBookingData.travelDate = travelDate;

    this.setStep(2);
  }

  updateTravelersCount(newCount) {
    const count = parseInt(newCount, 10) || 1;
    this.currentBookingData.travelersCount = count;
    if (this.currentBookingData.type === 'tour') {
      this.currentBookingData.basePricePKR = (this.currentBookingData.rawItem.pricePKR || 50000) * count;
    }
    this.recalculateTotal();
    this.renderBookingModal();
  }

  handleApplyPromo() {
    const promoInput = document.getElementById('promo-input');
    if (!promoInput) return;
    const res = this.applyPromo(promoInput.value);
    this.renderBookingModal();
    if (res.valid) {
      state.dispatch('notification_toast', {
        title: "Promo Applied!",
        message: res.message,
        type: "promo"
      });
    }
  }

  fillPromo(code) {
    this.applyPromo(code);
    this.renderBookingModal();
  }

  switchPaymentTab(method) {
    const tabs = document.querySelectorAll('.payment-tab');
    tabs.forEach(t => t.classList.remove('active'));

    const activeTab = Array.from(tabs).find(t => t.textContent.toLowerCase().includes(method));
    if (activeTab) activeTab.classList.add('active');

    const panel = document.getElementById('payment-tab-content');
    if (!panel) return;

    let fieldsHtml = '';
    if (method === 'jazzcash') {
      fieldsHtml = `
        <div class="alert-info-box">
          <i class="fa-solid fa-mobile-screen"></i> An approval MPIN prompt will be sent to your JazzCash Mobile Account.
        </div>
        <div class="form-group">
          <label>JazzCash Mobile Number</label>
          <div class="input-with-icon">
            <span class="input-prefix">+92</span>
            <input type="tel" id="jazz-phone" required value="${this.currentBookingData.leadTraveler.phone.replace('+92', '').trim()}" placeholder="300 1234567" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label>CNIC Last 6 Digits</label>
          <input type="password" id="jazz-cnic-verify" maxlength="6" value="765431" required placeholder="••••••" class="form-input" />
        </div>
      `;
    } else if (method === 'easypaisa') {
      fieldsHtml = `
        <div class="alert-info-box">
          <i class="fa-solid fa-wallet"></i> Instant OTP verification on your Telenor / All-network Easypaisa App.
        </div>
        <div class="form-group">
          <label>Easypaisa Account Number</label>
          <div class="input-with-icon">
            <span class="input-prefix">+92</span>
            <input type="tel" id="ep-phone" required value="${this.currentBookingData.leadTraveler.phone.replace('+92', '').trim()}" placeholder="333 1234567" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label>Account Holder Name</label>
          <input type="text" id="ep-name" value="${this.currentBookingData.leadTraveler.fullName}" required class="form-input" />
        </div>
      `;
    } else if (method === 'raast') {
      fieldsHtml = `
        <div class="alert-info-box">
          <i class="fa-solid fa-bolt"></i> State Bank of Pakistan RAAST Instant Payment Service (0% fee).
        </div>
        <div class="form-group">
          <label>Enter Your RAAST ID (Mobile / IBAN)</label>
          <input type="text" id="raast-id" required value="03004567890" placeholder="03001234567 or PKXX..." class="form-input" />
        </div>
      `;
    } else if (method === 'card') {
      fieldsHtml = `
        <div class="alert-info-box">
          <i class="fa-solid fa-lock"></i> 3D Secure 2.0 Protected (Supports 1Link, PayPak, Visa, MasterCard).
        </div>
        <div class="form-group">
          <label>Cardholder Name</label>
          <input type="text" id="card-name" required value="${this.currentBookingData.leadTraveler.fullName}" class="form-input" />
        </div>
        <div class="form-group">
          <label>Card Number</label>
          <input type="text" id="card-num" required maxlength="19" placeholder="4214 •••• •••• 9821" value="4214 8832 9912 9821" class="form-input text-mono" />
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>Expiry (MM/YY)</label>
            <input type="text" id="card-exp" required maxlength="5" placeholder="12/28" value="10/28" class="form-input text-mono" />
          </div>
          <div class="form-group">
            <label>CVV / CVC</label>
            <input type="password" id="card-cvv" required maxlength="4" placeholder="•••" value="882" class="form-input text-mono" />
          </div>
        </div>
      `;
    }

    panel.innerHTML = `
      <form id="payment-form" onsubmit="event.preventDefault(); window.bookingEngine.handlePaymentSubmit('${method}');">
        ${fieldsHtml}
        <div class="booking-modal-actions">
          <button type="button" class="btn btn-secondary" onclick="window.bookingEngine.setStep(2)"><i class="fa-solid fa-arrow-left"></i> Back</button>
          <button type="submit" id="btn-pay-now" class="btn btn-emerald btn-lg">
            <i class="fa-solid fa-shield-check"></i> Authorize & Pay ${state.formatPrice(this.currentBookingData.finalAmountPKR)}
          </button>
        </div>
      </form>
    `;
  }

  handlePaymentSubmit(method = "JazzCash") {
    const payBtn = document.getElementById('btn-pay-now');
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing PKR Payment with ${method}...`;
    }

    // Realistic brief simulated authorization delay
    setTimeout(() => {
      this.processPayment({ method: method.toUpperCase(), verified: true });
    }, 1000);
  }

  closeModal() {
    this.currentBookingData = null;
    const modalContainer = document.getElementById('booking-modal-container');
    if (modalContainer) {
      modalContainer.innerHTML = '';
      modalContainer.classList.remove('active');
    }
  }
}

export const bookingEngine = new BookingManager();
