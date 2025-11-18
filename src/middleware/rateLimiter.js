import { RateLimiterMemory } from 'rate-limiter-flexible'
import { TooManyRequestsError } from '@/lib/errors'

// Rate limiters for different endpoints
const rateLimiters = {
  // Strict rate limiting for auth endpoints (5 requests per 15 minutes)
  auth: new RateLimiterMemory({
    points: 5,
    duration: 15 * 60, // 15 minutes
    blockDuration: 15 * 60, // Block for 15 minutes
  }),

  // Moderate rate limiting for API endpoints (100 requests per minute)
  api: new RateLimiterMemory({
    points: 100,
    duration: 60, // 1 minute
    blockDuration: 60, // Block for 1 minute
  }),

  // Lenient rate limiting for public endpoints (200 requests per minute)
  public: new RateLimiterMemory({
    points: 200,
    duration: 60,
    blockDuration: 30,
  }),

  // Very strict for password reset (3 requests per hour)
  passwordReset: new RateLimiterMemory({
    points: 3,
    duration: 60 * 60, // 1 hour
    blockDuration: 60 * 60, // Block for 1 hour
  }),

  // File upload limiting (10 uploads per minute)
  upload: new RateLimiterMemory({
    points: 10,
    duration: 60,
    blockDuration: 2 * 60,
  }),
}

/**
 * Get client identifier from request
 * Uses IP address or authenticated user ID
 */
const getClientId = (req, session) => {
  // Prefer user ID if authenticated
  if (session?.user?.id) {
    return `user:${session.user.id}`
  }

  // Fall back to IP address
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
  return `ip:${ip}`
}

/**
 * Rate limiting middleware factory
 * @param {string} limiterType - Type of rate limiter to use (auth, api, public, passwordReset, upload)
 * @returns {Function} Middleware function
 */
export const createRateLimiter = (limiterType = 'api') => {
  const limiter = rateLimiters[limiterType] || rateLimiters.api

  return async (req, session = null) => {
    const clientId = getClientId(req, session)

    try {
      // Consume 1 point
      await limiter.consume(clientId)
      return { success: true }
    } catch (rejRes) {
      // Rate limit exceeded
      const retryAfter = Math.ceil(rejRes.msBeforeNext / 1000)

      if (process.env.NODE_ENV === 'development') {
        console.warn(`Rate limit exceeded for ${clientId}. Retry after ${retryAfter}s`)
      }

      throw new TooManyRequestsError(
        `Too many requests. Please try again in ${retryAfter} seconds.`,
        { retryAfter }
      )
    }
  }
}

/**
 * Rate limiter wrapper for API routes
 * @param {Function} handler - API route handler
 * @param {string} limiterType - Type of rate limiter
 */
export const withRateLimit = (handler, limiterType = 'api') => {
  const rateLimiter = createRateLimiter(limiterType)

  return async (req, context) => {
    try {
      // Check rate limit
      await rateLimiter(req)

      // Proceed with handler
      return await handler(req, context)
    } catch (error) {
      if (error instanceof TooManyRequestsError) {
        return new Response(
          JSON.stringify({
            success: false,
            error: error.message,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': error.retryAfter?.toString() || '60',
            },
          }
        )
      }
      throw error
    }
  }
}

/**
 * Get rate limit info for a client
 * @param {Request} req - Request object
 * @param {Object} session - Session object
 * @param {string} limiterType - Type of rate limiter
 */
export const getRateLimitInfo = async (req, session = null, limiterType = 'api') => {
  const limiter = rateLimiters[limiterType] || rateLimiters.api
  const clientId = getClientId(req, session)

  try {
    const res = await limiter.get(clientId)

    if (!res) {
      return {
        limit: limiter.points,
        remaining: limiter.points,
        reset: Date.now() + limiter.duration * 1000,
      }
    }

    return {
      limit: limiter.points,
      remaining: Math.max(0, limiter.points - res.consumedPoints),
      reset: new Date(Date.now() + res.msBeforeNext),
    }
  } catch (error) {
    console.error('Error getting rate limit info:', error)
    return {
      limit: limiter.points,
      remaining: 0,
      reset: Date.now() + limiter.duration * 1000,
    }
  }
}

export default {
  createRateLimiter,
  withRateLimit,
  getRateLimitInfo,
  rateLimiters,
}
