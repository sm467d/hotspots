const mongoose = require('mongoose');

const wildfireSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  location: {
    gridCell: { 
      x: { type: Number, required: true },
      y: { type: Number, required: true }
    },
    region: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  startDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'contained', 'extinguished'], 
    required: true 
  },
  size: { 
    acres: { type: Number, required: true },
    containmentPercentage: { type: Number, min: 0, max: 100, default: 0 }
  },
  conditions: {
    windSpeed: { type: Number }, // mph
    windDirection: { type: String },
    temperature: { type: Number }, // Fahrenheit
    humidity: { type: Number }, // percentage
    precipitation: { type: Number } // inches
  },
  resources: {
    personnelCount: { type: Number },
    aircraftCount: { type: Number },
    vehiclesCount: { type: Number }
  },
  evacuationOrders: [{
    area: { type: String },
    status: { type: String, enum: ['mandatory', 'warning', 'lifted'] },
    issuedAt: { type: Date }
  }],
  cause: { type: String },
  fuelTypes: [{ type: String }], // e.g., 'grass', 'timber', 'brush'
  terrainTypes: [{ type: String }], // e.g., 'mountainous', 'flat', 'canyon'
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Wildfire', wildfireSchema); 