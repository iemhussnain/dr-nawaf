import mongoSanitize from 'express-mongo-sanitize'

/**
 * Sanitize string to prevent XSS attacks
 * Removes potentially dangerous HTML/JS characters
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str

  return str
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .trim()
}

/**
 * Sanitize object recursively
 * Removes MongoDB operators and sanitizes strings
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item))
  }

  const sanitized = {}
  for (const [key, value] of Object.entries(obj)) {
    // Remove keys starting with $ (MongoDB operators)
    if (key.startsWith('$')) {
      continue
    }

    sanitized[key] = sanitizeObject(value)
  }

  return sanitized
}

/**
 * Sanitize request body middleware
 * Removes MongoDB operators and potentially dangerous content
 */
export const sanitizeRequestBody = async (req) => {
  if (!req.body) return

  try {
    // Read JSON body if not already parsed
    const body = await req.json()

    // Sanitize MongoDB operators
    const sanitized = mongoSanitize.sanitize(body, {
      replaceWith: '_',
      onSanitize: ({ key }) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Sanitized potentially dangerous key: ${key}`)
        }
      },
    })

    // Additional XSS sanitization
    return sanitizeObject(sanitized)
  } catch (error) {
    console.error('Error sanitizing request body:', error)
    return {}
  }
}

/**
 * Sanitize query parameters
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} Sanitized query object
 */
export const sanitizeQueryParams = (searchParams) => {
  const params = {}

  for (const [key, value] of searchParams.entries()) {
    // Skip keys with MongoDB operators
    if (key.startsWith('$') || key.startsWith('.')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Skipped potentially dangerous query param: ${key}`)
      }
      continue
    }

    params[key] = sanitizeString(value)
  }

  return params
}

/**
 * Sanitize email address
 * Ensures email is in valid format and removes dangerous characters
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return ''

  // Convert to lowercase and trim
  let sanitized = email.toLowerCase().trim()

  // Remove any dangerous characters except valid email characters
  sanitized = sanitized.replace(/[^a-z0-9@._+-]/g, '')

  // Basic email validation
  const emailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
  if (!emailRegex.test(sanitized)) {
    return ''
  }

  return sanitized
}

/**
 * Sanitize phone number
 * Removes all non-numeric characters except + for country code
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return ''

  // Remove all characters except digits and +
  let sanitized = phone.replace(/[^\d+]/g, '')

  // Ensure + only appears at the start
  if (sanitized.includes('+')) {
    const parts = sanitized.split('+')
    sanitized = '+' + parts.filter(Boolean).join('')
  }

  return sanitized
}

/**
 * Sanitize URL
 * Ensures URL uses safe protocol and removes dangerous characters
 */
export const sanitizeURL = (url) => {
  if (!url || typeof url !== 'string') return ''

  try {
    const parsed = new URL(url)

    // Only allow http, https, and mailto protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:']
    if (!allowedProtocols.includes(parsed.protocol)) {
      return ''
    }

    return parsed.toString()
  } catch (error) {
    // Invalid URL
    return ''
  }
}

/**
 * Sanitize filename
 * Removes path traversal attempts and dangerous characters
 */
export const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') return ''

  return filename
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[/\\]/g, '') // Remove slashes
    .replace(/[<>:"|?*]/g, '') // Remove invalid Windows filename characters
    .trim()
}

/**
 * Sanitize MongoDB query
 * Prevents NoSQL injection attacks
 */
export const sanitizeMongoQuery = (query) => {
  if (!query || typeof query !== 'object') return {}

  const sanitized = {}

  for (const [key, value] of Object.entries(query)) {
    // Allow specific MongoDB operators only when necessary
    const allowedOperators = ['$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$in', '$nin']

    if (key.startsWith('$') && !allowedOperators.includes(key)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Blocked potentially dangerous MongoDB operator: ${key}`)
      }
      continue
    }

    if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeMongoQuery(value)
    } else {
      sanitized[key] = typeof value === 'string' ? sanitizeString(value) : value
    }
  }

  return sanitized
}

/**
 * Content Security Policy (CSP) headers
 */
export const CSP_HEADERS = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://vercel.live'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:', 'blob:'],
  'font-src': ["'self'", 'data:'],
  'connect-src': ["'self'", 'https://vercel.live'],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
}

/**
 * Generate CSP header value
 */
export const generateCSPHeader = () => {
  return Object.entries(CSP_HEADERS)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

export default {
  sanitizeString,
  sanitizeObject,
  sanitizeRequestBody,
  sanitizeQueryParams,
  sanitizeEmail,
  sanitizePhone,
  sanitizeURL,
  sanitizeFilename,
  sanitizeMongoQuery,
  generateCSPHeader,
}
