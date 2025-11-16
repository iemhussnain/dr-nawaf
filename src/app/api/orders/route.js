import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Order from '@/models/Order'
import Product from '@/models/Product'
import Patient from '@/models/Patient'
import { asyncHandler } from '@/lib/errorHandler'
import { BadRequestError, UnauthorizedError, NotFoundError } from '@/lib/errors'
import { withRateLimit } from '@/middleware/rateLimiter'

// GET /api/orders - List orders
const getHandler = asyncHandler(async (req) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  const { searchParams } = new URL(req.url)
  const isAdmin = session.user.role === 'admin'

  // Build query
  const query = {}

  // Non-admin users only see their own orders
  if (!isAdmin) {
    // Find patient by user ID
    const patient = await Patient.findOne({ userId: session.user.id })
    if (!patient) {
      throw new NotFoundError('Patient profile not found')
    }
    query.patientId = patient._id
  } else {
    // Admin can filter by patient
    const patientId = searchParams.get('patientId')
    if (patientId) {
      query.patientId = patientId
    }
  }

  // Filter by order status
  const orderStatus = searchParams.get('orderStatus')
  if (orderStatus) {
    query.orderStatus = orderStatus
  }

  // Filter by payment status
  const paymentStatus = searchParams.get('paymentStatus')
  if (paymentStatus) {
    query.paymentStatus = paymentStatus
  }

  // Search by order number
  const search = searchParams.get('search')
  if (search) {
    query.orderNumber = { $regex: search, $options: 'i' }
  }

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit

  // Sorting
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1
  const sort = { [sortBy]: sortOrder }

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('patientId', 'firstName lastName email phone')
      .populate('items.productId', 'name slug images')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(query),
  ])

  return NextResponse.json({
    success: true,
    data: {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  })
})

// POST /api/orders - Create order
const postHandler = asyncHandler(async (req) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  const body = await req.json()

  // Validate required fields
  if (!body.items || body.items.length === 0) {
    throw new BadRequestError('Order must contain at least one item')
  }

  if (!body.shippingAddress) {
    throw new BadRequestError('Shipping address is required')
  }

  if (!body.paymentMethod) {
    throw new BadRequestError('Payment method is required')
  }

  // Find patient
  const patient = await Patient.findOne({ userId: session.user.id })
  if (!patient) {
    throw new NotFoundError('Patient profile not found')
  }

  // Validate products and calculate totals
  let subtotal = 0
  const orderItems = []

  for (const item of body.items) {
    const product = await Product.findById(item.productId)

    if (!product) {
      throw new NotFoundError(`Product ${item.productId} not found`)
    }

    if (!product.isActive) {
      throw new BadRequestError(`Product ${product.name} is not available`)
    }

    if (product.stock < item.quantity) {
      throw new BadRequestError(
        `Insufficient stock for ${product.name}. Available: ${product.stock}`
      )
    }

    // Check if prescription is required
    if (product.prescriptionRequired && !body.prescriptionUrl) {
      throw new BadRequestError(
        `Prescription is required for ${product.name}`
      )
    }

    orderItems.push({
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
    })

    subtotal += product.price * item.quantity

    // Reduce stock
    product.stock -= item.quantity
    await product.save()
  }

  // Calculate tax (VAT 15% in Saudi Arabia)
  const tax = subtotal * 0.15

  // Calculate shipping fee (free over 500 SAR)
  const shippingFee = subtotal >= 500 ? 0 : 50

  // Calculate total
  const total = subtotal + tax + shippingFee

  // Create order
  const order = await Order.create({
    patientId: patient._id,
    items: orderItems,
    subtotal,
    tax,
    shippingFee,
    total,
    shippingAddress: body.shippingAddress,
    paymentMethod: body.paymentMethod,
    notes: body.notes || '',
  })

  // Populate the order before returning
  await order.populate('patientId', 'firstName lastName email phone')
  await order.populate('items.productId', 'name slug images')

  return NextResponse.json(
    {
      success: true,
      data: order,
      message: 'Order created successfully',
    },
    { status: 201 }
  )
})

export const GET = withRateLimit(getHandler, 'api')
export const POST = withRateLimit(postHandler, 'api')
