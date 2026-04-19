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
        if (!process.env.REDIS_URL) {
            return (memoryCache.get(key) as T) ?? null;
        }

        try {
            const data = await redis.get(key);
            if (!data) return null;
            return JSON.parse(data) as T;
        } catch (error) {
            console.error(`Cache GET error for key ${key}:`, error);
            return null;
        }
    },

    /**
     * Set value in cache
     */
    async set(key: string, value: any, ttl: number = DEFAULT_TTL): Promise<void> {
        if (!process.env.REDIS_URL) {
            memoryCache.set(key, value, { ttl: ttl * 1000 });
            return;
        }

        try {
            await redis.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (error) {
            console.error(`Cache SET error for key ${key}:`, error);
        }
    },

    /**
     * Delete value from cache
     */
    async del(key: string): Promise<void> {
        if (!process.env.REDIS_URL) {
            memoryCache.delete(key);
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
        const cached = await this.get<T>(key);
        if (cached) return cached;

        const fresh = await fetcher();
        await this.set(key, fresh, ttl);
        return fresh;
    },

    /**
     * Generate cache key
     */
    generateKey(...parts: string[]): string {
        return parts.join(':');
    }
};