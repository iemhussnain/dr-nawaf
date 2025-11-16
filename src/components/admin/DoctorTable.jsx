"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export function DoctorTable({ doctors, loading, onDelete, pagination, onPageChange }) {
  if (loading) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (doctors.length === 0) {
    return (
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-12">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No doctors found
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
              Get started by adding your first doctor
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
      inactive: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
      "on-leave": "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
      >
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Doctor
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Specialization
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Contact
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Experience
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Fee
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Rating
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor) => (
                  <TableRow
                    key={doctor._id}
                    className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {/* Doctor Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center overflow-hidden">
                          {doctor.photo && doctor.photo !== '/images/default-doctor.png' ? (
                            <img
                              src={doctor.photo}
                              alt={doctor.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                              {doctor.firstName[0]}
                              {doctor.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            Dr. {doctor.fullName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {doctor.licenseNumber || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Specialization */}
                    <TableCell>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {doctor.specialization || doctor.specialty}
                      </p>
                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">{doctor.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <Phone className="h-3 w-3" />
                          <span>{doctor.phone}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Experience */}
                    <TableCell>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {doctor.experience} years
                      </span>
                    </TableCell>

                    {/* Fee */}
                    <TableCell>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${doctor.consultationFee}
                      </span>
                    </TableCell>

                    {/* Rating */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {doctor.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({doctor.reviewCount})
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>{getStatusBadge(doctor.status)}</TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-600 dark:text-gray-400"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/doctors/${doctor._id}`}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View Details</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/doctors/${doctor._id}/edit`}
                              className="cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/doctors/${doctor._id}/availability`}
                              className="cursor-pointer"
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>Manage Availability</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(doctor._id)}
                            className="text-red-600 dark:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} doctors
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="border-gray-300 dark:border-gray-600"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="border-gray-300 dark:border-gray-600"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
