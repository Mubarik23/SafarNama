/**
 * SafarNama PK - Real-Time Northern Road Conditions & Weather Status
 * Real-time monitoring for Karakoram Highway (KKH), Babusar Pass, Jaglot-Skardu Road, Lowari Tunnel, etc.
 */

export const INITIAL_ROAD_ALERTS = [
  {
    id: "road-kkh-main",
    highway: "N-35 Karakoram Highway (KKH)",
    section: "Islamabad - Mansehra - Besham - Chilas - Gilgit - Hunza - Khunjerab",
    status: "OPEN",
    statusLevel: "success", // success, warning, danger, info
    weather: "Clear / Sunny",
    temperature: "16°C",
    lastUpdated: "Just now (Verified by NHMP Sector 14)",
    advisory: "Road surface completely clear. Smooth transit throughout Hazara Motorway and Gilgit-Hunza sections.",
    suitableVehicles: "All vehicles (Cars, Hiace, Coaster, Buses)",
    coordinates: [35.9208, 74.3080]
  },
  {
    id: "road-babusar-pass",
    highway: "N-15 Babusar Pass (4,173m)",
    section: "Naran - Jalkhad - Babusar Top - Chilas Junction",
    status: "OPEN (Daylight 6 AM - 6 PM)",
    statusLevel: "success",
    weather: "Cool Breeze / Crisp",
    temperature: "6°C",
    lastUpdated: "35 mins ago",
    advisory: "Babusar Summit is open for light and heavy traffic during daylight hours. High altitude precautions recommended.",
    suitableVehicles: "Cars, SUVs, Hiace (Not recommended for low-clearance sports cars)",
    coordinates: [35.1481, 74.0483]
  },
  {
    id: "road-jaglot-skardu",
    highway: "S-1 Jaglot-Skardu Expressway",
    section: "Jaglot KKH Junction - Indus Gorge - Skardu City",
    status: "OPEN (Smooth Traffic)",
    statusLevel: "success",
    weather: "Partly Cloudy",
    temperature: "14°C",
    lastUpdated: "12 mins ago",
    advisory: "New double-carpeted expressway operational. Average transit time from Gilgit/Jaglot to Skardu is ~3.5 hours.",
    suitableVehicles: "All vehicles and Luxury Coasters",
    coordinates: [35.5684, 75.0125]
  },
  {
    id: "road-murree-expressway",
    highway: "N-75 Murree Expressway / Galyat",
    section: "Islamabad Toll Plaza - Murree - Nathia Gali - Abbottabad",
    status: "OPEN (Patrolled)",
    statusLevel: "success",
    weather: "Pleasant / Foggy in Galyat",
    temperature: "12°C",
    lastUpdated: "5 mins ago",
    advisory: "Traffic moving smoothly. NHMP teams active at Mall Road entry and Patriata bifurcation.",
    suitableVehicles: "All vehicle types",
    coordinates: [33.9070, 73.3903]
  },
  {
    id: "road-swat-malam-kalam",
    highway: "M-16 Swat Motorway & N-95",
    section: "Colonel Sher Khan Interchange - Chakdara - Mingora - Bahrain - Kalam",
    status: "OPEN",
    statusLevel: "success",
    weather: "Clear Skies",
    temperature: "19°C",
    lastUpdated: "1 hour ago",
    advisory: "Swat Motorway clear up to Chakdara. Road to Kalam paved and open. Mahodand Lake jeep track open.",
    suitableVehicles: "Cars to Kalam; 4x4 for Mahodand Lake",
    coordinates: [35.2227, 72.4258]
  },
  {
    id: "road-fairy-meadows-jeep",
    highway: "Raikot-Tato Offroad Jeep Track",
    section: "Raikot Bridge KKH - Tato Village - Fairy Meadows Trek",
    status: "4x4 MOUNTAIN JEEP ONLY",
    statusLevel: "warning",
    weather: "Cool / Windy",
    temperature: "8°C",
    lastUpdated: "20 mins ago",
    advisory: "Cliffside gravel track active with local driver union jeeps. 3-hour trek from Tato to Fairy Meadows in good condition.",
    suitableVehicles: "Local 4x4 Willy/Tato Jeeps only + Hiking on foot",
    coordinates: [35.3853, 74.5806]
  },
  {
    id: "road-coastal-highway",
    highway: "N-10 Makran Coastal Highway",
    section: "Karachi - Zero Point - Kund Malir - Ormara - Pasni - Gwadar",
    status: "EXCELLENT CONDITION",
    statusLevel: "success",
    weather: "Sunny Sea Breeze",
    temperature: "27°C",
    lastUpdated: "40 mins ago",
    advisory: "Flawless asphalt highway. Ensure adequate fuel refueling at Winder / Ormara PSO stations.",
    suitableVehicles: "All standard cars, luxury coasters, and motorbikes",
    coordinates: [25.3783, 64.2882]
  }
];
