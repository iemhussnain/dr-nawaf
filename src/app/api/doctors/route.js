import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Doctor from '@/models/Doctor'
import User from '@/models/User'
import { withRateLimit } from '@/middleware/rateLimiter'

/**
 * GET /api/doctors
 * Get all doctors with optional filters
 */
async function getHandler(req) {
  try {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const specialization = searchParams.get('specialization')
    const status = searchParams.get('status') || 'active'
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query
    const query = {}

    if (specialization) {
      query.specialization = specialization
    }

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } },
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get doctors with pagination
    const doctors = await Doctor.find(query)
      .populate('userId', 'email isVerified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Doctor.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('❌ Get doctors error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch doctors' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/doctors
 * Create a new doctor (Admin only)
 */
async function postHandler(req) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    await dbConnect()

    const body = await req.json()

    // Check if doctor email already exists
    const existingDoctor = await Doctor.findOne({ email: body.email })
    if (existingDoctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor with this email already exists' },
        { status: 400 }
      )
    }

    // Create user account for doctor
    const user = await User.create({
      email: body.email,
      password: body.password || 'Doctor@123', // Default password
      role: 'doctor',
      isVerified: true, // Auto-verify doctor accounts
    })

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      firstName: body.firstName,
      lastName: body.lastName,
      specialty: body.specialty,
      specialization: body.specialization || 'General Practitioner',
      qualifications: body.qualifications || [],
      licenseNumber: body.licenseNumber,
      experience: body.experience || 0,
      bio: body.bio,
      photo: body.photo || '/images/default-doctor.png',
      email: body.email,
      phone: body.phone,
      consultationFee: body.consultationFee,
      languages: body.languages || ['English'],
      availability: body.availability || [],
      status: 'active',
    })

    const populatedDoctor = await Doctor.findById(doctor._id).populate(
      'userId',
      'email isVerified'
    )

    return NextResponse.json(
      {
        success: true,
        data: populatedDoctor,
        message: 'Doctor created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Create doctor error:', error)

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0]
      return NextResponse.json(
        { success: false, error: `Doctor with this ${field} already exists` },
        { status: 400 }
      )
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create doctor' },
      { status: 500 }
    )
  }
}

export const GET = withRateLimit(getHandler, 'api')
export const POST = withRateLimit(postHandler, 'api')
