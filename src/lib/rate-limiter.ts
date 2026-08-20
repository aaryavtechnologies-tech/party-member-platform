/**
 * Simple in-memory rate limiter.
 *
 * NOTE: This is effective for single-instance deployments.
 * For multi-instance production (Render, Vercel, etc.), replace with
 * Redis/Upstash: https://github.com/upstash/ratelimit
 */

interface RateLimitRecord {
  count: number;
  windowStart: number;
  blockedUntil?: number;
}

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number; // Optional: lock out after maxRequests exceeded
}

const stores = new Map<string, Map<string, RateLimitRecord>>();

function getStore(namespace: string): Map<string, RateLimitRecord> {
  if (!stores.has(namespace)) {
    stores.set(namespace, new Map());
  }
  return stores.get(namespace)!;
}

export function checkRateLimit(
  namespace: string,
  key: string,
  options: RateLimiterOptions
): { allowed: boolean; retryAfterSeconds?: number; remaining?: number } {
  const { maxRequests, windowMs, blockDurationMs } = options;
  const store = getStore(namespace);
  const now = Date.now();
  const record = store.get(key);

  // Check if currently blocked
  if (record?.blockedUntil && now < record.blockedUntil) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  }

  // Fresh window
  if (!record || now - record.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  // Within window — check count
  if (record.count >= maxRequests) {
    if (blockDurationMs) {
      const blockedUntil = now + blockDurationMs;
      store.set(key, { ...record, blockedUntil });
      const retryAfterSeconds = Math.ceil(blockDurationMs / 1000);
      return { allowed: false, retryAfterSeconds, remaining: 0 };
    }
    const retryAfterSeconds = Math.ceil((record.windowStart + windowMs - now) / 1000);
    return { allowed: false, retryAfterSeconds: Math.max(1, retryAfterSeconds), remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
}

export function resetRateLimit(namespace: string, key: string) {
  const store = getStore(namespace);
  store.delete(key);
}
