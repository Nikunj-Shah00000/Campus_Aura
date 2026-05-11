const Redis = require('ioredis');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisClient.on('connect', () => {
  console.log('🔴 Redis connected for real-time caching');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Cache with TTL (time-to-live)
const cacheWithTTL = async (key, data, ttl = 300) => {
  await redisClient.setex(key, ttl, JSON.stringify(data));
};

const getFromCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

module.exports = { redisClient, cacheWithTTL, getFromCache };