// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
}

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
}

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

// Notification Types
export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  ORDER: 'order',
  REMINDER: 'reminder',
  ANNOUNCEMENT: 'announcement',
}

// Days of Week
export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

// Blood Groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

// Gender Options
export const GENDER_OPTIONS = ['male', 'female', 'other']

// Blog Status
export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

// Service Categories
export const SERVICE_CATEGORIES = [
  'General Consultation',
  'Specialist Consultation',
  'Diagnostic Services',
  'Laboratory Tests',
  'Radiology',
  'Surgery',
  'Emergency Care',
  'Preventive Care',
  'Rehabilitation',
  'Mental Health',
]

// Product Categories
export const PRODUCT_CATEGORIES = [
  'Medicines',
  'Supplements',
  'Medical Equipment',
  'Personal Care',
  'First Aid',
  'Fitness & Wellness',
  'Baby Care',
  'Elderly Care',
]

// Time Slots (24-hour format)
export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
]

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'Something went wrong',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  DUPLICATE: 'Resource already exists',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
}
