# Wildfire Data Simulation with Grid Cell System

This project provides a simulated data stream of wildfire characteristics using MongoDB as the data source. It uses a grid cell coordinate system to identify wildfire locations instead of specific latitude/longitude coordinates.

## Features

- MongoDB database with detailed wildfire data model
- Grid cell coordinate system for spatial identification of wildfires
- REST API with filtering capabilities
- Support for querying wildfires by grid cell and grid range
- Simulated data with realistic wildfire characteristics

## Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or remote instance)

## Installation

<!-- 1. Clone this repository
   ```
   git clone <repository-url>
   cd wildfire-data-stream
   ``` -->

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/wildfires
   API_URL=http://localhost:5001/api
   ```

## Usage

### Starting the Database

1. Make sure MongoDB is running:
   
   For macOS with Homebrew:
   ```
   brew services start mongodb-community
   ```
   
   For other systems, please refer to the [MongoDB documentation](https://docs.mongodb.com/manual/administration/install-community/).

### Seeding the Database

1. Populate the database with sample wildfire data:
   ```
   npm run seed
   ```
   This will create 100 wildfire records with realistic data across various regions, using the grid cell system for spatial coordinates.

### Starting the Server

1. Start the API server:
   ```
   npm start
   ```
   The server will start on port 5001 (or the port specified in your .env file).

### Querying the Data

Run the query test script to verify the data and API functionality:
```
node query-test.js
```

This script demonstrates various ways to query the wildfire data:
- Fetching all wildfires
- Filtering wildfires by region
- Finding wildfires at specific grid cells
- Querying wildfires within a grid range

## API Endpoints

- `GET /api/wildfires` - Get all wildfires with optional filtering
  - Query parameters: `status`, `region`, `minAcres`, `maxAcres`, `cause`, `gridX`, `gridY`
- `GET /api/wildfires/grid/:region` - Get wildfires in a specific grid cell range
  - Query parameters: `minX`, `maxX`, `minY`, `maxY`
- `GET /api/wildfires/:id` - Get a specific wildfire by ID

## Grid Cell System

The grid cell system provides a discrete way to represent geographic locations:
- Each region has its own grid system with cells numbered from (0,0) to (width-1, height-1)
- Grid cell dimensions vary by region to account for different geographic sizes
- Each wildfire has both grid cell coordinates and approximate latitude/longitude values

### Region Grid Dimensions

- California: 10×20 grid
- Oregon: 8×10 grid
- Washington: 8×8 grid
- Arizona: 10×10 grid
- Colorado: 8×8 grid
- Montana: 10×8 grid
- Idaho: 8×10 grid
- Nevada: 8×12 grid
- New Mexico: 8×10 grid
- Utah: 6×8 grid
- Wyoming: 6×6 grid

## Wildfire Data Model

Each wildfire record includes:

- Basic information (ID, name, start date)
- Location data (grid cell coordinates, region, approximate lat/long)
- Status (active, contained, extinguished)
- Size metrics (acres, containment percentage)
- Environmental conditions (wind, temperature, humidity)
- Resources assigned (personnel, vehicles, aircraft)
- Evacuation orders
- Cause and fuel types information
- Terrain characteristics

## Project Structure

- `index.js` - Main server file with API endpoints
- `models/Wildfire.js` - Mongoose schema for wildfire data
- `config/db.js` - MongoDB connection utility
- `seedDatabase.js` - Script to populate the database with sample data
- `query-test.js` - Utility to test querying the wildfire data

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 