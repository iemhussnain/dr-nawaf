/**
 * Custom Error Classes for API Error Handling
 */

/**
 * Base API Error class
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.timestamp = new Date().toISOString()
    Error.captureStackTrace(this, this.constructor)
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      statusCode: this.statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: this.stack,
        timestamp: this.timestamp,
      }),
    }
  }
}

/**
 * 400 Bad Request
 */
export class BadRequestError extends APIError {
  constructor(message = 'Bad Request') {
    super(message, 400)
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized - Authentication required') {
    super(message, 401)
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends APIError {
  constructor(message = 'Forbidden - Insufficient permissions') {
    super(message, 403)
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends APIError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404)
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends APIError {
  constructor(message = 'Resource already exists') {
    super(message, 409)
  }
}

/**
 * 422 Validation Error
 */
export class ValidationError extends APIError {
  constructor(message = 'Validation failed', errors = []) {
    super(message, 422)
    this.errors = errors
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
      ...(process.env.NODE_ENV === 'development' && {
        stack: this.stack,
        timestamp: this.timestamp,
      }),
    }
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends APIError {
  constructor(message = 'Internal server error') {
    super(message, 500)
  }
}

/**
 * 429 Too Many Requests
 */
export class TooManyRequestsError extends APIError {
  constructor(message = 'Too many requests', metadata = {}) {
    super(message, 429)
    this.retryAfter = metadata.retryAfter || 60
  }

  toJSON() {
    return {
      success: false,
      error: this.message,
      statusCode: this.statusCode,
      retryAfter: this.retryAfter,
      ...(process.env.NODE_ENV === 'development' && {
        stack: this.stack,
        timestamp: this.timestamp,
      }),
    }
  }
}

/**
 * Database Error
 */
export class DatabaseError extends APIError {
  constructor(message = 'Database operation failed', originalError = null) {
    super(message, 500)
    this.originalError = originalError
  }
}
