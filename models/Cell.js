const mongoose = require('mongoose');

const cellSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  coordinate: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  windSpeed: { type: Number }, // mph
  windDirection: { type: String }, // e.g., 'N', 'NE', 'E', etc.
  terrain: {
    type: String,
    enum: ['mountainous', 'flat', 'canyon', 'hills', 'valley'],
    required: true
  },
  resources: {
    personnel: { type: Number, default: 0 },
    aircrafts: { type: Number, default: 0 },
    vehicles: { type: Number, default: 0 },
    water: { type: Number, default: 0 },
    infrastructure: { type: Number, default: 0 }
  },
  fuel: {
    class: { 
      type: String,
      enum: ['vegetation', 'vehicle_fuel', 'structural_wood'], 
      required: true 
    },
    percent: { 
      type: Number,
      min: 0,
      max: 100,
      required: true 
    }
  },
  fires: [{
    probability: { 
      type: Number,
      min: 0,
      max: 1,
      required: true 
    },
    size: { 
      type: Number, // in acres
      min: 0,
      required: true 
    },
    severity: { 
      type: String,
      enum: ['low', 'moderate', 'high', 'extreme'],
      required: true 
    }
  }],
  updatedAt: { type: Date, default: Date.now }
});

// Create a compound index on coordinates to ensure uniqueness of cells
cellSchema.index({ 'coordinate.x': 1, 'coordinate.y': 1 }, { unique: true });

module.exports = mongoose.model('Cell', cellSchema); 