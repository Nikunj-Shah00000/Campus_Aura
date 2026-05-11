const mongoose = require('mongoose');

const campusStatsSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    unique: true,
    index: true
  },
  aggregates: {
    totalCheckins: { type: Number, default: 0 },
    averageMoodScore: { type: Number, default: 0 },
    distressRate: { type: Number, default: 0 },
    activeUsers24h: { type: Number, default: 0 }
  },
  moodDistribution: {
    radiant: { type: Number, default: 0 },
    breeze: { type: Number, default: 0 },
    mist: { type: Number, default: 0 },
    storm: { type: Number, default: 0 },
    void: { type: Number, default: 0 }
  },
  federatedModelVersion: {
    type: String,
    default: '1.0.0'
  },
  aiConfidence: {
    type: Number,
    default: 0.95
  }
}, {
  timestamps: true
});

// Index for time-series queries
campusStatsSchema.index({ timestamp: -1 });

module.exports = mongoose.model('CampusStats', campusStatsSchema);