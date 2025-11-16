"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DoctorForm } from "@/components/forms/DoctorForm"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

export default function EditDoctorPage() {
  const params = useParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctor()
  }, [params.id])

  const fetchDoctor = async () => {
    try {
      const response = await axiosInstance.get(`/api/doctors/${params.id}`)

      if (response.data.success) {
        setDoctor(response.data.data)
      } else {
        router.push("/admin/doctors")
      }
    } catch (error) {
      // Error already handled by axios interceptor
      console.error("Fetch doctor error:", error)
      router.push("/admin/doctors")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!doctor) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Doctor not found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <DoctorForm doctor={doctor} isEdit={true} />
    </div>
  )
}
