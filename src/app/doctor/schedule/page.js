"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Clock, Loader2, Calendar, Save } from "lucide-react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { toast } from "sonner"

const DAYS_OF_WEEK = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
  "20:00", "20:30", "21:00", "21:30", "22:00",
]

export default function DoctorSchedulePage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [availability, setAvailability] = useState({
    monday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    tuesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    wednesday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    thursday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    friday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    saturday: { enabled: false, startTime: "09:00", endTime: "17:00" },
    sunday: { enabled: false, startTime: "09:00", endTime: "17:00" },
  })

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
      loadSchedule()
    }
  }, [status, session])

  const loadSchedule = async () => {
    try {
      setLoading(true)
      // Placeholder for loading existing schedule
      // In a real implementation, fetch from API
      setTimeout(() => {
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Load schedule error:", error)
      setLoading(false)
    }
  }

  const handleDayToggle = (day) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        enabled: !availability[day].enabled,
      },
    })
  }

  const handleTimeChange = (day, type, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [type]: value,
      },
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Placeholder for saving schedule
      // In a real implementation, send to API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Schedule updated successfully")
    } catch (error) {
      toast.error("Failed to update schedule")
    } finally {
      setSaving(false)
    }
  }

  const handleQuickSetup = (preset) => {
    const presets = {
      "weekdays-morning": {
        monday: { enabled: true, startTime: "08:00", endTime: "12:00" },
        tuesday: { enabled: true, startTime: "08:00", endTime: "12:00" },
        wednesday: { enabled: true, startTime: "08:00", endTime: "12:00" },
        thursday: { enabled: true, startTime: "08:00", endTime: "12:00" },
        friday: { enabled: true, startTime: "08:00", endTime: "12:00" },
        saturday: { enabled: false, startTime: "09:00", endTime: "17:00" },
        sunday: { enabled: false, startTime: "09:00", endTime: "17:00" },
      },
      "weekdays-full": {
        monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        saturday: { enabled: false, startTime: "09:00", endTime: "17:00" },
        sunday: { enabled: false, startTime: "09:00", endTime: "17:00" },
      },
      "everyday": {
        monday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        tuesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        wednesday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        thursday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        friday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        saturday: { enabled: true, startTime: "09:00", endTime: "17:00" },
        sunday: { enabled: true, startTime: "09:00", endTime: "17:00" },
      },
    }

    setAvailability(presets[preset])
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
          Manage Schedule
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Set your availability for patient appointments
        </p>
      </div>

      {/* Quick Setup */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Quick Setup</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Choose a preset schedule to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => handleQuickSetup("weekdays-morning")}
            >
              Weekdays (Mornings)
            </Button>
            <Button
              variant="outline"
              onClick={() => handleQuickSetup("weekdays-full")}
            >
              Weekdays (9AM - 5PM)
            </Button>
            <Button variant="outline" onClick={() => handleQuickSetup("everyday")}>
              Every Day (9AM - 5PM)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">
            Weekly Schedule
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Configure your working hours for each day of the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                {/* Day Checkbox */}
                <div className="flex items-center space-x-2 min-w-[140px]">
                  <Checkbox
                    id={day.id}
                    checked={availability[day.id].enabled}
                    onCheckedChange={() => handleDayToggle(day.id)}
                  />
                  <Label
                    htmlFor={day.id}
                    className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                  >
                    {day.label}
                  </Label>
                </div>

                {/* Time Selectors */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <select
                      value={availability[day.id].startTime}
                      onChange={(e) =>
                        handleTimeChange(day.id, "startTime", e.target.value)
                      }
                      disabled={!availability[day.id].enabled}
                      className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50"
                    >
                      {TIME_SLOTS.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">to</span>
                  <select
                    value={availability[day.id].endTime}
                    onChange={(e) =>
                      handleTimeChange(day.id, "endTime", e.target.value)
                    }
                    disabled={!availability[day.id].enabled}
                    className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    {TIME_SLOTS.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Badge */}
                <div className="min-w-[100px] text-right">
                  {availability[day.id].enabled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400">
                      Unavailable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Schedule
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                About Your Schedule
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>• Patients can only book appointments during your available hours</li>
                <li>• You can modify your schedule at any time</li>
                <li>• Time slots are automatically generated based on your availability</li>
                <li>• Existing appointments won't be affected by schedule changes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
