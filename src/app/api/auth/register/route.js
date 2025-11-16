import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/models/User'
import Patient from '@/models/Patient'
import { registerSchema } from '@/lib/validations'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req) {
  console.log('🚀 ========== REGISTRATION ENDPOINT HIT ==========')
  try {
    console.log('📡 Connecting to database...')
    await dbConnect()
    console.log('✅ Database connected')

    // Parse request body
    console.log('📦 Parsing request body...')
    const body = await req.json()
    console.log('📦 Request body:', body)

    // Validate input
    console.log('✔️  Validating input...')
    const validatedData = registerSchema.parse(body)
    console.log('✅ Validation passed')

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
    console.error('❌ ========== REGISTRATION ERROR ==========')
    console.error('❌ Error name:', error.name)
    console.error('❌ Error message:', error.message)
    console.error('❌ Full error:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      console.error('❌ Zod validation errors:', error.errors)
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      console.error('❌ Duplicate key error. Field:', Object.keys(error.keyPattern))
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
