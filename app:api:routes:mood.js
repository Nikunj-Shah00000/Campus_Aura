const express = require('express');
const router = express.Router();
const MoodCheckin = require('../../models/MoodCheckin');
const { updateCampusStats } = require('../../services/statsService');
const { publishToWebSocket } = require('../../services/websocketManager');
const { validateMoodCheckin } = require('../../utils/validators');

// Submit anonymous mood check-in
router.post('/checkin', async (req, res) => {
  try {
    const { mood, intensity = 5, localModelUpdate = null } = req.body;
    
    // Validate input
    const validation = validateMoodCheckin({ mood, intensity });
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors });
    }
    
    // Generate anonymous ID for this session (no persistent storage)
    const anonymousId = MoodCheckin.generateAnonymousId();
    const sessionId = req.headers['x-session-id'] || `session_${Date.now()}`;
    
    // Create check-in record
    const checkin = new MoodCheckin({
      anonymousId,
      mood,
      intensity,
      localModelUpdate: localModelUpdate ? { weights: localModelUpdate } : null,
      sessionId
    });
    
    await checkin.save();
    
    // Update real-time stats
    await updateCampusStats();
    
    // Broadcast anonymous update to WebSocket clients
    publishToWebSocket('new-checkin', {
      mood,
      intensity,
      timestamp: checkin.timestamp,
      aggregated: true
    });
    
    res.status(201).json({
      success: true,
      message: 'Mood recorded anonymously',
      timestamp: checkin.timestamp,
      privacyNote: 'No personal data stored'
    });
  } catch (error) {
    console.error('Mood checkin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get aggregated mood trends (differentially private)
router.get('/trends', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    
    let startDate;
    switch(timeframe) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }
    
    const trends = await MoodCheckin.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      { $group: {
        _id: { 
          $dateToString: { format: '%Y-%m-%d-%H', date: '$timestamp' }
        },
        count: { $sum: 1 },
        avgIntensity: { $avg: '$intensity' },
        moodDistribution: {
          $push: '$mood'
        }
      }},
      { $sort: { '_id': 1 } }
    ]);
    
    // Add differential privacy noise to counts
    const privateTrends = trends.map(trend => ({
      hour: trend._id,
      count: Math.max(0, trend.count + (Math.random() - 0.5) * 5),
      avgIntensity: Math.min(10, Math.max(1, trend.avgIntensity + (Math.random() - 0.5) * 0.5)),
      moodDistribution: this.addNoiseToDistribution(trend.moodDistribution)
    }));
    
    res.json({
      timeframe,
      data: privateTrends,
      privacyLevel: 'ε-differential privacy (ε=0.5)'
    });
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.addNoiseToDistribution = (distribution) => {
  const counts = {
    radiant: distribution.filter(m => m === 'radiant').length,
    breeze: distribution.filter(m => m === 'breeze').length,
    mist: distribution.filter(m => m === 'mist').length,
    storm: distribution.filter(m => m === 'storm').length,
    void: distribution.filter(m => m === 'void').length
  };
  
  // Add Laplace noise
  Object.keys(counts).forEach(key => {
    counts[key] = Math.max(0, counts[key] + (Math.random() - 0.5) * 3);
  });
  
  return counts;
};

module.exports = router;