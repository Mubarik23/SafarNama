/**
 * SafarNama PK - Transport & 4x4 Mountain Rentals Dataset
 * Pricing per day in PKR, with experienced mountain drivers, fuel policies & terrain ratings
 */

export const INITIAL_TRANSPORT = [
  {
    id: "trans-prado-tx",
    name: "Toyota Prado TX 4x4 (Mountain Edition)",
    category: "4x4 Luxury SUV",
    capacity: "4-5 Passengers + Luggage",
    ratePerDayPKR: 22000,
    driverIncluded: true,
    fuelPolicy: "Driver & vehicle provided; fuel on actuals or flat mountain route rate",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    terrainSuitability: "Deosai Plains, Babusar Pass, Khunjerab, Mahodand Lake, Kumrat",
    features: ["High Ground Clearance 4WD", "Dual AC & Mountain Heater", "Experienced Mountain Chauffeur", "Bluetooth Sound System", "Emergency Recovery Winch"],
    rating: 4.96,
    tripsCompleted: 340,
    availableUnits: 8
  },
  {
    id: "trans-hiace-grand-cabin",
    name: "Toyota Hiace Grand Cabin Executive",
    category: "Luxury Group Van",
    capacity: "10-12 Passengers",
    ratePerDayPKR: 19500,
    driverIncluded: true,
    fuelPolicy: "Chauffeured; intercity & KKH mountain certified",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    terrainSuitability: "Islamabad to Hunza, Skardu, Swat, Naran, Gwadar Coastal Highway",
    features: ["Executive Reclining Captain Seats", "Dual Chilled AC", "Luggage Roof Rack & Trunk", "Smart TV & Audio System", "USB Charging at every seat"],
    rating: 4.91,
    tripsCompleted: 580,
    availableUnits: 12
  },
  {
    id: "trans-coaster-saloon",
    name: "Toyota Coaster Executive Saloon",
    category: "Corporate / Family Coaster",
    capacity: "22-29 Passengers",
    ratePerDayPKR: 29000,
    driverIncluded: true,
    fuelPolicy: "Chauffeured with assistant conductor",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    terrainSuitability: "Motorways, Hazara Expressway, KKH to Karimabad & Skardu Highway",
    features: ["Air Suspension", "Mic & PA System for Guide", "Overhead Luggage Bins", "Curtains & Tinted Glass", "Experienced Highway Driver"],
    rating: 4.88,
    tripsCompleted: 420,
    availableUnits: 6
  },
  {
    id: "trans-willys-jeep-4x4",
    name: "Rugged Mountain Jeep 4x4 (Raikot / Tato / Ratti Gali)",
    category: "Extreme Off-Road Jeep",
    capacity: "4-6 Passengers",
    ratePerDayPKR: 14000,
    driverIncluded: true,
    fuelPolicy: "Dedicated local route driver & all fuel included",
    image: "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80",
    terrainSuitability: "Fairy Meadows cliffside track, Ratti Gali rocky trail, Katora Lake approach",
    features: ["Low-range 4x4 Transfer Case", "Local Indigenous Mountain Driver", "Open / Covered Canopy option", "High Altitude Tuning"],
    rating: 4.95,
    tripsCompleted: 910,
    availableUnits: 15
  },
  {
    id: "trans-corolla-grande",
    name: "Toyota Corolla Altis Grande / Civic",
    category: "Intercity Sedan",
    capacity: "3-4 Passengers",
    ratePerDayPKR: 11000,
    driverIncluded: true,
    fuelPolicy: "With professional driver for city & moderate mountain routes",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    terrainSuitability: "Islamabad, Lahore, Murree, Swat, Abbottabad, Muzaffarabad",
    features: ["Climate Control AC", "Smooth Highway Ride", "Clean & Sanitized", "Experienced Driver"],
    rating: 4.82,
    tripsCompleted: 670,
    availableUnits: 14
  }
];
