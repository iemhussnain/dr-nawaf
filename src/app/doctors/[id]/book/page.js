"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppointmentBooking } from "@/components/shared/AppointmentBooking"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

export default function BookAppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctor()
  }, [params.id])

  const fetchDoctor = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/api/doctors/${params.id}`)

      if (response.data.success) {
        setDoctor(response.data.data)
      } else {
        router.push("/doctors")
      }
    } catch (error) {
      // Error already handled by axios interceptor
      router.push("/doctors")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Doctor not found</p>
          <Button onClick={() => router.push("/doctors")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Doctors
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/doctors")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book Appointment
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Schedule your consultation with Dr. {doctor.firstName} {doctor.lastName}
          </p>
        </div>

        {/* Booking Component */}
        <AppointmentBooking doctor={doctor} />
      </div>
    </div>
  )
}
