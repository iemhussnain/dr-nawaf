import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/db'
import Service from '@/models/Service'
import { asyncHandler, successResponse, validateRequest } from '@/lib/errors'
import { UnauthorizedError, ForbiddenError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { z } from 'zod'

// Validation schema for creating/updating service
const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(200, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours'),
  price: z.number().min(0, 'Price cannot be negative'),
  isActive: z.boolean().optional(),
  icon: z.string().optional(),
})

// GET /api/services - List all services (public for active, admin for all)
export const GET = asyncHandler(async (req) => {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const isActive = searchParams.get('isActive')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // Check if user is admin
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin'

  // Build query
  const query = {}

  // Non-admin users can only see active services
  if (!isAdmin) {
    query.isActive = true
  } else if (isActive !== null && isActive !== undefined) {
    query.isActive = isActive === 'true'
  }

  if (category) {
    query.category = category
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ]
  }

  const skip = (page - 1) * limit

  const [services, total] = await Promise.all([
    Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Service.countDocuments(query),
  ])

  // Get all unique categories
  const categories = await Service.distinct('category')

  logger.info('Services fetched', {
    count: services.length,
    isAdmin,
    filters: { category, search, isActive },
  })

  return successResponse(
    {
      services,
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Services fetched successfully'
  )
})

// POST /api/services - Create new service (Admin only)
export const POST = asyncHandler(async (req) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Only administrators can create services')
  }

  await dbConnect()

  const body = await req.json()

  // Validate request body
  const validatedData = await validateRequest(serviceSchema, body)

  // Create service
  const service = await Service.create(validatedData)

  logger.info('Service created', {
    serviceId: service._id,
    name: service.name,
    userId: session.user.id,
  })

  return successResponse(service, 'Service created successfully', 201)
})
