"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ServiceForm } from "@/components/forms/ServiceForm"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

export default function EditServicePage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchService()
  }, [params.id])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/api/services/${params.id}`)

      if (response.data.success) {
        setService(response.data.data)
      } else {
        toast.error(response.data.error || "Failed to fetch service")
        router.push("/admin/services")
      }
    } catch (error) {
      console.error("Fetch service error:", error)
      router.push("/admin/services")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Service not found</p>
        <Button
          onClick={() => router.push("/admin/services")}
          className="mt-4"
        >
          Back to Services
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/services")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update service information
        </p>
      </div>

      {/* Form */}
      <ServiceForm service={service} isEdit={true} />
    </div>
  )
}
