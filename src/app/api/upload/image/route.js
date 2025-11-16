import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { asyncHandler, successResponse } from '@/lib/errors'
import { UnauthorizedError, ForbiddenError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { withRateLimit } from '@/middleware/rateLimiter'
import { validateFileUpload, generateSafeFilename } from '@/middleware/fileValidation'

// POST /api/upload/image - Upload image (Admin and Doctor only)
const handler = asyncHandler(async (req) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  if (session.user.role !== 'admin' && session.user.role !== 'doctor') {
    throw new ForbiddenError('Only administrators and doctors can upload images')
  }

  const formData = await req.formData()
  const file = formData.get('file')

  // Validate file upload using middleware
  const { file: validatedFile, metadata } = validateFileUpload(file, {
    category: 'images',
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  // Create upload directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'blog')
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  // Generate safe filename
  const filename = generateSafeFilename(validatedFile.name)

  // Save file
  const bytes = await validatedFile.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filepath = join(uploadDir, filename)

  await writeFile(filepath, buffer)

  // Generate public URL
  const url = `/uploads/blog/${filename}`

  logger.info('Image uploaded', {
    ...metadata,
    filename,
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

export const POST = withRateLimit(handler, 'upload')
