"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, User, Calendar, Star } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axios"

export default function ServiceBookingPage() {
  const params = useParams()
  const router = useRouter()
  const [service, setService] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServiceAndDoctors()
  }, [params.id])

  const fetchServiceAndDoctors = async () => {
    try {
      setLoading(true)

      // Fetch service details
      const serviceResponse = await axiosInstance.get(`/api/services/${params.id}`)

      if (serviceResponse.data.success) {
        setService(serviceResponse.data.data)
      }

      // Fetch available doctors (active doctors)
      const doctorsResponse = await axiosInstance.get("/api/doctors?status=active&limit=10")

      if (doctorsResponse.data.success) {
        setDoctors(doctorsResponse.data.data || [])
      }
    } catch (error) {
      console.error("Fetch error:", error)
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
          onClick={() => router.push(`/services/${params.id}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Service Details
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Book Appointment for {service.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Select a doctor to book your appointment
          </p>
        </div>

        {/* Service Summary */}
        <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300">Service</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {service.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300">Duration</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {service.duration} minutes
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300">Price</p>
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  SAR {service.price}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Doctors */}
        {doctors.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-12">
              <div className="text-center">
                <User className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No doctors available at the moment
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  Please check back later or contact us for assistance
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Doctor Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Experience</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {doctor.experience} years
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Fee</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        SAR {doctor.consultationFee}
                      </span>
                    </div>
                    {doctor.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {doctor.rating.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({doctor.reviewCount || 0} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link href={`/doctors/${doctor._id}/book`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book with this Doctor
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Need help choosing a doctor?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Our team can help you find the right doctor for your needs
              </p>
              <Link href="/contact">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
