"use client"

import { Calendar, Clock, User, MapPin, Video, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AppointmentCard({ appointment }) {
  const getStatusInfo = (status) => {
    switch (status) {
      case "confirmed":
        return {
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-100 dark:bg-green-900/30",
          label: "Confirmed",
        }
      case "pending":
        return {
          icon: AlertCircle,
          color: "text-yellow-600 dark:text-yellow-400",
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
          label: "Pending",
        }
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-100 dark:bg-red-900/30",
          label: "Cancelled",
        }
      default:
        return {
          icon: Clock,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-100 dark:bg-gray-900/30",
          label: "Unknown",
        }
    }
  }

  const statusInfo = getStatusInfo(appointment.status)
  const StatusIcon = statusInfo.icon

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Doctor Avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          {appointment.doctor.photo ? (
            <img
              src={appointment.doctor.photo}
              alt={appointment.doctor.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {/* Appointment Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {appointment.doctor.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {appointment.doctor.specialization}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color} flex items-center gap-1`}
            >
              <StatusIcon className="h-3 w-3" />
              {statusInfo.label}
            </span>
          </div>

          {/* Date and Time */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{appointment.time}</span>
            </div>
            {appointment.type && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Video className="h-4 w-4" />
                <span>{appointment.type}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs border-gray-300 dark:border-gray-600"
              asChild
            >
              <Link href={`/my-appointments/${appointment.id}`}>View Details</Link>
            </Button>
            {appointment.status === "confirmed" && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs text-red-600 dark:text-red-400 border-red-300 dark:border-red-700"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
