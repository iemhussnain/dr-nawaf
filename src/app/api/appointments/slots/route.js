import dbConnect from '@/lib/db'
import Doctor from '@/models/Doctor'
import Appointment from '@/models/Appointment'
import { asyncHandler, successResponse } from '@/lib/errors'
import { BadRequestError, NotFoundError } from '@/lib/errors/APIError'
import logger from '@/lib/errors/logger'

// Helper function to generate time slots
function generateTimeSlots(startTime, endTime, duration = 30) {
  const slots = []
  const [startHour, startMinute] = startTime.split(':').map(Number)
  const [endHour, endMinute] = endTime.split(':').map(Number)

  let currentHour = startHour
  let currentMinute = startMinute

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(
      currentMinute
    ).padStart(2, '0')}`

    // Calculate end time for this slot
    let slotEndHour = currentHour
    let slotEndMinute = currentMinute + duration

    if (slotEndMinute >= 60) {
      slotEndHour += Math.floor(slotEndMinute / 60)
      slotEndMinute = slotEndMinute % 60
    }

    const slotEndTime = `${String(slotEndHour).padStart(2, '0')}:${String(
      slotEndMinute
    ).padStart(2, '0')}`

    slots.push({
      startTime: timeSlot,
      endTime: slotEndTime,
      isAvailable: true,
    })

    // Move to next slot
    currentMinute += duration
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60)
      currentMinute = currentMinute % 60
    }
  }

  return slots
}

// GET /api/appointments/slots?doctorId=xxx&date=YYYY-MM-DD
export const GET = asyncHandler(async (req) => {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const doctorId = searchParams.get('doctorId')
  const dateStr = searchParams.get('date')

  if (!doctorId || !dateStr) {
    throw new BadRequestError('Doctor ID and date are required')
  }

  // Validate date format
  const requestedDate = new Date(dateStr)
  if (isNaN(requestedDate.getTime())) {
    throw new BadRequestError('Invalid date format. Use YYYY-MM-DD')
  }

  // Check if date is in the past
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (requestedDate < today) {
    throw new BadRequestError('Cannot book appointments in the past')
  }

  // Find doctor
  const doctor = await Doctor.findById(doctorId)

  if (!doctor) {
    throw new NotFoundError('Doctor not found')
  }

  if (doctor.status !== 'active') {
    throw new BadRequestError('Doctor is not available for appointments')
  }

  // Get day of week (lowercase)
  const dayOfWeek = requestedDate
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase()

  // Check if doctor works on this day
  const dayAvailability = doctor.availability?.find(
    (avail) => avail.day === dayOfWeek && avail.isAvailable
  )

  if (!dayAvailability || !dayAvailability.slots || dayAvailability.slots.length === 0) {
    logger.info('No availability for doctor on this day', {
      doctorId,
      date: dateStr,
      dayOfWeek,
    })

    return successResponse(
      {
        date: dateStr,
        dayOfWeek,
        slots: [],
      },
      'No available slots for this date'
    )
  }

  // Check if this date is a holiday for the doctor
  const isHoliday = doctor.holidays?.some((holiday) => {
    const holidayDate = new Date(holiday.date)
    holidayDate.setHours(0, 0, 0, 0)
    return holidayDate.getTime() === requestedDate.getTime()
  })

  if (isHoliday) {
    logger.info('Doctor is on holiday', { doctorId, date: dateStr })

    return successResponse(
      {
        date: dateStr,
        dayOfWeek,
        slots: [],
        message: 'Doctor is not available on this date',
      },
      'Doctor is on holiday'
    )
  }

  // Generate all possible slots from doctor's availability
  let allSlots = []
  for (const slot of dayAvailability.slots) {
    if (slot.isAvailable) {
      const generatedSlots = generateTimeSlots(
        slot.startTime,
        slot.endTime,
        doctor.consultationDuration || 30
      )
      allSlots = allSlots.concat(generatedSlots)
    }
  }

  // Get all booked appointments for this doctor on this date
  const startOfDay = new Date(requestedDate)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(requestedDate)
  endOfDay.setHours(23, 59, 59, 999)

  const bookedAppointments = await Appointment.find({
    doctorId,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $in: ['pending', 'confirmed'] },
  }).select('timeSlot duration')

  // Mark booked slots as unavailable
  const bookedTimeSlots = new Set(
    bookedAppointments.map((appointment) => appointment.timeSlot)
  )

  const availableSlots = allSlots.map((slot) => ({
    ...slot,
    isAvailable: !bookedTimeSlots.has(slot.startTime),
  }))

  // If requested date is today, filter out past time slots
  if (requestedDate.toDateString() === today.toDateString()) {
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`

    availableSlots.forEach((slot) => {
      if (slot.startTime <= currentTime) {
        slot.isAvailable = false
      }
    })
  }

  logger.info('Available slots fetched', {
    doctorId,
    date: dateStr,
    totalSlots: availableSlots.length,
    availableCount: availableSlots.filter((s) => s.isAvailable).length,
  })

  return successResponse(
    {
      date: dateStr,
      dayOfWeek,
      doctorId,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      consultationFee: doctor.consultationFee,
      slots: availableSlots,
    },
    'Available slots fetched successfully'
  )
})
