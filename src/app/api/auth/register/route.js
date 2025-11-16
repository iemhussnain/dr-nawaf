import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import Patient from '@/models/Patient'
import { registerSchema } from '@/lib/validations'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req) {
  try {
    await dbConnect()

    // Parse request body
    const body = await req.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Debug logging
    console.log('🔍 Registration attempt for email:', validatedData.email)
    console.log('🔍 Email after validation:', validatedData.email)

    // Check total users in database
    const totalUsers = await User.countDocuments()
    console.log('📊 Total users in database:', totalUsers)

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })
    console.log('🔍 Existing user found:', existingUser ? 'YES' : 'NO')
    if (existingUser) {
      console.log('🔍 Existing user email:', existingUser.email)
      console.log('🔍 Existing user ID:', existingUser._id)
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Check all users emails
    const allUsers = await User.find({}, 'email')
    console.log('📧 All emails in database:', allUsers.map(u => u.email))

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    // Create user
    const user = await User.create({
      email: validatedData.email,
      password: validatedData.password,
      role: 'patient', // Default role
      isVerified: false,
      verificationToken,
    })

    // Create patient profile
    await Patient.create({
      userId: user._id,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      phone: validatedData.phone,
      dateOfBirth: new Date(), // Placeholder, will be updated in profile
      gender: 'other', // Placeholder, will be updated in profile
    })

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken)

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
