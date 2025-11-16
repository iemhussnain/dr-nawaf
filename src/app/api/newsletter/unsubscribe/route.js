import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Newsletter from '@/models/Newsletter'
import { asyncHandler } from '@/lib/errorHandler'
import { BadRequestError, NotFoundError } from '@/lib/errors'

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter
export const POST = asyncHandler(async (req) => {
  await dbConnect()

  const body = await req.json()

  if (!body.email) {
    throw new BadRequestError('Email is required')
  }

  const subscription = await Newsletter.findOne({ email: body.email.toLowerCase() })

  if (!subscription) {
    throw new NotFoundError('Email not found in newsletter subscriptions')
  }

  if (!subscription.isActive) {
    throw new BadRequestError('Email is already unsubscribed')
  }

  // Deactivate subscription
  subscription.isActive = false
  subscription.unsubscribedAt = new Date()
  await subscription.save()

  return NextResponse.json({
    success: true,
    message: 'Successfully unsubscribed from newsletter',
  })
})
