// Ye Redis client setup karta hai for caching.
const { createClient } = require('redis');

let redisClient = null;


if (process.env.NODE_ENV !== 'test') {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.warn('Redis Client Error - Redis may not be available:', err.message);
      redisClient = null;
    });

    redisClient.connect().then(() => {
      console.log('Redis connected successfully');
    }).catch((err) => {
      console.warn('Failed to connect to Redis - continuing without Redis:', err.message);
      redisClient = null;
    });
  } catch (error) {
    console.warn('Redis not available - continuing without Redis');
    redisClient = null;
  }
}

module.exports = redisClient;
