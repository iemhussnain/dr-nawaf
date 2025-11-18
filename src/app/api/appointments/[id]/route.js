import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import dbConnect from '@/lib/dbConnect'
import Appointment from '@/models/Appointment'
import Doctor from '@/models/Doctor'
import Patient from '@/models/Patient'
import { asyncHandler, successResponse, validateRequest } from '@/lib/errors'
import { UnauthorizedError, NotFoundError, ForbiddenError, BadRequestError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'
import { z } from 'zod'
import { withRateLimit } from '@/middleware/rateLimiter'

// Validation schema for updating appointment
const updateAppointmentSchema = z.object({
  appointmentDate: z.string().optional(),
  timeSlot: z.string().optional(),
  duration: z.number().min(15).max(180).optional(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no-show']).optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  prescription: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'refunded']).optional(),
  cancellationReason: z.string().optional(),
})

// GET /api/appointments/[id] - Get single appointment
const getHandler = asyncHandler(async (req, { params }) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  await dbConnect()
  const { id } = params

  const appointment = await Appointment.findById(id)
    .populate('patientId', 'firstName lastName email phone dateOfBirth gender bloodGroup')
    .populate('doctorId', 'firstName lastName specialty specialization consultationFee experience')
    .populate('serviceId', 'name description price duration')
    .lean()

  if (!appointment) {
    throw new NotFoundError('Appointment not found')
  }

  // Authorization check
  const isAdmin = session.user.role === 'admin'
  const isPatient = session.user.role === 'patient'
  const isDoctor = session.user.role === 'doctor'

  if (isPatient) {
    const patient = await Patient.findOne({ userId: session.user.id })
    if (appointment.patientId._id.toString() !== patient?._id.toString()) {
      throw new ForbiddenError('You can only view your own appointments')
    }
  } else if (isDoctor) {
    const doctor = await Doctor.findOne({ userId: session.user.id })
    if (appointment.doctorId._id.toString() !== doctor?._id.toString()) {
      throw new ForbiddenError('You can only view your own appointments')
    }
  }
  // Admin can view all appointments

  logger.info('Appointment fetched', { appointmentId: id, userId: session.user.id })

  return successResponse(appointment, 'Appointment fetched successfully')
})

// PUT /api/appointments/[id] - Update appointment
const putHandler = asyncHandler(async (req, { params }) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  await dbConnect()
  const { id } = params
  const body = await req.json()

  // Validate request body
  const validatedData = await validateRequest(updateAppointmentSchema, body)

  const appointment = await Appointment.findById(id)

  if (!appointment) {
    throw new NotFoundError('Appointment not found')
  }

  // Authorization and permission checks
  const isAdmin = session.user.role === 'admin'
  const isPatient = session.user.role === 'patient'
  const isDoctor = session.user.role === 'doctor'

  let canUpdate = false
  let allowedFields = []

  if (isAdmin) {
    canUpdate = true
    allowedFields = Object.keys(validatedData) // Admin can update all fields
  } else if (isPatient) {
    const patient = await Patient.findOne({ userId: session.user.id })
    if (appointment.patientId.toString() === patient?._id.toString()) {
      canUpdate = true
      // Patients can only update certain fields
      allowedFields = ['notes', 'cancellationReason']
      // Patients can cancel their own appointments
      if (validatedData.status === 'cancelled') {
        allowedFields.push('status')
      }
    }
  } else if (isDoctor) {
    const doctor = await Doctor.findOne({ userId: session.user.id })
    if (appointment.doctorId.toString() === doctor?._id.toString()) {
      canUpdate = true
      // Doctors can update status, notes, prescription
      allowedFields = ['status', 'notes', 'prescription']
    }
  }

  if (!canUpdate) {
    throw new ForbiddenError('You do not have permission to update this appointment')
  }

  // Filter out fields user is not allowed to update
  const updateData = {}
  for (const field of allowedFields) {
    if (validatedData[field] !== undefined) {
      updateData[field] = validatedData[field]
    }
  }

  // If cancelling, track cancellation details
  if (updateData.status === 'cancelled') {
    updateData.cancelledBy = session.user.id
    updateData.cancelledAt = new Date()
    if (!updateData.cancellationReason) {
      throw new BadRequestError('Cancellation reason is required')
    }
  }

  // If rescheduling, check if new slot is available
  if (updateData.appointmentDate || updateData.timeSlot) {
    const dateToCheck = updateData.appointmentDate || appointment.appointmentDate
    const slotToCheck = updateData.timeSlot || appointment.timeSlot

    const conflictingAppointment = await Appointment.findOne({
      _id: { $ne: id }, // Exclude current appointment
      doctorId: appointment.doctorId,
      appointmentDate: new Date(dateToCheck),
      timeSlot: slotToCheck,
      status: { $in: ['pending', 'confirmed'] },
    })

    if (conflictingAppointment) {
      throw new BadRequestError('The selected time slot is not available')
    }
  }

  // Update appointment
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('patientId', 'firstName lastName email phone')
    .populate('doctorId', 'firstName lastName specialty specialization consultationFee')
    .populate('serviceId', 'name price')

  logger.info('Appointment updated', {
    appointmentId: id,
    userId: session.user.id,
    updates: Object.keys(updateData),
  })

  return successResponse(updatedAppointment, 'Appointment updated successfully')
})

// DELETE /api/appointments/[id] - Delete appointment (Admin only)
const deleteHandler = asyncHandler(async (req, { params }) => {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new UnauthorizedError()
  }

  // Only admins can delete appointments
  if (session.user.role !== 'admin') {
    throw new ForbiddenError('Only administrators can delete appointments')
  }

  await dbConnect()
  const { id } = params

  const appointment = await Appointment.findById(id)

  if (!appointment) {
    throw new NotFoundError('Appointment not found')
  }

  // Soft delete by setting status to cancelled
  appointment.status = 'cancelled'
  appointment.cancelledBy = session.user.id
  appointment.cancelledAt = new Date()
  appointment.cancellationReason = 'Deleted by administrator'
  await appointment.save()

  logger.warn('Appointment deleted', { appointmentId: id, userId: session.user.id })

  return successResponse(null, 'Appointment deleted successfully')
})

export const GET = withRateLimit(getHandler, 'api')
export const PUT = withRateLimit(putHandler, 'api')
export const DELETE = withRateLimit(deleteHandler, 'api')
