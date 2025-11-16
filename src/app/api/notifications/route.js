import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Notification from '@/models/Notification'
import { asyncHandler } from '@/lib/errorHandler'
import { UnauthorizedError } from '@/lib/errors'

// GET /api/notifications - List notifications for current user
export const GET = asyncHandler(async (req) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  const { searchParams } = new URL(req.url)

  // Build query
  const query = { userId: session.user.id }

  // Filter by read status
  const isRead = searchParams.get('isRead')
  if (isRead !== null && isRead !== '') {
    query.isRead = isRead === 'true'
  }

  // Filter by type
  const type = searchParams.get('type')
  if (type) {
    query.type = type
  }

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ userId: session.user.id, isRead: false }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  })
})

// POST /api/notifications - Create notification (admin only or system)
export const POST = asyncHandler(async (req) => {
  await dbConnect()

  const session = await getServerSession(authOptions)

  // For now, allow authenticated users to create notifications
  // In production, you might want to restrict this to admin or use it internally
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  const body = await req.json()

  // Validate required fields
  if (!body.userId || !body.type || !body.title || !body.message) {
    throw new BadRequestError('Missing required fields')
  }

  // Create notification
  const notification = await Notification.create({
    userId: body.userId,
    type: body.type,
    title: body.title,
    message: body.message,
    link: body.link || '',
  })

  return NextResponse.json(
    {
      success: true,
      data: notification,
      message: 'Notification created successfully',
    },
    { status: 201 }
  )
})
