import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { asyncHandler } from '@/lib/errors'
import { BadRequestError, UnauthorizedError } from '@/lib/errors'
import { withRateLimit } from '@/middleware/rateLimiter'

// POST /api/payment/create-intent - Create payment intent
// Note: Stripe is not in package.json dependencies
// This is a placeholder for future Stripe integration
// To use Stripe, install: npm install stripe
const postHandler = asyncHandler(async (req) => {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  const body = await req.json()

  if (!body.amount || body.amount <= 0) {
    throw new BadRequestError('Invalid payment amount')
  }

  // TODO: Implement Stripe payment intent creation
  // Example Stripe integration (when installed):
  /*
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(body.amount * 100), // Convert to cents
    currency: 'sar',
    metadata: {
      orderId: body.orderId,
      patientId: session.user.id,
    },
  })

  return NextResponse.json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    },
  })
  */

  // Placeholder response for development
  return NextResponse.json({
    success: true,
    data: {
      clientSecret: 'placeholder_client_secret',
      paymentIntentId: 'placeholder_payment_intent_id',
      message: 'Stripe integration pending - install stripe package',
    },
  })
})

export const POST = withRateLimit(postHandler, 'api')
