import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'

export async function POST(req) {
  try {
    await dbConnect()

    const { token } = await req.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find user by verification token
    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 200 }
      )
    }

    // Update user
    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully! You can now login.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Email verification failed' },
      { status: 500 }
    )
  }
}
