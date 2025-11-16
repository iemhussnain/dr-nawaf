import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Order from '@/models/Order'
import Patient from '@/models/Patient'
import { asyncHandler } from '@/lib/errorHandler'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors'

// GET /api/orders/[id] - Get single order
export const GET = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  const { id } = params

  const order = await Order.findById(id)
    .populate('patientId', 'firstName lastName email phone')
    .populate('items.productId', 'name slug images')
    .lean()

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  // Check authorization (admin can see all, patients only their own)
  const isAdmin = session.user.role === 'admin'
  if (!isAdmin) {
    const patient = await Patient.findOne({ userId: session.user.id })
    if (!patient || order.patientId._id.toString() !== patient._id.toString()) {
      throw new ForbiddenError('You do not have permission to view this order')
    }
  }

  return NextResponse.json({
    success: true,
    data: order,
  })
})
