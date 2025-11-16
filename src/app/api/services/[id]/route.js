import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Service from '@/models/Service'
import { asyncHandler, successResponse, validateRequest } from '@/lib/errors'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { z } from 'zod'
import { withRateLimit } from '@/middleware/rateLimiter'

// Validation schema for updating service
const updateServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(200, 'Name too long').optional(),
  description: z.string().min(1, 'Description is required').max(2000, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required').optional(),
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(480, 'Duration cannot exceed 8 hours').optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  isActive: z.boolean().optional(),
  icon: z.string().optional(),
})

// GET /api/services/[id] - Get single service (public for active, admin for all)
const getHandler = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const { id } = params
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin'

  const service = await Service.findById(id).lean()

  if (!service) {
    throw new NotFoundError('Service not found')
  }

  // Non-admin users can only view active services
  if (!isAdmin && !service.isActive) {
    throw new NotFoundError('Service not found')
  }

  logger.info('Service fetched', { serviceId: id, isAdmin })

  return successResponse(service, 'Service fetched successfully')
})

// PUT /api/services/[id] - Update service (Admin only)
const putHandler = asyncHandler(async (req, { params }) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Only administrators can update services')
  }

  await dbConnect()

  const { id } = params
  const body = await req.json()

  // Validate request body
  const validatedData = await validateRequest(updateServiceSchema, body)

  const service = await Service.findById(id)

  if (!service) {
    throw new NotFoundError('Service not found')
  }

  // Update service
  const updatedService = await Service.findByIdAndUpdate(
    id,
    { $set: validatedData },
    { new: true, runValidators: true }
  )

  logger.info('Service updated', {
    serviceId: id,
    userId: session.user.id,
    updates: Object.keys(validatedData),
  })

  return successResponse(updatedService, 'Service updated successfully')
})

// DELETE /api/services/[id] - Delete service (Admin only)
const deleteHandler = asyncHandler(async (req, { params }) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Only administrators can delete services')
  }

  await dbConnect()

  const { id } = params

  const service = await Service.findById(id)

  if (!service) {
    throw new NotFoundError('Service not found')
  }

  // Soft delete by setting isActive to false
  service.isActive = false
  await service.save()

  logger.warn('Service deleted (soft)', { serviceId: id, userId: session.user.id })

  return successResponse(null, 'Service deleted successfully')
})

export const GET = withRateLimit(getHandler, 'api')
export const PUT = withRateLimit(putHandler, 'api')
export const DELETE = withRateLimit(deleteHandler, 'api')
