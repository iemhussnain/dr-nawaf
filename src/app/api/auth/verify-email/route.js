import dbConnect from '@/lib/db'
import User from '@/models/User'
import { asyncHandler, successResponse, formatMongoDBError } from '@/lib/errors'
import { BadRequestError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { withRateLimit } from '@/middleware/rateLimiter'

const handler = asyncHandler(async (req) => {
  await dbConnect()

  const { token } = await req.json()

  if (!token) {
    throw new BadRequestError('Verification token is required')
  }

  // Find user by verification token
  const user = await User.findOne({ verificationToken: token }).catch((error) => {
    throw formatMongoDBError(error)
  })

  if (!user) {
    throw new BadRequestError('Invalid or expired verification token')
  }

  // Check if already verified
  if (user.isVerified) {
    logger.info('Email already verified', { email: user.email })
    return successResponse(null, 'Email already verified')
  }

  // Update user
  user.isVerified = true
  user.verificationToken = undefined
  await user.save().catch((error) => {
    throw formatMongoDBError(error)
  })

  logger.info('Email verified successfully', { email: user.email })

  return successResponse(
    null,
    'Email verified successfully! You can now login.'
  )
})

export const POST = withRateLimit(handler, 'auth')
