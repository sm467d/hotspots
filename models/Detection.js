const mongoose = require('mongoose');

const DetectionSchema = new mongoose.Schema({
  cell: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  fires: [{
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    size: {
      type: Number,
      required: true,
      min: 0
    },
    severity: {
      type: Number,
      required: true,
      min: 0,
      max: 10 // Assuming a scale of 0-10 for individual fire severity
    }
  }],
  detectionSeverity: {
    type: Number,
    required: true,
    min: 0,
    max: 10 // Assuming a scale of 0-10 for overall detection severity
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Predicted', 'Mitigated']
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Update the updatedAt timestamp before saving
DetectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Detection', DetectionSchema);
