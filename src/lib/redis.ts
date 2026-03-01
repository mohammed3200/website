import Redis from 'ioredis';
import { isBuildPhase } from './env-utils';

const globalForRedis = global as unknown as { redis: Redis | undefined };

let _redis: Redis | undefined;

function getRedis(): Redis {
  if (_redis) return _redis;
  if (globalForRedis.redis) {
    _redis = globalForRedis.redis;
    return _redis;
  }

  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
      throw new Error(
        '❌ REDIS_URL is not defined. Redis is required for production caching and queues.',
      );
    }

    if (isBuildPhase) {
      // Return a mock instance during Next.js static build to prevent ECONNREFUSED crashes
      _redis = {
        get: async () => null,
        set: async () => 'OK',
        del: async () => 1,
        on: () => { },
      } as unknown as Redis;
      return _redis;
    }

    // Fallback for development/test only
    _redis = new Redis('redis://localhost:6379', {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });
  } else {
    // We shouldn't eagerly connect during build phase even if URL is present
    if (isBuildPhase) {
      _redis = {
        get: async () => null,
        set: async () => 'OK',
        del: async () => 1,
        on: () => { },
      } as unknown as Redis;
      return _redis;
    }

    _redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });
  }

  // Prevent uncaught ECONNREFUSED from crashing the process
  _redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForRedis.redis = _redis;
  }

  return _redis;
}

// Proxy that lazily creates the Redis connection on first property access
export const redis: Redis = new Proxy({} as Redis, {
  get(_target, prop, _receiver) {
    const instance = getRedis();
    const value = Reflect.get(instance, prop, instance);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

export default redis;
