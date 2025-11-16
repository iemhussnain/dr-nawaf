import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Product from '@/models/Product'
import { asyncHandler } from '@/lib/errors'
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors'
import { withRateLimit } from '@/middleware/rateLimiter'

// GET /api/products/[id] - Get single product
const getHandler = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const { id } = params

  const product = await Product.findById(id).lean()

  if (!product) {
    throw new NotFoundError('Product not found')
  }

  // Check if product is active (for non-admin users)
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin'

  if (!isAdmin && !product.isActive) {
    throw new NotFoundError('Product not found')
  }

  return NextResponse.json({
    success: true,
    data: product,
  })
})

// PUT /api/products/[id] - Update product (admin only)
const putHandler = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Only admins can update products')
  }

  const { id } = params
  const body = await req.json()

  const product = await Product.findById(id)

  if (!product) {
    throw new NotFoundError('Product not found')
  }

  // If name is changed, regenerate slug
  if (body.name && body.name !== product.name) {
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    let slug = generateSlug(body.name)

    // Ensure slug uniqueness (excluding current product)
    let counter = 1
    while (await Product.findOne({ slug, _id: { $ne: id } })) {
      slug = `${generateSlug(body.name)}-${counter}`
      counter++
    }

    body.slug = slug
  }

  // Update product
  const updatedProduct = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })

  return NextResponse.json({
    success: true,
    data: updatedProduct,
    message: 'Product updated successfully',
  })
})

// DELETE /api/products/[id] - Delete product (admin only)
const deleteHandler = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Only admins can delete products')
  }

  const { id } = params

  const product = await Product.findById(id)

  if (!product) {
    throw new NotFoundError('Product not found')
  }

  // Soft delete by setting isActive to false
  await Product.findByIdAndUpdate(id, { isActive: false })

  return NextResponse.json({
    success: true,
    message: 'Product deleted successfully',
  })
})

export const GET = withRateLimit(getHandler, 'api')
export const PUT = withRateLimit(putHandler, 'api')
export const DELETE = withRateLimit(deleteHandler, 'api')
