import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { asyncHandler, successResponse } from '@/lib/errors'
import { UnauthorizedError, ForbiddenError, BadRequestError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'

// POST /api/upload/image - Upload image (Admin and Doctor only)
export const POST = asyncHandler(async (req) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  if (session.user.role !== 'admin' && session.user.role !== 'doctor') {
    throw new ForbiddenError('Only administrators and doctors can upload images')
  }

  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    throw new BadRequestError('No file uploaded')
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new BadRequestError(
      'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed'
    )
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new BadRequestError('File size must be less than 5MB')
  }

  // Create upload directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'blog')
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split('.').pop()
  const filename = `${timestamp}-${randomString}.${extension}`

  // Save file
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filepath = join(uploadDir, filename)

  await writeFile(filepath, buffer)

  // Generate public URL
  const url = `/uploads/blog/${filename}`

  logger.info('Image uploaded', {
    filename,
    size: file.size,
    type: file.type,
    userId: session.user.id,
  })

  return successResponse(
    {
      url,
      filename,
      size: file.size,
      type: file.type,
    },
    'Image uploaded successfully',
    201
  )
})
