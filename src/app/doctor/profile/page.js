"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, Briefcase, Award, Languages, Save, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { toast } from "sonner"

export default function DoctorProfilePage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    department: "",
    credentials: "",
    bio: "",
    experience: "",
    education: "",
    consultationFee: "",
    languages: [],
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login")
    }
    if (status === "authenticated" && session?.user?.role !== "doctor") {
      redirect("/")
    }
  }, [status, session])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "doctor") {
      loadProfile()
    }
  }, [status, session])

  const loadProfile = async () => {
    try {
      setLoading(true)
      // Placeholder for loading profile
      // In a real implementation, fetch from API
      setProfile({
        firstName: session?.user?.name?.split(" ")[0] || "",
        lastName: session?.user?.name?.split(" ")[1] || "",
        email: session?.user?.email || "",
        phone: "",
        specialization: "",
        department: "",
        credentials: "MBBS, MD",
        bio: "",
        experience: "",
        education: "",
        consultationFee: "",
        languages: ["English", "Arabic"],
      })
    } catch (error) {
      console.error("Load profile error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleLanguageChange = (e) => {
    const languages = e.target.value.split(",").map((lang) => lang.trim())
    setProfile({
      ...profile,
      languages,
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Placeholder for saving profile
      // In a real implementation, send to API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your profile information and credentials
        </p>
      </div>

      {/* Profile Picture */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Dr. {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {profile.credentials || "Medical Professional"}
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">
                  {session?.user?.role || "Doctor"}
                </Badge>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                  Active
                </Badge>
              </div>
            </div>
            <Button variant="outline">Change Photo</Button>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </div>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-900 dark:text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-900 dark:text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </div>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </div>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+966 50 123 4567"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Professional Information
            </div>
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Manage your professional credentials and specialization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Specialization */}
            <div className="space-y-2">
              <Label htmlFor="specialization" className="text-gray-900 dark:text-white">
                Specialization
              </Label>
              <Input
                id="specialization"
                name="specialization"
                value={profile.specialization}
                onChange={handleChange}
                placeholder="e.g., Cardiology"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-900 dark:text-white">
                Department
              </Label>
              <Input
                id="department"
                name="department"
                value={profile.department}
                onChange={handleChange}
                placeholder="e.g., Internal Medicine"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Credentials */}
            <div className="space-y-2">
              <Label htmlFor="credentials" className="text-gray-900 dark:text-white">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Credentials
                </div>
              </Label>
              <Input
                id="credentials"
                name="credentials"
                value={profile.credentials}
                onChange={handleChange}
                placeholder="e.g., MBBS, MD, FRCP"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-gray-900 dark:text-white">
                Years of Experience
              </Label>
              <Input
                id="experience"
                name="experience"
                type="number"
                value={profile.experience}
                onChange={handleChange}
                placeholder="e.g., 10"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-2">
            <Label htmlFor="languages" className="text-gray-900 dark:text-white">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Languages (comma-separated)
              </div>
            </Label>
            <Input
              id="languages"
              name="languages"
              value={profile.languages.join(", ")}
              onChange={handleLanguageChange}
              placeholder="e.g., English, Arabic, French"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Consultation Fee */}
          <div className="space-y-2">
            <Label htmlFor="consultationFee" className="text-gray-900 dark:text-white">
              Consultation Fee (SAR)
            </Label>
            <Input
              id="consultationFee"
              name="consultationFee"
              type="number"
              value={profile.consultationFee}
              onChange={handleChange}
              placeholder="e.g., 300"
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-gray-900 dark:text-white">
              Professional Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              placeholder="Tell patients about your experience, approach to care, and areas of expertise..."
              rows={4}
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education" className="text-gray-900 dark:text-white">
              Education
            </Label>
            <Textarea
              id="education"
              name="education"
              value={profile.education}
              onChange={handleChange}
              placeholder="List your educational qualifications and certifications..."
              rows={3}
              className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
