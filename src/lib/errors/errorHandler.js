import { NextResponse } from 'next/server'
import {
  APIError,
  BadRequestError,
  ValidationError,
  DatabaseError,
  InternalServerError,
  ConflictError,
} from './APIError'
import { logger } from './logger'

/**
 * Format MongoDB errors into user-friendly messages
 */
export function formatMongoDBError(error) {
  // Duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0]
    const value = error.keyValue?.[field]
    return new ConflictError(
      `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Resource'} '${value}' already exists`
    )
  }

  // Validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors || {}).map((err) => ({
      field: err.path,
      message: err.message,
    }))
    return new ValidationError('Validation failed', errors)
  }

  // Cast error (invalid ObjectId, etc.)
  if (error.name === 'CastError') {
    return new BadRequestError(`Invalid ${error.path}: ${error.value}`)
  }

  return new DatabaseError('Database operation failed', error)
}

/**
 * Format Zod validation errors
 */
export function formatZodError(error) {
  const errors = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))
  return new ValidationError('Validation failed', errors)
}

/**
 * Handle all API errors and return consistent responses
 */
export function handleAPIError(error) {
  // Log error based on environment
  if (process.env.NODE_ENV === 'production') {
    logger.error({
      message: error.message,
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
      ...(error.isOperational && { type: 'operational' }),
    })
  } else {
    logger.error({
      message: error.message,
      statusCode: error.statusCode || 500,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    })
  }

  // Handle known error types
  if (error instanceof APIError) {
    return NextResponse.json(error.toJSON(), {
      status: error.statusCode,
    })
  }

  // Handle MongoDB errors
  if (error.name === 'MongoError' || error.name === 'MongoServerError' || error.code === 11000) {
    const mongoError = formatMongoDBError(error)
    return NextResponse.json(mongoError.toJSON(), {
      status: mongoError.statusCode,
    })
  }

  // Handle Mongoose errors
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    const mongooseError = formatMongoDBError(error)
    return NextResponse.json(mongooseError.toJSON(), {
      status: mongooseError.statusCode,
    })
  }

  // Handle Zod errors
  if (error.name === 'ZodError') {
    const zodError = formatZodError(error)
    return NextResponse.json(zodError.toJSON(), {
      status: zodError.statusCode,
    })
  }

  // Handle unknown errors - don't expose internals in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : error.message || 'Internal server error'

  const internalError = new InternalServerError(message)

  return NextResponse.json(
    {
      success: false,
      error: internalError.message,
      statusCode: 500,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
        originalError: error.message,
      }),
    },
    { status: 500 }
  )
}

/**
 * Async handler wrapper for API routes
 * Automatically catches errors and passes them to error handler
 */
export function asyncHandler(handler) {
  return async (req, context) => {
    try {
      return await handler(req, context)
    } catch (error) {
      return handleAPIError(error)
    }
  }
}

/**
 * Validate request body against Zod schema
 */
export async function validateRequest(req, schema) {
  try {
    const body = await req.json()
    const validatedData = schema.parse(body)
    return { data: validatedData, error: null }
  } catch (error) {
    if (error.name === 'ZodError') {
      throw formatZodError(error)
    }
    throw new BadRequestError('Invalid request body')
  }
}

/**
 * Success response helper
 */
export function successResponse(data, message = null, statusCode = 200) {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      ...(data !== undefined && { data }),
    },
    { status: statusCode }
  )
}
