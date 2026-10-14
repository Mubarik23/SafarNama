/**
 * SafarNama PK - Curated Pakistan Destinations Dataset
 * Comprehensive domestic database covering Gilgit-Baltistan, KPK, AJK, Sindh, Balochistan & Punjab
 */

export const INITIAL_DESTINATIONS = [
  {
    id: "hunza",
    name: "Hunza Valley",
    region: "Gilgit-Baltistan",
    tagline: "The Heaven on Earth nestled beneath Rakaposhi & Passu Cones",
    badge: "Most Popular",
    heroImage: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [36.3167, 74.6500],
    altitude: "2,438 m (8,000 ft)",
    bestSeason: "April to October (Autumn: Oct-Nov)",
    temperature: "14°C / 4°C",
    roadStatus: "Open (KKH in pristine condition)",
    highlights: ["Altit & Baltit Forts", "Passu Cones & Glacier", "Attabad Lake Boating", "Khunjerab Pass (Pak-China Border)", "Hussaini Suspension Bridge"],
    averageTourPrice: 65000,
    rating: 4.9,
    reviewsCount: 342,
    category: "Mountains & Valleys",
    featured: true
  },
  {
    id: "skardu",
    name: "Skardu & Baltistan",
    region: "Gilgit-Baltistan",
    tagline: "Gateway to the 8,000m Giants, Cold Desert & Shangrila",
    badge: "Adventure Capital",
    heroImage: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [35.2971, 75.6333],
    altitude: "2,228 m (7,310 ft)",
    bestSeason: "May to October",
    temperature: "16°C / 2°C",
    roadStatus: "Open (Jaglot-Skardu Expressway fully carpeted)",
    highlights: ["Shangrila Resort & Lower Kachura", "Katpana Cold Desert & Stargazing", "Deosai National Park (Land of Giants)", "Basho Valley", "Upper Kachura Lake"],
    averageTourPrice: 78000,
    rating: 4.95,
    reviewsCount: 420,
    category: "Mountains & Valleys",
    featured: true
  },
  {
    id: "fairy-meadows",
    name: "Fairy Meadows & Nanga Parbat",
    region: "Gilgit-Baltistan",
    tagline: "Unreal campsite facing the world's 9th tallest peak - Killer Mountain",
    badge: "Iconic Trek",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [35.3853, 74.5806],
    altitude: "3,300 m (10,800 ft)",
    bestSeason: "June to September",
    temperature: "9°C / -1°C",
    roadStatus: "Raikot Bridge accessible; 4x4 Jeep to Tato village + 3hr trek",
    highlights: ["Nanga Parbat Base Camp Trek", "Beyal Camp", "Reflection Pool", "Tattu Jeep Ride thrill", "Alpine Stargazing"],
    averageTourPrice: 52000,
    rating: 4.88,
    reviewsCount: 198,
    category: "Trekking & Adventure",
    featured: true
  },
  {
    id: "swat",
    name: "Swat Valley & Kalam",
    region: "Khyber Pakhtunkhwa",
    tagline: "The Switzerland of the East with lush meadows and pine forests",
    badge: "Family Favorite",
    heroImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [35.2227, 72.4258],
    altitude: "2,000 m (6,562 ft)",
    bestSeason: "All Year Round (Skiing in Malam Jabba in winter)",
    temperature: "18°C / 8°C",
    roadStatus: "Open (Swat Motorway M-16 clear to Mingora & Kalam)",
    highlights: ["Mahodand Lake & Ushu Forest", "Malam Jabba Ski Resort & Zipline", "Fizagat Park", "White Palace Marghazar", "Kumrat Trail Connector"],
    averageTourPrice: 42000,
    rating: 4.8,
    reviewsCount: 512,
    category: "Mountains & Valleys",
    featured: true
  },
  {
    id: "kumrat",
    name: "Kumrat Valley & Dir",
    region: "Khyber Pakhtunkhwa",
    tagline: "Untamed pine wilderness, cascading waterfalls and crystal streams",
    badge: "Wilderness Escape",
    heroImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [35.5386, 72.2217],
    altitude: "2,400 m (7,874 ft)",
    bestSeason: "May to September",
    temperature: "15°C / 5°C",
    roadStatus: "Open (Dir to Thal road open; 4x4 needed inside valley)",
    highlights: ["Panjkora River Banks", "Katora Lake Alpine Trek", "Kumrat Forest Waterfall", "Jandrai Village", "Do Kala Chasma"],
    averageTourPrice: 46000,
    rating: 4.75,
    reviewsCount: 164,
    category: "Trekking & Adventure",
    featured: false
  },
  {
    id: "neelum",
    name: "Neelum Valley",
    region: "Azad Jammu & Kashmir",
    tagline: "Lush green paradise, river gorges and cascading alpine lakes",
    badge: "Romantic Getaway",
    heroImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [34.5855, 73.9070],
    altitude: "1,615 m - 3,200 m",
    bestSeason: "April to October",
    temperature: "17°C / 7°C",
    roadStatus: "Open (Muzaffarabad to Keran & Sharda paved road)",
    highlights: ["Arang Kel Pearl of Neelum", "Ratti Gali Glacial Lake", "Sharda Peeth Ancient University", "Kutton Waterfall", "Taobat Border Hamlet"],
    averageTourPrice: 39000,
    rating: 4.82,
    reviewsCount: 290,
    category: "Mountains & Valleys",
    featured: true
  },
  {
    id: "kaghan",
    name: "Naran & Kaghan Valley",
    region: "Khyber Pakhtunkhwa",
    tagline: "Home of Saif-ul-Malook, Babusar Pass and crystal rivers",
    badge: "Classic Route",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [34.9080, 73.6528],
    altitude: "2,409 m (7,904 ft)",
    bestSeason: "May to October (Babusar opens June-Oct)",
    temperature: "12°C / 3°C",
    roadStatus: "Open (Hazara Motorway + Mansehra-Naran Highway)",
    highlights: ["Lake Saif-ul-Malook", "Babusar Pass (4,173m)", "Lulusar Lake", "Shogran & Siri Paye Meadows", "Kunhar River Rafting"],
    averageTourPrice: 35000,
    rating: 4.79,
    reviewsCount: 680,
    category: "Mountains & Valleys",
    featured: true
  },
  {
    id: "gwadar",
    name: "Gwadar & Makran Coastal Highway",
    region: "Balochistan",
    tagline: "Dramatic sea stacks, turquoise Arabian Sea & Kund Malir beaches",
    badge: "Coastal Wonder",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [25.1264, 62.3225],
    altitude: "Sea Level",
    bestSeason: "October to March",
    temperature: "26°C / 18°C",
    roadStatus: "Open (Makran Coastal Highway N-10 in superb condition)",
    highlights: ["Princess of Hope & Sphinx", "Kund Malir Golden Beach", "Hammerhead Rock Gwadar", "Astola Island Scuba & Snorkeling", "Ormara Turtle Beach"],
    averageTourPrice: 48000,
    rating: 4.76,
    reviewsCount: 145,
    category: "Coastal & Beaches",
    featured: true
  },
  {
    id: "cholistan",
    name: "Cholistan Desert & Bahawalpur",
    region: "Punjab",
    tagline: "Royal palaces, majestic Derawar Fort and legendary desert jeep rally",
    badge: "Heritage & Desert",
    heroImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [28.3240, 71.3340],
    altitude: "112 m",
    bestSeason: "November to February",
    temperature: "22°C / 9°C",
    roadStatus: "Open (M-5 Motorway & paved desert access roads)",
    highlights: ["Derawar Fort & Royal Tombs", "Noor Mahal & Darbar Mahal Bahawalpur", "Desert Camel Safari & Campfire", "Cholistan Jeep Rally Track", "Lal Suhanra National Park"],
    averageTourPrice: 32000,
    rating: 4.71,
    reviewsCount: 110,
    category: "Desert & Culture",
    featured: false
  },
  {
    id: "lahore",
    name: "Historic Lahore & Cultural Heart",
    region: "Punjab",
    tagline: "Mughal splendors, Food Street delicacies and living sufi heritage",
    badge: "Cultural Capital",
    heroImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [31.5497, 74.3436],
    altitude: "217 m",
    bestSeason: "October to March",
    temperature: "24°C / 12°C",
    roadStatus: "Open (Motorways M-2, M-3, M-11 fully operational)",
    highlights: ["Badshahi Mosque & Lahore Fort (UNESCO)", "Wazir Khan Mosque & Delhi Gate Walk", "Anarkali & Haveli Rooftop Food Street", "Wagah Border Flag Ceremony", "Shalimar Gardens"],
    averageTourPrice: 22000,
    rating: 4.9,
    reviewsCount: 780,
    category: "Cultural & Heritage",
    featured: false
  },
  {
    id: "chitral",
    name: "Chitral & Kalash Valleys",
    region: "Khyber Pakhtunkhwa",
    tagline: "Ancient pagan traditions, Tirich Mir peak and vibrant Chilam Joshi festival",
    badge: "Unique Culture",
    heroImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [35.8510, 71.7864],
    altitude: "1,500 m - 2,500 m",
    bestSeason: "May to October (Chilam Joshi in May)",
    temperature: "16°C / 5°C",
    roadStatus: "Open (Lowari Tunnel open 24/7 all weather)",
    highlights: ["Kalash Valleys (Bumburet, Rumbur, Birir)", "Shandur Pass - Highest Polo Ground on Earth", "Tirich Mir Viewpoint", "Chitral Gol National Park", "Ancient Shahi Mosque & Fort"],
    averageTourPrice: 62000,
    rating: 4.87,
    reviewsCount: 154,
    category: "Cultural & Heritage",
    featured: false
  },
  {
    id: "murree",
    name: "Murree & Galyat Hills",
    region: "Punjab / KP Border",
    tagline: "Colonial hill station, pine-scented breeze and quick weekend escape",
    badge: "Quick Getaway",
    heroImage: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [33.9070, 73.3903],
    altitude: "2,291 m (7,516 ft)",
    bestSeason: "All Year Round (Snowfall Dec-Feb, Cool Summers)",
    temperature: "13°C / 4°C",
    roadStatus: "Open (Murree Expressway Clear with NHMP active patrolling)",
    highlights: ["Mall Road & Pindi Point Chairlift", "Patriata (New Murree) Cable Car", "Nathia Gali Pipeline Track & Mukshpuri Peak", "Ayubia National Park", "Bhurban Resort Stay"],
    averageTourPrice: 28000,
    rating: 4.65,
    reviewsCount: 890,
    category: "Mountains & Valleys",
    featured: false
  },
  {
    id: "hingol",
    name: "Hingol National Park",
    region: "Balochistan",
    tagline: "Pakistan's largest national park with surreal mud volcanoes, wildlife & rock formations",
    badge: "Natural Wonder",
    heroImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [25.5256, 65.5264],
    altitude: "Sea level to 1,000 m",
    bestSeason: "October to March",
    temperature: "25°C / 17°C",
    roadStatus: "Open (Makran Coastal Highway N-10)",
    highlights: ["Princess of Hope Rock", "Active Mud Volcanoes (Chandragup)", "Hinglaj Mata Historic Temple", "Kund Malir Golden Beach", "Ibex & Wildlife Sanctuary"],
    averageTourPrice: 38000,
    rating: 4.84,
    reviewsCount: 175,
    category: "Coastal & Nature",
    featured: true
  },
  {
    id: "mohenjo-daro",
    name: "Mohenjo-daro",
    region: "Sindh",
    tagline: "5,000-year-old UNESCO Bronze Age metropolis of the Indus Valley Civilization",
    badge: "UNESCO Heritage",
    heroImage: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80"
    ],
    coordinates: [27.3292, 68.1383],
    altitude: "50 m",
    bestSeason: "November to February",
    temperature: "23°C / 10°C",
    roadStatus: "Open (Indus Highway N-55 via Larkana)",
    highlights: ["The Great Bath", "Ancient Granary & Citadel", "Indus Valley Archaeological Museum", "Buddhist Stupa Mound", "Ancient Brick Drainage Network"],
    averageTourPrice: 26000,
    rating: 4.89,
    reviewsCount: 210,
    category: "Cultural & Heritage",
    featured: false
  }
];
