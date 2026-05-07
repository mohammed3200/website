import { redis } from './redis';
import { LRUCache } from 'lru-cache';

// Fallback in-memory rate limiter using lru-cache
const memoryRateLimiter = new LRUCache<string, { count: number; expiresAt: number }>({
    max: 5000,
    ttl: 15 * 60 * 1000, // 15 mins default max TTL
});

/**
 * Internal helper for in-memory rate limiting fallback
 */
function memoryRateLimit(fullKey: string, limit: number, duration: number) {
    const now = Date.now();
    const record = memoryRateLimiter.get(fullKey);

    if (record && record.count >= limit && record.expiresAt > now) {
        return {
            success: false,
            limit,
            remaining: 0,
            reset: Math.ceil((record.expiresAt - now) / 1000)
        };
    }

    const newCount = (record && record.expiresAt > now) ? record.count + 1 : 1;
    const newExpiresAt = (record && record.expiresAt > now) ? record.expiresAt : now + duration * 1000;

    memoryRateLimiter.set(fullKey, { count: newCount, expiresAt: newExpiresAt }, { ttl: duration * 1000 });

    return {
        success: true,
        limit,
        remaining: limit - newCount,
        reset: duration
    };
}

/**
 * Simple Redis-based rate limiter (with in-memory fallback)
 * @param key The unique key for the rate limit (e.g., ip, email)
 * @param limit Maximum number of attempts
 * @param duration Duration window in seconds
 * @returns Object with success status and remaining attempts
 */
export async function rateLimit(
    key: string,
    limit: number = 5,
    duration: number = 900 // 15 minutes default
) {
    const fullKey = `ratelimit:${key}`;

    const isRedisDisabled = !process.env.REDIS_URL;

    // In-memory fallback if Redis is explicitly disabled
    if (isRedisDisabled) {
        return memoryRateLimit(fullKey, limit, duration);
    }

    try {
        const current = await redis.get(fullKey);
        const count = current ? parseInt(current, 10) : 0;

        if (count >= limit) {
            return {
                success: false,
                limit,
                remaining: 0,
                reset: duration
            };
        }

        // Increment count
        const multi = redis.multi();
        multi.incr(fullKey);

        // Set expiry if new key
        if (count === 0) {
            multi.expire(fullKey, duration);
        }

        await multi.exec();

        // Also sync to memory cache for local fallback consistency
        memoryRateLimiter.set(fullKey, { 
            count: count + 1, 
            expiresAt: Date.now() + duration * 1000 
        }, { ttl: duration * 1000 });

        return {
            success: true,
            limit,
            remaining: limit - (count + 1),
            reset: duration
        };
    } catch (error) {
        console.error('Rate limit error (falling back to memory):', error);
        // Secondary fallback: use memory rate limiter if Redis fails
        return memoryRateLimit(fullKey, limit, duration);
    }
}

