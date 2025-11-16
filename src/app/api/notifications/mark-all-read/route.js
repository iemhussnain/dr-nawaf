import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Notification from '@/models/Notification'
import { asyncHandler } from '@/lib/errorHandler'
import { UnauthorizedError } from '@/lib/errors'

// PUT /api/notifications/mark-all-read - Mark all notifications as read
export const PUT = asyncHandler(async (req) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  // Update all unread notifications for current user
  const result = await Notification.updateMany(
    { userId: session.user.id, isRead: false },
    { isRead: true }
  )

  return NextResponse.json({
    success: true,
    data: {
      modifiedCount: result.modifiedCount,
    },
    message: 'All notifications marked as read',
  })
})
