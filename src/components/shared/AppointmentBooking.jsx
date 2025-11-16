"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/shared/Calendar"
import { toast } from "sonner"
import {
  Clock,
  Calendar as CalendarIcon,
  User,
  FileText,
  CreditCard,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react"

const STEPS = {
  SELECT_DATE: 1,
  SELECT_TIME: 2,
  PATIENT_INFO: 3,
  REVIEW: 4,
  PAYMENT: 5,
}

export function AppointmentBooking({ doctor }) {
  const { data: session } = useSession()
  const router = useRouter()

  const [currentStep, setCurrentStep] = useState(STEPS.SELECT_DATE)
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [formData, setFormData] = useState({
    reason: "",
    notes: "",
    // Guest booking fields
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedDate])

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true)
    try {
      const dateStr = selectedDate.toISOString().split("T")[0]
      const response = await fetch(
        `/api/appointments/slots?doctorId=${doctor._id}&date=${dateStr}`
      )
      const data = await response.json()

      if (data.success) {
        setAvailableSlots(data.data.slots || [])
      } else {
        toast.error(data.error || "Failed to fetch available slots")
        setAvailableSlots([])
      }
    } catch (error) {
      toast.error("Failed to fetch available slots")
      setAvailableSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
    setCurrentStep(STEPS.SELECT_TIME)
  }

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleNext = () => {
    if (currentStep === STEPS.SELECT_TIME && !selectedSlot) {
      toast.error("Please select a time slot")
      return
    }

    if (currentStep === STEPS.PATIENT_INFO) {
      // Validate patient info
      if (!formData.reason.trim()) {
        toast.error("Please provide a reason for visit")
        return
      }

      // If not logged in, require guest info
      if (!session) {
        if (
          !formData.firstName.trim() ||
          !formData.lastName.trim() ||
          !formData.email.trim() ||
          !formData.phone.trim()
        ) {
          toast.error("Please fill in all required fields")
          return
        }
      }
    }

    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleBooking = async () => {
    setLoading(true)
    try {
      const bookingData = {
        doctorId: doctor._id,
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedSlot.startTime,
        duration: doctor.consultationDuration || 30,
        reason: formData.reason,
        notes: formData.notes,
        amount: doctor.consultationFee,
      }

      // Add guest info if not logged in
      if (!session) {
        bookingData.guestInfo = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }
      }

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Appointment booked successfully!")
        setCurrentStep(STEPS.PAYMENT)

        // Redirect to payment or confirmation page
        setTimeout(() => {
          if (session) {
            router.push("/my-appointments")
          } else {
            router.push("/")
          }
        }, 2000)
      } else {
        toast.error(data.error || "Failed to book appointment")
      }
    } catch (error) {
      toast.error("An error occurred while booking")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const progressPercentage = (currentStep / Object.keys(STEPS).length) * 100

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {currentStep} of {Object.keys(STEPS).length}
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Doctor Info Card */}
      <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {doctor.specialization}
              </p>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">
                SAR {doctor.consultationFee}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === STEPS.SELECT_DATE && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <CalendarIcon className="h-5 w-5" />
              Select Appointment Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          </CardContent>
        </Card>
      )}

      {currentStep === STEPS.SELECT_TIME && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock className="h-5 w-5" />
              Select Time Slot
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {selectedDate && formatDate(selectedDate)}
            </p>
          </CardHeader>
          <CardContent>
            {loadingSlots ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No available slots for this date
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(STEPS.SELECT_DATE)}
                  className="mt-4"
                >
                  Choose Different Date
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => slot.isAvailable && handleSlotSelect(slot)}
                    disabled={!slot.isAvailable}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium transition-colors
                      ${
                        selectedSlot?.startTime === slot.startTime
                          ? "bg-blue-600 text-white"
                          : slot.isAvailable
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30"
                          : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                      }
                    `}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === STEPS.PATIENT_INFO && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <FileText className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!session && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="reason">Reason for Visit *</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Please describe your symptoms or reason for consultation..."
                rows={4}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional information you'd like the doctor to know..."
                rows={3}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === STEPS.REVIEW && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <CheckCircle className="h-5 w-5" />
              Review Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedDate && formatDate(selectedDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedSlot?.startTime} - {selectedSlot?.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Doctor</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  Dr. {doctor.firstName} {doctor.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Consultation Fee
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  SAR {doctor.consultationFee}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Reason for Visit
              </p>
              <p className="text-gray-900 dark:text-white">{formData.reason}</p>
            </div>
            {formData.notes && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Additional Notes
                </p>
                <p className="text-gray-900 dark:text-white">{formData.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {currentStep === STEPS.PAYMENT && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Appointment Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your appointment has been booked
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              A confirmation has been sent to your email
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> Please complete the payment to confirm your
                appointment
              </p>
            </div>
            <Button
              onClick={() => router.push(session ? "/my-appointments" : "/")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {session ? "View My Appointments" : "Back to Home"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      {currentStep !== STEPS.PAYMENT && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === STEPS.SELECT_DATE}
            className="border-gray-300 dark:border-gray-600"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          {currentStep === STEPS.REVIEW ? (
            <Button
              onClick={handleBooking}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  Confirm Booking
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === STEPS.SELECT_DATE && !selectedDate) ||
                (currentStep === STEPS.SELECT_TIME && !selectedSlot)
              }
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
