"use client"

import { StatsCard } from "@/components/admin/StatsCard"
import { AppointmentsChart } from "@/components/charts/AppointmentsChart"
import { RevenueChart } from "@/components/charts/RevenueChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical
} from "lucide-react"

export default function DashboardPage() {
  const recentActivities = [
    {
      id: 1,
      type: "appointment",
      message: "New appointment booked by John Doe",
      time: "2 hours ago",
      icon: Calendar,
      iconColor: "bg-blue-500"
    },
    {
      id: 2,
      type: "patient",
      message: "New patient registered: Jane Smith",
      time: "5 hours ago",
      icon: Users,
      iconColor: "bg-green-500"
    },
    {
      id: 3,
      type: "payment",
      message: "Payment received: $150 from Mike Johnson",
      time: "1 day ago",
      icon: DollarSign,
      iconColor: "bg-purple-500"
    },
    {
      id: 4,
      type: "appointment",
      message: "Appointment completed with Sarah Wilson",
      time: "1 day ago",
      icon: CheckCircle,
      iconColor: "bg-green-500"
    },
    {
      id: 5,
      type: "appointment",
      message: "Appointment cancelled by Robert Brown",
      time: "2 days ago",
      icon: XCircle,
      iconColor: "bg-red-500"
    },
  ]

  const upcomingAppointments = [
    {
      id: 1,
      patient: "Alice Cooper",
      doctor: "Dr. Smith",
      time: "10:00 AM",
      date: "Today",
      status: "confirmed"
    },
    {
      id: 2,
      patient: "Bob Martin",
      doctor: "Dr. Johnson",
      time: "2:30 PM",
      date: "Today",
      status: "pending"
    },
    {
      id: 3,
      patient: "Charlie Davis",
      doctor: "Dr. Williams",
      time: "4:00 PM",
      date: "Tomorrow",
      status: "confirmed"
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Patients"
          value="1,234"
          change="+12.5%"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <StatsCard
          title="Appointments"
          value="456"
          change="+8.2%"
          changeType="positive"
          icon={Calendar}
          iconColor="bg-green-500"
        />
        <StatsCard
          title="Revenue"
          value="$78,450"
          change="+15.3%"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-purple-500"
        />
        <StatsCard
          title="Growth"
          value="23.4%"
          change="-2.1%"
          changeType="negative"
          icon={TrendingUp}
          iconColor="bg-orange-500"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsChart />
        <RevenueChart />
      </div>

      {/* Recent Activities & Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${activity.iconColor}`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View all activities
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                        {appointment.patient.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {appointment.patient}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {appointment.doctor} • {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    }`}>
                      {appointment.status}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View all appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
