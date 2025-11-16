"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AppointmentCard } from "@/components/patient/AppointmentCard"
import {
  Calendar,
  FileText,
  User,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react"
import { toast } from "sonner"

export default function PatientDashboardPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    upcomingAppointments: [],
    recentPrescriptions: [],
    medicalHistory: [],
    orders: [],
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      // TODO: Fetch actual data from APIs
      // For now, using mock data
      setDashboardData({
        upcomingAppointments: [
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
        ],
        recentPrescriptions: [
          {
            id: 1,
            medicationName: "Amoxicillin 500mg",
            doctor: "Dr. Ahmed Hassan",
            date: new Date(Date.now() - 86400000).toISOString(),
            duration: "7 days",
          },
          {
            id: 2,
            medicationName: "Paracetamol 500mg",
            doctor: "Dr. Sarah Ahmed",
            date: new Date(Date.now() - 259200000).toISOString(),
            duration: "5 days",
          },
        ],
        medicalHistory: [],
        orders: [],
      })
    } catch (error) {
      console.error("Fetch dashboard error:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Upcoming Appointments",
      value: dashboardData.upcomingAppointments.length,
      icon: Calendar,
      color: "bg-blue-500",
      link: "/my-appointments",
    },
    {
      title: "Active Prescriptions",
      value: dashboardData.recentPrescriptions.length,
      icon: FileText,
      color: "bg-green-500",
      link: "/my-prescriptions",
    },
    {
      title: "Medical Records",
      value: dashboardData.medicalHistory.length,
      icon: Activity,
      color: "bg-purple-500",
      link: "/profile",
    },
    {
      title: "Recent Orders",
      value: dashboardData.orders.length,
      icon: ShoppingBag,
      color: "bg-orange-500",
      link: "/shop",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 rounded-lg p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold">
          Welcome back, {session?.user?.name || "Patient"}!
        </h1>
        <p className="mt-2 text-blue-100">
          Here's an overview of your health dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.link}>
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Upcoming Appointments
            </CardTitle>
            <Link href="/my-appointments">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.upcomingAppointments.length > 0 ? (
              dashboardData.upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No upcoming appointments</p>
                <Link href="/doctors">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-900 dark:text-white">
              Recent Prescriptions
            </CardTitle>
            <Link href="/my-prescriptions">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentPrescriptions.length > 0 ? (
              dashboardData.recentPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {prescription.medicationName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Prescribed by {prescription.doctor}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(prescription.date).toLocaleDateString()} • Duration:{" "}
                        {prescription.duration}
                      </p>
                    </div>
                    <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No prescriptions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/doctors">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Shop Products
              </Button>
            </Link>
            <Link href="/my-prescriptions">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Prescriptions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
