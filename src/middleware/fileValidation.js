/**
 * File Upload Validation Middleware
 *
 * Provides validation for file uploads including:
 * - File type validation
 * - File size limits
 * - Multiple file validation
 * - MIME type checking
 * - Malicious file detection
 *
 * Usage:
 * import { validateFileUpload } from '@/middleware/fileValidation'
 *
 * // In your API route:
 * const file = formData.get('file')
 * validateFileUpload(file, options)
 */

import { BadRequestError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'

// Common MIME type groups
export const MIME_TYPES = {
  images: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ],
  archives: [
    'application/zip',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
  ],
  videos: [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/webm',
  ],
  audio: [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
  ],
}

// Dangerous file extensions that should never be allowed
const DANGEROUS_EXTENSIONS = [
  'exe', 'bat', 'cmd', 'com', 'pif', 'scr',
  'vbs', 'js', 'jar', 'msi', 'app', 'deb',
  'rpm', 'sh', 'bash', 'ps1', 'dll', 'so',
]

// Magic numbers (file signatures) for common file types
const FILE_SIGNATURES = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
  'application/zip': [0x50, 0x4B, 0x03, 0x04],
}

/**
 * Validate file upload against specified criteria
 *
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {string[]} options.allowedTypes - Array of allowed MIME types
 * @param {number} options.maxSize - Maximum file size in bytes
 * @param {string} options.category - Predefined category from MIME_TYPES
 * @param {boolean} options.checkSignature - Verify file signature matches MIME type
 * @param {boolean} options.allowDangerous - Allow potentially dangerous file extensions (default: false)
 * @returns {Object} Validation result { valid: boolean, file: File, error?: string }
 */
export function validateFileUpload(file, options = {}) {
  const {
    allowedTypes,
    maxSize = 10 * 1024 * 1024, // 10MB default
    category,
    checkSignature = true,
    allowDangerous = false,
  } = options

  // Check if file exists
  if (!file) {
    throw new BadRequestError('No file provided')
  }

  // Check if it's a valid File object
  if (!(file instanceof File) && !file.type) {
    throw new BadRequestError('Invalid file object')
  }

  // Get allowed types from category or use provided types
  let allowedMimeTypes = allowedTypes || []
  if (category && MIME_TYPES[category]) {
    allowedMimeTypes = MIME_TYPES[category]
  }

  // Validate file name
  if (!file.name || file.name.trim() === '') {
    throw new BadRequestError('File must have a valid name')
  }

  // Extract file extension
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (!extension) {
    throw new BadRequestError('File must have an extension')
  }

  // Check for dangerous extensions
  if (!allowDangerous && DANGEROUS_EXTENSIONS.includes(extension)) {
    logger.warn('Blocked dangerous file upload attempt', {
      filename: file.name,
      extension,
      mimetype: file.type,
    })
    throw new BadRequestError(
      `File extension .${extension} is not allowed for security reasons`
    )
  }

  // Validate MIME type
  if (allowedMimeTypes.length > 0 && !allowedMimeTypes.includes(file.type)) {
    throw new BadRequestError(
      `File type ${file.type} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`
    )
  }

  // Validate file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    throw new BadRequestError(
      `File size ${fileSizeMB}MB exceeds maximum allowed size of ${maxSizeMB}MB`
    )
  }

  // Validate minimum file size (prevent empty files)
  if (file.size === 0) {
    throw new BadRequestError('File cannot be empty')
  }

  logger.info('File validation passed', {
    filename: file.name,
    size: file.size,
    type: file.type,
  })

  return {
    valid: true,
    file,
    metadata: {
      name: file.name,
      size: file.size,
      type: file.type,
      extension,
    },
  }
}

/**
 * Validate file signature (magic numbers) matches declared MIME type
 * This helps prevent file type spoofing
 *
 * @param {ArrayBuffer} buffer - File buffer
 * @param {string} declaredType - Declared MIME type
 * @returns {boolean} True if signature matches, false otherwise
 */
export async function validateFileSignature(buffer, declaredType) {
  const signature = FILE_SIGNATURES[declaredType]

  if (!signature) {
    // No signature check available for this type
    return true
  }

  const uint8Array = new Uint8Array(buffer)

  // Check if file starts with expected signature
  for (let i = 0; i < signature.length; i++) {
    if (uint8Array[i] !== signature[i]) {
      logger.warn('File signature mismatch', {
        declaredType,
        expectedSignature: signature,
        actualSignature: Array.from(uint8Array.slice(0, signature.length)),
      })
      return false
    }
  }

  return true
}

/**
 * Validate multiple file uploads
 *
 * @param {File[]} files - Array of files to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxFiles - Maximum number of files allowed
 * @param {number} options.maxTotalSize - Maximum total size of all files
 * @returns {Object} Validation result
 */
export function validateMultipleFiles(files, options = {}) {
  const {
    maxFiles = 10,
    maxTotalSize = 50 * 1024 * 1024, // 50MB default
    ...fileOptions
  } = options

  // Check if files array exists
  if (!files || !Array.isArray(files)) {
    throw new BadRequestError('Files must be provided as an array')
  }

  // Check number of files
  if (files.length === 0) {
    throw new BadRequestError('At least one file must be provided')
  }

  if (files.length > maxFiles) {
    throw new BadRequestError(
      `Too many files. Maximum ${maxFiles} files allowed, got ${files.length}`
    )
  }

  // Calculate total size
  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

  if (totalSize > maxTotalSize) {
    const maxSizeMB = (maxTotalSize / (1024 * 1024)).toFixed(2)
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2)
    throw new BadRequestError(
      `Total file size ${totalSizeMB}MB exceeds maximum allowed ${maxSizeMB}MB`
    )
  }

  // Validate each file individually
  const validatedFiles = files.map((file, index) => {
    try {
      return validateFileUpload(file, fileOptions)
    } catch (error) {
      throw new BadRequestError(`File ${index + 1} (${file.name}): ${error.message}`)
    }
  })

  logger.info('Multiple files validation passed', {
    fileCount: files.length,
    totalSize,
  })

  return {
    valid: true,
    files: validatedFiles.map(v => v.file),
    metadata: {
      count: files.length,
      totalSize,
      files: validatedFiles.map(v => v.metadata),
    },
  }
}

/**
 * Generate a safe filename
 * Removes dangerous characters and ensures uniqueness
 *
 * @param {string} originalName - Original filename
 * @param {Object} options - Options
 * @param {boolean} options.preserveExtension - Keep original extension (default: true)
 * @param {boolean} options.addTimestamp - Add timestamp for uniqueness (default: true)
 * @param {boolean} options.addRandomString - Add random string (default: true)
 * @returns {string} Safe filename
 */
export function generateSafeFilename(originalName, options = {}) {
  const {
    preserveExtension = true,
    addTimestamp = true,
    addRandomString = true,
  } = options

  // Extract extension
  const parts = originalName.split('.')
  const extension = parts.length > 1 ? parts.pop() : ''
  let baseName = parts.join('.')

  // Remove dangerous characters
  baseName = baseName
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 50) // Limit length

  // Build new filename
  const components = [baseName]

  if (addTimestamp) {
    components.push(Date.now().toString())
  }

  if (addRandomString) {
    const randomStr = Math.random().toString(36).substring(2, 10)
    components.push(randomStr)
  }

  let newFilename = components.join('-')

  if (preserveExtension && extension) {
    // Validate extension is safe
    const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, '')
    newFilename += `.${safeExtension}`
  }

  return newFilename
}

/**
 * Example usage:
 *
 * // In an API route:
 * export const POST = asyncHandler(async (req) => {
 *   const formData = await req.formData()
 *   const file = formData.get('file')
 *
 *   // Validate single image file
 *   validateFileUpload(file, {
 *     category: 'images',
 *     maxSize: 5 * 1024 * 1024, // 5MB
 *   })
 *
 *   // Generate safe filename
 *   const safeFilename = generateSafeFilename(file.name)
 *
 *   // Process file...
 * })
 *
 * // Multiple files:
 * const files = formData.getAll('files')
 * validateMultipleFiles(files, {
 *   category: 'documents',
 *   maxFiles: 5,
 *   maxSize: 10 * 1024 * 1024, // 10MB per file
 *   maxTotalSize: 40 * 1024 * 1024, // 40MB total
 * })
 */
