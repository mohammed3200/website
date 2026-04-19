import Redis from 'ioredis';
import { isBuildPhase } from './env-utils';

const globalForRedis = global as unknown as { redis: Redis | undefined };

let _redis: Redis | undefined;

function createMockRedis(): Redis {
  const mock = {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    hget: async () => null,
    hset: async () => 1,
    hdel: async () => 1,
    hgetall: async () => ({}),
    expire: async () => 1,
    incr: async () => 1,
    decr: async () => 0,
    lpush: async () => 1,
    rpush: async () => 1,
    lpop: async () => null,
    rpop: async () => null,
    sadd: async () => 1,
    srem: async () => 1,
    smembers: async () => [],
    publish: async () => 0,
    subscribe: async () => { },
    on: function (_event: string, _handler: (...args: unknown[]) => void) {
      return this;
    },
    once: function (_event: string, _handler: (...args: unknown[]) => void) {
      return this;
    },
    quit: async () => 'OK',
    disconnect: () => { },
  } as unknown as Redis;

  return mock;
}

function getRedis(): Redis {
  if (_redis) return _redis;
  if (globalForRedis.redis) {
    _redis = globalForRedis.redis;
    return _redis;
  }

  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    if (process.env.NODE_ENV === 'production' && !isBuildPhase) {
      console.warn(
        '⚠️ REDIS_URL is not defined. Using in-memory mock Redis (features like Background Workers will not function properly).',
      );
    }

    if (isBuildPhase || process.env.NODE_ENV === 'production') {
      // Return a mock instance during Next.js static build or in production without Redis
      _redis = createMockRedis();
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
      _redis = createMockRedis();
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
