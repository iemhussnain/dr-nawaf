import Notification from '@/models/Notification'

/**
 * Create a notification for a user
 * @param {Object} params - Notification parameters
 * @param {string} params.userId - User ID to send notification to
 * @param {string} params.type - Type of notification (appointment, order, reminder, announcement)
 * @param {string} params.title - Notification title
 * @param {string} params.message - Notification message
 * @param {string} [params.link] - Optional link to navigate to when clicked
 * @returns {Promise<Object>} Created notification
 */
export const createNotification = async ({ userId, type, title, message, link }) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      link: link || '',
    })

    return { success: true, data: notification }
  } catch (error) {
    console.error('Error creating notification:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Create appointment notification
 * @param {string} userId - User ID
 * @param {string} doctorName - Doctor's name
 * @param {Date} appointmentDate - Appointment date
 * @param {string} [appointmentId] - Optional appointment ID for link
 */
export const createAppointmentNotification = async (userId, doctorName, appointmentDate, appointmentId) => {
  return createNotification({
    userId,
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: `Your appointment with Dr. ${doctorName} has been scheduled for ${new Date(appointmentDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}.`,
    link: '/appointments',
  })
}

/**
 * Create appointment reminder notification
 * @param {string} userId - User ID
 * @param {string} doctorName - Doctor's name
 * @param {Date} appointmentDate - Appointment date
 */
export const createAppointmentReminder = async (userId, doctorName, appointmentDate) => {
  return createNotification({
    userId,
    type: 'reminder',
    title: 'Appointment Reminder',
    message: `Reminder: You have an appointment with Dr. ${doctorName} tomorrow at ${new Date(appointmentDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })}.`,
    link: '/appointments',
  })
}

/**
 * Create order notification
 * @param {string} userId - User ID
 * @param {string} orderNumber - Order number
 * @param {string} status - Order status
 * @param {string} [orderId] - Optional order ID for link
 */
export const createOrderNotification = async (userId, orderNumber, status, orderId) => {
  const statusMessages = {
    pending: 'Your order has been placed and is being processed.',
    processing: 'Your order is being prepared for shipment.',
    shipped: 'Your order has been shipped and is on the way!',
    delivered: 'Your order has been delivered. Thank you for shopping with us!',
    cancelled: 'Your order has been cancelled.',
  }

  return createNotification({
    userId,
    type: 'order',
    title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: `Order ${orderNumber}: ${statusMessages[status] || 'Your order status has been updated.'}`,
    link: orderId ? `/orders/${orderId}` : '/orders',
  })
}

/**
 * Create announcement notification for all users
 * @param {string} title - Announcement title
 * @param {string} message - Announcement message
 * @param {string} [link] - Optional link
 * @param {Array<string>} userIds - Array of user IDs to send to (if empty, sends to all users)
 */
export const createAnnouncementNotification = async (title, message, link, userIds = []) => {
  try {
    // If no specific users, you would fetch all user IDs from database
    // For now, we'll just create for specified users
    const results = await Promise.all(
      userIds.map((userId) =>
        createNotification({
          userId,
          type: 'announcement',
          title,
          message,
          link: link || '',
        })
      )
    )

    return { success: true, data: results }
  } catch (error) {
    console.error('Error creating announcement notifications:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Unread count
 */
export const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.countDocuments({ userId, isRead: false })
    return count
  } catch (error) {
    console.error('Error getting unread count:', error)
    return 0
  }
}

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 */
export const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    )

    return { success: true, data: notification }
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 */
export const markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany({ userId, isRead: false }, { isRead: true })

    return { success: true, data: result }
  } catch (error) {
    console.error('Error marking all as read:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Delete old read notifications (older than 30 days)
 * This can be called by a cron job to clean up old notifications
 */
export const cleanupOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const result = await Notification.deleteMany({
      isRead: true,
      createdAt: { $lt: thirtyDaysAgo },
    })

    console.log(`Deleted ${result.deletedCount} old notifications`)
    return { success: true, deletedCount: result.deletedCount }
  } catch (error) {
    console.error('Error cleaning up old notifications:', error)
    return { success: false, error: error.message }
  }
}

export default {
  createNotification,
  createAppointmentNotification,
  createAppointmentReminder,
  createOrderNotification,
  createAnnouncementNotification,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  cleanupOldNotifications,
}
