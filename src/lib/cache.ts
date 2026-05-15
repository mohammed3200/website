import { redis } from '@/lib/redis';
import { LRUCache } from 'lru-cache';

const DEFAULT_TTL = 3600; // 1 hour in seconds

// In-memory cache fallback
const memoryCache = new LRUCache<string, any>({
    max: 1000,  // Max 1000 items
    ttl: DEFAULT_TTL * 1000,
});

/**
 * Generic cache utility using Redis (with in-memory fallback)
 */
export const cache = {
    /**
     * Get value from cache
     */
    async get<T>(key: string): Promise<T | null> {
        // Primary Check: If Redis is explicitly disabled via env
        if (!process.env.REDIS_URL) {
            return (memoryCache.get(key) as T) ?? null;
        }

        try {
            const data = await redis.get(key);
            if (!data) {
                // Secondary check: maybe it's in memory cache (e.g. if Redis just went down)
                return (memoryCache.get(key) as T) ?? null;
            }
            return JSON.parse(data) as T;
        } catch (error) {
            console.error(`Cache GET error for key ${key} (falling back to memory):`, error);
            return (memoryCache.get(key) as T) ?? null;
        }
    },

    /**
     * Set value in cache
     */
    async set(key: string, value: any, ttl: number = DEFAULT_TTL): Promise<void> {
        // Always set in memory cache as a fast local fallback
        memoryCache.set(key, value, { ttl: ttl * 1000 });

        if (!process.env.REDIS_URL) {
            return;
        }

        try {
            await redis.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (error) {
            console.error(`Cache SET error for key ${key}:`, error);
            // We already set it in memory above, so we're good
        }
    },

    /**
     * Delete value from cache
     */
    async del(key: string): Promise<void> {
        memoryCache.delete(key);

        if (!process.env.REDIS_URL) {
            return;
        }

        try {
            await redis.del(key);
        } catch (error) {
            console.error(`Cache DEL error for key ${key}:`, error);
        }
    },

    /**
     * Get or set value in cache
     */
    async getOrSet<T>(
        key: string,
        fetcher: () => Promise<T>,
        ttl: number = DEFAULT_TTL
    ): Promise<T> {
        let cached = await this.get<T>(key);
        if (cached) return cached;

        const lockKey = `lock:${key}`;
        const lockToken = Math.random().toString(36).substring(2);
        let acquiredLock = false;

        if (process.env.REDIS_URL) {
            let attempts = 0;
            while (attempts < 5) {
                const acquired = await redis.set(lockKey, lockToken, 'EX', 10, 'NX');
                if (acquired) {
                    acquiredLock = true;
                    break;
                }
                
                await new Promise(resolve => setTimeout(resolve, 200));
                cached = await this.get<T>(key);
                if (cached) return cached;
                attempts++;
            }
        }

        try {
            const fresh = await fetcher();
            await this.set(key, fresh, ttl);
            return fresh;
        } finally {
            if (process.env.REDIS_URL && acquiredLock) {
                const script = `
                    if redis.call("get", KEYS[1]) == ARGV[1] then
                        return redis.call("del", KEYS[1])
                    else
                        return 0
                    end
                `;
                await redis.eval(script, 1, lockKey, lockToken);
            }
        }
    },

    /**
     * Generate cache key
     */
    generateKey(...parts: string[]): string {
        return parts.join(':');
    }
};