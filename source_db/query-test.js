const fetch = require('node-fetch');
require('dotenv').config();

const API_URL = process.env.API_URL || 'http://localhost:5001/api';

// Function to format wildfire data in a readable way
function formatWildfire(wildfire) {
  return {
    id: wildfire.id,
    name: wildfire.name,
    region: wildfire.location.region,
    gridCell: wildfire.location.gridCell,
    status: wildfire.status,
    acres: wildfire.size.acres,
    containment: `${wildfire.size.containmentPercentage}%`,
    cause: wildfire.cause,
    startDate: new Date(wildfire.startDate).toLocaleDateString(),
    evacuationOrders: wildfire.evacuationOrders.length
  };
}

// Get all wildfires
async function getAllWildfires() {
  try {
    const response = await fetch(`${API_URL}/wildfires`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching wildfires:', error);
    return [];
  }
}

// Get wildfires by region
async function getWildfiresByRegion(region) {
  try {
    const response = await fetch(`${API_URL}/wildfires?region=${region}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching wildfires for region ${region}:`, error);
    return [];
  }
}

// Get wildfires by grid cell
async function getWildfiresByGridCell(x, y) {
  try {
    const response = await fetch(`${API_URL}/wildfires?gridX=${x}&gridY=${y}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching wildfires for grid cell (${x},${y}):`, error);
    return [];
  }
}

// Get wildfires by grid cell range
async function getWildfiresByGridRange(region, minX, maxX, minY, maxY) {
  try {
    const response = await fetch(
      `${API_URL}/wildfires/grid/${region}?minX=${minX}&maxX=${maxX}&minY=${minY}&maxY=${maxY}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching wildfires by grid range:`, error);
    return { count: 0, wildfires: [] };
  }
}

// Main function
async function main() {
  console.log('==== WILDFIRE DATA QUERY TEST ====');
  
  // Get all wildfires
  console.log('\n1. Fetching all wildfires...');
  const allWildfires = await getAllWildfires();
  console.log(`Found ${allWildfires.length} wildfires total`);
  
  // Group by region
  const regions = {};
  allWildfires.forEach(fire => {
    const region = fire.location.region;
    if (!regions[region]) regions[region] = 0;
    regions[region]++;
  });
  
  console.log('\nWildfires by region:');
  Object.entries(regions).forEach(([region, count]) => {
    console.log(`- ${region}: ${count} wildfires`);
  });
  
  // Sample a few wildfires
  console.log('\nSample wildfires:');
  for (let i = 0; i < Math.min(5, allWildfires.length); i++) {
    console.log(formatWildfire(allWildfires[i]));
  }
  
  // Get California wildfires
  console.log('\n2. Fetching California wildfires...');
  const caWildfires = await getWildfiresByRegion('California');
  console.log(`Found ${caWildfires.length} wildfires in California`);
  
  // Count by status
  const activeCA = caWildfires.filter(fire => fire.status === 'active').length;
  const containedCA = caWildfires.filter(fire => fire.status === 'contained').length;
  const extinguishedCA = caWildfires.filter(fire => fire.status === 'extinguished').length;
  
  console.log(`Status breakdown: ${activeCA} active, ${containedCA} contained, ${extinguishedCA} extinguished`);
  
  // Test grid cell query
  console.log('\n3. Fetching wildfires at grid cell (3,15)...');
  const gridCellWildfires = await getWildfiresByGridCell(3, 15);
  console.log(`Found ${gridCellWildfires.length} wildfires at grid cell (3,15)`);
  
  if (gridCellWildfires.length > 0) {
    console.log('Grid cell wildfires:');
    gridCellWildfires.forEach(fire => console.log(formatWildfire(fire)));
  }
  
  // Test grid range query
  console.log('\n4. Fetching wildfires in northern California grid range (0-4, 15-19)...');
  const gridRangeResult = await getWildfiresByGridRange('California', 0, 4, 15, 19);
  console.log(`Found ${gridRangeResult.count} wildfires in grid range:`);
  console.log(gridRangeResult.gridRange);
  
  if (gridRangeResult.count > 0) {
    console.log('Grid range wildfires:');
    gridRangeResult.wildfires.forEach(fire => console.log(formatWildfire(fire)));
  }
  
  console.log('\n==== QUERY TEST COMPLETE ====');
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 