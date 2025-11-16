import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Notification from '@/models/Notification'
import { asyncHandler } from '@/lib/errorHandler'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors'
import { withRateLimit } from '@/middleware/rateLimiter'

// PUT /api/notifications/[id] - Mark notification as read
const putHandler = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  const { id } = params

  const notification = await Notification.findById(id)

  if (!notification) {
    throw new NotFoundError('Notification not found')
  }

  // Check if notification belongs to current user
  if (notification.userId.toString() !== session.user.id) {
    throw new ForbiddenError('You do not have permission to update this notification')
  }

  // Update notification
  notification.isRead = true
  await notification.save()

  return NextResponse.json({
    success: true,
    data: notification,
    message: 'Notification marked as read',
  })
})

// DELETE /api/notifications/[id] - Delete notification
const deleteHandler = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  const { id } = params

  const notification = await Notification.findById(id)

  if (!notification) {
    throw new NotFoundError('Notification not found')
  }

  // Check if notification belongs to current user
  if (notification.userId.toString() !== session.user.id) {
    throw new ForbiddenError('You do not have permission to delete this notification')
  }

  await Notification.findByIdAndDelete(id)

  return NextResponse.json({
    success: true,
    message: 'Notification deleted successfully',
  })
})

export const PUT = withRateLimit(putHandler, 'api')
export const DELETE = withRateLimit(deleteHandler, 'api')
