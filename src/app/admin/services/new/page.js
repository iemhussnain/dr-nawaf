"use client"

import { ServiceForm } from "@/components/forms/ServiceForm"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NewServicePage() {
  const router = useRouter()

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
          Create New Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add a new service to your medical practice
        </p>
      </div>

      {/* Form */}
      <ServiceForm />
    </div>
  )
}
