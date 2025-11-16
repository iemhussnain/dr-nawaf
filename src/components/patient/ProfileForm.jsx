"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
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
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function ProfileForm() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    bloodGroup: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Saudi Arabia",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    allergies: [],
    currentMedications: [],
    medicalHistory: [],
  })

  const [newAllergy, setNewAllergy] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [newCondition, setNewCondition] = useState({
    condition: "",
    diagnosedDate: "",
    notes: "",
  })

  useEffect(() => {
    fetchPatientData()
  }, [])

  const fetchPatientData = async () => {
    try {
      // TODO: Fetch actual patient data from API
      // Mock data for now
      setFormData({
        firstName: session?.user?.name?.split(" ")[0] || "",
        lastName: session?.user?.name?.split(" ")[1] || "",
        dateOfBirth: "1990-01-01",
        gender: "male",
        phone: "+966 50 123 4567",
        bloodGroup: "O+",
        address: {
          street: "123 Main Street",
          city: "Riyadh",
          state: "Riyadh",
          zipCode: "12345",
          country: "Saudi Arabia",
        },
        emergencyContact: {
          name: "John Doe",
          relationship: "Father",
          phone: "+966 50 987 6543",
        },
        allergies: ["Penicillin", "Peanuts"],
        currentMedications: ["Aspirin 81mg", "Vitamin D"],
        medicalHistory: [
          {
            condition: "Hypertension",
            diagnosedDate: "2020-05-15",
            notes: "Controlled with medication",
          },
        ],
      })
    } catch (error) {
      console.error("Fetch patient error:", error)
      toast.error("Failed to load profile data")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setFormData((prev) => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }))
      setNewAllergy("")
    }
  }

  const handleRemoveAllergy = (index) => {
    setFormData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index),
    }))
  }

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setFormData((prev) => ({
        ...prev,
        currentMedications: [...prev.currentMedications, newMedication.trim()],
      }))
      setNewMedication("")
    }
  }

  const handleRemoveMedication = (index) => {
    setFormData((prev) => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((_, i) => i !== index),
    }))
  }

  const handleAddCondition = () => {
    if (newCondition.condition && newCondition.diagnosedDate) {
      setFormData((prev) => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, newCondition],
      }))
      setNewCondition({
        condition: "",
        diagnosedDate: "",
        notes: "",
      })
    } else {
      toast.error("Please fill in condition and diagnosed date")
    }
  }

  const handleRemoveCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: API call to update patient profile
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Update profile error:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-900 dark:text-white">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-900 dark:text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="text-gray-900 dark:text-white">
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-gray-900 dark:text-white">
                Gender
              </Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}>
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 dark:text-white">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="text-gray-900 dark:text-white">
                Blood Group
              </Label>
              <Select value={formData.bloodGroup} onValueChange={(value) => setFormData((prev) => ({ ...prev, bloodGroup: value }))}>
                <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address.street" className="text-gray-900 dark:text-white">
                Street Address
              </Label>
              <Input
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address.city" className="text-gray-900 dark:text-white">
                City
              </Label>
              <Input
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address.state" className="text-gray-900 dark:text-white">
                State/Province
              </Label>
              <Input
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address.zipCode" className="text-gray-900 dark:text-white">
                ZIP Code
              </Label>
              <Input
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address.country" className="text-gray-900 dark:text-white">
                Country
              </Label>
              <Input
                id="address.country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact.name" className="text-gray-900 dark:text-white">
                Contact Name
              </Label>
              <Input
                id="emergencyContact.name"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact.relationship" className="text-gray-900 dark:text-white">
                Relationship
              </Label>
              <Input
                id="emergencyContact.relationship"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
                placeholder="e.g., Father, Mother, Spouse"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact.phone" className="text-gray-900 dark:text-white">
                Phone Number
              </Label>
              <Input
                id="emergencyContact.phone"
                name="emergencyContact.phone"
                type="tel"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Allergies */}
          <div className="space-y-3">
            <Label className="text-gray-900 dark:text-white">Allergies</Label>
            {formData.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm flex items-center gap-2"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(index)}
                      className="hover:text-red-900 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Add allergy"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAllergy())}
              />
              <Button type="button" onClick={handleAddAllergy} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Current Medications */}
          <div className="space-y-3">
            <Label className="text-gray-900 dark:text-white">Current Medications</Label>
            {formData.currentMedications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.currentMedications.map((medication, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm flex items-center gap-2"
                  >
                    {medication}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Add medication"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddMedication())}
              />
              <Button type="button" onClick={handleAddMedication} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-3">
            <Label className="text-gray-900 dark:text-white">Medical History</Label>
            {formData.medicalHistory.length > 0 && (
              <div className="space-y-2">
                {formData.medicalHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.condition}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Diagnosed: {new Date(item.diagnosedDate).toLocaleDateString()}
                      </p>
                      {item.notes && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(index)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Condition */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={newCondition.condition}
                onChange={(e) =>
                  setNewCondition((prev) => ({ ...prev, condition: e.target.value }))
                }
                placeholder="Condition"
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
              <Input
                type="date"
                value={newCondition.diagnosedDate}
                onChange={(e) =>
                  setNewCondition((prev) => ({ ...prev, diagnosedDate: e.target.value }))
                }
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
              <Button type="button" onClick={handleAddCondition} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  )
}
