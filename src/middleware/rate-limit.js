import { RateLimiterMemory } from 'rate-limiter-flexible'

// Create rate limiter instance
const rateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Number of requests
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) / 1000 || 900, // Per 15 minutes (900 seconds)
})

/**
 * Rate limiting middleware
 */
export async function rateLimit(req) {
  // Get IP address
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown'

  try {
    await rateLimiter.consume(ip)
    return { success: true }
  } catch (error) {
    return {
      error: 'Too many requests, please try again later',
      status: 429,
      retryAfter: Math.round(error.msBeforeNext / 1000) || 60,
    }
  }
}
