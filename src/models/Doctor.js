import mongoose from 'mongoose'

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
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    experience: {
      type: Number,
      default: 0,
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
    availability: [
      {
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        },
        slots: [
          {
            startTime: String,
            endTime: String,
            isAvailable: {
              type: Boolean,
              default: true,
            },
          },
        ],
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

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema)
