"use client"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

// Common service categories
const SERVICE_CATEGORIES = [
  "General Consultation",
  "Specialist Consultation",
  "Diagnostic Test",
  "Medical Procedure",
  "Vaccination",
  "Health Checkup",
  "Dental Care",
  "Eye Care",
  "Lab Test",
  "Imaging",
  "Therapy",
  "Other",
]

export function ServiceForm({ service = null, isEdit = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: service?.name || "",
    description: service?.description || "",
    category: service?.category || "",
    duration: service?.duration || 30,
    price: service?.price || 0,
    isActive: service?.isActive ?? true,
    icon: service?.icon || "",
  })

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    })
  }

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value })
  }

  const handleActiveChange = (checked) => {
    setFormData({ ...formData, isActive: checked })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Service name is required")
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
      if (formData.duration < 15) {
        toast.error("Duration must be at least 15 minutes")
        return
      }
      if (formData.price < 0) {
        toast.error("Price cannot be negative")
        return
      }

      const url = isEdit ? `/api/services/${service._id}` : "/api/services"
      const method = isEdit ? "put" : "post"

      const response = await axiosInstance[method](url, formData)

      if (response.data.success) {
        toast.success(
          isEdit ? "Service updated successfully" : "Service created successfully"
        )
        router.push("/admin/services")
      }
    } catch (error) {
      // Error already handled by axios interceptor
      console.error("Form submit error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {/* Basic Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., General Consultation"
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
              placeholder="Describe the service in detail..."
              rows={4}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category" className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="icon">Icon (Optional)</Label>
            <Input
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g., stethoscope, heart, pill"
              className="mt-1"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enter an icon name from Lucide Icons
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing and Duration */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Pricing & Duration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (SAR) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="15"
                step="5"
                value={formData.duration}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive" className="text-base">
                Active Status
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Make this service available for booking
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={handleActiveChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/services")}
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
            "Update Service"
          ) : (
            "Create Service"
          )}
        </Button>
      </div>
    </form>
  )
}
