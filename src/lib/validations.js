import { z } from 'zod'

// User Registration Schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phone: z.string().min(10, 'Invalid phone number'),
})

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Appointment Schema
export const appointmentSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  serviceId: z.string().optional(),
  appointmentDate: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  reason: z.string().min(10, 'Please provide reason for visit (min 10 characters)'),
})

// Patient Profile Schema
export const patientProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  phone: z.string().min(10),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().default('Saudi Arabia'),
  }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', '']).optional(),
  allergies: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
})

// Doctor Profile Schema
export const doctorProfileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  specialty: z.string().min(2),
  bio: z.string().max(1000).optional(),
  phone: z.string().min(10),
  consultationFee: z.number().min(0),
  experience: z.number().min(0),
})

// Service Schema
export const serviceSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  duration: z.number().min(15),
  price: z.number().min(0),
  isActive: z.boolean().default(true),
})

// Product Schema
export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  stock: z.number().min(0),
  sku: z.string().min(2),
  prescriptionRequired: z.boolean().default(false),
  isActive: z.boolean().default(true),
})

// Blog Schema
export const blogSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5),
  content: z.string().min(50),
  excerpt: z.string().max(300).optional(),
  category: z.string().min(2),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
})

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).optional(),
  subject: z.string().min(5),
  message: z.string().min(20),
})

// Newsletter Schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})
