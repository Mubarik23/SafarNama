/**
 * SafarNama PK - Interactive Pakistan Travel & Road Map Engine
 * Built with Leaflet.js with custom styled markers, road status overlays,
 * hotel markers, restaurant dhabas, scenic highway routes, and real-time search.
 */

import { ENV } from './config.js';
import { state } from './state.js';

// CARTO Basemaps Configuration
export const CARTO_CONFIG = {
  apiKey: localStorage.getItem('safarnama_carto_api_key') || ENV.CARTO_API_KEY || '',
  style: 'voyager' // 'voyager', 'dark_all', or 'light_all'
};

// Major Pakistani cities database for geographic search
const PAKISTAN_CITIES = [
  { name: "Islamabad", region: "Federal Capital", coordinates: [33.7294, 73.0931], desc: "Federal capital nestled beneath the Margalla Hills" },
  { name: "Rawalpindi", region: "Punjab", coordinates: [33.5984, 73.0441], desc: "Historic garrison twin city and northern transit hub" },
  { name: "Lahore", region: "Punjab", coordinates: [31.5497, 74.3436], desc: "Heart of Pakistan, Mughal architecture & culinary capital" },
  { name: "Karachi", region: "Sindh", coordinates: [24.8607, 67.0011], desc: "City of lights, Arabian Sea coast & financial metropolis" },
  { name: "Peshawar", region: "Khyber Pakhtunkhwa", coordinates: [34.0151, 71.5249], desc: "Historic gateway to Central Asia & ancient Silk Road" },
  { name: "Quetta", region: "Balochistan", coordinates: [30.1798, 66.9750], desc: "Balochistan capital fruit garden surrounded by Chiltan peaks" },
  { name: "Gwadar", region: "Balochistan", coordinates: [25.1210, 62.3250], desc: "Deep-sea port city on the warm Arabian Sea coast" },
  { name: "Gilgit", region: "Gilgit-Baltistan", coordinates: [35.9208, 74.3089], desc: "Northern capital connecting KKH, Karakoram & Hindu Kush" },
  { name: "Skardu", region: "Gilgit-Baltistan", coordinates: [35.2971, 75.6333], desc: "Gateway to K2, cold deserts & Shangrila alpine lakes" },
  { name: "Hunza (Karimabad)", region: "Gilgit-Baltistan", coordinates: [36.3167, 74.6500], desc: "Iconic mountain valley under Rakaposhi & Ultar Sar" },
  { name: "Swat (Mingora)", region: "Khyber Pakhtunkhwa", coordinates: [34.7717, 72.3602], desc: "The Switzerland of the East with lush alpine forests" },
  { name: "Kalam", region: "Khyber Pakhtunkhwa", coordinates: [35.4912, 72.5855], desc: "Upper Swat valley, trout streams & Ushu pine forest" },
  { name: "Naran", region: "Khyber Pakhtunkhwa", coordinates: [34.9080, 73.6520], desc: "Heart of Kaghan Valley & Saif-ul-Malook lake gateway" },
  { name: "Murree", region: "Punjab", coordinates: [33.9062, 73.3903], desc: "Colonial pine hill station & Galyat ridge gateway" },
  { name: "Chitral", region: "Khyber Pakhtunkhwa", coordinates: [35.8510, 71.7864], desc: "Home of Tirich Mir and the unique Kalash Valleys" },
  { name: "Multan", region: "Punjab", coordinates: [30.1575, 71.5249], desc: "City of Saints, blue pottery & ancient shrines" },
  { name: "Faisalabad", region: "Punjab", coordinates: [31.4504, 73.1350], desc: "Major textile hub and industrial center" },
  { name: "Muzaffarabad", region: "Azad Kashmir", coordinates: [34.3597, 73.4711], desc: "Capital of AJK at the confluence of Jhelum & Neelum rivers" },
  { name: "Turbat", region: "Balochistan", coordinates: [26.0031, 63.0544], desc: "Major historical oasis city in southern Balochistan" },
  { name: "Khuzdar", region: "Balochistan", coordinates: [27.8105, 66.6177], desc: "Central Balochistan crossroads on the RCD Highway" },
  { name: "Ziarat", region: "Balochistan", coordinates: [30.3824, 67.7256], desc: "Famous Juniper forest reserve & Quaid-e-Azam Residency" },
  { name: "Chaman", region: "Balochistan", coordinates: [30.9236, 66.4512], desc: "Western border gateway on the Khojak Pass" },
  { name: "Sibi", region: "Balochistan", coordinates: [29.5448, 67.8764], desc: "Historic cultural town and Sibi Mela heritage center" },
  { name: "Kund Malir", region: "Balochistan", coordinates: [25.4890, 65.4580], desc: "Pristine golden beach along Makran Coastal Highway" },
  { name: "Ormara", region: "Balochistan", coordinates: [25.2100, 64.6320], desc: "Hammerhead coastal peninsula on the Arabian Sea" }
];

// Comprehensive Hubs Database for Pakistan City-to-City Directions
export const ROUTE_HUBS = {
  islamabad: { id: "hub-isb", name: "Islamabad", region: "Federal Capital", coordinates: [33.7294, 73.0931], aliases: ["isb", "islamabad"] },
  rawalpindi: { id: "hub-rwp", name: "Rawalpindi", region: "Punjab", coordinates: [33.5984, 73.0441], aliases: ["pindi", "rawalpindi"] },
  lahore: { id: "hub-lhr", name: "Lahore", region: "Punjab", coordinates: [31.5497, 74.3436], aliases: ["lhr", "lahore"] },
  karachi: { id: "hub-khi", name: "Karachi", region: "Sindh", coordinates: [24.8607, 67.0011], aliases: ["khi", "karachi"] },
  peshawar: { id: "hub-pew", name: "Peshawar", region: "Khyber Pakhtunkhwa", coordinates: [34.0151, 71.5249], aliases: ["pew", "peshawar"] },
  quetta: { id: "hub-uqa", name: "Quetta", region: "Balochistan", coordinates: [30.1798, 66.9750], aliases: ["quetta"] },
  gwadar: { id: "hub-gwd", name: "Gwadar", region: "Balochistan", coordinates: [25.1210, 62.3250], aliases: ["gwadar", "gwader"] },
  multan: { id: "hub-mux", name: "Multan", region: "Punjab", coordinates: [30.1575, 71.5249], aliases: ["multan"] },
  faisalabad: { id: "hub-fsd", name: "Faisalabad", region: "Punjab", coordinates: [31.4504, 73.1350], aliases: ["fsd", "faisalabad", "lyallpur"] },
  gujranwala: { id: "hub-gwa", name: "Gujranwala", region: "Punjab", coordinates: [32.1877, 74.1945], aliases: ["gujranwala"] },
  sialkot: { id: "hub-skt", name: "Sialkot", region: "Punjab", coordinates: [32.4945, 74.5229], aliases: ["sialkot"] },
  abbottabad: { id: "hub-atb", name: "Abbottabad", region: "Khyber Pakhtunkhwa", coordinates: [34.1688, 73.2215], aliases: ["abbottabad", "atb"] },
  mansehra: { id: "hub-msh", name: "Mansehra", region: "Khyber Pakhtunkhwa", coordinates: [34.3312, 73.1970], aliases: ["mansehra"] },
  naran: { id: "hub-nrn", name: "Naran", region: "Kagham Valley", coordinates: [34.9080, 73.6520], aliases: ["naran", "kaghan", "saifulmalook", "saif-ul-malook"] },
  babusar: { id: "hub-bbr", name: "Babusar Top", region: "High Mountain Pass (4,173m)", coordinates: [35.1500, 74.0300], aliases: ["babusar", "babusar pass", "babusar top"] },
  chilas: { id: "hub-cls", name: "Chilas", region: "Gilgit-Baltistan", coordinates: [35.4210, 74.0980], aliases: ["chilas"] },
  gilgit: { id: "hub-gil", name: "Gilgit", region: "Gilgit-Baltistan", coordinates: [35.9208, 74.3089], aliases: ["gilgit"] },
  hunza: { id: "hub-hnz", name: "Hunza Valley", region: "Gilgit-Baltistan", coordinates: [36.3167, 74.6500], aliases: ["hunza", "karimabad", "aliabad", "nagar"] },
  attabad: { id: "hub-atd", name: "Attabad Lake", region: "Gilgit-Baltistan", coordinates: [36.3350, 74.8680], aliases: ["attabad", "attabad lake"] },
  passu: { id: "hub-psu", name: "Passu Cones", region: "Gilgit-Baltistan", coordinates: [36.4710, 74.8820], aliases: ["passu", "passu cones", "gojal"] },
  sost: { id: "hub-sst", name: "Sost (Dry Port)", region: "Pak-China Border Highway", coordinates: [36.6910, 74.8210], aliases: ["sost", "sust"] },
  khunjerab: { id: "hub-kjb", name: "Khunjerab Pass", region: "Pak-China Border (4,693m)", coordinates: [36.8500, 75.4300], aliases: ["khunjerab", "china border"] },
  skardu: { id: "hub-kdu", name: "Skardu", region: "Baltistan", coordinates: [35.2971, 75.6333], aliases: ["skardu", "baltistan", "shangrila", "deosai"] },
  swat: { id: "hub-swt", name: "Swat (Mingora)", region: "Khyber Pakhtunkhwa", coordinates: [34.7717, 72.3602], aliases: ["swat", "mingora", "saidu sharif"] },
  kalam: { id: "hub-klm", name: "Kalam", region: "Upper Swat Valley", coordinates: [35.4912, 72.5855], aliases: ["kalam", "ushiu", "mahodand"] },
  malamjabba: { id: "hub-mjb", name: "Malam Jabba", region: "Khyber Pakhtunkhwa", coordinates: [34.7990, 72.5710], aliases: ["malam jabba", "malamjabba", "ski"] },
  kumrat: { id: "hub-kmr", name: "Kumrat Valley", region: "Upper Dir", coordinates: [35.5390, 72.2150], aliases: ["kumrat", "kumrat valley", "dir"] },
  chitral: { id: "hub-cht", name: "Chitral", region: "Hindu Kush", coordinates: [35.8510, 71.7864], aliases: ["chitral", "kalash", "ayun", "bumburet"] },
  muzaffarabad: { id: "hub-mzd", name: "Muzaffarabad", region: "Azad Kashmir", coordinates: [34.3597, 73.4711], aliases: ["muzaffarabad", "ajk"] },
  neelum: { id: "hub-nlm", name: "Neelum Valley", region: "Azad Kashmir", coordinates: [34.6610, 73.9520], aliases: ["neelum", "neelum valley", "keran", "sharda", "kashmir"] },
  murree: { id: "hub-mre", name: "Murree", region: "Punjab", coordinates: [33.9062, 73.3903], aliases: ["murree", "mall road", "galyat"] },
  nathiagali: { id: "hub-nth", name: "Nathiagali", region: "Galyat Range", coordinates: [34.0850, 73.3780], aliases: ["nathiagali", "dunga gali", "ayubia"] },
  ziarat: { id: "hub-zrt", name: "Ziarat", region: "Balochistan", coordinates: [30.3824, 67.7256], aliases: ["ziarat", "juniper"] },
  kundmalir: { id: "hub-knm", name: "Kund Malir", region: "Balochistan Coast", coordinates: [25.4890, 65.4580], aliases: ["kund malir", "kundmalir", "hingol"] },
  ormara: { id: "hub-orm", name: "Ormara", region: "Balochistan Coast", coordinates: [25.2100, 64.6320], aliases: ["ormara"] },
  sukkur: { id: "hub-skr", name: "Sukkur", region: "Sindh", coordinates: [27.7052, 68.8574], aliases: ["sukkur"] },
  hyderabad: { id: "hub-hyd", name: "Hyderabad", region: "Sindh", coordinates: [25.3960, 68.3578], aliases: ["hyderabad"] }
};

// Strategic Highway Corridor Polyline Segments
const CORRIDOR_M2 = [
  [31.5497, 74.3436], // Lahore Thokar
  [31.7131, 73.9783], // Sheikhupura
  [31.8950, 73.2700], // Pindi Bhattian (M-3/M-4 Junction)
  [32.2210, 73.1120], // Kot Momin
  [32.4820, 72.9100], // Bhera Rest Area
  [32.7800, 72.7000], // Kallar Kahar
  [32.9300, 72.8600], // Balkassar / Chakwal
  [33.3120, 72.9500], // Sukho / Mandra
  [33.5984, 73.0441], // Rawalpindi
  [33.7294, 73.0931]  // Islamabad
];

const CORRIDOR_KKH = [
  [33.7294, 73.0931], // Islamabad
  [33.8210, 72.8540], // Hasan Abdal
  [33.9980, 72.9320], // Haripur
  [34.1688, 73.2215], // Abbottabad
  [34.3312, 73.1970], // Mansehra
  [34.5420, 73.0120], // Battagram
  [34.7210, 72.9150], // Thakot
  [34.9250, 72.8750], // Besham
  [35.1120, 73.1520], // Pattan
  [35.2910, 73.1780], // Dassu
  [35.5340, 73.8420], // Thor Nullah
  [35.4210, 74.0980], // Chilas
  [35.4830, 74.5980], // Raikot
  [35.5680, 74.6210], // 3 Mountain Junction
  [35.6820, 74.6310], // Jaglot
  [35.9208, 74.3089], // Gilgit
  [36.2110, 74.3410], // Nomal
  [36.3167, 74.6500], // Hunza (Karimabad)
  [36.3350, 74.8680], // Attabad Lake
  [36.4120, 74.8760], // Gulmit
  [36.4710, 74.8820], // Passu Cones
  [36.6910, 74.8210], // Sost
  [36.8500, 75.4300]  // Khunjerab Pass
];

const CORRIDOR_S1 = [
  [35.6820, 74.6310], // Jaglot KKH Junction
  [35.6540, 74.7820], // Alam Bridge
  [35.6210, 75.0210], // Sassi
  [35.5320, 75.2410], // Rondu Gorge
  [35.4810, 75.3520], // Tormik
  [35.4215, 75.4490], // Lower Kachura / Shangrila
  [35.3850, 75.5210], // Upper Kachura Lake
  [35.2971, 75.6333]  // Skardu City
];

const CORRIDOR_N15 = [
  [34.3312, 73.1970], // Mansehra
  [34.5480, 73.3520], // Balakot
  [34.6820, 73.4510], // Mahandri
  [34.7810, 73.5320], // Kaghan
  [34.9080, 73.6520], // Naran
  [35.0350, 73.7620], // Battakundi
  [35.0810, 73.9180], // Lulusar Lake
  [35.1500, 74.0300], // Babusar Top (4,173m)
  [35.3210, 74.0620], // Babusar Village
  [35.4210, 74.0980]  // Chilas (KKH Junction)
];

const CORRIDOR_SWAT_M16 = [
  [33.7294, 73.0931], // Islamabad
  [33.8210, 72.8540], // Hasan Abdal (M-1)
  [34.0520, 72.0310], // Karnal Sher Khan M-1 Interchange
  [34.2210, 72.0450], // Dobian
  [34.3520, 72.0710], // Katlang
  [34.5210, 72.0210], // Palai Twin Tunnels
  [34.6540, 72.0320], // Chakdara
  [34.7210, 72.1850], // Barikot
  [34.7810, 72.3610], // Mingora / Saidu Sharif
  [35.0210, 72.4820], // Khwazakhela
  [35.1420, 72.5320], // Madyan
  [35.2110, 72.5620], // Bahrain
  [35.4912, 72.5855]  // Kalam Valley
];

const CORRIDOR_MAKRAN_N10 = [
  [24.8607, 67.0011], // Karachi
  [25.0320, 66.8820], // Hub
  [25.3210, 66.5810], // Winder
  [25.5520, 66.4320], // Uthal
  [25.5920, 65.9120], // Liari Junction
  [25.4890, 65.4580], // Kund Malir Beach
  [25.5180, 65.5120], // Princess of Hope
  [25.5410, 65.3120], // Buzi Pass
  [25.2100, 64.6320], // Ormara
  [25.2610, 63.4710], // Pasni
  [25.1210, 62.3250]  // Gwadar City
];

const CORRIDOR_M9_M5 = [
  [24.8607, 67.0011], // Karachi
  [25.3960, 68.3578], // Hyderabad
  [26.2483, 68.4096], // Nawabshah / Moro
  [27.7052, 68.8574], // Sukkur
  [28.4212, 70.2989], // Rahim Yar Khan
  [29.3544, 71.6911], // Bahawalpur
  [30.1575, 71.5249]  // Multan
];

function getHaversineDistanceKm(c1, c2) {
  const R = 6371;
  const dLat = (c2[0] - c1[0]) * Math.PI / 180;
  const dLon = (c2[1] - c1[1]) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(c1[0] * Math.PI / 180) * Math.cos(c2[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculatePathDistanceKm(coords) {
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += getHaversineDistanceKm(coords[i], coords[i + 1]);
  }
  return Math.round(total);
}

class PakistanTravelMap {
  constructor(containerId = 'pakistan-map') {
    this.containerId = containerId;
    this.map = null;
    this.tileLayer = null;

    // Separate Layer Groups for rich interactive toggling
    this.destinationsLayer = null;
    this.hotelsLayer = null;
    this.restaurantsLayer = null;
    this.routesLayer = null;
    this.roadMarkersGroup = null;
    this.searchMarkerGroup = null;
    this.cityRouteLayer = null;

    // Markers lookup map for direct popup opening by ID
    this.markersMap = new Map();

    this.activeFilter = 'all';
    this.apiKey = CARTO_CONFIG.apiKey;
    this.style = CARTO_CONFIG.style;
    this.searchQuery = '';
  }

  setApiKey(apiKey) {
    this.apiKey = (apiKey || '').trim();
    CARTO_CONFIG.apiKey = this.apiKey;
    if (this.apiKey) {
      localStorage.setItem('safarnama_carto_api_key', this.apiKey);
    } else {
      localStorage.removeItem('safarnama_carto_api_key');
    }
    if (this.map) {
      this.updateTileLayer();
    }
  }

  setMapStyle(style) {
    this.style = style;
    CARTO_CONFIG.style = style;
    if (this.map) {
      this.updateTileLayer();
    }
  }

  getTileUrl() {
    const baseUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/${this.style}/{z}/{x}/{y}{r}.png`;
    return this.apiKey ? `${baseUrl}?key=${encodeURIComponent(this.apiKey)}` : baseUrl;
  }

  updateTileLayer() {
    if (this.tileLayer && this.map) {
      this.map.removeLayer(this.tileLayer);
    }
    this.tileLayer = L.tileLayer(this.getTileUrl(), {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(this.map);
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container || typeof L === 'undefined') {
      console.warn('Map container or Leaflet library not found.');
      return;
    }

    if (this.map) {
      this.map.remove();
    }

    // Centered on Pakistan
    this.map = L.map(this.containerId, {
      center: [32.5, 71.5],
      zoom: 6,
      minZoom: 5,
      maxZoom: 16,
      zoomControl: false,
      scrollWheelZoom: true
    });

    // Custom Zoom Controls in top-right
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Add CARTO tile layer
    this.updateTileLayer();

    // Initialize Layer Groups
    this.destinationsLayer = L.layerGroup().addTo(this.map);
    this.hotelsLayer = L.layerGroup().addTo(this.map);
    this.restaurantsLayer = L.layerGroup().addTo(this.map);
    this.routesLayer = L.layerGroup().addTo(this.map);
    this.roadMarkersGroup = L.layerGroup().addTo(this.map);
    this.searchMarkerGroup = L.layerGroup().addTo(this.map);
    this.cityRouteLayer = L.layerGroup().addTo(this.map);

    // Initial render of all layers
    this.renderAll();

    // Re-render when state changes
    state.subscribe('road_alerts_changed', () => this.renderRoadAlerts());
    state.subscribe('destinations_changed', () => this.renderDestinations());
    state.subscribe('hotels_changed', () => this.renderHotels());
  }

  renderAll() {
    this.markersMap.clear();
    this.renderDestinations();
    this.renderHotels();
    this.renderRestaurants();
    this.renderRoutes();
    this.renderRoadAlerts();
    this.applyFilter(this.activeFilter);
  }

  setFilter(filterCategory) {
    this.activeFilter = filterCategory;
    this.applyFilter(filterCategory);
  }

  applyFilter(filter) {
    if (!this.map) return;

    // Helper to toggle layer visibility
    const show = (layer) => {
      if (layer && !this.map.hasLayer(layer)) this.map.addLayer(layer);
    };
    const hide = (layer) => {
      if (layer && this.map.hasLayer(layer)) this.map.removeLayer(layer);
    };

    if (filter === 'all') {
      show(this.destinationsLayer);
      show(this.hotelsLayer);
      show(this.restaurantsLayer);
      show(this.routesLayer);
      show(this.roadMarkersGroup);
    } else if (filter === 'destinations') {
      show(this.destinationsLayer);
      hide(this.hotelsLayer);
      hide(this.restaurantsLayer);
      hide(this.routesLayer);
      hide(this.roadMarkersGroup);
    } else if (filter === 'hotels') {
      hide(this.destinationsLayer);
      show(this.hotelsLayer);
      hide(this.restaurantsLayer);
      hide(this.routesLayer);
      hide(this.roadMarkersGroup);
    } else if (filter === 'restaurants') {
      hide(this.destinationsLayer);
      hide(this.hotelsLayer);
      show(this.restaurantsLayer);
      hide(this.routesLayer);
      hide(this.roadMarkersGroup);
    } else if (filter === 'routes') {
      hide(this.destinationsLayer);
      hide(this.hotelsLayer);
      hide(this.restaurantsLayer);
      show(this.routesLayer);
      hide(this.roadMarkersGroup);
    } else if (filter === 'roads') {
      hide(this.destinationsLayer);
      hide(this.hotelsLayer);
      hide(this.restaurantsLayer);
      hide(this.routesLayer);
      show(this.roadMarkersGroup);
    } else if (filter === 'mountains' || filter === 'coastal') {
      show(this.destinationsLayer);
      hide(this.hotelsLayer);
      hide(this.restaurantsLayer);
      hide(this.routesLayer);
      hide(this.roadMarkersGroup);
      this.renderDestinations(); // Filtered internally
    }
  }

  // ─── 1. DESTINATIONS LAYER ────────────────────────────────────────────────
  renderDestinations() {
    if (!this.destinationsLayer) return;
    this.destinationsLayer.clearLayers();

    const destinations = state.destinations || [];
    destinations.forEach(dest => {
      if (this.activeFilter === 'mountains' && !dest.category?.includes('Mountains') && !dest.category?.includes('Trekking')) return;
      if (this.activeFilter === 'coastal' && !dest.category?.includes('Coastal')) return;

      const iconHtml = `
        <div class="map-custom-marker marker-destination">
          <div class="marker-pin"><i class="fa-solid fa-mountain-sun"></i></div>
          <div class="marker-pulse"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const popupContent = `
        <div class="map-popup-card">
          <div class="map-popup-img" style="background-image: url('${dest.heroImage}')">
            <span class="map-popup-badge badge-dest">${dest.region}</span>
          </div>
          <div class="map-popup-body">
            <h4>${dest.name}</h4>
            <p class="map-popup-tagline">${dest.tagline || ''}</p>
            <div class="map-popup-meta">
              <span><i class="fa-solid fa-cloud-sun text-cyan"></i> ${dest.temperature || 'N/A'}</span>
              <span><i class="fa-solid fa-arrows-up-to-line text-gold"></i> ${dest.altitude || 'N/A'}</span>
            </div>
            <div class="map-popup-footer">
              <div class="map-price">From <strong>${state.formatPrice(dest.averageTourPrice || 45000)}</strong></div>
              <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.viewDestination('${dest.id}')">Explore Valley</button>
            </div>
          </div>
        </div>
      `;

      const marker = L.marker(dest.coordinates, { icon: customIcon }).bindPopup(popupContent, {
        maxWidth: 290,
        className: 'safarnama-popup'
      });

      this.destinationsLayer.addLayer(marker);
      this.markersMap.set(`dest-${dest.id}`, { marker, coords: dest.coordinates, layer: 'destinations' });
    });
  }

  // ─── 2. HOTELS & RESORTS LAYER ─────────────────────────────────────────────
  renderHotels() {
    if (!this.hotelsLayer) return;
    this.hotelsLayer.clearLayers();

    const hotels = state.hotels || [];
    hotels.forEach(hotel => {
      // Coordinate fallback from destination if missing
      let coords = hotel.coordinates;
      if (!coords && hotel.destinationId) {
        const d = (state.destinations || []).find(dest => dest.id === hotel.destinationId);
        if (d && d.coordinates) coords = [d.coordinates[0] + 0.015, d.coordinates[1] + 0.015];
      }
      if (!coords) return;

      const iconHtml = `
        <div class="map-custom-marker marker-hotel">
          <div class="marker-pin"><i class="fa-solid fa-hotel"></i></div>
          <div class="marker-pulse-hotel"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-hotel-pin',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const popupContent = `
        <div class="map-popup-card hotel-popup-card">
          <div class="map-popup-img" style="background-image: url('${hotel.image}')">
            <span class="map-popup-badge badge-hotel"><i class="fa-solid fa-star text-gold"></i> ${hotel.rating} (${hotel.reviewsCount})</span>
          </div>
          <div class="map-popup-body">
            <span class="hotel-cat-chip">${hotel.category}</span>
            <h4>${hotel.name}</h4>
            <p class="hotel-location-text"><i class="fa-solid fa-location-dot text-emerald"></i> ${hotel.destinationName}</p>
            <div class="hotel-amenities-pills">
              ${(hotel.amenities || []).slice(0, 3).map(a => `<span>${a}</span>`).join('')}
            </div>
            <div class="map-popup-footer">
              <div class="map-price"><strong>${state.formatPrice(hotel.pricePerNightPKR)}</strong> <small>/night</small></div>
              <button class="btn btn-sm btn-gold" onclick="window.safarnamaApp.openBookingModal('hotel', '${hotel.id}')">Book Stay</button>
            </div>
          </div>
        </div>
      `;

      const marker = L.marker(coords, { icon: customIcon }).bindPopup(popupContent, {
        maxWidth: 300,
        className: 'safarnama-popup'
      });

      this.hotelsLayer.addLayer(marker);
      this.markersMap.set(`hotel-${hotel.id}`, { marker, coords, layer: 'hotels' });
    });
  }

  // ─── 3. RESTAURANTS & DHABAS LAYER ─────────────────────────────────────────
  renderRestaurants() {
    if (!this.restaurantsLayer) return;
    this.restaurantsLayer.clearLayers();

    const restaurants = state.restaurants || [];
    restaurants.forEach(rest => {
      if (!rest.coordinates) return;

      const iconHtml = `
        <div class="map-custom-marker marker-restaurant">
          <div class="marker-pin"><i class="fa-solid fa-utensils"></i></div>
          <div class="marker-pulse-rest"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-rest-pin',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
      });

      const popupContent = `
        <div class="map-popup-card rest-popup-card">
          <div class="map-popup-img" style="background-image: url('${rest.image}')">
            <span class="map-popup-badge badge-rest"><i class="fa-solid fa-fire text-coral"></i> ${rest.cuisine}</span>
          </div>
          <div class="map-popup-body">
            <span class="hotel-cat-chip rest-chip">${rest.category}</span>
            <h4>${rest.name}</h4>
            <p class="rest-specialty"><i class="fa-solid fa-drumstick-bite text-gold"></i> <strong>Must Try:</strong> ${rest.specialty}</p>
            <div class="rest-meta-row">
              <span><i class="fa-solid fa-star text-gold"></i> ${rest.rating} (${rest.reviewsCount})</span>
              <span><i class="fa-regular fa-clock"></i> ${rest.timings}</span>
            </div>
            <div class="map-popup-footer">
              <div class="map-price"><small>${rest.priceRange}</small></div>
              <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.viewRestaurantInfo('${rest.id}')">View Details</button>
            </div>
          </div>
        </div>
      `;

      const marker = L.marker(rest.coordinates, { icon: customIcon }).bindPopup(popupContent, {
        maxWidth: 300,
        className: 'safarnama-popup'
      });

      this.restaurantsLayer.addLayer(marker);
      this.markersMap.set(`rest-${rest.id}`, { marker, coords: rest.coordinates, layer: 'restaurants' });
    });
  }

  // ─── 4. HIGHWAY & SCENIC ROUTES LAYER (POLYLINES) ──────────────────────────
  renderRoutes() {
    if (!this.routesLayer) return;
    this.routesLayer.clearLayers();

    const routes = state.routes || [];
    routes.forEach(route => {
      if (!route.coordinates || route.coordinates.length < 2) return;

      // Outer glow line
      const glowPolyline = L.polyline(route.coordinates, {
        color: route.color || '#10b981',
        weight: 8,
        opacity: 0.35,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Core crisp line
      const corePolyline = L.polyline(route.coordinates, {
        color: route.color || '#10b981',
        weight: 4,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      });

      // Route Popup
      const popupContent = `
        <div class="map-popup-card route-popup-card">
          <div class="route-popup-header" style="border-left: 4px solid ${route.color}">
            <span class="route-code-badge">${route.highwayCode}</span>
            <h4>${route.name}</h4>
          </div>
          <div class="map-popup-body">
            <div class="route-stats-grid">
              <div class="route-stat-box">
                <i class="fa-solid fa-road text-emerald"></i>
                <div><small>Distance</small><strong>${route.distanceKm} km</strong></div>
              </div>
              <div class="route-stat-box">
                <i class="fa-solid fa-clock text-gold"></i>
                <div><small>Drive Time</small><strong>${route.driveTime}</strong></div>
              </div>
            </div>
            <p class="route-desc">${route.description}</p>
            <div class="route-meta-item"><i class="fa-solid fa-car-side text-cyan"></i> <strong>Vehicle:</strong> ${route.suitableVehicles}</div>
            <div class="route-meta-item"><i class="fa-solid fa-circle-check text-emerald"></i> <strong>Status:</strong> ${route.status}</div>
            <div class="route-stops-wrap">
              <small>Key Stops:</small>
              <div class="route-stops-chips">
                ${(route.highlights || []).slice(0, 4).map(h => `<span>${h}</span>`).join('')}
              </div>
            </div>
            <div class="map-popup-footer" style="margin-top: 0.75rem;">
              <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.viewRouteDetails('${route.id}')">View Route Details</button>
            </div>
          </div>
        </div>
      `;

      // Start & End markers
      const startCoord = route.coordinates[0];
      const endCoord = route.coordinates[route.coordinates.length - 1];

      const startIcon = L.divIcon({
        className: 'route-terminal-pin start',
        html: `<div class="terminal-badge start"><i class="fa-solid fa-play"></i> ${route.highwayCode}</div>`,
        iconAnchor: [12, 12]
      });
      const endIcon = L.divIcon({
        className: 'route-terminal-pin end',
        html: `<div class="terminal-badge end"><i class="fa-solid fa-flag-checkered"></i></div>`,
        iconAnchor: [12, 12]
      });

      const startMarker = L.marker(startCoord, { icon: startIcon }).bindPopup(popupContent, { maxWidth: 320, className: 'safarnama-popup' });
      const endMarker = L.marker(endCoord, { icon: endIcon }).bindPopup(popupContent, { maxWidth: 320, className: 'safarnama-popup' });

      corePolyline.bindPopup(popupContent, { maxWidth: 320, className: 'safarnama-popup' });

      // Hover feedback
      corePolyline.on('mouseover', function () {
        this.setStyle({ weight: 6, opacity: 1 });
      });
      corePolyline.on('mouseout', function () {
        this.setStyle({ weight: 4, opacity: 0.95 });
      });

      this.routesLayer.addLayer(glowPolyline);
      this.routesLayer.addLayer(corePolyline);
      this.routesLayer.addLayer(startMarker);
      this.routesLayer.addLayer(endMarker);

      // Midpoint coordinate for zooming to route
      const midIdx = Math.floor(route.coordinates.length / 2);
      this.markersMap.set(`route-${route.id}`, {
        marker: corePolyline,
        coords: route.coordinates[midIdx],
        bounds: L.polyline(route.coordinates).getBounds(),
        layer: 'routes'
      });
    });
  }

  // ─── 5. ROAD ALERTS LAYER (NHMP LIVE STATUS) ──────────────────────────────
  renderRoadAlerts() {
    if (!this.roadMarkersGroup) return;
    this.roadMarkersGroup.clearLayers();

    const roadAlerts = state.roadAlerts || [];
    roadAlerts.forEach(alert => {
      const isOk = alert.statusLevel === 'success';
      const isWarn = alert.statusLevel === 'warning';
      const iconClass = isOk ? 'marker-road-open' : (isWarn ? 'marker-road-warn' : 'marker-road-danger');
      const iconSymbol = isOk ? 'fa-road' : 'fa-triangle-exclamation';

      const iconHtml = `
        <div class="map-custom-marker ${iconClass}">
          <div class="marker-pin"><i class="fa-solid ${iconSymbol}"></i></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-road-pin',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const popupContent = `
        <div class="map-popup-card road-alert-popup">
          <div class="map-road-header ${alert.statusLevel}">
            <i class="fa-solid ${iconSymbol}"></i>
            <span>${alert.status}</span>
          </div>
          <div class="map-popup-body">
            <h4>${alert.highway}</h4>
            <p class="map-road-section"><i class="fa-solid fa-route"></i> ${alert.section}</p>
            <p class="map-road-advisory">${alert.advisory}</p>
            <div class="map-popup-meta">
              <span><i class="fa-solid fa-car-side"></i> ${alert.suitableVehicles}</span>
              <span><i class="fa-solid fa-temperature-half"></i> ${alert.temperature}</span>
            </div>
            <div class="map-road-updated"><i class="fa-regular fa-clock"></i> ${alert.lastUpdated}</div>
          </div>
        </div>
      `;

      const marker = L.marker(alert.coordinates, { icon: customIcon }).bindPopup(popupContent, {
        maxWidth: 290,
        className: 'safarnama-popup'
      });

      this.roadMarkersGroup.addLayer(marker);
      this.markersMap.set(`road-${alert.id}`, { marker, coords: alert.coordinates, layer: 'roads' });
    });
  }

  // ─── 6. CITY-TO-CITY ROUTE PARSER & NAVIGATION ENGINE ─────────────────────
  resolveLocation(query) {
    if (!query) return null;
    const q = (typeof query === 'string' ? query : (query.name || '')).trim().toLowerCase();
    if (!q) return null;

    // 1. Check ROUTE_HUBS
    for (const key of Object.keys(ROUTE_HUBS)) {
      const hub = ROUTE_HUBS[key];
      if (
        key === q ||
        hub.name.toLowerCase() === q ||
        (hub.aliases && hub.aliases.some(a => a === q || q.includes(a) || a.includes(q)))
      ) {
        return {
          id: hub.id,
          name: hub.name,
          region: hub.region,
          coordinates: hub.coordinates,
          type: 'hub'
        };
      }
    }

    // 2. Check Destinations in state
    const dest = (state.destinations || []).find(d => 
      d.name.toLowerCase() === q || 
      d.name.toLowerCase().includes(q) || 
      q.includes(d.name.toLowerCase()) ||
      d.id.toLowerCase() === q
    );
    if (dest) {
      return {
        id: `dest-${dest.id}`,
        name: dest.name,
        region: dest.region,
        coordinates: dest.coordinates,
        type: 'destination'
      };
    }

    // 3. Check PAKISTAN_CITIES
    const city = PAKISTAN_CITIES.find(c => 
      c.name.toLowerCase() === q || 
      c.name.toLowerCase().includes(q) || 
      q.includes(c.name.toLowerCase())
    );
    if (city) {
      return {
        id: `city-${city.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: city.name,
        region: city.region,
        coordinates: city.coordinates,
        type: 'city'
      };
    }

    // 4. Check Hotels
    const hotel = (state.hotels || []).find(h => 
      h.name.toLowerCase().includes(q) || 
      (h.destinationName && h.destinationName.toLowerCase().includes(q))
    );
    if (hotel) {
      return {
        id: `hotel-${hotel.id}`,
        name: hotel.name,
        region: hotel.destinationName,
        coordinates: hotel.coordinates,
        type: 'hotel'
      };
    }

    return null;
  }

  parseCityToCityQuery(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string') return null;
    let q = rawQuery.trim();

    // Strip conversational query prefixes
    q = q.replace(/^(?:directions\s+(?:from\s+)?|route\s+(?:from\s+)?|how\s+to\s+go\s+(?:from\s+)?|travel\s+(?:from\s+)?|drive\s+(?:from\s+)?|go\s+to\s+)/i, '');

    // Check standard separators: "A to B", "A -> B", "A => B", "A - B", "A toward B"
    const separators = [
      /\s+to\s+/i,
      /\s+->\s+/,
      /\s+=>\s+/,
      /\s+-->\s+/,
      /\s+-\s+/,
      /\s+towards?\s+/i,
      /\s+till\s+/i
    ];

    for (const sep of separators) {
      if (sep.test(q)) {
        const parts = q.split(sep);
        if (parts.length >= 2) {
          const originStr = parts[0].replace(/^from\s+/i, '').trim();
          const destStr = parts.slice(1).join(' ').trim();
          if (originStr && destStr && originStr.length >= 2 && destStr.length >= 2) {
            return { origin: originStr, dest: destStr, raw: rawQuery };
          }
        }
      }
    }

    // Check inverted syntax: "go/travel to B from A"
    const invertedMatch = rawQuery.match(/(?:go|travel|drive|ride)\s+to\s+(.+?)\s+from\s+(.+)/i);
    if (invertedMatch && invertedMatch[1] && invertedMatch[2]) {
      return { origin: invertedMatch[2].trim(), dest: invertedMatch[1].trim(), raw: rawQuery };
    }

    return null;
  }

  buildCityRouteCoordinates(origin, dest) {
    const origName = origin.name.toLowerCase();
    const destName = dest.name.toLowerCase();

    // Check if reverse route
    const isOrigLahore = origName.includes('lahore');
    const isOrigIsb = origName.includes('islamabad') || origName.includes('rawalpindi');
    const isDestHunza = destName.includes('hunza') || destName.includes('karimabad') || destName.includes('passu') || destName.includes('khunjerab') || destName.includes('gilgit');
    const isDestSkardu = destName.includes('skardu') || destName.includes('shangrila');
    const isDestSwat = destName.includes('swat') || destName.includes('mingora') || destName.includes('kalam');
    const isDestNaran = destName.includes('naran') || destName.includes('kaghan') || destName.includes('babusar');
    const isKarachiGwadar = (origName.includes('karachi') && destName.includes('gwadar')) || (origName.includes('gwadar') && destName.includes('karachi'));

    // 1. Karachi <-> Gwadar (Makran Coastal Highway N-10)
    if (isKarachiGwadar) {
      const coords = [...CORRIDOR_MAKRAN_N10];
      return origName.includes('gwadar') ? coords.reverse() : coords;
    }

    // 2. Lahore -> Northern Areas
    if (isOrigLahore) {
      if (isDestHunza) {
        // Lahore -> M2 -> Islamabad -> KKH -> Hunza
        const kkhSlice = CORRIDOR_KKH.slice(1); // skip duplicate Islamabad
        return [...CORRIDOR_M2, ...kkhSlice];
      }
      if (isDestSkardu) {
        // Lahore -> M2 -> Islamabad -> KKH to Jaglot (index 14) -> S-1 -> Skardu
        const kkhToJaglot = CORRIDOR_KKH.slice(1, 15);
        const s1Slice = CORRIDOR_S1.slice(1);
        return [...CORRIDOR_M2, ...kkhToJaglot, ...s1Slice];
      }
      if (isDestSwat) {
        // Lahore -> M2 -> Swat Motorway M-16
        const swatSlice = CORRIDOR_SWAT_M16.slice(1);
        return [...CORRIDOR_M2, ...swatSlice];
      }
      if (isDestNaran) {
        // Lahore -> M2 -> Islamabad -> Hazara M-15/KKH to Mansehra (index 5) -> N-15
        const kkhToMansehra = CORRIDOR_KKH.slice(1, 5);
        const n15Slice = CORRIDOR_N15.slice(1);
        return [...CORRIDOR_M2, ...kkhToMansehra, ...n15Slice];
      }
    }

    // 3. Northern Areas -> Lahore (Reversed)
    if (destName.includes('lahore')) {
      if (origName.includes('hunza') || origName.includes('gilgit')) {
        const kkhSlice = CORRIDOR_KKH.slice(1);
        return [...CORRIDOR_M2, ...kkhSlice].reverse();
      }
      if (origName.includes('skardu')) {
        const kkhToJaglot = CORRIDOR_KKH.slice(1, 15);
        const s1Slice = CORRIDOR_S1.slice(1);
        return [...CORRIDOR_M2, ...kkhToJaglot, ...s1Slice].reverse();
      }
      if (origName.includes('swat') || origName.includes('kalam')) {
        const swatSlice = CORRIDOR_SWAT_M16.slice(1);
        return [...CORRIDOR_M2, ...swatSlice].reverse();
      }
      if (origName.includes('naran')) {
        const kkhToMansehra = CORRIDOR_KKH.slice(1, 5);
        const n15Slice = CORRIDOR_N15.slice(1);
        return [...CORRIDOR_M2, ...kkhToMansehra, ...n15Slice].reverse();
      }
    }

    // 4. Islamabad/Rawalpindi -> Northern Areas
    if (isOrigIsb) {
      if (isDestHunza) {
        return [...CORRIDOR_KKH];
      }
      if (isDestSkardu) {
        const kkhToJaglot = CORRIDOR_KKH.slice(0, 15);
        const s1Slice = CORRIDOR_S1.slice(1);
        return [...kkhToJaglot, ...s1Slice];
      }
      if (isDestSwat) {
        return [...CORRIDOR_SWAT_M16];
      }
      if (isDestNaran) {
        const kkhToMansehra = CORRIDOR_KKH.slice(0, 5);
        const n15Slice = CORRIDOR_N15.slice(1);
        return [...kkhToMansehra, ...n15Slice];
      }
      if (destName.includes('lahore')) {
        return [...CORRIDOR_M2].reverse();
      }
    }

    // 5. Northern Areas -> Islamabad (Reversed)
    if (destName.includes('islamabad') || destName.includes('rawalpindi')) {
      if (isDestHunza || origName.includes('hunza') || origName.includes('gilgit')) {
        return [...CORRIDOR_KKH].reverse();
      }
      if (origName.includes('skardu')) {
        const kkhToJaglot = CORRIDOR_KKH.slice(0, 15);
        const s1Slice = CORRIDOR_S1.slice(1);
        return [...kkhToJaglot, ...s1Slice].reverse();
      }
      if (origName.includes('swat') || origName.includes('kalam')) {
        return [...CORRIDOR_SWAT_M16].reverse();
      }
      if (origName.includes('naran')) {
        const kkhToMansehra = CORRIDOR_KKH.slice(0, 5);
        const n15Slice = CORRIDOR_N15.slice(1);
        return [...kkhToMansehra, ...n15Slice].reverse();
      }
      if (origName.includes('lahore')) {
        return [...CORRIDOR_M2];
      }
    }

    // 6. Generic Curved Road Interpolation with Topographic Realism
    const c1 = origin.coordinates;
    const c2 = dest.coordinates;
    const coords = [c1];

    const numPoints = 8;
    const dLat = (c2[0] - c1[0]);
    const dLon = (c2[1] - c1[1]);
    const normalLat = -dLon * 0.08;
    const normalLon = dLat * 0.08;

    for (let i = 1; i < numPoints; i++) {
      const t = i / numPoints;
      // Natural highway sin curvature
      const curveFactor = Math.sin(t * Math.PI) * (i % 2 === 0 ? 1 : -0.7);
      const lat = c1[0] + dLat * t + normalLat * curveFactor;
      const lon = c1[1] + dLon * t + normalLon * curveFactor;
      coords.push([parseFloat(lat.toFixed(4)), parseFloat(lon.toFixed(4))]);
    }

    coords.push(c2);
    return coords;
  }

  getCityRouteEstimate(origin, dest, routeCoords = null) {
    const coords = routeCoords || this.buildCityRouteCoordinates(origin, dest);
    let distanceKm = calculatePathDistanceKm(coords);

    const origLow = origin.name.toLowerCase();
    const destLow = dest.name.toLowerCase();

    // Check mountainous topography
    const isMountain = (origin.region && (origin.region.includes('Gilgit') || origin.region.includes('Baltistan') || origin.region.includes('Kashmir') || origin.region.includes('KPK') || origin.region.includes('Khyber'))) ||
                       (dest.region && (dest.region.includes('Gilgit') || dest.region.includes('Baltistan') || dest.region.includes('Kashmir') || dest.region.includes('KPK') || dest.region.includes('Khyber'))) ||
                       origLow.includes('hunza') || origLow.includes('skardu') || origLow.includes('gilgit') || origLow.includes('swat') || origLow.includes('kalam') || origLow.includes('naran') ||
                       destLow.includes('hunza') || destLow.includes('skardu') || destLow.includes('gilgit') || destLow.includes('swat') || destLow.includes('kalam') || destLow.includes('naran') || destLow.includes('chitral') || destLow.includes('murree');

    const isOrigLhr = origLow.includes('lahore');
    const isOrigIsb = origLow.includes('islamabad') || origLow.includes('rawalpindi');
    const isDestHunza = destLow.includes('hunza') || destLow.includes('karimabad') || destLow.includes('gilgit');
    const isDestSkardu = destLow.includes('skardu');
    const isDestSwat = destLow.includes('swat') || destLow.includes('mingora');
    const isDestKalam = destLow.includes('kalam');
    const isDestNaran = destLow.includes('naran') || destLow.includes('kaghan');
    const isKarachiGwadar = (origLow.includes('karachi') && destLow.includes('gwadar')) || (origLow.includes('gwadar') && destLow.includes('karachi'));

    // Calibrated NHMP official highway distances & realistic drive times
    let officialDistance = null;
    let officialDriveTime = null;

    if (isKarachiGwadar) {
      officialDistance = 653;
      officialDriveTime = '7.5 – 9 Hours';
    } else if ((isOrigLhr && isDestHunza) || (origLow.includes('hunza') && destLow.includes('lahore'))) {
      officialDistance = 985;
      officialDriveTime = '17 – 19 Hours';
    } else if ((isOrigIsb && isDestHunza) || (origLow.includes('hunza') && destLow.includes('islamabad'))) {
      officialDistance = 610;
      officialDriveTime = '13 – 15 Hours';
    } else if ((isOrigLhr && isDestSkardu) || (origLow.includes('skardu') && destLow.includes('lahore'))) {
      officialDistance = 1010;
      officialDriveTime = '18 – 20 Hours';
    } else if ((isOrigIsb && isDestSkardu) || (origLow.includes('skardu') && destLow.includes('islamabad'))) {
      officialDistance = 640;
      officialDriveTime = '13 – 15 Hours';
    } else if ((isOrigIsb && isDestKalam) || (origLow.includes('kalam') && destLow.includes('islamabad'))) {
      officialDistance = 320;
      officialDriveTime = '5.5 – 6.5 Hours';
    } else if ((isOrigIsb && isDestSwat) || (origLow.includes('swat') && destLow.includes('islamabad'))) {
      officialDistance = 245;
      officialDriveTime = '3.5 – 4.5 Hours';
    } else if ((isOrigLhr && isDestSwat) || (origLow.includes('swat') && destLow.includes('lahore'))) {
      officialDistance = 590;
      officialDriveTime = '7.5 – 8.5 Hours';
    } else if ((isOrigIsb && isDestNaran) || (origLow.includes('naran') && destLow.includes('islamabad'))) {
      officialDistance = 280;
      officialDriveTime = '5 – 6 Hours';
    } else if ((isOrigLhr && isDestNaran) || (origLow.includes('naran') && destLow.includes('lahore'))) {
      officialDistance = 530;
      officialDriveTime = '8 – 9 Hours';
    }

    if (officialDistance) {
      distanceKm = officialDistance;
    } else {
      distanceKm = Math.round(distanceKm * (isMountain ? 1.32 : 1.18));
    }

    const driveTimeString = officialDriveTime || (() => {
      const avgSpeed = isMountain ? 46 : 80;
      const rawHours = distanceKm / avgSpeed;
      const minHours = Math.max(1, Math.floor(rawHours * 0.95));
      const maxHours = Math.max(2, Math.ceil(rawHours * 1.15));
      return `${minHours} – ${maxHours} Hours`;
    })();

    // Highway Corridor naming
    let corridor = 'National Highway Network';
    let elevation = 'Valley / Plains Elevation';
    let advisory = 'Paved all-weather route. Sedans & family vehicles suitable.';

    if ((origLow.includes('lahore') || origLow.includes('islamabad')) && (destLow.includes('hunza') || destLow.includes('gilgit'))) {
      corridor = origLow.includes('lahore') 
        ? 'M-2 Motorway ➔ Hazara Expressway (M-15) ➔ Karakoram Highway (N-35)'
        : 'Hazara Expressway (M-15) ➔ Karakoram Highway (N-35)';
      elevation = 'KKH (2,500m) • Rakaposhi Viewpoint • Hunza (2,438m)';
      advisory = 'All Sedans, Hatchbacks, Coasters & 4x4s. Night driving caution through Kohistan.';
    } else if (destLow.includes('skardu') || origLow.includes('skardu')) {
      corridor = origLow.includes('lahore')
        ? 'M-2 Motorway ➔ M-15 ➔ KKH (N-35) ➔ Jaglot-Skardu Expressway (S-1)'
        : 'Hazara Expressway (M-15) ➔ KKH (N-35) ➔ Jaglot-Skardu Expressway (S-1)';
      elevation = 'Alam Bridge • Rondu Gorge • Katpana Desert • Skardu (2,228m)';
      advisory = 'Carpeted 2-lane S-1 Expressway open year-round. All sedans can travel to Skardu.';
    } else if (destLow.includes('swat') || destLow.includes('kalam') || origLow.includes('swat')) {
      corridor = origLow.includes('lahore')
        ? 'M-2 Motorway ➔ M-1 ➔ Swat Motorway (M-16) ➔ N-95 Kalam Road'
        : 'M-1 Motorway ➔ Swat Motorway (M-16) ➔ N-95 Kalam Road';
      elevation = 'Palai Tunnels • Chakdara • Mingora (984m) • Kalam (2,000m)';
      advisory = 'Fast motorway to Chakdara; carpeted to Kalam. 4x4 required for Mahodand Lake only.';
    } else if (destLow.includes('naran') || destLow.includes('babusar') || origLow.includes('naran')) {
      corridor = origLow.includes('lahore')
        ? 'M-2 Motorway ➔ Hazara Expressway (M-15) ➔ N-15 Kaghan Highway'
        : 'Hazara Expressway (M-15) ➔ N-15 Kaghan Highway ➔ Babusar Pass';
      elevation = 'Balakot • Kunhar River • Naran (2,409m) • Babusar Top (4,173m)';
      advisory = 'Naran open spring/summer. Babusar Top open June to October daylight only.';
    } else if (destLow.includes('gwadar') || origLow.includes('gwadar')) {
      corridor = 'Makran Coastal Highway (N-10)';
      elevation = 'Arabian Sea Shoreline • Buzi Pass (320m) • Kund Malir';
      advisory = 'Flawless scenic asphalt along the Arabian Sea. Fuel up at Hub & Ormara.';
    }

    return {
      distanceKm,
      driveTime: driveTimeString,
      highwayCorridor: corridor,
      elevationHighlight: elevation,
      vehicleAdvisory: advisory
    };
  }

  planCityToCityRoute(originInput, destInput) {
    if (!this.map) return { success: false, error: 'Map not initialized' };

    const origin = this.resolveLocation(originInput);
    const dest = this.resolveLocation(destInput);

    if (!origin) {
      if (window.safarnamaApp) {
        window.safarnamaApp.showToast({
          title: 'Origin Not Found',
          message: `Could not pinpoint origin "${typeof originInput === 'string' ? originInput : 'location'}". Try Lahore, Islamabad, or Karachi.`,
          type: 'road'
        });
      }
      return { success: false, error: 'Origin not resolved' };
    }

    if (!dest) {
      if (window.safarnamaApp) {
        window.safarnamaApp.showToast({
          title: 'Destination Not Found',
          message: `Could not pinpoint destination "${typeof destInput === 'string' ? destInput : 'location'}". Try Hunza, Skardu, Swat, or Naran.`,
          type: 'road'
        });
      }
      return { success: false, error: 'Destination not resolved' };
    }

    // 1. Clear previous city route layers
    if (this.cityRouteLayer) {
      this.cityRouteLayer.clearLayers();
    } else {
      this.cityRouteLayer = L.layerGroup().addTo(this.map);
    }

    // 2. Build coordinates and estimate
    const coords = this.buildCityRouteCoordinates(origin, dest);
    const estimate = this.getCityRouteEstimate(origin, dest, coords);

    // 3. Draw Highway Polylines
    // Background Wide Glow Casing
    L.polyline(coords, {
      color: '#064e3b',
      weight: 9,
      opacity: 0.65,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.cityRouteLayer);

    // Foreground Glowing Animated Dashed Line
    const activeRouteLine = L.polyline(coords, {
      color: '#10b981',
      weight: 4.5,
      opacity: 0.95,
      dashArray: '10, 10',
      className: 'animated-route-line',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(this.cityRouteLayer);

    // 4. Custom Origin Marker (Point A)
    const originIcon = L.divIcon({
      className: 'custom-route-endpoint origin-pin',
      html: `
        <div class="route-marker-pill origin">
          <span class="route-pin-letter">A</span>
          <span class="route-pin-label">${origin.name}</span>
          <div class="route-pulse-ring origin-ring"></div>
        </div>
      `,
      iconSize: [120, 36],
      iconAnchor: [20, 36]
    });

    const originPopup = `
      <div class="map-popup-card route-endpoint-popup">
        <div class="map-road-header" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">
          <i class="fa-solid fa-circle-dot"></i>
          <span>Origin Departure Point</span>
        </div>
        <div class="map-popup-body">
          <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 1.05rem;">${origin.name}</h4>
          <p style="margin: 0; color: #94a3b8; font-size: 0.85rem;">${origin.region || 'Pakistan Hub'}</p>
          <div style="margin-top: 10px; font-size: 0.82rem; color: #cbd5e1; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px;">
            <i class="fa-solid fa-road text-emerald"></i> Heading toward <strong>${dest.name}</strong>
          </div>
        </div>
      </div>
    `;

    L.marker(origin.coordinates, { icon: originIcon })
      .bindPopup(originPopup, { maxWidth: 280, className: 'safarnama-popup' })
      .addTo(this.cityRouteLayer);

    // 5. Custom Destination Marker (Point B)
    const destIcon = L.divIcon({
      className: 'custom-route-endpoint dest-pin',
      html: `
        <div class="route-marker-pill dest">
          <span class="route-pin-letter"><i class="fa-solid fa-flag-checkered"></i></span>
          <span class="route-pin-label">${dest.name}</span>
          <div class="route-pulse-ring dest-ring"></div>
        </div>
      `,
      iconSize: [120, 36],
      iconAnchor: [20, 36]
    });

    const destPopup = `
      <div class="map-popup-card route-endpoint-popup">
        <div class="map-road-header" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">
          <i class="fa-solid fa-flag-checkered"></i>
          <span>Destination Arrival</span>
        </div>
        <div class="map-popup-body">
          <h4 style="margin: 0 0 4px 0; color: #fff; font-size: 1.05rem;">${dest.name}</h4>
          <p style="margin: 0; color: #94a3b8; font-size: 0.85rem;">${dest.region || 'Scenic Destination'}</p>
          <div style="margin-top: 10px; font-size: 0.82rem; color: #cbd5e1; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 8px;">
            <div><i class="fa-solid fa-clock text-gold"></i> Est. Drive Time: <strong>${estimate.driveTime}</strong></div>
            <div style="margin-top: 4px;"><i class="fa-solid fa-mountain text-glacier"></i> <strong>${estimate.elevationHighlight}</strong></div>
          </div>
          <button class="btn btn-sm btn-emerald btn-full" style="margin-top: 10px;" onclick="window.safarnamaApp.planAIWithRoute('${origin.name}', '${dest.name}')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Plan Trip with SafarAI
          </button>
        </div>
      </div>
    `;

    const destMarker = L.marker(dest.coordinates, { icon: destIcon })
      .bindPopup(destPopup, { maxWidth: 300, className: 'safarnama-popup' })
      .addTo(this.cityRouteLayer);

    // 6. Fit Map Bounds
    const bounds = L.latLngBounds(coords);
    this.map.flyToBounds(bounds, { padding: [60, 60], duration: 1.5, easeLinearity: 0.25 });

    // 7. Render Floating Route Summary Card in DOM
    this.renderFloatingRouteSummary(origin, dest, estimate);

    // Open destination popup after camera animation
    setTimeout(() => {
      destMarker.openPopup();
    }, 1600);

    return { success: true, origin, dest, estimate };
  }

  renderFloatingRouteSummary(origin, dest, estimate) {
    const mount = document.getElementById('map-route-summary-mount');
    if (!mount) return;

    mount.innerHTML = `
      <div class="map-route-summary-floating-card animate-fade-in">
        <div class="summary-header">
          <div class="summary-title-col">
            <span class="summary-badge"><i class="fa-solid fa-diamond-turn-right"></i> Active City Route</span>
            <h3 class="summary-title">${origin.name} ➔ ${dest.name}</h3>
          </div>
          <button type="button" class="summary-close-btn" onclick="window.safarnamaApp.clearCityRoute()" title="Close Route">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div class="summary-metrics-grid">
          <div class="metric-box">
            <i class="fa-solid fa-road text-emerald"></i>
            <div class="metric-meta">
              <span class="metric-val">${estimate.distanceKm} km</span>
              <span class="metric-sub">Distance</span>
            </div>
          </div>
          <div class="metric-box">
            <i class="fa-solid fa-clock text-gold"></i>
            <div class="metric-meta">
              <span class="metric-val">${estimate.driveTime}</span>
              <span class="metric-sub">Drive Time</span>
            </div>
          </div>
          <div class="metric-box">
            <i class="fa-solid fa-mountain text-glacier"></i>
            <div class="metric-meta">
              <span class="metric-val">${estimate.elevationHighlight.split('•')[0] || 'Scenic Pass'}</span>
              <span class="metric-sub">Elevation</span>
            </div>
          </div>
        </div>

        <div class="summary-corridor-row">
          <i class="fa-solid fa-signs-post text-emerald"></i>
          <span><strong>Highway:</strong> ${estimate.highwayCorridor}</span>
        </div>

        <div class="summary-advisory-row">
          <i class="fa-solid fa-shield-halved text-gold"></i>
          <span><strong>Advisory:</strong> ${estimate.vehicleAdvisory}</span>
        </div>

        <div class="summary-actions-row">
          <button type="button" class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.planAIWithRoute('${origin.name}', '${dest.name}')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Plan Itinerary with SafarAI
          </button>
          <button type="button" class="btn btn-sm btn-ghost" onclick="window.safarnamaApp.clearCityRoute()">
            <i class="fa-solid fa-trash-can"></i> Clear Route
          </button>
        </div>
      </div>
    `;
  }

  clearCityRoute() {
    if (this.cityRouteLayer) {
      this.cityRouteLayer.clearLayers();
    }
    const mount = document.getElementById('map-route-summary-mount');
    if (mount) {
      mount.innerHTML = '';
    }
  }

  // ─── 7. UNIFIED MAP SEARCH ACROSS ALL ENTITIES & ROUTES ─────────────────────
  searchLocations(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];

    const results = [];

    // 0. Check City-to-City Route Query (e.g. "Lahore to Hunza", "Islamabad to Skardu")
    const routeMatch = this.parseCityToCityQuery(q);
    if (routeMatch) {
      const origLoc = this.resolveLocation(routeMatch.origin);
      const destLoc = this.resolveLocation(routeMatch.dest);
      if (origLoc && destLoc) {
        const estimate = this.getCityRouteEstimate(origLoc, destLoc);
        results.push({
          id: `city-route-${origLoc.id}-${destLoc.id}`,
          type: 'city_to_city_route',
          title: `${origLoc.name} ➔ ${destLoc.name}`,
          subtitle: `${estimate.highwayCorridor} • ${estimate.distanceKm} km • ${estimate.driveTime}`,
          badge: 'City Route',
          icon: 'fa-diamond-turn-right',
          origin: origLoc,
          dest: destLoc,
          coordinates: origLoc.coordinates
        });
      }
    }

    // Search Destinations
    (state.destinations || []).forEach(d => {
      if (
        d.name.toLowerCase().includes(q) ||
        d.region?.toLowerCase().includes(q) ||
        d.tagline?.toLowerCase().includes(q) ||
        (d.highlights || []).some(h => h.toLowerCase().includes(q))
      ) {
        results.push({
          id: `dest-${d.id}`,
          type: 'destination',
          title: d.name,
          subtitle: `${d.region} • ${d.altitude || 'Mountain Valley'}`,
          badge: 'Destination',
          icon: 'fa-mountain-sun',
          coordinates: d.coordinates
        });
      }
    });

    // Search Hotels
    (state.hotels || []).forEach(h => {
      if (
        h.name.toLowerCase().includes(q) ||
        h.destinationName?.toLowerCase().includes(q) ||
        h.category?.toLowerCase().includes(q)
      ) {
        results.push({
          id: `hotel-${h.id}`,
          type: 'hotel',
          title: h.name,
          subtitle: `${h.destinationName} • ${state.formatPrice(h.pricePerNightPKR)}/night`,
          badge: 'Hotel / Resort',
          icon: 'fa-hotel',
          coordinates: h.coordinates
        });
      }
    });

    // Search Restaurants & Dhabas
    (state.restaurants || []).forEach(r => {
      if (
        r.name.toLowerCase().includes(q) ||
        r.city?.toLowerCase().includes(q) ||
        r.cuisine?.toLowerCase().includes(q) ||
        r.specialty?.toLowerCase().includes(q)
      ) {
        results.push({
          id: `rest-${r.id}`,
          type: 'restaurant',
          title: r.name,
          subtitle: `${r.city} • ${r.specialty}`,
          badge: 'Restaurant',
          icon: 'fa-utensils',
          coordinates: r.coordinates
        });
      }
    });

    // Search Routes
    (state.routes || []).forEach(rt => {
      if (
        rt.name.toLowerCase().includes(q) ||
        rt.highwayCode.toLowerCase().includes(q) ||
        rt.shortName.toLowerCase().includes(q) ||
        (rt.highlights || []).some(h => h.toLowerCase().includes(q))
      ) {
        results.push({
          id: `route-${rt.id}`,
          type: 'route',
          title: rt.name,
          subtitle: `${rt.highwayCode} • ${rt.distanceKm} km • ${rt.driveTime}`,
          badge: 'Scenic Route',
          icon: 'fa-route',
          coordinates: rt.coordinates[Math.floor(rt.coordinates.length / 2)]
        });
      }
    });

    // Search Road Alerts
    (state.roadAlerts || []).forEach(ra => {
      if (
        ra.highway.toLowerCase().includes(q) ||
        ra.section.toLowerCase().includes(q) ||
        ra.status.toLowerCase().includes(q)
      ) {
        results.push({
          id: `road-${ra.id}`,
          type: 'road',
          title: `${ra.highway} (${ra.status})`,
          subtitle: ra.section,
          badge: 'Road Alert',
          icon: 'fa-triangle-exclamation',
          coordinates: ra.coordinates
        });
      }
    });

    // Search Major Pakistani Cities / Hubs
    PAKISTAN_CITIES.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)) {
        if (!results.some(r => r.title.toLowerCase() === c.name.toLowerCase())) {
          results.push({
            id: `city-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
            type: 'city',
            title: c.name,
            subtitle: `${c.region} • ${c.desc}`,
            badge: 'City / Hub',
            icon: 'fa-city',
            coordinates: c.coordinates
          });
        }
      }
    });

    return results.slice(0, 10);
  }

  // ─── 8. FOCUS LOCATION / SELECT SEARCH RESULT ──────────────────────────────
  selectSearchResult(item) {
    if (!this.map || !item) return;

    // Handle City-to-City Route directly
    if (item.type === 'city_to_city_route') {
      this.planCityToCityRoute(item.origin, item.dest);
      return;
    }

    if (!item.coordinates) return;

    // Clear previous search marker
    if (this.searchMarkerGroup) {
      this.searchMarkerGroup.clearLayers();
    }

    const coords = item.coordinates;
    const entry = this.markersMap.get(item.id);

    if (entry) {
      if (this.activeFilter !== 'all' && this.activeFilter !== entry.layer) {
        this.setFilter('all');
        document.querySelectorAll('.map-pill').forEach(p => p.classList.remove('active'));
        const allPill = document.querySelector('.map-pill[data-filter="all"]');
        if (allPill) allPill.classList.add('active');
      }

      if (item.type === 'route' && entry.bounds) {
        this.map.flyToBounds(entry.bounds, { padding: [50, 50], duration: 1.5 });
      } else {
        this.map.flyTo(coords, 11, { duration: 1.5, easeLinearity: 0.25 });
      }

      setTimeout(() => {
        if (entry.marker && typeof entry.marker.openPopup === 'function') {
          entry.marker.openPopup();
        }
      }, 1600);
    } else {
      this.map.flyTo(coords, 10, { duration: 1.5 });

      const searchIcon = L.divIcon({
        className: 'custom-search-pin',
        html: `
          <div class="map-custom-marker marker-search">
            <div class="marker-pin search-pin"><i class="fa-solid fa-location-crosshairs"></i></div>
            <div class="marker-pulse-search"></div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      const cityPopup = `
        <div class="map-popup-card city-search-popup">
          <div class="map-road-header success">
            <i class="fa-solid fa-location-dot"></i>
            <span>${item.title}</span>
          </div>
          <div class="map-popup-body">
            <p>${item.subtitle}</p>
            <div class="map-popup-footer" style="margin-top: 0.75rem;">
              <button class="btn btn-sm btn-emerald" onclick="window.safarnamaApp.navigateTo('tours')">Browse Tours Here</button>
            </div>
          </div>
        </div>
      `;

      const sm = L.marker(coords, { icon: searchIcon }).bindPopup(cityPopup, { maxWidth: 260, className: 'safarnama-popup' });
      this.searchMarkerGroup.addLayer(sm);

      setTimeout(() => {
        sm.openPopup();
      }, 1600);
    }
  }

  flyTo(coords, zoomLevel = 9) {
    if (this.map && coords) {
      this.map.flyTo(coords, zoomLevel, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }
}

export const travelMap = new PakistanTravelMap();
