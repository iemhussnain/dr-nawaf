import dbConnect from '@/lib/db'
import User from '@/models/User'
import Patient from '@/models/Patient'
import { registerSchema } from '@/lib/validations'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'
import { asyncHandler, successResponse, formatZodError, formatMongoDBError } from '@/lib/errors'
import { ConflictError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'

export const POST = asyncHandler(async (req) => {
  logger.info('Registration endpoint hit')

  await dbConnect()
  logger.info('Database connected')

  // Parse and validate request body
  const body = await req.json()
  logger.info('Request body parsed', { email: body.email })

  // Validate input with Zod
  let validatedData
  try {
    validatedData = registerSchema.parse(body)
    logger.info('Validation passed')
  } catch (error) {
    throw formatZodError(error)
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: validatedData.email }).catch((error) => {
    throw formatMongoDBError(error)
  })

  if (existingUser) {
    logger.warn('Registration attempt with existing email', { email: validatedData.email })
    throw new ConflictError('User with this email already exists')
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex')

  // Create user
  const user = await User.create({
    email: validatedData.email,
    password: validatedData.password,
    role: 'patient', // Default role
    isVerified: false,
    verificationToken,
  }).catch((error) => {
    throw formatMongoDBError(error)
  })

  // Create patient profile
  await Patient.create({
    userId: user._id,
    firstName: validatedData.firstName,
    lastName: validatedData.lastName,
    phone: validatedData.phone,
    dateOfBirth: new Date(), // Placeholder, will be updated in profile
    gender: 'other', // Placeholder, will be updated in profile
  }).catch((error) => {
    throw formatMongoDBError(error)
  })

  // Send verification email
  await sendVerificationEmail(user.email, verificationToken)

  logger.info('User registered successfully', { email: user.email, userId: user._id })

  return successResponse(
    null,
    'Registration successful! Please check your email to verify your account.',
    201
  )
})
