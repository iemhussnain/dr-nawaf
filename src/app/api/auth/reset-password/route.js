import dbConnect from '@/lib/db'
import User from '@/models/User'
import { asyncHandler, successResponse, formatMongoDBError } from '@/lib/errors'
import { BadRequestError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { withRateLimit } from '@/middleware/rateLimiter'

const handler = asyncHandler(async (req) => {
  await dbConnect()

  const { token, password } = await req.json()

  if (!token || !password) {
    throw new BadRequestError('Token and new password are required')
  }

  // Validate password strength
  if (password.length < 8) {
    throw new BadRequestError('Password must be at least 8 characters long')
  }

  // Find user by reset token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  }).catch((error) => {
    throw formatMongoDBError(error)
  })

  if (!user) {
    throw new BadRequestError('Invalid or expired reset token')
  }

  // Update password
  user.password = password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save().catch((error) => {
    throw formatMongoDBError(error)
  })

  logger.info('Password reset successful', { email: user.email })

  return successResponse(
    null,
    'Password reset successful! You can now login with your new password.'
  )
})

export const POST = withRateLimit(handler, 'passwordReset')
