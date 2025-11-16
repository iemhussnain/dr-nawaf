import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Newsletter from '@/models/Newsletter'
import { asyncHandler } from '@/lib/errorHandler'
import { BadRequestError } from '@/lib/errors'
import { sendWelcomeEmail } from '@/utils/email'
import { withRateLimit } from '@/middleware/rateLimiter'

// POST /api/newsletter - Subscribe to newsletter
const postHandler = asyncHandler(async (req) => {
  await dbConnect()

  const body = await req.json()

  if (!body.email) {
    throw new BadRequestError('Email is required')
  }

  // Check if already subscribed
  const existing = await Newsletter.findOne({ email: body.email.toLowerCase() })

  if (existing) {
    if (existing.isActive) {
      throw new BadRequestError('Email is already subscribed')
    } else {
      // Reactivate subscription
      existing.isActive = true
      existing.subscribedAt = new Date()
      existing.unsubscribedAt = undefined
      await existing.save()

      return NextResponse.json({
        success: true,
        data: existing,
        message: 'Successfully resubscribed to newsletter',
      })
    }
  }

  // Create new subscription
  const subscription = await Newsletter.create({
    email: body.email.toLowerCase(),
  })

  // Send welcome email (optional)
  try {
    await sendWelcomeEmail({
      to: subscription.email,
      name: 'Subscriber',
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
  }

  return NextResponse.json(
    {
      success: true,
      data: subscription,
      message: 'Successfully subscribed to newsletter',
    },
    { status: 201 }
  )
})

// GET /api/newsletter - Get all newsletter subscribers (admin only)
const getHandler = asyncHandler(async (req) => {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const isActive = searchParams.get('isActive')

  const query = {}
  if (isActive !== null && isActive !== '') {
    query.isActive = isActive === 'true'
  }

  const subscribers = await Newsletter.find(query).sort({ subscribedAt: -1 }).lean()

  return NextResponse.json({
    success: true,
    data: {
      subscribers,
      total: subscribers.length,
    },
  })
})

export const GET = withRateLimit(getHandler, 'public')
export const POST = withRateLimit(postHandler, 'public')
