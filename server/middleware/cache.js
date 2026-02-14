/**
 * Cache Middleware for AstroView API
 * Uses node-cache to cache API responses and reduce external API calls
 */

import { cache } from '../index.js';

/**
 * Cache middleware factory
 * @param {number} ttl - Time to live in seconds (optional, uses default if not provided)
 * @returns {Function} Express middleware function
 */
export const cacheMiddleware = (ttl) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from request URL and query parameters
    const cacheKey = `${req.baseUrl}${req.path}${JSON.stringify(req.query)}`;

    try {
      // Check if data exists in cache
      const cachedData = cache.get(cacheKey);

      if (cachedData) {
        console.log(`✓ Cache HIT: ${cacheKey}`);
        return res.json({
          ...cachedData,
          _cached: true,
          _cacheTime: new Date().toISOString()
        });
      }

      console.log(`✗ Cache MISS: ${cacheKey}`);

      // Store the original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (data) => {
        // Cache the data
        const ttlToUse = ttl || cache.options.stdTTL;
        cache.set(cacheKey, data, ttlToUse);
        console.log(`✓ Cached: ${cacheKey} (TTL: ${ttlToUse}s)`);

        // Send the response with cache metadata
        return originalJson({
          ...data,
          _cached: false,
          _cacheTTL: ttlToUse
        });
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      // On cache error, continue without caching
      next();
    }
  };
};

/**
 * Clear cache for specific pattern or all cache
 * @param {string} pattern - Optional pattern to match cache keys (uses includes)
 * @returns {number} Number of keys deleted
 */
export const clearCache = (pattern) => {
  if (!pattern) {
    // Clear all cache
    const keys = cache.keys();
    cache.flushAll();
    console.log(`🗑️ Cleared all cache (${keys.length} keys)`);
    return keys.length;
  }

  // Clear cache matching pattern
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(pattern));
  
  let deleted = 0;
  matchingKeys.forEach(key => {
    const success = cache.del(key);
    if (success) deleted++;
  });

  console.log(`🗑️ Cleared ${deleted} cache keys matching: ${pattern}`);
  return deleted;
};

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export const getCacheStats = () => {
  const stats = cache.getStats();
  const keys = cache.keys();
  
  return {
    keys: keys.length,
    hits: stats.hits,
    misses: stats.misses,
    hitRate: stats.hits > 0 ? (stats.hits / (stats.hits + stats.misses) * 100).toFixed(2) + '%' : '0%',
    ...stats
  };
};
