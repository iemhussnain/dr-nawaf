import mongoose from 'mongoose'

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  slots: [
    {
      startTime: {
        type: String, // Format: "09:00"
        required: true,
      },
      endTime: {
        type: String, // Format: "17:00"
        required: true,
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
  ],
})

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
    },
    specialization: {
      type: String,
      enum: [
        'General Practitioner',
        'Cardiologist',
        'Dermatologist',
        'Pediatrician',
        'Orthopedic',
        'Neurologist',
        'Psychiatrist',
        'Gynecologist',
        'Ophthalmologist',
        'ENT Specialist',
        'Dentist',
        'Physiotherapist',
        'Radiologist',
        'Surgeon',
        'Other',
      ],
      default: 'General Practitioner',
    },
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    licenseNumber: {
      type: String,
      unique: true,
      sparse: true, // Allows null values while maintaining uniqueness
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    photo: {
      type: String,
      default: '/images/default-doctor.png',
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    languages: [
      {
        type: String,
      },
    ],
    availability: [availabilitySchema],
    holidays: [
      {
        date: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          default: 'Holiday',
        },
      },
    ],
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on-leave'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
)

// Virtual for full name
doctorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Ensure virtuals are included in JSON
doctorSchema.set('toJSON', { virtuals: true })
doctorSchema.set('toObject', { virtuals: true })

// Indexes for faster queries
doctorSchema.index({ specialization: 1, status: 1 })
doctorSchema.index({ userId: 1 })
doctorSchema.index({ isActive: 1 })

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema)
