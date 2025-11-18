"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, UserX, Mail, Phone, Calendar } from "lucide-react"
import axiosInstance from "@/lib/axios"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function DoctorPatientsPage() {
  const { data: session, status } = useSession()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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
      fetchPatients()
    }
  }, [status, session])

  const fetchPatients = async () => {
    try {
      setLoading(true)

      // Fetch appointments to get unique patients
      const response = await axiosInstance.get("/api/appointments?limit=1000")

      if (response.data.success) {
        const appointments = response.data.data?.appointments || []

        // Extract unique patients
        const uniquePatients = []
        const seenIds = new Set()

        appointments.forEach((appointment) => {
          const patient = appointment.patientId
          if (patient && !seenIds.has(patient._id)) {
            seenIds.add(patient._id)
            uniquePatients.push({
              ...patient,
              lastVisit: appointment.appointmentDate,
              totalVisits: appointments.filter(
                (a) => a.patientId?._id === patient._id
              ).length,
            })
          }
        })

        setPatients(uniquePatients)
      }
    } catch (error) {
      console.error("Fetch patients error:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter((patient) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      patient.firstName?.toLowerCase().includes(search) ||
      patient.lastName?.toLowerCase().includes(search) ||
      patient.email?.toLowerCase().includes(search)
    )
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A"
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
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
          Patient Records
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View information about your patients
        </p>
      </div>

      {/* Search */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.length === 0 ? (
          <Card className="col-span-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-12">
              <div className="text-center">
                <UserX className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {searchTerm ? "No patients found" : "No patients yet"}
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  {searchTerm
                    ? "Try adjusting your search"
                    : "Patients will appear here after their appointments"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient._id}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  {/* Patient Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {patient.firstName?.[0]}
                    {patient.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {patient.firstName} {patient.lastName}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {patient.gender || "Not specified"}
                      </Badge>
                      {patient.dateOfBirth && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {calculateAge(patient.dateOfBirth)} years
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Contact Information */}
                  {patient.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{patient.phone}</span>
                    </div>
                  )}

                  {/* Visit Information */}
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Visits
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {patient.totalVisits}
                      </span>
                    </div>
                    {patient.lastVisit && (
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          Last Visit
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatDate(patient.lastVisit)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Button variant="outline" className="w-full mt-2">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Total Patients
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                {patients.length}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
