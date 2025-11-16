import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Appointment from '@/models/Appointment'
import User from '@/models/User'
import Patient from '@/models/Patient'
import Doctor from '@/models/Doctor'
import Service from '@/models/Service'
import Notification from '@/models/Notification'
import { sendAppointmentReminder } from '@/utils/email'
import { asyncHandler } from '@/lib/errors'
import { withRateLimit } from '@/middleware/rateLimiter'

// GET /api/cron/send-reminders - Send appointment reminders for appointments in next 24 hours
// This should be called by a cron job (e.g., Vercel Cron, external cron service)
const getHandler = asyncHandler(async (req) => {
  await dbConnect()

  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Get appointments scheduled for 24 hours from now
  const now = new Date()
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const twentyThreeHoursFromNow = new Date(now.getTime() + 23 * 60 * 60 * 1000)

  // Find appointments between 23-24 hours from now that haven't been reminded yet
  const appointments = await Appointment.find({
    appointmentDate: {
      $gte: twentyThreeHoursFromNow,
      $lte: twentyFourHoursFromNow,
    },
    status: { $in: ['scheduled', 'confirmed'] },
  })
    .populate('patientId')
    .populate('doctorId')
    .populate('serviceId')
    .lean()

  const results = {
    total: appointments.length,
    sent: 0,
    failed: 0,
    errors: [],
  }

  // Send reminder for each appointment
  for (const appointment of appointments) {
    try {
      // Get patient user email
      const user = await User.findById(appointment.patientId.userId)

      if (!user || !user.email) {
        results.failed++
        results.errors.push({
          appointmentId: appointment._id,
          error: 'Patient email not found',
        })
        continue
      }

      // Send email reminder
      const emailResult = await sendAppointmentReminder({
        to: user.email,
        patientName: `${appointment.patientId.firstName} ${appointment.patientId.lastName}`,
        appointmentDate: appointment.appointmentDate,
        doctorName: `${appointment.doctorId.firstName} ${appointment.doctorId.lastName}`,
        service: appointment.serviceId?.name || 'Consultation',
      })

      if (!emailResult.success) {
        results.failed++
        results.errors.push({
          appointmentId: appointment._id,
          error: emailResult.error,
        })
        continue
      }

      // Create in-app notification
      await Notification.create({
        userId: user._id,
        type: 'reminder',
        title: 'Appointment Reminder',
        message: `Your appointment with Dr. ${appointment.doctorId.firstName} ${appointment.doctorId.lastName} is scheduled for tomorrow at ${new Date(appointment.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.`,
        link: '/appointments',
      })

      results.sent++
    } catch (error) {
      console.error('Error sending reminder for appointment:', appointment._id, error)
      results.failed++
      results.errors.push({
        appointmentId: appointment._id,
        error: error.message,
      })
    }
  }

  return NextResponse.json({
    success: true,
    data: results,
    message: `Sent ${results.sent} reminders, ${results.failed} failed`,
  })
})

export const GET = withRateLimit(getHandler, 'public')
