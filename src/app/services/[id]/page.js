"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock,
  DollarSign,
  Calendar,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axios"

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [relatedServices, setRelatedServices] = useState([])

  useEffect(() => {
    fetchService()
  }, [params.id])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/api/services/${params.id}`)

      if (response.data.success) {
        const serviceData = response.data.data
        setService(serviceData)

        // Fetch related services in the same category
        if (serviceData.category) {
          fetchRelatedServices(serviceData.category, serviceData._id)
        }
      } else {
        router.push("/services")
      }
    } catch (error) {
      console.error("Fetch service error:", error)
      router.push("/services")
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedServices = async (category, excludeId) => {
    try {
      const response = await axiosInstance.get(
        `/api/services?category=${category}&isActive=true&limit=3`
      )

      if (response.data.success) {
        const related = response.data.data.services.filter(
          (s) => s._id !== excludeId
        )
        setRelatedServices(related)
      }
    } catch (error) {
      console.error("Fetch related services error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Service not found</p>
          <Button onClick={() => router.push("/services")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
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
          onClick={() => router.push("/services")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Services
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl text-gray-900 dark:text-white mb-2">
                      {service.name}
                    </CardTitle>
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
                      {service.category}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Service Details */}
                <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Duration
                      </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {service.duration} minutes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        SAR {service.price}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>

                {/* Features/Benefits - Can be customized based on your needs */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Professional medical consultation
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Detailed health assessment
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Personalized treatment plan
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Follow-up recommendations
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-white">
                    Related Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedServices.map((relatedService) => (
                      <Link
                        key={relatedService._id}
                        href={`/services/${relatedService._id}`}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {relatedService.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                          {relatedService.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {relatedService.duration} min
                          </span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            SAR {relatedService.price}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Now Card */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">
                  Ready to book?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    SAR {service.price}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Per session ({service.duration} minutes)
                  </p>
                </div>

                <Link href={`/services/${service._id}/book`} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Appointment
                  </Button>
                </Link>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Need Help?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Contact us for any questions about this service
                  </p>
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
