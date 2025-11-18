"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, Loader2, UserX, Calendar, Star } from "lucide-react"
import axiosInstance from "@/lib/axios"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([])
  const [specializations, setSpecializations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [specializationFilter, setSpecializationFilter] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  useEffect(() => {
    fetchDoctors()
  }, [pagination.page, specializationFilter])

  const fetchDoctors = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        isActive: "true", // Only show active doctors
      })

      if (specializationFilter !== "all") {
        params.append("specialization", specializationFilter)
      }

      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const response = await axiosInstance.get(`/api/doctors?${params}`)

      if (response.data.success) {
        setDoctors(response.data.data || [])

        // Extract unique specializations and filter out empty values
        const specs = [...new Set((response.data.data || []).map(d => d.specialization).filter(s => s && s.trim()))]
        setSpecializations(specs)

        setPagination(response.data.pagination || pagination)
      }
    } catch (error) {
      console.error("Fetch doctors error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination({ ...pagination, page: 1 })
    fetchDoctors()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Expert Doctors
            </h1>
            <p className="text-xl text-blue-100 dark:text-blue-200">
              Meet our team of highly qualified medical professionals
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <form onSubmit={handleSearch} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  />
                </div>

                {/* Specialization Filter */}
                <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                  <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {loading ? (
              "Loading doctors..."
            ) : (
              <>
                Showing {doctors.length} of {pagination.total} doctors
                {specializationFilter !== "all" && ` specializing in ${specializationFilter}`}
              </>
            )}
          </p>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : doctors.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-12">
              <div className="text-center">
                <UserX className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No doctors found
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  {searchTerm
                    ? "Try adjusting your search"
                    : specializationFilter !== "all"
                    ? "Try selecting a different specialization"
                    : "Check back later for available doctors"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {doctors.map((doctor) => (
                <Card
                  key={doctor._id}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {/* Doctor Avatar */}
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl text-gray-900 dark:text-white mb-1">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          {doctor.credentials}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Specialization Badge */}
                      <div>
                        <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {doctor.specialization}
                        </Badge>
                      </div>

                      {/* Department */}
                      {doctor.department && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Department:</span> {doctor.department}
                        </p>
                      )}

                      {/* Languages */}
                      {doctor.languages && doctor.languages.length > 0 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Languages:</span> {doctor.languages.join(", ")}
                        </p>
                      )}

                      {/* Experience */}
                      {doctor.experience && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Experience:</span> {doctor.experience} years
                        </p>
                      )}

                      {/* Consultation Fee */}
                      {doctor.consultationFee && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Consultation Fee:</span> SAR {doctor.consultationFee}
                        </p>
                      )}

                      {/* Rating */}
                      {doctor.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {doctor.rating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            ({doctor.reviewCount || 0} reviews)
                          </span>
                        </div>
                      )}

                      {/* Bio Preview */}
                      {doctor.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {doctor.bio}
                        </p>
                      )}

                      {/* Book Appointment Button */}
                      <Link href={`/doctors/${doctor._id}/book`} className="block mt-4">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-400 px-4">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
