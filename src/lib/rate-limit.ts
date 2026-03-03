import { redis } from './redis';

/**
 * Simple Redis-based rate limiter
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

        return {
            success: true,
            limit,
            remaining: limit - (count + 1),
            reset: duration
        };
    } catch (error) {
        console.error('Rate limit error:', error);
        // Fail-safe: allow if Redis is down
        return {
            success: true,
            limit,
            remaining: 1,
            reset: duration
        };
    }
}
