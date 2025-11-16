import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { cleanupOldNotifications } from '@/utils/notifications'
import { asyncHandler } from '@/lib/errorHandler'
import { withRateLimit } from '@/middleware/rateLimiter'

// GET /api/cron/cleanup-notifications - Clean up old read notifications
// This should be called by a cron job weekly
const getHandler = asyncHandler(async (req) => {
  await dbConnect()

  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const result = await cleanupOldNotifications()

  return NextResponse.json({
    success: true,
    data: result,
    message: `Cleaned up ${result.deletedCount || 0} old notifications`,
  })
})

export const GET = withRateLimit(getHandler, 'public')
