import { redis } from '@/lib/redis';

const DEFAULT_TTL = 3600; // 1 hour in seconds

/**
 * Generic cache utility using Redis
 */
export const cache = {
    /**
     * Get value from cache
     */
    async get<T>(key: string): Promise<T | null> {
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