import { generateCSPHeader } from './sanitizer'

/**
 * Security headers configuration
 * Following OWASP security best practices
 */
export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Enable XSS protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

  // Strict transport security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

/**
 * CORS configuration
 */
export const CORS_CONFIG = {
  // Allowed origins
  origins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001'],

  // Allowed methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Allowed headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
  ],

  // Exposed headers
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],

  // Credentials
  credentials: true,

  // Max age for preflight requests (24 hours)
  maxAge: 86400,
}

/**
 * Apply security headers to response
 * @param {Headers} headers - Response headers object
 */
export const applySecurityHeaders = (headers) => {
  // Apply security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    headers.set(key, value)
  })

  // Apply CSP header
  headers.set('Content-Security-Policy', generateCSPHeader())

  return headers
}

/**
 * Apply CORS headers to response
 * @param {Headers} headers - Response headers object
 * @param {Request} request - Request object
 */
export const applyCORSHeaders = (headers, request) => {
  const origin = request.headers.get('origin')

  // Check if origin is allowed
  const isAllowedOrigin =
    !origin || // Same-origin requests
    CORS_CONFIG.origins.includes(origin) ||
    CORS_CONFIG.origins.includes('*')

  if (isAllowedOrigin && origin) {
    headers.set('Access-Control-Allow-Origin', origin)
  } else if (CORS_CONFIG.origins.includes('*')) {
    headers.set('Access-Control-Allow-Origin', '*')
  }

  // Apply other CORS headers
  headers.set('Access-Control-Allow-Methods', CORS_CONFIG.methods.join(', '))
  headers.set('Access-Control-Allow-Headers', CORS_CONFIG.allowedHeaders.join(', '))
  headers.set('Access-Control-Expose-Headers', CORS_CONFIG.exposedHeaders.join(', '))

  if (CORS_CONFIG.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true')
  }

  headers.set('Access-Control-Max-Age', CORS_CONFIG.maxAge.toString())

  return headers
}

/**
 * Handle CORS preflight requests
 * @param {Request} request - Request object
 */
export const handleCORSPreflight = (request) => {
  const headers = new Headers()
  applyCORSHeaders(headers, request)
  applySecurityHeaders(headers)

  return new Response(null, {
    status: 204,
    headers,
  })
}

/**
 * Middleware to apply security and CORS headers
 * @param {Response} response - Response object
 * @param {Request} request - Request object
 */
export const withSecurityHeaders = (response, request) => {
  const headers = new Headers(response.headers)

  applySecurityHeaders(headers)
  applyCORSHeaders(headers, request)

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

/**
 * Check if request origin is allowed
 * @param {Request} request - Request object
 */
export const isOriginAllowed = (request) => {
  const origin = request.headers.get('origin')

  if (!origin) return true // Same-origin requests

  return (
    CORS_CONFIG.origins.includes(origin) ||
    CORS_CONFIG.origins.includes('*')
  )
}

/**
 * Validate CSRF token
 * @param {Request} request - Request object
 * @param {Object} session - User session
 */
export const validateCSRFToken = (request, session) => {
  // Skip for GET, HEAD, OPTIONS requests
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(request.method)
  if (safeMethod) return true

  // Skip if no session (not authenticated)
  if (!session) return true

  const csrfToken = request.headers.get('X-CSRF-Token')
  const sessionToken = session.csrfToken

  return csrfToken === sessionToken
}

/**
 * Generate CSRF token
 */
export const generateCSRFToken = () => {
  const array = new Uint8Array(32)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
  }
  // Fallback for Node.js environment
  const crypto = require('crypto')
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Security middleware wrapper for API routes
 * @param {Function} handler - API route handler
 */
export const withSecurity = (handler) => {
  return async (req, context) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return handleCORSPreflight(req)
    }

    // Check origin
    if (!isOriginAllowed(req)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Origin not allowed',
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    try {
      // Execute handler
      const response = await handler(req, context)

      // Apply security headers to response
      return withSecurityHeaders(response, req)
    } catch (error) {
      // Apply security headers to error response
      const errorResponse = new Response(
        JSON.stringify({
          success: false,
          error: error.message || 'Internal server error',
        }),
        {
          status: error.statusCode || 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return withSecurityHeaders(errorResponse, req)
    }
  }
}

export default {
  applySecurityHeaders,
  applyCORSHeaders,
  handleCORSPreflight,
  withSecurityHeaders,
  isOriginAllowed,
  validateCSRFToken,
  generateCSRFToken,
  withSecurity,
  SECURITY_HEADERS,
  CORS_CONFIG,
}
