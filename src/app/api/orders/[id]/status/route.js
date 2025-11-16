import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Order from '@/models/Order'
import { asyncHandler } from '@/lib/errorHandler'
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors'

// PUT /api/orders/[id]/status - Update order status (admin only)
export const PUT = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Only admins can update order status')
  }

  const { id } = params
  const body = await req.json()

  const order = await Order.findById(id)

  if (!order) {
    throw new NotFoundError('Order not found')
  }

  // Validate status values
  const validOrderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']

  if (body.orderStatus && !validOrderStatuses.includes(body.orderStatus)) {
    throw new BadRequestError('Invalid order status')
  }

  if (body.paymentStatus && !validPaymentStatuses.includes(body.paymentStatus)) {
    throw new BadRequestError('Invalid payment status')
  }

  // Update order
  const updateData = {}
  if (body.orderStatus) updateData.orderStatus = body.orderStatus
  if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus
  if (body.trackingNumber) updateData.trackingNumber = body.trackingNumber
  if (body.notes) updateData.notes = body.notes

  const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('patientId', 'firstName lastName email phone')
    .populate('items.productId', 'name slug images')

  return NextResponse.json({
    success: true,
    data: updatedOrder,
    message: 'Order status updated successfully',
  })
})
