interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * In-memory rate limiter.
 * For single-instance deployments. Use Redis for multi-instance.
 */
export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000,
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return {
    ok: true,
    remaining: limit - bucket.count,
    resetAt: bucket.resetAt,
  };
}
