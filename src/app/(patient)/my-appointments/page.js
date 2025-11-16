"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppointmentCard } from "@/components/patient/AppointmentCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function MyAppointmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  // Mock data - replace with API call
  const appointments = [
    {
      id: 1,
      doctor: {
        name: "Dr. Ahmed Hassan",
        specialization: "Cardiologist",
        photo: null,
      },
      date: new Date(Date.now() + 86400000).toISOString(),
      time: "10:00 AM",
      status: "confirmed",
      type: "Consultation",
    },
    {
      id: 2,
      doctor: {
        name: "Dr. Sarah Ahmed",
        specialization: "General Practitioner",
        photo: null,
      },
      date: new Date(Date.now() + 172800000).toISOString(),
      time: "2:30 PM",
      status: "pending",
      type: "Follow-up",
    },
    {
      id: 3,
      doctor: {
        name: "Dr. Mohammed Ali",
        specialization: "Dermatologist",
        photo: null,
      },
      date: new Date(Date.now() - 86400000).toISOString(),
      time: "11:00 AM",
      status: "completed",
      type: "Consultation",
    },
    {
      id: 4,
      doctor: {
        name: "Dr. Fatima Khan",
        specialization: "Pediatrician",
        photo: null,
      },
      date: new Date(Date.now() - 259200000).toISOString(),
      time: "3:00 PM",
      status: "cancelled",
      type: "Check-up",
    },
  ]

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const upcomingAppointments = filteredAppointments.filter(
    (a) => new Date(a.date) > new Date()
  )
  const pastAppointments = filteredAppointments.filter((a) => new Date(a.date) <= new Date())

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage your appointments
          </p>
        </div>
        <Link href="/doctors">
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            <Calendar className="h-4 w-4 mr-2" />
            Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by doctor or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Appointments</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {appointments.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {upcomingAppointments.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
              {appointments.filter((a) => a.status === "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
              {appointments.filter((a) => a.status === "cancelled").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Past Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No appointments found</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Try adjusting your filters or book a new appointment
              </p>
              <Link href="/doctors">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
