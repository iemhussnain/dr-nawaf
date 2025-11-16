import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },
    featuredImage: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [String],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: Date,
  },
  {
    timestamps: true,
  }
)

// Set publishedAt when status changes to published
blogSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema)
