import dbConnect from '@/lib/db'
import User from '@/models/User'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'
import { asyncHandler, successResponse, formatMongoDBError } from '@/lib/errors'
import { BadRequestError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { withRateLimit } from '@/middleware/rateLimiter'

const handler = asyncHandler(async (req) => {
  await dbConnect()

  const { email } = await req.json()

  if (!email) {
    throw new BadRequestError('Email is required')
  }

  // Find user by email
  const user = await User.findOne({ email }).catch((error) => {
    throw formatMongoDBError(error)
  })

  // Don't reveal if user exists or not (security best practice)
  if (!user) {
    logger.info('Password reset requested for non-existent email', { email })
    return successResponse(
      null,
      'If an account exists with this email, a password reset link has been sent.'
    )
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

  // Save token to user
  user.resetPasswordToken = resetToken
  user.resetPasswordExpires = resetTokenExpiry
  await user.save().catch((error) => {
    throw formatMongoDBError(error)
  })

  // Send reset email
  await sendPasswordResetEmail(user.email, resetToken)

  logger.info('Password reset email sent', { email: user.email })

  return successResponse(
    null,
    'If an account exists with this email, a password reset link has been sent.'
  )
})

export const POST = withRateLimit(handler, 'passwordReset')
