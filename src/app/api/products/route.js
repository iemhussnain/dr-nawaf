import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import Product from '@/models/Product'
import { asyncHandler } from '@/lib/errorHandler'
import { BadRequestError, UnauthorizedError, ForbiddenError } from '@/lib/errors'

// GET /api/products - List products
export const GET = asyncHandler(async (req) => {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin'

  // Build query
  const query = {}

  // Public users only see active products
  if (!isAdmin) {
    query.isActive = true
  }

  // Filter by category
  const category = searchParams.get('category')
  if (category) {
    query.category = category
  }

  // Filter by active status (admin only)
  const isActive = searchParams.get('isActive')
  if (isActive && isAdmin) {
    query.isActive = isActive === 'true'
  }

  // Filter by prescription required
  const prescriptionRequired = searchParams.get('prescriptionRequired')
  if (prescriptionRequired) {
    query.prescriptionRequired = prescriptionRequired === 'true'
  }

  // Filter by stock availability
  const inStock = searchParams.get('inStock')
  if (inStock === 'true') {
    query.stock = { $gt: 0 }
  }

  // Search
  const search = searchParams.get('search')
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ]
  }

  // Pagination
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const skip = (page - 1) * limit

  // Sorting
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1
  const sort = { [sortBy]: sortOrder }

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ])

  // Get unique categories for filters
  const categories = await Product.distinct('category')

  return NextResponse.json({
    success: true,
    data: {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      categories,
    },
  })
})

// POST /api/products - Create product (admin only)
export const POST = asyncHandler(async (req) => {
  await dbConnect()

  const session = await getServerSession(authOptions)
  if (!session) {
    throw new UnauthorizedError('You must be logged in')
  }

  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Only admins can create products')
  }

  const body = await req.json()

  // Validate required fields
  if (!body.name || !body.description || !body.category || !body.price || !body.sku) {
    throw new BadRequestError('Missing required fields')
  }

  // Generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  let slug = generateSlug(body.name)

  // Ensure slug uniqueness
  let counter = 1
  while (await Product.findOne({ slug })) {
    slug = `${generateSlug(body.name)}-${counter}`
    counter++
  }

  // Create product
  const product = await Product.create({
    ...body,
    slug,
  })

  return NextResponse.json(
    {
      success: true,
      data: product,
      message: 'Product created successfully',
    },
    { status: 201 }
  )
})
