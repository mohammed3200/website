import Redis from 'ioredis';

const globalForRedis = global as unknown as { redis: Redis | undefined };

let _redis: Redis | undefined;

function getRedis(): Redis {
  if (_redis) return _redis;
  if (globalForRedis.redis) {
    _redis = globalForRedis.redis;
    return _redis;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  _redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    globalForRedis.redis = _redis;
  }

  return _redis;
}

// Proxy that lazily creates the Redis connection on first property access
export const redis: Redis = new Proxy({} as Redis, {
  get(_target, prop, receiver) {
    const instance = getRedis();
    const value = Reflect.get(instance, prop, instance);
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  },
});

export default redis;
