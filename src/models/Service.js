import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Service || mongoose.model('Service', serviceSchema)
