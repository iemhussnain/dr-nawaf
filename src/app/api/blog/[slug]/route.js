import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/db'
import Blog from '@/models/Blog'
import Doctor from '@/models/Doctor'
import { asyncHandler, successResponse, validateRequest } from '@/lib/errors'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/errors/APIError'
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

// Validation schema for updating blog
const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  excerpt: z.string().max(300, 'Excerpt cannot exceed 300 characters').optional(),
  featuredImage: z.string().url('Invalid image URL').optional().or(z.literal('')),
  category: z.string().min(1, 'Category is required').optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).optional(),
})

// GET /api/blog/[slug] - Get single blog post (published for public, all for admin/author)
const getHandler = asyncHandler(async (req, { params }) => {
  await dbConnect()

  const { slug } = params
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'admin'

  const post = await Blog.findOne({ slug })
    .populate('author', 'firstName lastName specialization bio')
    .lean()

  if (!post) {
    throw new NotFoundError('Blog post not found')
  }

  // Check authorization
  const isAuthor = session && post.author._id.toString() === session.user.id

  // Non-admin and non-author users can only view published posts
  if (!isAdmin && !isAuthor && post.status !== 'published') {
    throw new NotFoundError('Blog post not found')
  }

  // Increment views count (but don't wait for it)
  Blog.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).catch((err) =>
    logger.error('Failed to increment views', err)
  )

  logger.info('Blog post fetched', { slug, isAdmin })

  return successResponse(post, 'Blog post fetched successfully')
})

// PUT /api/blog/[slug] - Update blog post (Admin or Author only)
const putHandler = asyncHandler(async (req, { params }) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  await dbConnect()

  const { slug } = params
  const body = await req.json()

  // Validate request body
  const validatedData = await validateRequest(updateBlogSchema, body)

  const post = await Blog.findOne({ slug }).populate('author')

  if (!post) {
    throw new NotFoundError('Blog post not found')
  }

  // Check authorization
  const isAdmin = session.user.role === 'admin'
  let isAuthor = false

  if (session.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: session.user.id })
    isAuthor = doctor && post.author._id.toString() === doctor._id.toString()
  }

  if (!isAdmin && !isAuthor) {
    throw new ForbiddenError('You can only edit your own blog posts')
  }

  // If title is being changed, generate new slug
  if (validatedData.title && validatedData.title !== post.title) {
    const baseSlug = generateSlug(validatedData.title)
    let newSlug = baseSlug
    let counter = 1

    // Ensure new slug is unique
    while (await Blog.findOne({ slug: newSlug, _id: { $ne: post._id } })) {
      newSlug = `${baseSlug}-${counter}`
      counter++
    }

    validatedData.slug = newSlug
  }

  // Update post
  const updatedPost = await Blog.findByIdAndUpdate(
    post._id,
    { $set: validatedData },
    { new: true, runValidators: true }
  ).populate('author', 'firstName lastName specialization')

  logger.info('Blog post updated', {
    postId: post._id,
    slug,
    userId: session.user.id,
    updates: Object.keys(validatedData),
  })

  return successResponse(updatedPost, 'Blog post updated successfully')
})

// DELETE /api/blog/[slug] - Delete blog post (Admin or Author only)
const deleteHandler = asyncHandler(async (req, { params }) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  await dbConnect()

  const { slug } = params

  const post = await Blog.findOne({ slug }).populate('author')

  if (!post) {
    throw new NotFoundError('Blog post not found')
  }

  // Check authorization
  const isAdmin = session.user.role === 'admin'
  let isAuthor = false

  if (session.user.role === 'doctor') {
    const doctor = await Doctor.findOne({ userId: session.user.id })
    isAuthor = doctor && post.author._id.toString() === doctor._id.toString()
  }

  if (!isAdmin && !isAuthor) {
    throw new ForbiddenError('You can only delete your own blog posts')
  }

  // Delete the post
  await Blog.findByIdAndDelete(post._id)

  logger.warn('Blog post deleted', { postId: post._id, slug, userId: session.user.id })

  return successResponse(null, 'Blog post deleted successfully')
})

export const GET = withRateLimit(getHandler, 'api')
export const PUT = withRateLimit(putHandler, 'api')
export const DELETE = withRateLimit(deleteHandler, 'api')
