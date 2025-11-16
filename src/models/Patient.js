import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
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
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Gender is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'Saudi Arabia',
      },
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    medicalHistory: [
      {
        condition: String,
        diagnosedDate: Date,
        notes: String,
      },
    ],
    allergies: [String],
    currentMedications: [String],
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', ''],
    },
  },
  {
    timestamps: true,
  }
)

// Virtual for full name
patientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Virtual for age
patientSchema.virtual('age').get(function () {
  const today = new Date()
  const birthDate = new Date(this.dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
})

// Ensure virtuals are included in JSON
patientSchema.set('toJSON', { virtuals: true })
patientSchema.set('toObject', { virtuals: true })

export default mongoose.models.Patient || mongoose.model('Patient', patientSchema)
