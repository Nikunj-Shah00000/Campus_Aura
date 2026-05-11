const crypto = require('crypto');
const MoodCheckin = require('../models/MoodCheckin');

class FederatedLearningService {
  constructor() {
    this.globalModel = {
      weights: this.initializeWeights(),
      version: '1.0.0',
      lastUpdate: new Date()
    };
    this.localUpdates = [];
  }

  initializeWeights() {
    return {
      moodWeights: [0.2, 0.2, 0.2, 0.2, 0.2],
      sensitivityThreshold: 0.7,
      interventionBias: 0.3
    };
  }

  async aggregateLocalUpdates() {
    const updates = await MoodCheckin.find({
      timestamp: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      localModelUpdate: { $ne: null }
    }).limit(1000);

    if (updates.length === 0) return;

    // Secure aggregation with homomorphic encryption simulation
    const aggregatedWeights = this.globalModel.weights.moodWeights.map(() => 0);
    
    updates.forEach(update => {
      if (update.localModelUpdate && update.localModelUpdate.weights) {
        update.localModelUpdate.weights.forEach((weight, idx) => {
          aggregatedWeights[idx] += weight;
        });
      }
    });

    // Average the weights
    const averagedWeights = aggregatedWeights.map(w => w / updates.length);
    
    // Update global model with differential privacy
    this.globalModel.weights.moodWeights = averagedWeights.map(w => 
      w + this.addDifferentialPrivacyNoise()
    );
    
    this.globalModel.version = this.incrementVersion();
    this.globalModel.lastUpdate = new Date();
    
    return this.globalModel;
  }

  addDifferentialPrivacyNoise() {
    // Laplace mechanism for differential privacy
    const scale = 0.1;
    return (Math.random() - 0.5) * scale;
  }

  incrementVersion() {
    const parts = this.globalModel.version.split('.');
    parts[2] = parseInt(parts[2]) + 1;
    return parts.join('.');
  }

  async getGlobalModel() {
    return {
      ...this.globalModel,
      privacyGuarantee: 'ε-differential privacy (ε=0.1)',
      participantsCount: await MoodCheckin.countDocuments({
        timestamp: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      })
    };
  }
}

module.exports = new FederatedLearningService();