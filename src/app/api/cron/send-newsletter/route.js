import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Newsletter from '@/models/Newsletter'
import { sendNewsletter } from '@/utils/email'
import { asyncHandler } from '@/lib/errorHandler'

// POST /api/cron/send-newsletter - Send newsletter to all active subscribers
// This should be called by a cron job or manually by admin
export const POST = asyncHandler(async (req) => {
  await dbConnect()

  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const body = await req.json()

  // Validate required fields
  if (!body.subject || !body.content) {
    return NextResponse.json(
      { success: false, error: 'Subject and content are required' },
      { status: 400 }
    )
  }

  // Get all active subscribers
  const subscribers = await Newsletter.find({ isActive: true }).lean()

  const results = {
    total: subscribers.length,
    sent: 0,
    failed: 0,
    errors: [],
  }

  // Send newsletter to each subscriber
  // Note: In production, you should use a proper email service that supports batch sending
  // and implement rate limiting to avoid hitting email provider limits
  for (const subscriber of subscribers) {
    try {
      const emailResult = await sendNewsletter({
        to: subscriber.email,
        subject: body.subject,
        content: body.content,
      })

      if (!emailResult.success) {
        results.failed++
        results.errors.push({
          email: subscriber.email,
          error: emailResult.error,
        })
      } else {
        results.sent++
      }

      // Add small delay to avoid overwhelming email provider
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error('Error sending newsletter to:', subscriber.email, error)
      results.failed++
      results.errors.push({
        email: subscriber.email,
        error: error.message,
      })
    }
  }

  return NextResponse.json({
    success: true,
    data: results,
    message: `Sent newsletter to ${results.sent} subscribers, ${results.failed} failed`,
  })
})

// GET /api/cron/send-newsletter - Get newsletter sending status (for testing)
export const GET = asyncHandler(async (req) => {
  await dbConnect()

  const activeSubscribers = await Newsletter.countDocuments({ isActive: true })
  const totalSubscribers = await Newsletter.countDocuments()

  return NextResponse.json({
    success: true,
    data: {
      activeSubscribers,
      totalSubscribers,
      inactiveSubscribers: totalSubscribers - activeSubscribers,
    },
  })
})
