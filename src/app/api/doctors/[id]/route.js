import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Doctor from '@/models/Doctor'
import User from '@/models/User'
import { withRateLimit } from '@/middleware/rateLimiter'

/**
 * GET /api/doctors/:id
 * Get single doctor by ID
 */
async function getHandler(req, { params }) {
  try {
    await dbConnect()

    const { id } = params

    const doctor = await Doctor.findById(id)
      .populate('userId', 'email isVerified lastLogin')
      .populate('services', 'name description price')
      .lean()

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: doctor,
    })
  } catch (error) {
    console.error('❌ Get doctor error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch doctor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/doctors/:id
 * Update doctor (Admin or Doctor themselves)
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
        { success: false, error: 'Forbidden: You can only edit your own profile' },
        { status: 403 }
      )
    }

    // Prevent non-admins from changing certain fields
    if (!isAdmin) {
      delete body.status
      delete body.rating
      delete body.reviewCount
      delete body.isActive
    }

    // Update doctor
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('userId', 'email isVerified')

    return NextResponse.json({
      success: true,
      data: updatedDoctor,
      message: 'Doctor updated successfully',
    })
  } catch (error) {
    console.error('❌ Update doctor error:', error)

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
      { success: false, error: error.message || 'Failed to update doctor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/doctors/:id
 * Delete/deactivate doctor (Admin only)
 */
async function deleteHandler(req, { params }) {
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

    const { id } = params

    // Check if doctor exists
    const doctor = await Doctor.findById(id)

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      )
    }

    // Soft delete: Set status to inactive instead of actually deleting
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: { status: 'inactive', isActive: false } },
      { new: true }
    )

    // Optionally, also deactivate the user account
    if (doctor.userId) {
      await User.findByIdAndUpdate(doctor.userId, { isActive: false })
    }

    return NextResponse.json({
      success: true,
      data: updatedDoctor,
      message: 'Doctor deactivated successfully',
    })
  } catch (error) {
    console.error('❌ Delete doctor error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete doctor' },
      { status: 500 }
    )
  }
}

export const GET = withRateLimit(getHandler, 'api')
export const PUT = withRateLimit(putHandler, 'api')
export const DELETE = withRateLimit(deleteHandler, 'api')
