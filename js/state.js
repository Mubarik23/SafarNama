/**
 * SafarNama PK - Central Reactive State Store & Persistence Engine
 * Supports LocalStorage caching, cross-tab synchronization, and real-time event dispatching
 */

import { INITIAL_DESTINATIONS } from './data/destinations.js';
import { INITIAL_TOURS } from './data/tours.js';
import { INITIAL_HOTELS } from './data/hotels.js';
import { INITIAL_TRANSPORT } from './data/transport.js';
import { INITIAL_ROAD_ALERTS } from './data/roadAlerts.js';
import { INITIAL_RESTAURANTS } from './data/restaurants.js';
import { INITIAL_ROUTES } from './data/routes.js';

const STORAGE_KEYS = {
  DESTINATIONS: 'safarnama_destinations_v1',
  TOURS: 'safarnama_tours_v1',
  HOTELS: 'safarnama_hotels_v1',
  RESTAURANTS: 'safarnama_restaurants_v1',
  ROUTES: 'safarnama_routes_v1',
  TRANSPORT: 'safarnama_transport_v1',
  ROAD_ALERTS: 'safarnama_road_alerts_v1',
  BOOKINGS: 'safarnama_bookings_v1',
  WISHLIST: 'safarnama_wishlist_v1',
  USER: 'safarnama_user_v1',
  CURRENCY: 'safarnama_currency_v1',
  THEME: 'safarnama_theme_v2',
  NOTIFICATIONS: 'safarnama_notifications_v1'
};

const INITIAL_BOOKINGS = [
  {
    id: "BK-PK-98214",
    type: "tour",
    itemId: "tour-hunza-expedition-7d",
    title: "7-Day Hunza Valley & Khunjerab Pass Expedition",
    departureCity: "Islamabad",
    travelDate: "2026-09-15",
    travelersCount: 2,
    leadTraveler: {
      fullName: "Muhammad Hamza Khan",
      email: "hamza.khan@gmail.com",
      phone: "+92 300 4567890",
      cnic: "35201-9876543-1"
    },
    totalAmountPKR: 137000,
    discountPKR: 13700,
    finalAmountPKR: 123300,
    paymentMethod: "JazzCash",
    paymentRef: "JC-992019482",
    paymentStatus: "CONFIRMED",
    bookingStatus: "CONFIRMED",
    bookedAt: "2026-09-02T18:45:00Z",
    qrCodeData: "SAFARNAMA:BK-PK-98214:HUNZA:2PAX:HAMZA_KHAN",
    addons: ["Attabad Jet-Ski Pass", "Mountain Travel Insurance"]
  },
  {
    id: "BK-PK-74192",
    type: "hotel",
    itemId: "hotel-shangrila-skardu",
    title: "Shangrila Resort - Lower Kachura, Skardu",
    roomType: "Lakeside Swiss Cottage",
    checkInDate: "2026-09-22",
    checkOutDate: "2026-09-25",
    nights: 3,
    guestsCount: 2,
    leadTraveler: {
      fullName: "Ayesha Tariq",
      email: "ayesha.tariq@outlook.com",
      phone: "+92 333 8765432",
      cnic: "61101-2345678-2"
    },
    totalAmountPKR: 144000,
    discountPKR: 0,
    finalAmountPKR: 144000,
    paymentMethod: "Easypaisa",
    paymentRef: "EP-88392100",
    paymentStatus: "CONFIRMED",
    bookingStatus: "CONFIRMED",
    bookedAt: "2026-09-01T14:20:00Z",
    qrCodeData: "SAFARNAMA:BK-PK-74192:SHANGRILA:AYESHA_TARIQ",
    addons: ["Airport Transfer from Skardu Airport"]
  }
];

const INITIAL_PROMO_CODES = [
  { code: "SAFARPK", discountPercent: 15, maxDiscountPKR: 15000, description: "15% Welcome Discount across Pakistan" },
  { code: "NORTHERN10", discountPercent: 10, maxDiscountPKR: 8000, description: "10% off Gilgit & Skardu tours" },
  { code: "AZADI2026", flatDiscountPKR: 5000, description: "Flat PKR 5,000 off on bookings above PKR 50,000" }
];

export const CURRENCY_RATES = {
  PKR: { code: "PKR", symbol: "Rs.", rate: 1.0, name: "Pakistani Rupee" },
  USD: { code: "USD", symbol: "$", rate: 0.0036, name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", rate: 0.0033, name: "Euro" },
  SAR: { code: "SAR", symbol: "SAR", rate: 0.0135, name: "Saudi Riyal" },
  AED: { code: "AED", symbol: "AED", rate: 0.0132, name: "UAE Dirham" }
};

class StateManager {
  constructor() {
    this.subscribers = new Map();
    this.destinations = this.load(STORAGE_KEYS.DESTINATIONS, INITIAL_DESTINATIONS);
    INITIAL_DESTINATIONS.forEach(id => {
      if (!this.destinations.some(d => d.id === id.id)) this.destinations.push(id);
    });
    this.tours = this.load(STORAGE_KEYS.TOURS, INITIAL_TOURS);
    INITIAL_TOURS.forEach(it => {
      if (!this.tours.some(t => t.id === it.id)) this.tours.push(it);
    });
    // Merge updated hotel coordinates from initial data if missing in cache
    const loadedHotels = this.load(STORAGE_KEYS.HOTELS, INITIAL_HOTELS);
    this.hotels = loadedHotels.map(h => {
      if (!h.coordinates) {
        const initH = INITIAL_HOTELS.find(ih => ih.id === h.id);
        if (initH && initH.coordinates) h.coordinates = initH.coordinates;
      }
      return h;
    });
    INITIAL_HOTELS.forEach(ih => {
      if (!this.hotels.some(h => h.id === ih.id)) this.hotels.push(ih);
    });

    this.restaurants = this.load(STORAGE_KEYS.RESTAURANTS, INITIAL_RESTAURANTS);
    this.routes = this.load(STORAGE_KEYS.ROUTES, INITIAL_ROUTES);
    this.transport = this.load(STORAGE_KEYS.TRANSPORT, INITIAL_TRANSPORT);
    this.roadAlerts = this.load(STORAGE_KEYS.ROAD_ALERTS, INITIAL_ROAD_ALERTS);
    this.bookings = this.load(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    this.wishlist = this.load(STORAGE_KEYS.WISHLIST, ["tour-hunza-expedition-7d", "hotel-luxus-hunza"]);
    this.currency = this.load(STORAGE_KEYS.CURRENCY, "PKR");
    this.theme = this.load(STORAGE_KEYS.THEME, 'light');
    this.promoCodes = INITIAL_PROMO_CODES;
    this.notifications = this.load(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: "notif-1",
        title: "KKH Route Clear",
        message: "National Highways & Motorway Police report smooth transit on Karakoram Highway.",
        time: "10m ago",
        type: "road",
        unread: true
      },
      {
        id: "notif-2",
        title: "Hunza Autumn Colors Alert",
        message: "Golden foliage season booking is now open with up to 15% discount.",
        time: "1h ago",
        type: "promo",
        unread: true
      }
    ]);

    this.user = this.load(STORAGE_KEYS.USER, {
      id: "user-pak-01",
      fullName: "Hamza Khan",
      email: "hamza.khan@traveler.pk",
      phone: "+92 300 4567890",
      cnic: "35201-9876543-1",
      city: "Lahore",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      role: "traveler", // 'traveler' or 'admin'
      isLoggedIn: true
    });

    // Listen to storage events across other browser tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        this.handleStorageEvent(e);
      });
    }

    // Apply persisted theme to document immediately
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', this.theme);
    }
  }

  load(key, defaultValue) {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
      return defaultValue;
    }
  }

  save(key, value) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.warn(`Error saving ${key} to storage:`, e);
    }
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
    return () => {
      const listeners = this.subscribers.get(event);
      if (listeners) {
        this.subscribers.set(event, listeners.filter(cb => cb !== callback));
      }
    };
  }

  dispatch(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(cb => {
        try {
          cb(data);
        } catch (err) {
          console.error(`Error in subscriber for ${event}:`, err);
        }
      });
    }
    // Also trigger generic 'change'
    if (event !== 'change' && this.subscribers.has('change')) {
      this.subscribers.get('change').forEach(cb => cb({ event, data }));
    }
  }

  handleStorageEvent(e) {
    if (e.key === STORAGE_KEYS.ROAD_ALERTS) {
      this.roadAlerts = JSON.parse(e.newValue);
      this.dispatch('road_alerts_changed', this.roadAlerts);
    } else if (e.key === STORAGE_KEYS.BOOKINGS) {
      this.bookings = JSON.parse(e.newValue);
      this.dispatch('bookings_changed', this.bookings);
    } else if (e.key === STORAGE_KEYS.TOURS) {
      this.tours = JSON.parse(e.newValue);
      this.dispatch('tours_changed', this.tours);
    }
  }

  // --- Currency & Formatting ---
  setCurrency(currencyCode) {
    if (CURRENCY_RATES[currencyCode]) {
      this.currency = currencyCode;
      this.save(STORAGE_KEYS.CURRENCY, currencyCode);
      this.dispatch('currency_changed', currencyCode);
    }
  }

  formatPrice(pkrAmount) {
    const curr = CURRENCY_RATES[this.currency] || CURRENCY_RATES.PKR;
    const converted = pkrAmount * curr.rate;
    if (this.currency === 'PKR') {
      return `Rs. ${Math.round(converted).toLocaleString('en-PK')}`;
    }
    return `${curr.symbol} ${Math.round(converted).toLocaleString()}`;
  }

  // --- Theme ---
  setTheme(theme) {
    this.theme = theme;
    this.save(STORAGE_KEYS.THEME, theme);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    this.dispatch('theme_changed', theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  // --- User Auth & Role Switch ---
  setUser(userData) {
    this.user = { ...this.user, ...userData };
    this.save(STORAGE_KEYS.USER, this.user);
    this.dispatch('user_changed', this.user);
  }

  switchRole(newRole) {
    this.user.role = newRole;
    this.save(STORAGE_KEYS.USER, this.user);
    this.dispatch('user_changed', this.user);
  }

  // --- Wishlist ---
  toggleWishlist(itemId) {
    const idx = this.wishlist.indexOf(itemId);
    if (idx >= 0) {
      this.wishlist.splice(idx, 1);
    } else {
      this.wishlist.push(itemId);
    }
    this.save(STORAGE_KEYS.WISHLIST, this.wishlist);
    this.dispatch('wishlist_changed', this.wishlist);
    return this.isInWishlist(itemId);
  }

  isInWishlist(itemId) {
    return this.wishlist.includes(itemId);
  }

  // --- Bookings ---
  createBooking(bookingData) {
    const bookingId = `BK-PK-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking = {
      id: bookingId,
      bookedAt: new Date().toISOString(),
      bookingStatus: "CONFIRMED",
      paymentStatus: "CONFIRMED",
      qrCodeData: `SAFARNAMA:${bookingId}:${bookingData.itemId}:${bookingData.leadTraveler.fullName.replace(/\s+/g, '_')}`,
      ...bookingData
    };

    // Decrease seat availability if it's a tour
    if (newBooking.type === 'tour') {
      const tour = this.tours.find(t => t.id === newBooking.itemId);
      if (tour && tour.availableSeats > 0) {
        tour.availableSeats = Math.max(0, tour.availableSeats - (newBooking.travelersCount || 1));
        this.save(STORAGE_KEYS.TOURS, this.tours);
        this.dispatch('tours_changed', this.tours);
      }
    }

    this.bookings.unshift(newBooking);
    this.save(STORAGE_KEYS.BOOKINGS, this.bookings);

    // Send instant real-time notification
    this.addNotification({
      title: "Booking Confirmed! 🎉",
      message: `Your domestic trip "${newBooking.title}" has been confirmed with voucher ID ${bookingId}.`,
      type: "booking"
    });

    this.dispatch('booking_created', newBooking);
    return newBooking;
  }

  updateBookingStatus(bookingId, newStatus) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.bookingStatus = newStatus;
      this.save(STORAGE_KEYS.BOOKINGS, this.bookings);
      this.dispatch('bookings_changed', this.bookings);
    }
  }

  // --- Road & Weather Alerts (Real-Time Admin Sync) ---
  updateRoadAlert(alertId, updatedFields) {
    const alert = this.roadAlerts.find(a => a.id === alertId);
    if (alert) {
      Object.assign(alert, updatedFields, { lastUpdated: "Just now (Admin Live Broadcast)" });
      this.save(STORAGE_KEYS.ROAD_ALERTS, this.roadAlerts);
      
      // Dispatch road alert update
      this.dispatch('road_alerts_changed', this.roadAlerts);
      
      // Broadcast user notification
      this.addNotification({
        title: `Road Advisory: ${alert.highway}`,
        message: `Status updated to [${alert.status}]. ${alert.advisory}`,
        type: "road"
      });
      return alert;
    }
    return null;
  }

  // --- Tour Packages Management ---
  addTour(tourData) {
    const id = `tour-${Date.now()}`;
    const newTour = { id, rating: 5.0, reviewsCount: 0, ...tourData };
    this.tours.unshift(newTour);
    this.save(STORAGE_KEYS.TOURS, this.tours);
    this.dispatch('tours_changed', this.tours);
    return newTour;
  }

  updateTour(tourId, updatedFields) {
    const idx = this.tours.findIndex(t => t.id === tourId);
    if (idx !== -1) {
      this.tours[idx] = { ...this.tours[idx], ...updatedFields };
      this.save(STORAGE_KEYS.TOURS, this.tours);
      this.dispatch('tours_changed', this.tours);
      return this.tours[idx];
    }
    return null;
  }

  deleteTour(tourId) {
    this.tours = this.tours.filter(t => t.id !== tourId);
    this.save(STORAGE_KEYS.TOURS, this.tours);
    this.dispatch('tours_changed', this.tours);
  }

  // --- Notifications ---
  addNotification(notif) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      time: "Just now",
      unread: true,
      ...notif
    };
    this.notifications.unshift(newNotif);
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.dispatch('notifications_changed', this.notifications);
    this.dispatch('notification_toast', newNotif);
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => n.unread = false);
    this.save(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.dispatch('notifications_changed', this.notifications);
  }

  // --- Promo Code Validation ---
  applyPromoCode(code, subtotalPKR) {
    const cleanCode = (code || '').trim().toUpperCase();
    const promo = this.promoCodes.find(p => p.code === cleanCode);
    if (!promo) {
      return { valid: false, message: "Invalid promo code for Pakistan domestic tours" };
    }

    let discount = 0;
    if (promo.discountPercent) {
      discount = (subtotalPKR * promo.discountPercent) / 100;
      if (promo.maxDiscountPKR) {
        discount = Math.min(discount, promo.maxDiscountPKR);
      }
    } else if (promo.flatDiscountPKR) {
      discount = promo.flatDiscountPKR;
    }

    discount = Math.min(discount, subtotalPKR);
    return {
      valid: true,
      promo,
      discountPKR: Math.round(discount),
      finalAmountPKR: Math.max(0, subtotalPKR - Math.round(discount)),
      message: `Promo applied! You saved ${this.formatPrice(discount)} (${promo.description})`
    };
  }
}

// Global Singleton State
export const state = new StateManager();
