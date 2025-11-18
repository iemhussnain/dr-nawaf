import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Doctor from '@/models/Doctor'
import { withRateLimit } from '@/middleware/rateLimiter'

/**
 * PUT /api/doctors/:id/availability
 * Update doctor availability and holidays
 */
async function putHandler(req, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { id } = params
    const body = await req.json()

    // Find the doctor
    const doctor = await Doctor.findById(id)

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Authorization check: Admin or the doctor themselves
    const isAdmin = session.user.role === 'admin'
    const isOwner = doctor.userId.toString() === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only manage your own availability' },
        { status: 403 }
      )
    }

    // Update availability
    const updateData = {}

    if (body.availability !== undefined) {
      updateData.availability = body.availability
    }

    if (body.holidays !== undefined) {
      updateData.holidays = body.holidays
    }

    // Update doctor with new availability
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'email')

    return NextResponse.json({
      success: true,
      data: updatedDoctor,
      message: 'Availability updated successfully',
    })
  } catch (error) {
    console.error('❌ Update availability error:', error)

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message)
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update availability' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/doctors/:id/availability
 * Add holiday to doctor's schedule
 */
async function postHandler(req, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const { id } = params
    const body = await req.json()

    // Find the doctor
    const doctor = await Doctor.findById(id)

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Authorization check: Admin or the doctor themselves
    const isAdmin = session.user.role === 'admin'
    const isOwner = doctor.userId.toString() === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: You can only manage your own availability' },
        { status: 403 }
      )
    }

    // Add holiday to doctor's holidays array
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      {
        $push: {
          holidays: {
            date: body.date,
            reason: body.reason || 'Holiday',
          },
        },
      },
      { new: true, runValidators: true }
    ).populate('userId', 'email')

    return NextResponse.json({
      success: true,
      data: updatedDoctor,
      message: 'Holiday added successfully',
    })
  } catch (error) {
    console.error('❌ Add holiday error:', error)

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add holiday' },
      { status: 500 }
    )
  }
}

export const PUT = withRateLimit(putHandler, 'api')
export const POST = withRateLimit(postHandler, 'api')
