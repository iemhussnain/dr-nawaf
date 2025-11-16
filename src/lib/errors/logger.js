/**
 * Simple logger that logs differently for dev and production
 */

const isDevelopment = process.env.NODE_ENV === 'development'

class Logger {
  /**
   * Log info messages
   */
  info(message, meta = {}) {
    if (isDevelopment) {
      console.log('ℹ️  INFO:', message, meta)
    } else {
      console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }))
    }
  }

  /**
   * Log error messages
   */
  error(error, meta = {}) {
    if (isDevelopment) {
      console.error('❌ ERROR:', error, meta)
    } else {
      // In production, log structured data without stack traces for security
      const errorData = {
        level: 'error',
        message: typeof error === 'string' ? error : error.message,
        ...(error.statusCode && { statusCode: error.statusCode }),
        ...meta,
        timestamp: new Date().toISOString(),
      }
      console.error(JSON.stringify(errorData))
    }
  }

  /**
   * Log warning messages
   */
  warn(message, meta = {}) {
    if (isDevelopment) {
      console.warn('⚠️  WARN:', message, meta)
    } else {
      console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }))
    }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message, meta = {}) {
    if (isDevelopment) {
      console.debug('🔍 DEBUG:', message, meta)
    }
  }

  /**
   * Log success messages
   */
  success(message, meta = {}) {
    if (isDevelopment) {
      console.log('✅ SUCCESS:', message, meta)
    } else {
      console.log(JSON.stringify({ level: 'success', message, ...meta, timestamp: new Date().toISOString() }))
    }
  }
}

export const logger = new Logger()
