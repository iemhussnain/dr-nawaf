import nodemailer from 'nodemailer'

// Create reusable transporter using consistent EMAIL_* environment variables
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.warn('⚠️ Email not configured. Set EMAIL_HOST and EMAIL_USER environment variables.')
    return null
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Base email template
const getEmailTemplate = (title, content) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
          }
          .button {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Dr. Nawaf Medical Center</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Dr. Nawaf Medical Center. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </body>
    </html>
  `
}

// Send appointment reminder email
export const sendAppointmentReminder = async ({ to, patientName, appointmentDate, doctorName, service }) => {
  try {
    const transporter = createTransporter()
    if (!transporter) {
      console.log('⚠️ Email not configured. Skipping appointment reminder.')
      return { success: false, error: 'Email not configured' }
    }

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const content = `
      <h2>Appointment Reminder</h2>
      <p>Dear ${patientName},</p>
      <p>This is a friendly reminder about your upcoming appointment:</p>
      <ul>
        <li><strong>Date & Time:</strong> ${new Date(appointmentDate).toLocaleString('en-US', {
          dateStyle: 'full',
          timeStyle: 'short',
        })}</li>
        <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
        <li><strong>Service:</strong> ${service}</li>
      </ul>
      <p>Please arrive 10 minutes early for check-in.</p>
      <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
      <a href="${appUrl}/appointments" class="button">View My Appointments</a>
    `

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Dr. Nawaf Medical Center" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Appointment Reminder - Dr. Nawaf Medical Center',
      html: getEmailTemplate('Appointment Reminder', content),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Appointment reminder sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending appointment reminder:', error)
    return { success: false, error: error.message }
  }
}

// Send order confirmation email
export const sendOrderConfirmation = async ({ to, orderNumber, customerName, items, total }) => {
  try {
    const transporter = createTransporter()
    if (!transporter) {
      console.log('⚠️ Email not configured. Skipping order confirmation.')
      return { success: false, error: 'Email not configured' }
    }

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const itemsList = items
      .map(
        (item) =>
          `<li>${item.name} - Qty: ${item.quantity} - SAR ${(item.price * item.quantity).toFixed(2)}</li>`
      )
      .join('')

    const content = `
      <h2>Order Confirmation</h2>
      <p>Dear ${customerName},</p>
      <p>Thank you for your order! Your order has been confirmed.</p>
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <h3>Order Items:</h3>
      <ul>
        ${itemsList}
      </ul>
      <p><strong>Total:</strong> SAR ${total.toFixed(2)}</p>
      <p>We'll send you another email when your order ships.</p>
      <a href="${appUrl}/orders/${orderNumber}" class="button">View Order Details</a>
    `

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Dr. Nawaf Medical Center" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Confirmation - ${orderNumber}`,
      html: getEmailTemplate('Order Confirmation', content),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order confirmation sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending order confirmation:', error)
    return { success: false, error: error.message }
  }
}

// Send order status update email
export const sendOrderStatusUpdate = async ({ to, orderNumber, customerName, status, trackingNumber }) => {
  try {
    const transporter = createTransporter()
    if (!transporter) {
      console.log('⚠️ Email not configured. Skipping order status update.')
      return { success: false, error: 'Email not configured' }
    }

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const statusMessages = {
      processing: 'Your order is being processed and will be shipped soon.',
      shipped: `Your order has been shipped! ${trackingNumber ? `Tracking Number: ${trackingNumber}` : ''}`,
      delivered: 'Your order has been delivered. Thank you for shopping with us!',
      cancelled: 'Your order has been cancelled. If you have any questions, please contact us.',
    }

    const content = `
      <h2>Order Status Update</h2>
      <p>Dear ${customerName},</p>
      <p>Your order <strong>${orderNumber}</strong> status has been updated to: <strong>${status.toUpperCase()}</strong></p>
      <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
      ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
      <a href="${appUrl}/orders/${orderNumber}" class="button">Track Order</a>
    `

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Dr. Nawaf Medical Center" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Order Update - ${orderNumber}`,
      html: getEmailTemplate('Order Status Update', content),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Order status update sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending order status update:', error)
    return { success: false, error: error.message }
  }
}

// Send newsletter email
export const sendNewsletter = async ({ to, subject, content }) => {
  try {
    const transporter = createTransporter()
    if (!transporter) {
      console.log('⚠️ Email not configured. Skipping newsletter.')
      return { success: false, error: 'Email not configured' }
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Dr. Nawaf Medical Center Newsletter" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: getEmailTemplate(subject, content),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Newsletter sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return { success: false, error: error.message }
  }
}

// Send welcome email
export const sendWelcomeEmail = async ({ to, name }) => {
  try {
    const transporter = createTransporter()
    if (!transporter) {
      console.log('⚠️ Email not configured. Skipping welcome email.')
      return { success: false, error: 'Email not configured' }
    }

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const content = `
      <h2>Welcome to Dr. Nawaf Medical Center!</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering with Dr. Nawaf Medical Center. We're excited to have you as part of our healthcare community.</p>
      <p>With your account, you can:</p>
      <ul>
        <li>Book appointments with our specialists</li>
        <li>Access your medical records</li>
        <li>Order medications and health products</li>
        <li>Receive health tips and updates</li>
      </ul>
      <a href="${appUrl}" class="button">Get Started</a>
    `

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Dr. Nawaf Medical Center" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to Dr. Nawaf Medical Center',
      html: getEmailTemplate('Welcome', content),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error: error.message }
  }
}

// Send password reset email
export const sendPasswordResetEmail = async ({ to, name, resetToken }) => {
  try {
    const transporter = createTransporter()
    if (!transporter) {
      console.log('⚠️ Email not configured. Skipping password reset email.')
      return { success: false, error: 'Email not configured' }
    }

    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const resetUrl = `${appUrl}/reset-password?token=${resetToken}`

    const content = `
      <h2>Password Reset Request</h2>
      <p>Dear ${name},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Dr. Nawaf Medical Center" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Password Reset Request',
      html: getEmailTemplate('Password Reset', content),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    return { success: false, error: error.message }
  }
}

export default {
  sendAppointmentReminder,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendNewsletter,
  sendWelcomeEmail,
  sendPasswordResetEmail,
}
