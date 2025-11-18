"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import axiosInstance from "@/lib/axios"

export function DoctorForm({ doctor = null, isEdit = false }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: doctor?.firstName || "",
    lastName: doctor?.lastName || "",
    email: doctor?.email || "",
    phone: doctor?.phone || "",
    specialty: doctor?.specialty || "",
    specialization: doctor?.specialization || "General Practitioner",
    experience: doctor?.experience || 0,
    consultationFee: doctor?.consultationFee || 0,
    bio: doctor?.bio || "",
    licenseNumber: doctor?.licenseNumber || "",
    languages: doctor?.languages?.join(", ") || "English",
    qualifications: doctor?.qualifications || [],
    status: doctor?.status || "active",
    password: "",
  })

  const [qualification, setQualification] = useState({
    degree: "",
    institution: "",
    year: new Date().getFullYear(),
  })

  const specializations = [
    "General Practitioner",
    "Cardiologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedic",
    "Neurologist",
    "Psychiatrist",
    "Gynecologist",
    "Ophthalmologist",
    "ENT Specialist",
    "Dentist",
    "Physiotherapist",
    "Radiologist",
    "Surgeon",
    "Other",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddQualification = () => {
    if (qualification.degree && qualification.institution) {
      setFormData((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, qualification],
      }))
      setQualification({
        degree: "",
        institution: "",
        year: new Date().getFullYear(),
      })
    } else {
      toast.error("Please fill in all qualification fields")
    }
  }

  const handleRemoveQualification = (index) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error("Please fill in all required fields")
        setLoading(false)
        return
      }

      // Prepare data
      const submitData = {
        ...formData,
        languages: formData.languages.split(",").map((lang) => lang.trim()),
        experience: parseInt(formData.experience),
        consultationFee: parseFloat(formData.consultationFee),
      }

      // Remove password if editing and not changed
      if (isEdit && !submitData.password) {
        delete submitData.password
      }

      const url = isEdit ? `/api/doctors/${doctor._id}` : "/api/doctors"

      const response = isEdit
        ? await axiosInstance.put(url, submitData)
        : await axiosInstance.post(url, submitData)

      if (response.data.success) {
        toast.success(isEdit ? "Doctor updated successfully" : "Doctor created successfully")
        router.push("/admin/doctors")
        router.refresh()
      }
    } catch (error) {
      // Error already handled by axios interceptor
      console.error("Submit error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/doctors">
          <Button type="button" variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Doctor" : "Add New Doctor"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isEdit ? "Update doctor information" : "Fill in the details to add a new doctor"}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-900 dark:text-white">
                First Name *
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-900 dark:text-white">
                Last Name *
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-white">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isEdit}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 dark:text-white">
                Phone *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-900 dark:text-white">
                  Password {!isEdit && "*"}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEdit}
                  placeholder={isEdit ? "Leave blank to keep current" : ""}
                  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-gray-900 dark:text-white">
                Specialization *
              </Label>
              <Select
                value={formData.specialization}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, specialization: value }))
                }
              >
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-gray-900 dark:text-white">
                Specialty *
              </Label>
              <Input
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                required
                placeholder="e.g., Heart Surgery"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber" className="text-gray-900 dark:text-white">
                License Number
              </Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-900 dark:text-white">
                Experience (years) *
              </Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                required
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultationFee" className="text-gray-900 dark:text-white">
                Consultation Fee ($) *
              </Label>
              <Input
                id="consultationFee"
                name="consultationFee"
                type="number"
                min="0"
                step="0.01"
                value={formData.consultationFee}
                onChange={handleChange}
                required
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages" className="text-gray-900 dark:text-white">
                Languages (comma separated)
              </Label>
              <Input
                id="languages"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
                placeholder="English, Arabic, French"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {isEdit && (
              <div className="space-y-2">
                <Label htmlFor="status" className="text-gray-900 dark:text-white">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-900 dark:text-white">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Brief description about the doctor..."
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Qualifications */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Qualifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.qualifications.length > 0 && (
            <div className="space-y-2">
              {formData.qualifications.map((qual, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{qual.degree}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {qual.institution} • {qual.year}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveQualification(index)}
                    className="text-red-600 dark:text-red-400"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-gray-900 dark:text-white">Degree</Label>
              <Input
                value={qualification.degree}
                onChange={(e) =>
                  setQualification((prev) => ({ ...prev, degree: e.target.value }))
                }
                placeholder="e.g., MBBS"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Institution</Label>
              <Input
                value={qualification.institution}
                onChange={(e) =>
                  setQualification((prev) => ({ ...prev, institution: e.target.value }))
                }
                placeholder="University name"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-900 dark:text-white">Year</Label>
              <Input
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                value={qualification.year}
                onChange={(e) =>
                  setQualification((prev) => ({ ...prev, year: parseInt(e.target.value) }))
                }
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAddQualification}
            className="w-full md:w-auto"
          >
            Add Qualification
          </Button>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Doctor" : "Create Doctor"}
        </Button>
        <Link href="/admin/doctors">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  )
}
