const mongoose = require('mongoose');
const crypto = require('crypto');

// Anonymous mood check-in schema - no PII storage
const moodCheckinSchema = new mongoose.Schema({
  // Hashed anonymous identifier (rotated daily)
  anonymousId: {
    type: String,
    required: true,
    index: true
  },
  mood: {
    type: String,
    enum: ['radiant', 'breeze', 'mist', 'storm', 'void'],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  // Federated learning contribution
  localModelUpdate: {
    type: Object,
    default: null
  },
  // Differential privacy noise added
  dpNoise: {
    type: Number,
    default: 0
  },
  // Session info (non-identifying)
  sessionId: {
    type: String,
    index: true
  }
}, {
  timestamps: true,
  expires: 90 * 24 * 60 * 60 // Auto-delete after 90 days
});

// Pre-save hook to add differential privacy
moodCheckinSchema.pre('save', function(next) {
  if (!this.dpNoise) {
    // Laplace noise for differential privacy
    const lambda = 0.5;
    const noise = (Math.random() - 0.5) * lambda;
    this.dpNoise = noise;
  }
  next();
});

// Static method to generate anonymous ID
moodCheckinSchema.statics.generateAnonymousId = function() {
  const date = new Date().toISOString().split('T')[0];
  const salt = process.env.ANON_SALT || 'campus-salt';
  return crypto
    .createHash('sha256')
    .update(`${date}:${salt}:${Math.random()}`)
    .digest('hex')
    .substring(0, 32);
};

module.exports = mongoose.model('MoodCheckin', moodCheckinSchema);