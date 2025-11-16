// Use require for nodemailer due to Next.js 16 + Turbopack compatibility
const nodemailer = require('nodemailer')

// Create reusable transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

/**
 * Send email
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    })

    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send appointment confirmation email
 */
export async function sendAppointmentConfirmation(appointment) {
  const { patient, doctor, appointmentDate, timeSlot } = appointment

  const html = `
    <h1>Appointment Confirmation</h1>
    <p>Dear ${patient.fullName},</p>
    <p>Your appointment has been confirmed with the following details:</p>
    <ul>
      <li><strong>Doctor:</strong> Dr. ${doctor.fullName}</li>
      <li><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${timeSlot}</li>
    </ul>
    <p>Please arrive 10 minutes before your scheduled time.</p>
    <p>If you need to cancel or reschedule, please contact us at ${process.env.SUPPORT_PHONE}</p>
  `

  return sendEmail({
    to: patient.userId.email,
    subject: 'Appointment Confirmation - Dr. Nawaf Clinic',
    html,
  })
}

/**
 * Send appointment reminder email
 */
export async function sendAppointmentReminder(appointment) {
  const { patient, doctor, appointmentDate, timeSlot } = appointment

  const html = `
    <h1>Appointment Reminder</h1>
    <p>Dear ${patient.fullName},</p>
    <p>This is a reminder of your upcoming appointment:</p>
    <ul>
      <li><strong>Doctor:</strong> Dr. ${doctor.fullName}</li>
      <li><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${timeSlot}</li>
    </ul>
    <p>We look forward to seeing you!</p>
  `

  return sendEmail({
    to: patient.userId.email,
    subject: 'Appointment Reminder - Tomorrow',
    html,
  })
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmation(order) {
  const { patient, orderNumber, items, total } = order

  const itemsList = items
    .map(
      (item) =>
        `<li>${item.productId.name} - Quantity: ${item.quantity} - ${item.price} SAR</li>`
    )
    .join('')

  const html = `
    <h1>Order Confirmation</h1>
    <p>Dear ${patient.fullName},</p>
    <p>Thank you for your order! Your order number is: <strong>${orderNumber}</strong></p>
    <h3>Order Details:</h3>
    <ul>${itemsList}</ul>
    <p><strong>Total: ${total} SAR</strong></p>
    <p>We'll notify you once your order is shipped.</p>
  `

  return sendEmail({
    to: patient.userId.email,
    subject: `Order Confirmation - ${orderNumber}`,
    html,
  })
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`

  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested to reset your password.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `

  return sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
  })
}

/**
 * Send email verification
 */
export async function sendVerificationEmail(email, verificationToken) {
  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`

  const html = `
    <h1>Email Verification</h1>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
  `

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - Dr. Nawaf Clinic',
    html,
  })
}
