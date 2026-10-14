/**
 * SafarNama PK - Curated Pakistan Highway Routes & Scenic Expeditions Dataset
 * Real polyline coordinates, driving times, road statuses, and vehicle recommendations
 */

export const INITIAL_ROUTES = [
  {
    id: "route-kkh-n35",
    name: "Karakoram Highway (KKH / N-35)",
    shortName: "KKH N-35 (Friendship Highway)",
    highwayCode: "N-35",
    color: "#10b981", // Emerald Green
    type: "All-Weather National Highway",
    startPoint: "Islamabad / Hasan Abdal",
    endPoint: "Khunjerab Pass (Pak-China Border)",
    distanceKm: 806,
    driveTime: "14 to 18 Hours",
    status: "OPEN (Pristine Carpeted Road)",
    suitableVehicles: "All Sedans, Hatchbacks, Vans & 4x4s",
    altitudeMax: "4,693 m (Khunjerab Pass)",
    description: "Known as the Eighth Wonder of the World, carving through the meeting point of Karakoram, Himalayas, and Hindu Kush alongside the Indus and Hunza rivers.",
    highlights: ["Abbottabad Pine Hills", "Besham Indus River Gorge", "Nanga Parbat Viewpoint", "Three Mountain Ranges Junction", "Hunza Valley", "Passu Cones", "Khunjerab Pass"],
    coordinates: [
      [33.7294, 73.0931], // Islamabad
      [33.8210, 72.8540], // Hasan Abdal
      [33.9980, 72.9320], // Haripur
      [34.1688, 73.2215], // Abbottabad
      [34.3312, 73.1970], // Mansehra
      [34.5420, 73.0120], // Battagram
      [34.7210, 72.9150], // Thakot Bridge (Indus River)
      [34.9250, 72.8750], // Besham
      [35.1120, 73.1520], // Pattan
      [35.2910, 73.1780], // Dassu / Kohistan
      [35.5340, 73.8420], // Thor Nullah
      [35.4210, 74.0980], // Chilas
      [35.4830, 74.5980], // Raikot Bridge (Fairy Meadows entrance)
      [35.5680, 74.6210], // Nanga Parbat Viewpoint & 3 Mountain Ranges Junction
      [35.6820, 74.6310], // Jaglot (Skardu turnoff)
      [35.9208, 74.3089], // Gilgit
      [36.2110, 74.3410], // Nomal / Naltar entrance
      [36.3167, 74.6500], // Aliabad / Karimabad (Hunza)
      [36.3350, 74.8680], // Attabad Lake & KKH Tunnels
      [36.4120, 74.8760], // Gulmit
      [36.4710, 74.8820], // Passu Cones & Glacier
      [36.6910, 74.8210], // Sost (Dry Port / Customs)
      [36.8500, 75.4300]  // Khunjerab Pass (Pak-China Border)
    ]
  },
  {
    id: "route-babusar-n15",
    name: "Naran & Babusar Pass Highway (N-15)",
    shortName: "N-15 Babusar Valley Route",
    highwayCode: "N-15",
    color: "#f59e0b", // Warm Amber
    type: "High-Altitude Scenic Mountain Route",
    startPoint: "Mansehra / Balakot",
    endPoint: "Chilas (KKH Reconnection)",
    distanceKm: 240,
    driveTime: "6 to 8 Hours",
    status: "SEASONAL (Open June to late October; Daytime only)",
    suitableVehicles: "All Cars (Sedans & 4x4s) during summer daylight",
    altitudeMax: "4,173 m (Babusar Top)",
    description: "The breathtaking shortcut to Gilgit-Baltistan through the lush Kaghan Valley, Kunhar River, turquoise Lulusar Lake, and across the 4,173m Babusar Pass.",
    highlights: ["Balakot Gateway", "Kunhar River Rafting", "Naran Bazar", "Saif-ul-Malook turnoff", "Batta Kundi", "Lulusar Alpine Lake", "Babusar Top clouds"],
    coordinates: [
      [34.3312, 73.1970], // Mansehra
      [34.5480, 73.3520], // Balakot
      [34.6820, 73.4510], // Mahandri
      [34.7810, 73.5320], // Kaghan
      [34.9080, 73.6520], // Naran
      [35.0350, 73.7620], // Battakundi
      [35.0810, 73.9180], // Lulusar Lake
      [35.1320, 73.9850], // Gitidas Plain
      [35.1500, 74.0300], // Babusar Top (4,173m)
      [35.3210, 74.0620], // Babusar Village
      [35.4210, 74.0980]  // Chilas (KKH Junction)
    ]
  },
  {
    id: "route-skardu-s1",
    name: "Jaglot-Skardu Mountain Expressway (S-1)",
    shortName: "S-1 Skardu Expressway",
    highwayCode: "S-1",
    color: "#06b6d4", // Vibrant Cyan
    type: "Strategic All-Weather Mountain Expressway",
    startPoint: "Jaglot Junction (KKH)",
    endPoint: "Skardu City",
    distanceKm: 167,
    driveTime: "3.5 to 4.5 Hours",
    status: "OPEN (Widened & Newly Carpeted 2-Lane Expressway)",
    suitableVehicles: "All Sedans, Vans, Coasters & 4x4s",
    altitudeMax: "2,228 m (Skardu Valley)",
    description: "Engineering triumph through the deepest granite gorges of the Indus River, connecting Karakoram Highway to the gateway of K2 and Shangrila.",
    highlights: ["Alam Bridge suspension view", "Dramatic Indus River Canyon", "Rondu Gorge rock-cut tunnels", "Shangrila Lower Kachura Lake", "Katpana Cold Desert"],
    coordinates: [
      [35.6820, 74.6310], // Jaglot KKH Junction
      [35.6540, 74.7820], // Alam Bridge
      [35.6210, 75.0210], // Sassi
      [35.5320, 75.2410], // Rondu Gorge
      [35.4810, 75.3520], // Tormik
      [35.4215, 75.4490], // Lower Kachura / Shangrila Resort
      [35.3850, 75.5210], // Upper Kachura Lake turnoff
      [35.2971, 75.6333]  // Skardu City & Airport
    ]
  },
  {
    id: "route-makran-n10",
    name: "Makran Coastal Highway (N-10)",
    shortName: "N-10 Makran Coastal Highway",
    highwayCode: "N-10",
    color: "#3b82f6", // Ocean Sapphire
    type: "Pristine Coastal Scenic Highway",
    startPoint: "Karachi / Zero Point Hub",
    endPoint: "Gwadar Port City",
    distanceKm: 653,
    driveTime: "7.5 to 9 Hours",
    status: "OPEN (Flawless Asphalt with Ocean Views)",
    suitableVehicles: "All Passenger Sedans, Luxury Buses & SUVS",
    altitudeMax: "320 m (Buzi Pass)",
    description: "One of the world's most spectacular coastal drives along the Arabian Sea, featuring Hingol National Park, volcanic mud vents, and natural rock sculptures.",
    highlights: ["Hingol National Park", "Kund Malir Golden Beach", "Princess of Hope rock sculpture", "Sphinx of Balochistan", "Buzi Pass vistas", "Ormara Hammerhead", "Gwadar Bay"],
    coordinates: [
      [24.8607, 67.0011], // Karachi
      [25.0320, 66.8820], // Hub Balochistan
      [25.3210, 66.5810], // Winder
      [25.5520, 66.4320], // Uthal
      [25.5920, 65.9120], // Liari Junction
      [25.4890, 65.4580], // Kund Malir Beach
      [25.5180, 65.5120], // Princess of Hope & Sphinx
      [25.5410, 65.3120], // Buzi Pass
      [25.2100, 64.6320], // Ormara
      [25.2610, 63.4710], // Pasni
      [25.1210, 62.3250]  // Gwadar City & Deep Sea Port
    ]
  },
  {
    id: "route-swat-m16",
    name: "Swat Motorway & Valley Route (M-16 / N-95)",
    shortName: "M-16 Swat Motorway to Kalam",
    highwayCode: "M-16 / N-95",
    color: "#0d9488", // Alpine Teal (replaced violet)
    type: "Controlled-Access Motorway & River Expressway",
    startPoint: "Karnal Sher Khan Interchange (M-1)",
    endPoint: "Kalam Valley",
    distanceKm: 215,
    driveTime: "4 to 5 Hours",
    status: "OPEN (Fast Motorway to Chakdara, Carpeted to Kalam)",
    suitableVehicles: "All Sedans to Kalam; 4x4 needed for Mahodand Lake",
    altitudeMax: "2,000 m (Kalam)",
    description: "The emerald corridor from Islamabad to Swat Valley via high-speed motorway tunnels and pine-fringed river valleys.",
    highlights: ["Swat Motorway Twin Tunnels", "Chakdara Malakand pass", "Mingora Bazar", "White Palace Marghazar", "Malam Jabba Ski Resort", "Bahrain Cascades", "Kalam Valley"],
    coordinates: [
      [34.0520, 72.0310], // Karnal Sher Khan M-1 Interchange
      [34.2210, 72.0450], // Dobian
      [34.3520, 72.0710], // Katlang
      [34.5210, 72.0210], // Palai Twin Tunnels
      [34.6540, 72.0320], // Chakdara
      [34.7210, 72.1850], // Barikot
      [34.7810, 72.3610], // Mingora / Saidu Sharif
      [34.7990, 72.5710], // Malam Jabba turnoff
      [35.0210, 72.4820], // Khwazakhela
      [35.1420, 72.5320], // Madyan
      [35.2110, 72.5620], // Bahrain
      [35.4912, 72.5855]  // Kalam Valley
    ]
  },
  {
    id: "route-murree-galyat",
    name: "Islamabad-Murree Expressway & Galyat Ridge (N-75)",
    shortName: "N-75 Murree & Galyat Route",
    highwayCode: "N-75",
    color: "#0284c7", // Clear Sky Blue
    type: "Dual Carriage Mountain Ridge Highway",
    startPoint: "Islamabad (Zero Point)",
    endPoint: "Nathiagali & Abbottabad",
    distanceKm: 110,
    driveTime: "2 to 3 Hours",
    status: "OPEN (Snow chains required during peak Jan-Feb snowfall)",
    suitableVehicles: "All Sedans & City Cars",
    altitudeMax: "2,500 m (Nathiagali)",
    description: "The quick alpine escape from the twin cities through misty pine ridges, heritage viewpoints, and chairlifts.",
    highlights: ["Islamabad Zero Point", "Murree Expressway 4-lane climb", "Mall Road Murree", "Patriata New Murree Chairlift", "Ayubia Pipeline Track", "Nathiagali Pine Woods"],
    coordinates: [
      [33.7010, 73.0550], // Islamabad Zero Point
      [33.7820, 73.1950], // Barakahu
      [33.8820, 73.3510], // Satra Meel
      [33.9062, 73.3903], // Murree Mall Road
      [33.9120, 73.4520], // Bhurban PC Resort
      [34.0210, 73.4010], // Ayubia National Park
      [34.0720, 73.3850], // Dunga Gali
      [34.0850, 73.3780], // Nathiagali
      [34.1688, 73.2215]  // Abbottabad
    ]
  }
];
