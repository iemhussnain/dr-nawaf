import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative'],
    },
    images: [String],
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    prescriptionRequired: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
)

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100)
  }
  return 0
})

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

export default mongoose.models.Product || mongoose.model('Product', productSchema)
