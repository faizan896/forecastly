/**
 * Lightweight in-memory sliding-window rate limiter (per serverless instance).
 * Not a substitute for Redis/Upstash at massive scale, but stops burst abuse and
 * accidental floods against the metered upstream (FMP) key with zero extra infra.
 */
const HITS = new Map(); // key -> number[] (timestamps ms)

export function rateLimit(key, { limit = 30, windowMs = 10_000 } = {}) {
  const now = Date.now();
  const arr = (HITS.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  HITS.set(key, arr);
  // opportunistic cleanup so the Map can't grow unbounded
  if (HITS.size > 5000) {
    for (const [k, v] of HITS) {
      if (!v.length || now - v[v.length - 1] > windowMs) HITS.delete(k);
    }
  }
  return { ok: arr.length <= limit, remaining: Math.max(0, limit - arr.length) };
}

export function clientIp(req) {
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0] : null) || req.headers.get("x-real-ip") || "anon";
}
