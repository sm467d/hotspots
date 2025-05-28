const faker = require('faker');
const connectDB = require('./config/db');
const Wildfire = require('./models/Wildfire');

// Helper function to generate random number within a range
const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to randomly select an item from an array
const randomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Sample data for wildfire generation
const regions = ['California', 'Oregon', 'Washington', 'Arizona', 'Colorado', 'Montana', 'Idaho', 'Nevada', 'New Mexico', 'Utah', 'Wyoming'];
const fuelTypes = ['grass', 'timber', 'brush', 'chaparral', 'mixed', 'slash'];
const terrainTypes = ['mountainous', 'flat', 'hilly', 'canyon', 'valley', 'ridge', 'forest'];
const causes = ['lightning', 'human-caused', 'equipment failure', 'campfire', 'arson', 'prescribed fire', 'powerline', 'unknown'];
const windDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Generate a random wildfire
const generateWildfire = (id) => {
  const startDate = faker.date.past(1);
  
  const region = randomItem(regions);
  
  // Generate grid cell and coordinates based on region
  let latitude, longitude, gridX, gridY;
  
  // Define grid boundaries for each region (simplified)
  // Each region has a grid system with cells numbered from (0,0) to (gridWidth-1, gridHeight-1)
  const regionGrids = {
    'California': { width: 10, height: 20 },
    'Oregon': { width: 8, height: 10 },
    'Washington': { width: 8, height: 8 },
    'Arizona': { width: 10, height: 10 },
    'Colorado': { width: 8, height: 8 },
    'Montana': { width: 10, height: 8 },
    'Idaho': { width: 8, height: 10 },
    'Nevada': { width: 8, height: 12 },
    'New Mexico': { width: 8, height: 10 },
    'Utah': { width: 6, height: 8 },
    'Wyoming': { width: 6, height: 6 }
  };
  
  // Get grid dimensions for the region or use default
  const grid = regionGrids[region] || { width: 10, height: 10 };
  
  // Generate random grid cell within the region's grid
  gridX = randomNumber(0, grid.width - 1);
  gridY = randomNumber(0, grid.height - 1);
  
  // Also generate approximate latitude/longitude for reference
  switch (region) {
    case 'California':
      latitude = 32.5 + (gridY / grid.height) * 9.5; // 32.5 to 42
      longitude = -124.4 + (gridX / grid.width) * 10.3; // -124.4 to -114.1
      break;
    case 'Oregon':
      latitude = 42 + (gridY / grid.height) * 4.3; // 42 to 46.3
      longitude = -124.6 + (gridX / grid.width) * 8.1; // -124.6 to -116.5
      break;
    // Add more cases for other regions as needed
    default:
      latitude = 32 + (gridY / 10) * 17; // 32 to 49
      longitude = -125 + (gridX / 10) * 23; // -125 to -102
  }
  
  const status = randomItem(['active', 'contained', 'extinguished']);
  const acres = randomNumber(1, 500000);
  const containmentPercentage = status === 'extinguished' ? 100 : 
                               status === 'contained' ? randomNumber(70, 99) : 
                               randomNumber(0, 70);
  
  return {
    id: `WF-${id}`,
    name: `${faker.address.county()} ${randomItem(['Fire', 'Complex', 'Wildfire'])}`,
    location: {
      gridCell: {
        x: gridX,
        y: gridY
      },
      region: region,
      coordinates: {
        latitude: latitude,
        longitude: longitude
      }
    },
    startDate,
    status,
    size: {
      acres,
      containmentPercentage
    },
    conditions: {
      windSpeed: randomNumber(0, 50),
      windDirection: randomItem(windDirections),
      temperature: randomNumber(60, 110),
      humidity: randomNumber(5, 90),
      precipitation: parseFloat((Math.random() * 3).toFixed(2))
    },
    resources: {
      personnelCount: randomNumber(10, 5000),
      aircraftCount: randomNumber(0, 30),
      vehiclesCount: randomNumber(5, 200)
    },
    evacuationOrders: Array(randomNumber(0, 5)).fill().map(() => ({
      area: `${faker.address.streetName()} ${faker.address.streetSuffix()}`,
      status: randomItem(['mandatory', 'warning', 'lifted']),
      issuedAt: faker.date.between(startDate, new Date())
    })),
    cause: randomItem(causes),
    fuelTypes: Array(randomNumber(1, 3)).fill().map(() => randomItem(fuelTypes)),
    terrainTypes: Array(randomNumber(1, 3)).fill().map(() => randomItem(terrainTypes)),
    updatedAt: faker.date.recent()
  };
};

// Seed the database
const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Wildfire.deleteMany({});
    console.log('Existing wildfires data cleared');
    
    // Generate and insert 100 random wildfires
    const wildfires = [];
    for (let i = 1; i <= 100; i++) {
      wildfires.push(generateWildfire(i));
    }
    
    await Wildfire.insertMany(wildfires);
    console.log(`${wildfires.length} wildfires inserted into the database`);
    
    process.exit();
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase(); 