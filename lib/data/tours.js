/**
 * SafarNama PK - Curated Tour Packages Dataset
 * All pricing strictly in Pakistani Rupee (PKR), with realistic domestic logistics & seat inventories
 */

export const INITIAL_TOURS = [
  {
    id: "tour-hunza-expedition-7d",
    title: "7-Day Hunza Valley & Khunjerab Pass Expedition",
    destinationId: "hunza",
    destinationName: "Hunza Valley & Passu",
    region: "Gilgit-Baltistan",
    badge: "Bestseller",
    category: "Luxury Guided Tour",
    image: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",
    durationDays: 7,
    durationNights: 6,
    departureCities: ["Islamabad", "Lahore", "Karachi (via flight)"],
    nextDeparture: "2026-09-15",
    totalSeats: 22,
    availableSeats: 7,
    pricePKR: 68500,
    originalPricePKR: 78000,
    rating: 4.94,
    reviewsCount: 168,
    difficulty: "Easy to Moderate",
    groupType: "Family & Couples",
    transportType: "Luxury Saloon Coaster / Hiace Grand Cabin",
    hotelCategory: "4-Star Hotels (Hunza Serena / Luxus View)",
    overview: "Experience the majestic crown of Pakistan. Journey through the Karakoram Highway, witness Rakaposhi View Point, boat on turquoise Attabad Lake, cross the suspension bridge of Hussaini, and stand at the world's highest border - Khunjerab Pass (4,693m).",
    itinerary: [
      {
        day: 1,
        title: "Departure from Islamabad to Chilas / Naran via Hazara Motorway",
        stops: ["Hazara Motorway", "Babusar Pass (Summer) or Besham KKH", "Lulusar Lake", "Chilas Shangrila"],
        stay: "Chilas / Naran Riverside Hotel",
        meals: "Dinner included"
      },
      {
        day: 2,
        title: "Journey to Hunza Valley via 3 Mountain Ranges Junction",
        stops: ["Junction of Himalayas, Karakoram & Hindu Kush", "Rakaposhi View Point (7,788m)", "Karimabad Bazaar"],
        stay: "Karimabad Deluxe Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 3,
        title: "Altit Fort, Baltit Fort & Eagle's Nest Sunset View",
        stops: ["900-year-old Baltit Fort", "1100-year-old Altit Fort & Royal Gardens", "Eagle's Nest Panoramic Sunset"],
        stay: "Karimabad Deluxe Hotel",
        meals: "Breakfast & Dinner (Traditional Hunzai Cuisine)"
      },
      {
        day: 4,
        title: "Attabad Lake, Passu Cones, Hussaini Bridge & Khunjerab Pass",
        stops: ["Attabad Lake Jet Ski & Speed Boating", "Passu Glacier Viewpoint", "Hussaini Suspension Bridge walk", "Khunjerab National Park & World's Highest ATM"],
        stay: "Passu / Gulmit Tourist Resort",
        meals: "Breakfast & BBQ Dinner with Bonfire"
      },
      {
        day: 5,
        title: "Nagar Valley, Hoper Glacier & Local Handicrafts Discovery",
        stops: ["Hoper Glacier view", "Organic Apricot Orchards", "Ganish Ancient Village Heritage walk"],
        stay: "Gilgit River View Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 6,
        title: "Return Drive towards Chilas / Besham with Scenic Stops",
        stops: ["Gilgit River Confluence", "Danyore Suspension Bridge", "KKH Rest Stops"],
        stay: "Besham / Naran Deluxe Stay",
        meals: "Breakfast & Dinner"
      },
      {
        day: 7,
        title: "Final Leg Arrival in Islamabad via Hazara Motorway",
        stops: ["Khanpur Dam Viewpoint", "Faisal Mosque Farewell Gathering", "Drop-off at Islamabad Airport / Station"],
        stay: "Home Sweet Home",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "AC Luxury Transport (Saloon Coaster / Hiace) with Fuel & Tolls",
      "6 Nights Deluxe Hotel Accommodation on Twin/Triple sharing",
      "Daily Quality Breakfasts & Gourmet Dinners (including 1 Live BBQ)",
      "Attabad Lake Boating & Khunjerab Pass Entry Permits",
      "Licensed Professional Mountain Tour Guide",
      "First Aid Kit with Portable O2 Cylinder",
      "Musical Bonfire Night in Hunza"
    ],
    exclusions: [
      "Lunch, snacks and personal beverage expenses",
      "Horse riding or private water sports (Jet-ski)",
      "Personal porter / extra baggage handling",
      "Domestic air tickets (available as add-on)"
    ],
    gearChecklist: ["Warm fleece/jacket", "Comfortable walking shoes/sneakers", "Sunscreen (SPF 50+) & Sunglasses", "CNIC / Original Passport", "Power bank & camera"]
  },
  {
    id: "tour-skardu-deosai-8d",
    title: "8-Day Ultimate Skardu, Shangrila & Deosai 4x4 Safari",
    destinationId: "skardu",
    destinationName: "Skardu & Deosai Plains",
    region: "Gilgit-Baltistan",
    badge: "Bucket List",
    category: "4x4 Jeep Safari",
    image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80",
    durationDays: 8,
    durationNights: 7,
    departureCities: ["Islamabad", "Lahore", "Karachi"],
    nextDeparture: "2026-09-18",
    totalSeats: 18,
    availableSeats: 4,
    pricePKR: 88000,
    originalPricePKR: 98000,
    rating: 4.97,
    reviewsCount: 215,
    difficulty: "Moderate",
    groupType: "Adventure & Families",
    transportType: "Toyota Prado 4x4 / Land Cruiser & AC Van",
    hotelCategory: "Shangrila / Serena Shigar Heritage",
    overview: "Traverse the newly carpeted Jaglot-Skardu road through deep Indus gorges into the enchanting kingdom of Baltistan. Visit Lower Kachura Shangrila, Katpana Cold Desert, Shigar Fort, and take dedicated 4x4 Jeeps across the rooftop of the world: Deosai Plains (4,000m).",
    itinerary: [
      {
        day: 1,
        title: "Islamabad to Chilas via KKH / Babusar Pass",
        stops: ["Hazara Highway", "Babusar Summit 4,173m", "Chilas Indus View"],
        stay: "Chilas Tourist Resort",
        meals: "Dinner"
      },
      {
        day: 2,
        title: "Chilas to Skardu via Jaglot-Skardu Expressway",
        stops: ["Indus & Gilgit Confluence", "Astor Gorge", "Skardu City Entrance"],
        stay: "Skardu Riverview Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 3,
        title: "Shangrila Resort, Lower Kachura & Upper Kachura Lake",
        stops: ["Heart-shaped Kachura Lake", "Shangrila Pagodas", "Upper Kachura Boat Ride & Trout Fish lunch stop"],
        stay: "Skardu Riverview Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 4,
        title: "Deosai Plains National Park - Land of the Giants Safari",
        stops: ["Sadpara Lake & Dam", "Ali Malik Top (4,200m)", "Sheosar Lake Reflections", "Bara Pani Bridge & Himalayan Brown Bear Sanctuary"],
        stay: "Skardu Deluxe Hotel or Deosai Glamping Pod",
        meals: "Breakfast & Deosai Picnic Lunch & Dinner"
      },
      {
        day: 5,
        title: "Shigar Fort, Blind Lake & Katpana Cold Desert Sunset",
        stops: ["400-year-old Serena Shigar Fort", "Sarfaranga / Katpana Cold Desert Dune Safari", "Stargazing over Sand Dunes"],
        stay: "Shigar / Skardu Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 6,
        title: "Manthoka Waterfall & Khaplu Royal Palace",
        stops: ["180ft Manthoka Waterfall", "Serena Khaplu Palace", "Chaqchan Mosque (700 yrs old)"],
        stay: "Khaplu / Skardu Heritage Stay",
        meals: "Breakfast & Dinner"
      },
      {
        day: 7,
        title: "Return Journey towards Besham / Naran",
        stops: ["Indus River Viewpoints", "Dassu Valley", "Besham Rest House"],
        stay: "Besham Riverside Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 8,
        title: "Arrival back in Islamabad Capital City",
        stops: ["Hazara Expressway", "Centaurus / Blue Area Drop"],
        stay: "Departure",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "Dedicated 4x4 Prado / Land Cruiser for Deosai Plains & Cold Desert",
      "7 Nights Premium Hotel / Resort Accommodation",
      "Daily Buffet Breakfasts & Gourmet Mountain Dinners",
      "Deosai National Park & Shigar / Khaplu Fort Entry Tickets",
      "Professional Local Balti Guide with Mountain First Aid",
      "Bonfire & Traditional Balti Musical Evening"
    ],
    exclusions: ["Personal laundry & phone calls", "Optional flights Islamabad-Skardu upgrade", "Extra jeep rides outside itinerary"],
    gearChecklist: ["Windproof & Thermal Jacket", "Sturdy Hiking Boots", "Sunglasses & Lip Balm", "Power Bank"]
  },
  {
    id: "tour-swat-kalam-5d",
    title: "5-Day Swat Valley, Malam Jabba Ski & Mahodand Lake",
    destinationId: "swat",
    destinationName: "Swat & Kalam",
    region: "Khyber Pakhtunkhwa",
    badge: "Family Pick",
    category: "Relaxation & Scenic",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    durationDays: 5,
    durationNights: 4,
    departureCities: ["Islamabad", "Lahore", "Peshawar"],
    nextDeparture: "2026-09-12",
    totalSeats: 24,
    availableSeats: 11,
    pricePKR: 44000,
    originalPricePKR: 50000,
    rating: 4.86,
    reviewsCount: 298,
    difficulty: "Easy",
    groupType: "Family & Senior Friendly",
    transportType: "Grand Cabin Hiace / Executive Saloon",
    hotelCategory: "PC Malam Jabba / Walnut Heights Kalam",
    overview: "Explore the lush valleys of Swat. Ride the exhilarating chairlift at Malam Jabba, wander through the cedar groves of Ushu Forest, and ride 4x4s to the crystal turquoise Mahodand and Saifullah alpine lakes.",
    itinerary: [
      {
        day: 1,
        title: "Islamabad / Lahore to Mingora & Malam Jabba",
        stops: ["Swat Motorway M-16", "Malam Jabba Ski Resort & Chairlift", "Zipline Experience"],
        stay: "Malam Jabba / Fizagat Luxury Hotel",
        meals: "Dinner"
      },
      {
        day: 2,
        title: "Scenic Drive to Kalam Valley along Swat River",
        stops: ["Bahrain Trout Farms & Bazar", "Swat River Rapids", "Kalam Valley Entry"],
        stay: "Kalam Riverfront Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 3,
        title: "4x4 Jeep Expedition to Mahodand & Saifullah Lakes",
        stops: ["Ushu Dense Pine Forest", "Matiltan Waterfall", "Mahodand Lake Boating", "Saifullah Glacial Stream"],
        stay: "Kalam Riverfront Hotel",
        meals: "Breakfast & Fresh Trout Dinner"
      },
      {
        day: 4,
        title: "White Palace Marghazar & Swat Heritage Bazaar",
        stops: ["Historical Marble Palace Marghazar", "Swat Museum & Buddhist Artifacts", "Mingora Handicrafts & Emerald Market"],
        stay: "Mingora / Fizagat Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 5,
        title: "Return to Islamabad / Lahore with Memories",
        stops: ["Katlang Interchange", "Motorway M-1 / M-2"],
        stay: "Return",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "AC Transport with skilled mountain driver",
      "4 Nights Hotel Stay on Double/Twin Sharing",
      "Dedicated 4x4 Jeeps for Mahodand Lake",
      "Daily Breakfast & Dinner",
      "Malam Jabba chairlift entry support",
      "Tour Coordinator & Local Assistance"
    ],
    exclusions: ["Personal rides (Zipline/Boating)", "Lunch expenses"],
    gearChecklist: ["Light jacket", "Comfortable walking shoes", "Camera", "Umbrella/Rain jacket"]
  },
  {
    id: "tour-fairy-meadows-5d",
    title: "5-Day Thrill Trek to Fairy Meadows & Nanga Parbat Base",
    destinationId: "fairy-meadows",
    destinationName: "Fairy Meadows",
    region: "Gilgit-Baltistan",
    badge: "Extreme Thrill",
    category: "Mountain Trekking",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    durationDays: 5,
    durationNights: 4,
    departureCities: ["Islamabad", "Rawalpindi", "Lahore"],
    nextDeparture: "2026-09-20",
    totalSeats: 14,
    availableSeats: 5,
    pricePKR: 54000,
    originalPricePKR: 62000,
    rating: 4.91,
    reviewsCount: 143,
    difficulty: "Challenging",
    groupType: "Youth, Hikers & Adventure Seekers",
    transportType: "AC Van to Raikot + 4x4 Mountain Jeep",
    hotelCategory: "Alpine Wooden Cottages & Glamping Tents",
    overview: "The world-famous adventure: ride the world's most dramatic cliffside jeep track to Tato village, trek through alpine pine forests, and wake up right beneath the towering 8,126m North Face of Nanga Parbat at Fairy Meadows and Beyal Camp.",
    itinerary: [
      {
        day: 1,
        title: "Islamabad to Chilas via KKH / Babusar Pass",
        stops: ["Babusar Summit", "Lulusar Lake", "Chilas Junction"],
        stay: "Chilas Tourist Cottage",
        meals: "Dinner"
      },
      {
        day: 2,
        title: "Raikot Bridge Jeep Thrill & Trek to Fairy Meadows",
        stops: ["Raikot Bridge", "Tato Village cliffside jeep drive", "3-4hr scenic pine forest trek to Fairy Meadows"],
        stay: "Fairy Meadows Wooden Log Huts",
        meals: "Breakfast & Hot Dinner by Wood Stove"
      },
      {
        day: 3,
        title: "Hike to Beyal Camp, Viewpoint & Nanga Parbat Base Camp",
        stops: ["Fairy Meadows Reflection Pond", "Beyal Camp Birch Forests", "German Base Camp 1 Views of Nanga Parbat & Raikot Glacier"],
        stay: "Fairy Meadows Wooden Log Huts",
        meals: "Breakfast, Trail Snacks & Dinner"
      },
      {
        day: 4,
        title: "Trek Down to Tato Village & Drive to Besham",
        stops: ["Tato Village", "Raikot Bridge reunion", "KKH drive to Besham"],
        stay: "Besham Riverside Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 5,
        title: "Besham to Islamabad Arrival",
        stops: ["Mansehra", "Abbottabad", "Islamabad Drop"],
        stay: "Trip Conclusion",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "AC Transport from Islamabad to Raikot & back",
      "4x4 Rugged Jeeps from Raikot Bridge to Tato & return",
      "Wooden Log Hut Accommodation at Fairy Meadows with mountain views",
      "All Breakfasts & Warm Dinners",
      "Experienced High-Altitude Mountain Guide & First Aid",
      "Bonfire Night under the Milky Way"
    ],
    exclusions: ["Porters or mules for personal luggage", "Lunches on trail"],
    gearChecklist: ["High-ankle trekking boots", "Thermal inners & Down jacket", "Headlamp / Flashlight", "Trekking poles", "Water bottle & hydration pack"]
  },
  {
    id: "tour-gwadar-coastal-4d",
    title: "4-Day Gwadar, Kund Malir Beach & Princess of Hope Safari",
    destinationId: "gwadar",
    destinationName: "Gwadar & Makran Coast",
    region: "Balochistan",
    badge: "Coastal Sunset",
    category: "Beach & Desert Roadtrip",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    durationDays: 4,
    durationNights: 3,
    departureCities: ["Karachi", "Islamabad (flight link)"],
    nextDeparture: "2026-09-25",
    totalSeats: 20,
    availableSeats: 8,
    pricePKR: 49500,
    originalPricePKR: 56000,
    rating: 4.88,
    reviewsCount: 112,
    difficulty: "Easy",
    groupType: "Friends & Families",
    transportType: "Luxury AC Coaster / Grand Cabin",
    hotelCategory: "Gwadar Business Hotel / Beachfront Resort",
    overview: "Cruise on Pakistan's most scenic highway — the Makran Coastal Highway (N-10). Marvel at Hingol National Park rock formations, camp by the golden sands of Kund Malir, witness Princess of Hope, and take speedboats along Gwadar Hammerhead.",
    itinerary: [
      {
        day: 1,
        title: "Departure from Karachi to Kund Malir Beach via Coastal Highway",
        stops: ["Winder Town", "Hingol River", "Kund Malir Golden Beach", "Beachside Sunset & BBQ"],
        stay: "Kund Malir Beach Glamping / Ormara Resort",
        meals: "Dinner & BBQ"
      },
      {
        day: 2,
        title: "Princess of Hope, Sphinx of Balochistan & Gwadar Harbor",
        stops: ["Princess of Hope Natural Rock Monument", "Sphinx of Balochistan", "Buzi Pass vistas", "Arrival in Gwadar City"],
        stay: "Gwadar Luxury Seaview Hotel",
        meals: "Breakfast & Seafood Dinner"
      },
      {
        day: 3,
        title: "Gwadar Port, Hammerhead Koh-e-Batil & Sunset Boating",
        stops: ["Koh-e-Batil Top Stairs & 360 Sea View", "Gwadar Deep Sea Port & Free Zone", "Speedboat Ride into Arabian Sea", "Shahi Bazar Gwadar (Omani Halwa)"],
        stay: "Gwadar Luxury Seaview Hotel",
        meals: "Breakfast & Traditional Balochi Sajji Dinner"
      },
      {
        day: 4,
        title: "Gwadar to Karachi with Coastal Road Photography Stops",
        stops: ["Ormara Beach", "Mud Volcanoes of Hingol", "Arrival in Karachi by evening"],
        stay: "Home Drop",
        meals: "Breakfast & Coastal Lunch Stop"
      }
    ],
    inclusions: [
      "Executive AC Transportation throughout the roadtrip",
      "3 Nights Hotel / Premium Beach Glamping Stay",
      "Breakfasts & Themed Dinners (Fresh Catch Seafood & Balochi Sajji)",
      "Speedboat cruise at Gwadar Marine Bay",
      "Professional Photographer for Instagrammable shots",
      "All tolls, security clearances & entry fees"
    ],
    exclusions: ["Personal watersports & jet ski rentals", "Airfare to Karachi"],
    gearChecklist: ["Beachwear & slippers", "Sun hat & UV sunglasses", "Power bank", "Valid original CNIC"]
  },
  {
    id: "tour-neelum-valley-4d",
    title: "4-Day Neelum Valley, Arang Kel & Ratti Gali Lake Escape",
    destinationId: "neelum",
    destinationName: "Neelum Valley & Arang Kel",
    region: "Azad Jammu & Kashmir",
    badge: "Green Paradise",
    category: "Nature & Lake Trek",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    durationDays: 4,
    durationNights: 3,
    departureCities: ["Islamabad", "Lahore", "Rawalpindi"],
    nextDeparture: "2026-09-14",
    totalSeats: 22,
    availableSeats: 6,
    pricePKR: 38000,
    originalPricePKR: 44000,
    rating: 4.89,
    reviewsCount: 245,
    difficulty: "Easy to Moderate",
    groupType: "Couples & Families",
    transportType: "AC Hiace / Coaster + 4x4 Ratti Gali Jeep",
    hotelCategory: "Riverfront Wooden Cottages Keran / Sharda",
    overview: "Escape into the lush river valley of Azad Kashmir. Listen to the roaring Neelum River in Keran, explore the historic Sharda Peeth University ruins, take the cable car up to the fairy-tale meadows of Arang Kel, and trek to emerald Ratti Gali glacial lake.",
    itinerary: [
      {
        day: 1,
        title: "Islamabad to Keran via Muzaffarabad & Kohala",
        stops: ["Kohala River Point", "Muzaffarabad Waterfall", "Dhani & Kutton Waterfalls", "Keran Line of Control riverbank"],
        stay: "Keran Riverview Wooden Cottages",
        meals: "Dinner"
      },
      {
        day: 2,
        title: "4x4 Jeep Safari & Hike to Ratti Gali Glacial Lake",
        stops: ["Dowarian Base Camp", "4x4 thrilling mountain track", "Ratti Gali Base Camp & Lake (3,700m)"],
        stay: "Keran / Sharda Resort",
        meals: "Breakfast & Lake Picnic & Dinner"
      },
      {
        day: 3,
        title: "Sharda Peeth Ruins & Cable Car Hike to Arang Kel",
        stops: ["Ancient Sharda Peeth Buddhist Temple", "Kel Suspension Bridge & River crossing", "Doli Cable Car & Arang Kel Pearl of Neelum"],
        stay: "Sharda / Arang Kel Riverside Stay",
        meals: "Breakfast & Kashmiri Wazwan Dinner"
      },
      {
        day: 4,
        title: "Return Journey to Islamabad with Waterfall Stops",
        stops: ["Neelum River scenic viewpoints", "Muzaffarabad Shawl Market", "Arrival in Islamabad by 9 PM"],
        stay: "Trip Conclusion",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "AC Transport from Islamabad + 4x4 Mountain Jeeps for Ratti Gali",
      "3 Nights Riverfront Cottage Accommodation",
      "Daily Breakfasts & Authentic Kashmiri Dinners",
      "Arang Kel Chairlift tickets & Local Guided assistance",
      "Musical Bonfire by the Neelum River"
    ],
    exclusions: ["Horse ride at Ratti Gali", "Lunches on route"],
    gearChecklist: ["Warm sweater/shawl", "Raincoat", "Joggers/Trekking shoes", "CNIC"]
  }
];
