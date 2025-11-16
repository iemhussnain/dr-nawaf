import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/db'
import Appointment from '@/models/Appointment'
import Doctor from '@/models/Doctor'
import Patient from '@/models/Patient'
import { asyncHandler, successResponse, validateRequest } from '@/lib/errors'
import { UnauthorizedError, BadRequestError, NotFoundError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { z } from 'zod'
import { withRateLimit } from '@/middleware/rateLimiter'

// Validation schema for creating appointment
const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  patientId: z.string().optional(),
  serviceId: z.string().optional(),
  appointmentDate: z.string().min(1, 'Appointment date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  duration: z.number().min(15).max(180).optional(),
  reason: z.string().min(1, 'Reason for visit is required'),
  notes: z.string().optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  // Guest booking fields (when user not logged in)
  guestInfo: z
    .object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
    })
    .optional(),
})

// GET /api/appointments - List appointments with filters
const getHandler = asyncHandler(async (req) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  await dbConnect()

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const doctorId = searchParams.get('doctorId')
  const patientId = searchParams.get('patientId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  // Build query based on user role
  const query = {}

  // Role-based filtering
  if (session.user.role === 'patient') {
    // Patients can only see their own appointments
    const patient = await Patient.findOne({ userId: session.user.id })
    if (!patient) {
      throw new NotFoundError('Patient profile not found')
    }
    query.patientId = patient._id
  } else if (session.user.role === 'doctor') {
    // Doctors can only see their own appointments
    const doctor = await Doctor.findOne({ userId: session.user.id })
    if (!doctor) {
      throw new NotFoundError('Doctor profile not found')
    }
    query.doctorId = doctor._id
  }
  // Admin can see all appointments (no additional filter)

  // Apply filters
  if (status) query.status = status
  if (doctorId) query.doctorId = doctorId
  if (patientId) query.patientId = patientId

  // Date range filter
  if (startDate || endDate) {
    query.appointmentDate = {}
    if (startDate) query.appointmentDate.$gte = new Date(startDate)
    if (endDate) query.appointmentDate.$lte = new Date(endDate)
  }

  const skip = (page - 1) * limit

  const appointments = await Appointment.find(query)
    .populate('patientId', 'firstName lastName email phone')
    .populate('doctorId', 'firstName lastName specialty specialization consultationFee')
    .populate('serviceId', 'name price')
    .sort({ appointmentDate: -1, timeSlot: 1 })
    .skip(skip)
    .limit(limit)
    .lean()

  const total = await Appointment.countDocuments(query)

  logger.info('Appointments fetched', {
    userId: session.user.id,
    role: session.user.role,
    count: appointments.length,
  })

  return successResponse(
    {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Appointments fetched successfully'
  )
})

// POST /api/appointments - Create new appointment
const postHandler = asyncHandler(async (req) => {
  await dbConnect()

  const body = await req.json()
  const session = await getServerSession(authOptions)

  // Validate request body
  const validatedData = await validateRequest(createAppointmentSchema, body)

  // Check if doctor exists and is active
  const doctor = await Doctor.findById(validatedData.doctorId)
  if (!doctor) {
    throw new NotFoundError('Doctor not found')
  }
  if (doctor.status !== 'active') {
    throw new BadRequestError('Doctor is not available for appointments')
  }

  let patientId = validatedData.patientId

  // If user is logged in as patient, use their patient profile
  if (session?.user?.role === 'patient') {
    const patient = await Patient.findOne({ userId: session.user.id })
    if (!patient) {
      throw new NotFoundError('Patient profile not found')
    }
    patientId = patient._id
  } else if (!validatedData.guestInfo) {
    // If not logged in and no guest info, require authentication
    throw new UnauthorizedError('Please login or provide guest information')
  }

  // For guest booking, create a temporary patient record
  if (validatedData.guestInfo && !patientId) {
    // Check if patient with email already exists
    let patient = await Patient.findOne({ email: validatedData.guestInfo.email })

    if (!patient) {
      // Create new patient record for guest
      patient = await Patient.create({
        firstName: validatedData.guestInfo.firstName,
        lastName: validatedData.guestInfo.lastName,
        email: validatedData.guestInfo.email,
        phone: validatedData.guestInfo.phone,
        dateOfBirth: new Date(), // Placeholder
        gender: 'other', // Placeholder
      })
      logger.info('Guest patient record created', { email: patient.email })
    }

    patientId = patient._id
  }

  // Check if the slot is still available
  const existingAppointment = await Appointment.findOne({
    doctorId: validatedData.doctorId,
    appointmentDate: new Date(validatedData.appointmentDate),
    timeSlot: validatedData.timeSlot,
    status: { $in: ['pending', 'confirmed'] },
  })

  if (existingAppointment) {
    throw new BadRequestError('This time slot is no longer available')
  }

  // Create appointment
  const appointment = await Appointment.create({
    patientId,
    doctorId: validatedData.doctorId,
    serviceId: validatedData.serviceId,
    appointmentDate: new Date(validatedData.appointmentDate),
    timeSlot: validatedData.timeSlot,
    duration: validatedData.duration || 30,
    reason: validatedData.reason,
    notes: validatedData.notes,
    amount: validatedData.amount,
    status: 'pending',
    paymentStatus: 'pending',
  })

  // Populate the appointment for response
  await appointment.populate([
    { path: 'patientId', select: 'firstName lastName email phone' },
    { path: 'doctorId', select: 'firstName lastName specialty specialization consultationFee' },
    { path: 'serviceId', select: 'name price' },
  ])

  logger.info('Appointment created', {
    appointmentId: appointment._id,
    doctorId: validatedData.doctorId,
    patientId,
  })

  return successResponse(
    appointment,
    'Appointment booked successfully! Please complete the payment.',
    201
  )
})

export const GET = withRateLimit(getHandler, 'api')
export const POST = withRateLimit(postHandler, 'api')
