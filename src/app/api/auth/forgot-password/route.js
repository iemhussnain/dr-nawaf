import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req) {
  try {
    await dbConnect()

    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await User.findOne({ email })

    // Don't reveal if user exists or not (security)
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: 'If an account exists with this email, a password reset link has been sent.',
        },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

    // Save token to user
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpiry
    await user.save()

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken)

    return NextResponse.json(
      {
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
