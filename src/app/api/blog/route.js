import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Blog from '@/models/Blog'
import Doctor from '@/models/Doctor'
import { asyncHandler, successResponse, validateRequest } from '@/lib/errors'
import { UnauthorizedError, ForbiddenError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { z } from 'zod'
import { withRateLimit } from '@/middleware/rateLimiter'

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Validation schema for creating/updating blog
const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(300, 'Excerpt cannot exceed 300 characters').optional(),
  featuredImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional(),
})

// GET /api/blog - List all blog posts (published for public, all for admin)
const getHandler = asyncHandler(async (req) => {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const tag = searchParams.get('tag')
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // Check if user is admin
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin'

  // Build query
  const query = {}

  // Non-admin users can only see published posts
  if (!isAdmin) {
    query.status = 'published'
  } else if (status) {
    query.status = status
  }

  if (category) {
    query.category = category
  }

  if (tag) {
    query.tags = tag
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ]
  }

  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    Blog.find(query)
      .populate('author', 'firstName lastName specialization')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments(query),
  ])

  // Get all unique categories and tags
  const [categories, allTags] = await Promise.all([
    Blog.distinct('category'),
    Blog.distinct('tags'),
  ])

  logger.info('Blog posts fetched', {
    count: posts.length,
    isAdmin,
    filters: { category, tag, status, search },
  })

  return successResponse(
    {
      posts,
      categories,
      tags: allTags,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Blog posts fetched successfully'
  )
})

// POST /api/blog - Create new blog post (Admin only)
const postHandler = asyncHandler(async (req) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  if (session.user.role !== 'admin' && session.user.role !== 'doctor') {
    throw new ForbiddenError('Only administrators and doctors can create blog posts')
  }

  await dbConnect()

  const body = await req.json()

  // Validate request body
  const validatedData = await validateRequest(blogSchema, body)

  // Generate slug from title
  const baseSlug = generateSlug(validatedData.title)
  let slug = baseSlug
  let counter = 1

  // Ensure slug is unique
  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  // Get author (doctor profile for current user)
  let authorId
  if (session.user.role === 'admin') {
    // For admin, find or create a default author doctor profile
    // Or you can require admin to specify an author
    const adminDoctor = await Doctor.findOne({ userId: session.user.id })
    if (!adminDoctor) {
      // Create a default doctor profile for admin if needed
      throw new ForbiddenError('Admin must have a doctor profile to create blog posts')
    }
    authorId = adminDoctor._id
  } else {
    const doctor = await Doctor.findOne({ userId: session.user.id })
    if (!doctor) {
      throw new ForbiddenError('Doctor profile not found')
    }
    authorId = doctor._id
  }

  // Create blog post
  const post = await Blog.create({
    ...validatedData,
    slug,
    author: authorId,
  })

  // Populate author info
  await post.populate('author', 'firstName lastName specialization')

  logger.info('Blog post created', {
    postId: post._id,
    title: post.title,
    userId: session.user.id,
  })

  return successResponse(post, 'Blog post created successfully', 201)
})

export const GET = withRateLimit(getHandler, 'api')
export const POST = withRateLimit(postHandler, 'api')
