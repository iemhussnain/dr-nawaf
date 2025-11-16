"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, X } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

// Product categories
const PRODUCT_CATEGORIES = [
  "Medications",
  "Vitamins & Supplements",
  "Personal Care",
  "Medical Devices",
  "First Aid",
  "Health Monitoring",
  "Skincare",
  "Baby Care",
  "Wellness",
  "Other",
]

export function ProductForm({ product = null, isEdit = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "",
    price: product?.price || "",
    compareAtPrice: product?.compareAtPrice || "",
    stock: product?.stock || "",
    sku: product?.sku || "",
    images: product?.images || [],
    tags: product?.tags?.join(", ") || "",
    isActive: product?.isActive ?? true,
    prescriptionRequired: product?.prescriptionRequired ?? false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value })
  }

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    setUploadingImages(true)
    try {
      const uploadedUrls = []

      for (const file of files) {
        const formDataObj = new FormData()
        formDataObj.append("file", file)

        const response = await axiosInstance.post(
          "/api/upload/image",
          formDataObj,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )

        if (response.data.success) {
          uploadedUrls.push(response.data.data.url)
        }
      }

      setFormData({
        ...formData,
        images: [...formData.images, ...uploadedUrls],
      })
      toast.success("Images uploaded successfully")
    } catch (error) {
      console.error("Image upload error:", error)
    } finally {
      setUploadingImages(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Product name is required")
        return
      }
      if (!formData.description.trim()) {
        toast.error("Description is required")
        return
      }
      if (!formData.category) {
        toast.error("Category is required")
        return
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error("Valid price is required")
        return
      }
      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error("Valid stock quantity is required")
        return
      }
      if (!formData.sku.trim()) {
        toast.error("SKU is required")
        return
      }

      // Prepare submit data
      const submitData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice
          ? parseFloat(formData.compareAtPrice)
          : undefined,
        stock: parseInt(formData.stock),
        sku: formData.sku,
        images: formData.images,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        isActive: formData.isActive,
        prescriptionRequired: formData.prescriptionRequired,
      }

      const url = isEdit ? `/api/products/${product._id}` : "/api/products"
      const method = isEdit ? "put" : "post"

      const response = await axiosInstance[method](url, submitData)

      if (response.data.success) {
        toast.success(
          isEdit
            ? "Product updated successfully"
            : "Product created successfully"
        )
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Form submit error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
      {/* Basic Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name..."
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              rows={4}
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g., MED-001"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (Optional)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., pain relief, headache, fever (comma-separated)"
              className="mt-1"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Separate tags with commas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Pricing & Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (SAR) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="compareAtPrice">
                Compare at Price (SAR) - Optional
              </Label>
              <Input
                id="compareAtPrice"
                name="compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.compareAtPrice}
                onChange={handleChange}
                placeholder="0.00"
                className="mt-1"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Original price for showing discounts
              </p>
            </div>

            <div>
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                required
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Product Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Preview Grid */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImages}
            >
              {uploadingImages ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </>
              )}
            </Button>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              JPEG, PNG, GIF, or WebP (max 5MB per image)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Product will be visible in the shop
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="prescriptionRequired">Prescription Required</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customer must upload prescription to purchase
              </p>
            </div>
            <Switch
              id="prescriptionRequired"
              checked={formData.prescriptionRequired}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, prescriptionRequired: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
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
            "Update Product"
          ) : (
            "Create Product"
          )}
        </Button>
      </div>
    </form>
  )
}
