import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    duration: {
      type: Number,
      default: 30, // minutes
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    reason: {
      type: String,
      required: [true, 'Reason for visit is required'],
    },
    notes: String,
    prescription: String,
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancellationReason: String,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
)

// Index for faster queries
appointmentSchema.index({ patientId: 1, appointmentDate: -1 })
appointmentSchema.index({ doctorId: 1, appointmentDate: -1 })
appointmentSchema.index({ status: 1, appointmentDate: 1 })

export default mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema)
