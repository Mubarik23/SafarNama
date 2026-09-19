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
  },
  {
    id: "tour-kumrat-katora-5d",
    title: "5-Day Kumrat Valley, Katora Lake & Panjkora Wilderness Trek",
    destinationId: "kumrat",
    destinationName: "Kumrat Valley & Dir",
    region: "Khyber Pakhtunkhwa",
    badge: "Wilderness Escape",
    category: "Trekking & Adventure",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    durationDays: 5,
    durationNights: 4,
    departureCities: ["Islamabad", "Peshawar", "Lahore"],
    nextDeparture: "2026-09-19",
    totalSeats: 20,
    availableSeats: 8,
    pricePKR: 46000,
    originalPricePKR: 52000,
    rating: 4.87,
    reviewsCount: 128,
    difficulty: "Moderate to Challenging",
    groupType: "Youth, Trekkers & Nature Lovers",
    transportType: "AC Grand Cabin + 4x4 Mountain Jeeps",
    hotelCategory: "Riverfront Alpine Camps & Wooden Cottages",
    overview: "Explore the untamed beauty of Kumrat Valley. Camp under century-old deodar pine trees along the roaring Panjkora River, take rugged 4x4 jeeps through dense wilderness to Jandrai, and trek to the mythical alpine bowl of Katora Lake (3,500m).",
    itinerary: [
      {
        day: 1,
        title: "Islamabad to Upper Dir & Thal Village via Swat Motorway",
        stops: ["Swat Motorway M-16", "Chakdara Interchange", "Dir City", "Thal Historic Wooden Mosque"],
        stay: "Thal / Kumrat Riverside Wooden Huts",
        meals: "Dinner"
      },
      {
        day: 2,
        title: "4x4 Jeep Safari into Dense Kumrat Forest & Waterfalls",
        stops: ["Panjkora Riverbed drive", "Kumrat Waterfall & Forest Canopy", "Do Kala Chasma Glacial Stream", "Kala Chashma Campsite"],
        stay: "Kumrat Forest Alpine Glamping Pods",
        meals: "Breakfast & Campfire BBQ Dinner"
      },
      {
        day: 3,
        title: "Trek to Mythical Katora Glacial Lake (Land of Fairies)",
        stops: ["Jandrai Village base", "Choki Trekking Route", "Katora Lake Summit (3,500m)", "Glacial Reflections"],
        stay: "Kumrat Riverside Wooden Huts",
        meals: "Breakfast, Trail Lunch Pack & Dinner"
      },
      {
        day: 4,
        title: "Kumrat Meadows Exploration & Trout Fishing Experience",
        stops: ["Jaz Banda Trek Viewpoint", "Panjkora Trout Fishing Spot", "Local Kohistani Cultural Bazaar"],
        stay: "Thal Riverside Hotel",
        meals: "Breakfast & Fresh Trout Fish Dinner"
      },
      {
        day: 5,
        title: "Return Drive to Islamabad / Lahore with Scenic Stops",
        stops: ["Malakand Pass panoramic view", "Mardan Interchange", "Islamabad Drop-off"],
        stay: "Trip Conclusion",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "AC Transport from Islamabad + Dedicated 4x4 Mountain Jeeps for Kumrat & Thal",
      "4 Nights Wooden Hut & Forest Glamping Pod Accommodation",
      "Daily Hearty Breakfasts & Traditional Dinners (including 1 Trout Fish BBQ)",
      "Experienced Local Wilderness Guide & First Aid",
      "Bonfire Night under the starry canopy",
      "All road tolls and entry permits"
    ],
    exclusions: ["Personal trekking gear & poles", "Lunches on travel days", "Personal porter charges"],
    gearChecklist: ["High-ankle trekking shoes", "Thermal fleece jacket", "Rain poncho / umbrella", "Headlamp / Flashlight", "Original CNIC"]
  },
  {
    id: "tour-naran-kaghan-4d",
    title: "4-Day Naran, Kaghan Valley, Saif-ul-Malook Lake & Babusar Pass",
    destinationId: "kaghan",
    destinationName: "Naran & Kaghan Valley",
    region: "Khyber Pakhtunkhwa",
    badge: "Classic Favorite",
    category: "Mountains & Valleys",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    durationDays: 4,
    durationNights: 3,
    departureCities: ["Islamabad", "Lahore", "Rawalpindi"],
    nextDeparture: "2026-09-16",
    totalSeats: 26,
    availableSeats: 9,
    pricePKR: 36000,
    originalPricePKR: 42000,
    rating: 4.89,
    reviewsCount: 380,
    difficulty: "Easy",
    groupType: "Families & Couples",
    transportType: "Executive Saloon Coaster / Hiace Grand Cabin",
    hotelCategory: "Deluxe Riverside Resort Naran",
    overview: "Pakistan's quintessential mountain holiday: drive the scenic Hazara Motorway, visit the legendary emerald Lake Saif-ul-Malook by 4x4 jeep, cross the dramatic Babusar Pass (4,173m), gaze at turquoise Lulusar Lake, and ride jeeps up to Shogran & Siri Paye meadows.",
    itinerary: [
      {
        day: 1,
        title: "Islamabad to Shogran & Siri Paye Meadows",
        stops: ["Hazara Motorway tunnels", "Balakot Kunhar River", "Kiwai Waterfall jeep point", "Siri Paye Alpine Meadow 3,000m"],
        stay: "Shogran / Naran Deluxe Hotel",
        meals: "Dinner"
      },
      {
        day: 2,
        title: "4x4 Safari to Fairy-Tale Lake Saif-ul-Malook",
        stops: ["Naran Main Bazaar", "Steep 4x4 Jeep trail", "Lake Saif-ul-Malook & Malika Parbat View (5,290m)", "Kunhar River Rafting point"],
        stay: "Naran Riverside Resort",
        meals: "Breakfast & Dinner"
      },
      {
        day: 3,
        title: "Expedition to Lulusar Lake & Babusar Pass (4,173m)",
        stops: ["Batta Kundi Valley", "Turquoise Lulusar Glacial Lake", "Babusar Summit KP-GB Border", "Snowfields & Pakora stalls"],
        stay: "Naran Riverside Resort",
        meals: "Breakfast & Bonfire BBQ Dinner"
      },
      {
        day: 4,
        title: "Scenic Return Journey to Islamabad / Lahore",
        stops: ["Kunhar River trout stop", "Mansehra Interchange", "Drop-off in Islamabad"],
        stay: "Trip Conclusion",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "Executive AC Transport with professional mountain driver",
      "3 Nights Deluxe Riverview Hotel Stay",
      "4x4 Jeeps for Lake Saif-ul-Malook and Siri Paye",
      "Daily Buffet Breakfasts & Gourmet Dinners",
      "Kunhar River Bonfire Night with Live Music",
      "All highway tolls and local taxes"
    ],
    exclusions: ["Kunhar river white-water rafting", "Horse riding at Lake Saif-ul-Malook", "Lunches on route"],
    gearChecklist: ["Warm sweater / windbreaker", "Comfortable sneakers", "UV Sunglasses", "Umbrella", "Valid CNIC"]
  },
  {
    id: "tour-cholistan-bahawalpur-3d",
    title: "3-Day Royal Bahawalpur & Cholistan Desert Safari with Derawar Fort",
    destinationId: "cholistan",
    destinationName: "Cholistan Desert & Bahawalpur",
    region: "Punjab",
    badge: "Heritage & Desert",
    category: "Desert & Culture",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    durationDays: 3,
    durationNights: 2,
    departureCities: ["Lahore", "Multan", "Islamabad", "Karachi"],
    nextDeparture: "2026-09-22",
    totalSeats: 18,
    availableSeats: 6,
    pricePKR: 34000,
    originalPricePKR: 39000,
    rating: 4.82,
    reviewsCount: 145,
    difficulty: "Easy",
    groupType: "History Buffs, Families & Photographers",
    transportType: "AC Luxury Coaster + Desert 4x4s",
    hotelCategory: "Heritage Palace Hotel / Desert Luxury Camp",
    overview: "Step into royal grandeur and desert mystery. Tour the breathtaking Italianate palaces of Noor Mahal and Darbar Mahal in Bahawalpur, venture into the golden dunes of the Great Cholistan Desert to the towering 40 bastions of Derawar Fort, and experience a desert campfire under brilliant star-filled skies.",
    itinerary: [
      {
        day: 1,
        title: "Arrival in Bahawalpur & Royal Palaces Tour",
        stops: ["M-5 Motorway Transit", "Noor Mahal Italian Chateau & Light Show", "Darbar Mahal Royal Gardens", "Shahi Bazar & Chunri Market"],
        stay: "Bahawalpur Luxury Heritage Hotel",
        meals: "Traditional Saraiki Dinner"
      },
      {
        day: 2,
        title: "4x4 Desert Safari to 9th-Century Derawar Fort & Stargazing",
        stops: ["Ahmedpur East route", "Derawar Fort 40 Bastions & Royal Tombs", "Abbasi Mosque marble court", "Desert Camel Safari & Stargazing Campfire"],
        stay: "Cholistan Desert Luxury Glamping Camp",
        meals: "Breakfast & Authentic Desert Sajji Dinner"
      },
      {
        day: 3,
        title: "Lal Suhanra National Park & Heritage Return",
        stops: ["Lal Suhanra Blackbuck Reserve", "Tomb of Bibi Jawindi (Uch Sharif connector)", "Return drive to Lahore / Multan"],
        stay: "Trip Conclusion",
        meals: "Breakfast & Sohan Halwa Tasting"
      }
    ],
    inclusions: [
      "AC Transport throughout with professional chauffeur",
      "Desert 4x4 Vehicles for deep Cholistan dune safari",
      "2 Nights Stay (1 night Heritage Hotel + 1 night Desert Glamping)",
      "All Breakfasts & Authentic Saraiki Dinners (Desert Mutton Sajji included)",
      "Palace entry tickets & licensed heritage historian guide",
      "Desert campfire & folk music gathering"
    ],
    exclusions: ["Private camel rides", "Lunches", "Camera fees inside royal palaces"],
    gearChecklist: ["Sun hat & UV sunglasses", "Light breathable cotton clothes", "Warm evening layer", "Power bank", "CNIC"]
  },
  {
    id: "tour-lahore-heritage-3d",
    title: "3-Day Historic Lahore, Badshahi Mosque & Sufi Food Street Odyssey",
    destinationId: "lahore",
    destinationName: "Historic Lahore & Cultural Heart",
    region: "Punjab",
    badge: "UNESCO Heritage",
    category: "Cultural & Heritage",
    image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    durationDays: 3,
    durationNights: 2,
    departureCities: ["Islamabad", "Karachi (flight link)", "Faisalabad"],
    nextDeparture: "2026-09-17",
    totalSeats: 20,
    availableSeats: 7,
    pricePKR: 24500,
    originalPricePKR: 29000,
    rating: 4.93,
    reviewsCount: 420,
    difficulty: "Easy Walking",
    groupType: "Foodies, Cultural Travelers & Families",
    transportType: "AC Executive Van + Rangeela Rickshaws",
    hotelCategory: "Avari / Pearl Continental Lahore",
    overview: "Immerse yourself in 1,000 years of living history. Walk the royal trail through Delhi Gate to the tiled Wazir Khan Mosque, admire the grand arches of Badshahi Mosque and Lahore Fort, witness the electrifying Wagah Border ceremony, and feast on world-famous rooftop Food Street delicacies overlooking illuminated Mughal monuments.",
    itinerary: [
      {
        day: 1,
        title: "The Walled City Royal Trail, Delhi Gate & Wazir Khan Mosque",
        stops: ["Delhi Gate entrance", "Shahi Hammam Royal Baths", "Frescoed Wazir Khan Mosque", "Rangeela Rickshaw tour through ancient bazaars", "Haveli Rooftop Dinner with Badshahi view"],
        stay: "Lahore 5-Star / Heritage Boutique Hotel",
        meals: "Mughlai Dinner at Fort Road Food Street"
      },
      {
        day: 2,
        title: "Badshahi Mosque, UNESCO Lahore Fort & Wagah Border Ceremony",
        stops: ["1673 Badshahi Mosque", "Sheesh Mahal (Palace of Mirrors) at Lahore Fort", "Lahore Museum Buddhist & Sikh Galleries", "Wagah Border Flag Lowering Ceremony"],
        stay: "Lahore 5-Star / Heritage Boutique Hotel",
        meals: "Breakfast & Traditional Butt Karahi Lakshmi Chowk Dinner"
      },
      {
        day: 3,
        title: "Shalimar Mughal Gardens & Anarkali Artisan Walk",
        stops: ["UNESCO Shalimar Gardens 410 fountains", "Anarkali Tomb & Traditional Handicrafts Bazar", "Gawalmandi Halwa Puri / Falooda stop", "Drop-off at Airport / Motorway"],
        stay: "Trip Conclusion",
        meals: "Breakfast & Artisan Food Tasting"
      }
    ],
    inclusions: [
      "AC Executive Transport + Decorated Rangeela Rickshaw walled city rides",
      "2 Nights 5-Star Hotel Stay on Double/Twin sharing",
      "Daily Buffet Breakfasts & Gourmet Themed Dinners (Haveli Rooftop + Butt Karahi)",
      "VIP Enclosure passes for Wagah Border Flag Ceremony",
      "All UNESCO monument entry tickets & licensed Walled City authority guide",
      "Traditional Lahore street food and dessert tasting"
    ],
    exclusions: ["Personal souvenirs and shopping", "Lunch expenses"],
    gearChecklist: ["Modest walking attire for mosques", "Comfortable sneakers/walking shoes", "Camera / smartphone with storage", "Original CNIC/Passport"]
  },
  {
    id: "tour-chitral-kalash-6d",
    title: "6-Day Chitral, Kalash Valleys & Lowari Pass Mountain Heritage Expedition",
    destinationId: "chitral",
    destinationName: "Chitral & Kalash Valleys",
    region: "Khyber Pakhtunkhwa",
    badge: "Unique Culture",
    category: "Cultural & Heritage",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    durationDays: 6,
    durationNights: 5,
    departureCities: ["Islamabad", "Peshawar", "Lahore"],
    nextDeparture: "2026-09-21",
    totalSeats: 16,
    availableSeats: 5,
    pricePKR: 64000,
    originalPricePKR: 72000,
    rating: 4.95,
    reviewsCount: 184,
    difficulty: "Moderate",
    groupType: "Cultural Enthusiasts & Adventurers",
    transportType: "AC Grand Cabin to Lowari + Dedicated 4x4 Jeeps",
    hotelCategory: "Chitral Hindu Kush Heights / Kalash Wooden Chalets",
    overview: "Venture into the mystical Hindu Kush mountains. Journey through the Lowari Tunnel into the ancient Kingdom of Chitral, meet the animist Kalash tribes in their vibrant hand-embroidered robes in Bumburet and Rumbur, gaze up at 7,708m Tirich Mir, and explore the historic Shahi Mosque and Chitral Fort.",
    itinerary: [
      {
        day: 1,
        title: "Islamabad to Chitral via Swat Expressway & 10.4km Lowari Tunnel",
        stops: ["Hazara / Swat Motorway", "Lowari Tunnel engineering marvel", "Drosh Valley", "Chitral Town sunset on Kunar River"],
        stay: "Chitral Riverfront Hotel",
        meals: "Dinner"
      },
      {
        day: 2,
        title: "Journey to Bumburet - The Heart of the Kalash Valley",
        stops: ["Ayun Valley 4x4 route", "Bumburet Valley entrance", "Kalash Graveyard & Ancient Temple", "Kalasha Dur Cultural Museum"],
        stay: "Kalash Valley Wooden Chalets Bumburet",
        meals: "Breakfast & Traditional Kalash Walnuts & Cheese Dinner"
      },
      {
        day: 3,
        title: "Rumbur Valley, Animist Altars & Traditional Music Circle",
        stops: ["Rumbur Valley pristine hamlet", "Malosh sacred altar hike", "Interaction with village elders & women weavers", "Evening folk dance & Rubab"],
        stay: "Kalash Valley Wooden Chalets",
        meals: "Breakfast & Mountain Feast"
      },
      {
        day: 4,
        title: "Chitral Town, Shahi Mosque, Royal Fort & Markhor Sanctuary",
        stops: ["300-year-old Chitral Fort", "Shahi Masjid marble minarets", "Chitral Gol National Park Markhor viewpoint", "Chitrali Patti woolen market"],
        stay: "Chitral Deluxe Hotel",
        meals: "Breakfast & Traditional Chitrali Pulao Dinner"
      },
      {
        day: 5,
        title: "Scenic Excursion towards Garam Chashma / Tirich Mir View",
        stops: ["Kunar river rapids", "Tirich Mir 7,708m snow peak viewpoint", "Garam Chashma natural sulphur hot springs"],
        stay: "Chitral Deluxe Hotel",
        meals: "Breakfast & Dinner"
      },
      {
        day: 6,
        title: "Return Journey to Islamabad / Peshawar via Lowari",
        stops: ["Dir Valley panoramic pass", "Malakand viewpoint", "Drop-off in Islamabad by night"],
        stay: "Trip Conclusion",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "AC Transport from Islamabad + Dedicated 4x4 Jeeps for Kalash valleys",
      "5 Nights Premium Lodge Accommodation (Chitral + Kalash Chalets)",
      "Daily Breakfasts & Authentic Mountain Dinners",
      "Kalash Valley entry permits & cultural museum tickets",
      "Licensed Local Chitrali Historian & Tour Escort",
      "First Aid Kit & high-altitude support"
    ],
    exclusions: ["Personal donations & handicrafts", "Lunches on travel days"],
    gearChecklist: ["Warm jacket / fleece", "Comfortable hiking shoes", "Camera with extra batteries", "Sunscreen SPF 50+", "Original CNIC"]
  },
  {
    id: "tour-murree-galyat-3d",
    title: "3-Day Murree, Nathia Gali, Mukshpuri Peak & Ayubia Retreat",
    destinationId: "murree",
    destinationName: "Murree & Galyat Hills",
    region: "Punjab / KP Border",
    badge: "Quick Escape",
    category: "Mountains & Valleys",
    image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80",
    durationDays: 3,
    durationNights: 2,
    departureCities: ["Islamabad", "Lahore", "Faisalabad"],
    nextDeparture: "2026-09-18",
    totalSeats: 25,
    availableSeats: 12,
    pricePKR: 27500,
    originalPricePKR: 32000,
    rating: 4.76,
    reviewsCount: 310,
    difficulty: "Easy to Moderate",
    groupType: "Families, Couples & Weekend Travelers",
    transportType: "Executive Saloon Coaster / Hiace Van",
    hotelCategory: "PC Bhurban / Lockwood Heritage Hotel Murree",
    overview: "The ultimate cool mountain weekend. Breathe crisp pine mountain air on the famous Nathia Gali Pipeline Walk, hike to the 360-degree panoramic summit of Mukshpuri Peak (2,800m), ride the chairlifts at Patriata and Ayubia, and stroll down historic Mall Road Murree.",
    itinerary: [
      {
        day: 1,
        title: "Islamabad to Murree Mall Road & Patriata Cable Car",
        stops: ["Murree Expressway scenic drive", "Patriata New Murree Chairlift & Cable Car", "Mall Road colonial walk & shopping", "Pindi Point sunset"],
        stay: "Murree / Bhurban Luxury Mountain Hotel",
        meals: "Dinner"
      },
      {
        day: 2,
        title: "Nathia Gali Pipeline Walk & Hike to Mukshpuri Top (2,800m)",
        stops: ["Historic 1931 Pipeline Trek through dense pines", "Governor House Nathia Gali viewpoint", "Mukshpuri Peak alpine meadows hike", "Hot Chai & Pakora at Dunga Gali"],
        stay: "Murree / Bhurban Luxury Mountain Hotel",
        meals: "Breakfast & Pinecone Bonfire BBQ Dinner"
      },
      {
        day: 3,
        title: "Ayubia National Park Chairlift & Return Journey",
        stops: ["Ayubia National Park & Chairlift ride", "Kashmir Point Murree", "Monal / Islamabad drop-off by evening"],
        stay: "Trip Conclusion",
        meals: "Breakfast"
      }
    ],
    inclusions: [
      "Executive AC Transport with skilled hill driver",
      "2 Nights Luxury Hotel Stay on Double/Twin sharing",
      "Daily Buffet Breakfasts & Gourmet Mountain Dinners (including 1 Live BBQ)",
      "Guided trek to Mukshpuri Peak & Pipeline track assistance",
      "All expressway tolls and parking charges"
    ],
    exclusions: ["Patriata / Ayubia Chairlift tickets", "Lunch expenses"],
    gearChecklist: ["Light warm sweater / windbreaker", "Comfortable walking / running shoes", "Rain poncho or umbrella", "Valid CNIC"]
  }
];
