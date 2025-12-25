// Ye cache.service service hai jo cache.service related operations handle karta hai.
const redisClient = require('../config/redis');

class CacheService {
  static async set(key, value, ttl = 3600) { // ttl in seconds, default 1 hour
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async get(key) {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async del(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Cache del error:', error);
    }
  }

  static async clear() {
    try {
      await redisClient.flushAll();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
}

module.exports = CacheService;

