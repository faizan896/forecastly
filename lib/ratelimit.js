/**
 * Rate limiting with graceful degradation.
 *
 *  • If Upstash Redis env vars are set (UPSTASH_REDIS_REST_URL + _TOKEN), use a
 *    real DISTRIBUTED sliding-window limiter that works across every serverless
 *    instance — this is the production-correct path.
 *  • Otherwise fall back to a per-instance in-memory limiter, which only blunts
 *    single-instance bursts (fine for local/dev, insufficient at scale).
 *
 * To enable distributed limiting: create a free Upstash Redis DB, then add
 * UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to the Vercel project.
 */
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(40, "10 s"),
      prefix: "vexa-rl",
      analytics: false,
    });
  } catch { limiter = null; }
}

// --- in-memory fallback ---
const HITS = new Map();
function memLimit(key, { limit = 30, windowMs = 10_000 } = {}) {
  const now = Date.now();
  const arr = (HITS.get(key) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  HITS.set(key, arr);
  if (HITS.size > 5000) {
    for (const [k, v] of HITS) if (!v.length || now - v[v.length - 1] > windowMs) HITS.delete(k);
  }
  return { ok: arr.length <= limit, remaining: Math.max(0, limit - arr.length) };
}

export async function checkRateLimit(key, opts = {}) {
  if (limiter) {
    try {
      const r = await limiter.limit(key);
      return { ok: r.success, remaining: r.remaining };
    } catch {
      /* Redis hiccup — fall back rather than fail the request */
    }
  }
  return memLimit(key, opts);
}

export function clientIp(req) {
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0] : null) || req.headers.get("x-real-ip") || "anon";
}
