"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

export function AppointmentTable({
  appointments,
  loading,
  onUpdate,
  pagination,
  onPageChange,
}) {
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateData, setUpdateData] = useState({
    status: "",
    notes: "",
    prescription: "",
  })

  const handleUpdateClick = (appointment) => {
    setSelectedAppointment(appointment)
    setUpdateData({
      status: appointment.status,
      notes: appointment.notes || "",
      prescription: appointment.prescription || "",
    })
    setShowUpdateDialog(true)
  }

  const handleDetailsClick = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsDialog(true)
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/appointments/${selectedAppointment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Appointment updated successfully")
        setShowUpdateDialog(false)
        onUpdate()
      } else {
        toast.error(data.error || "Failed to update appointment")
      }
    } catch (error) {
      toast.error("An error occurred while updating")
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async (appointment) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return

    try {
      const response = await fetch(`/api/appointments/${appointment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "cancelled",
          cancellationReason: "Cancelled by administrator",
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Appointment cancelled successfully")
        onUpdate()
      } else {
        toast.error(data.error || "Failed to cancel appointment")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
        label: "Pending",
      },
      confirmed: {
        className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        label: "Confirmed",
      },
      completed: {
        className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
        label: "Completed",
      },
      cancelled: {
        className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        label: "Cancelled",
      },
      "no-show": {
        className: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400",
        label: "No Show",
      },
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No appointments found</p>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 dark:border-gray-700">
              <TableHead className="text-gray-900 dark:text-white">Patient</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Doctor</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Date</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Time</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Status</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Amount</TableHead>
              <TableHead className="text-gray-900 dark:text-white">Payment</TableHead>
              <TableHead className="text-gray-900 dark:text-white text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow
                key={appointment._id}
                className="border-gray-200 dark:border-gray-700"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.patientId?.phone}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Dr. {appointment.doctorId?.firstName}{" "}
                      {appointment.doctorId?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {appointment.doctorId?.specialization}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white">
                  {formatDate(appointment.appointmentDate)}
                </TableCell>
                <TableCell className="text-gray-900 dark:text-white">
                  {appointment.timeSlot}
                </TableCell>
                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                <TableCell className="text-gray-900 dark:text-white">
                  SAR {appointment.amount}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appointment.paymentStatus === "paid"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : appointment.paymentStatus === "refunded"
                        ? "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400"
                        : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    }`}
                  >
                    {appointment.paymentStatus}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDetailsClick(appointment)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateClick(appointment)}>
                        <FileText className="h-4 w-4 mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      {appointment.status !== "cancelled" && (
                        <DropdownMenuItem
                          onClick={() => handleCancel(appointment)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Update Appointment
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Update the status and add notes or prescription
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={updateData.status}
                onValueChange={(value) =>
                  setUpdateData({ ...updateData, status: value })
                }
              >
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={updateData.notes}
                onChange={(e) =>
                  setUpdateData({ ...updateData, notes: e.target.value })
                }
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="prescription">Prescription</Label>
              <Textarea
                id="prescription"
                value={updateData.prescription}
                onChange={(e) =>
                  setUpdateData({ ...updateData, prescription: e.target.value })
                }
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUpdateDialog(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="bg-white dark:bg-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              Appointment Details
            </DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Patient</Label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedAppointment.patientId?.firstName}{" "}
                    {selectedAppointment.patientId?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.patientId?.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.patientId?.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Doctor</Label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    Dr. {selectedAppointment.doctorId?.firstName}{" "}
                    {selectedAppointment.doctorId?.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.doctorId?.specialization}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Date & Time</Label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {formatDate(selectedAppointment.appointmentDate)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.timeSlot} ({selectedAppointment.duration} min)
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-gray-600 dark:text-gray-400">
                  Reason for Visit
                </Label>
                <p className="mt-1 text-gray-900 dark:text-white">
                  {selectedAppointment.reason}
                </p>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">Notes</Label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
              {selectedAppointment.prescription && (
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    Prescription
                  </Label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {selectedAppointment.prescription}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    Consultation Fee
                  </Label>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    SAR {selectedAppointment.amount}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    Payment Status
                  </Label>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedAppointment.paymentStatus === "paid"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                      }`}
                    >
                      {selectedAppointment.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
