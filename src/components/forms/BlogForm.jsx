"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RichTextEditor } from "@/components/admin/RichTextEditor"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

// Common blog categories
const BLOG_CATEGORIES = [
  "Health & Wellness",
  "Medical News",
  "Patient Education",
  "Treatment Guides",
  "Disease Prevention",
  "Nutrition & Diet",
  "Mental Health",
  "Fitness & Exercise",
  "Medical Research",
  "Healthcare Technology",
  "Other",
]

export function BlogForm({ post = null, isEdit = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    featuredImage: post?.featuredImage || "",
    category: post?.category || "",
    tags: post?.tags?.join(", ") || "",
    status: post?.status || "draft",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleContentChange = (content) => {
    setFormData({ ...formData, content })
  }

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value })
  }

  const handleStatusChange = (value) => {
    setFormData({ ...formData, status: value })
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formDataObj = new FormData()
      formDataObj.append('file', file)

      const response = await axiosInstance.post('/api/upload/image', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.success) {
        setFormData({ ...formData, featuredImage: response.data.data.url })
        toast.success('Featured image uploaded successfully')
      }
    } catch (error) {
      console.error('Image upload error:', error)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, featuredImage: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.title.trim()) {
        toast.error("Title is required")
        return
      }
      if (!formData.content.trim()) {
        toast.error("Content is required")
        return
      }
      if (!formData.category) {
        toast.error("Category is required")
        return
      }

      // Prepare submit data
      const submitData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        featuredImage: formData.featuredImage,
        category: formData.category,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : [],
        status: formData.status,
      }

      const url = isEdit ? `/api/blog/${post.slug}` : "/api/blog"
      const method = isEdit ? "put" : "post"

      const response = await axiosInstance[method](url, submitData)

      if (response.data.success) {
        toast.success(
          isEdit ? "Blog post updated successfully" : "Blog post created successfully"
        )
        router.push("/admin/blog")
      }
    } catch (error) {
      console.error("Form submit error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-5xl mx-auto space-y-6">
      {/* Basic Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog post title..."
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt (Optional)</Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Brief summary of the blog post (max 300 characters)..."
              rows={3}
              maxLength={300}
              className="mt-1"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {formData.excerpt.length}/300 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {BLOG_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={handleStatusChange}>
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., health, wellness, tips (comma-separated)"
              className="mt-1"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Separate tags with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Featured Image (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.featuredImage ? (
            <div className="relative">
              <img
                src={formData.featuredImage}
                alt="Featured"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Featured Image
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                JPEG, PNG, GIF, or WebP (max 5MB)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Content *</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={formData.content}
            onChange={handleContentChange}
            placeholder="Write your blog post content here..."
            rows={20}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/blog")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : isEdit ? (
            "Update Post"
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  )
}
