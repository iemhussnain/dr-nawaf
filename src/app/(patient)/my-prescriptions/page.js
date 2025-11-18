"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Pill,
  Clock,
} from "lucide-react"

export default function MyPrescriptionsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - replace with API call
  const prescriptions = [
    {
      id: 1,
      prescriptionNumber: "RX-2024-001",
      doctor: {
        name: "Dr. Ahmed Hassan",
        specialization: "Cardiologist",
      },
      date: new Date(Date.now() - 86400000).toISOString(),
      medications: [
        {
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "3 times daily",
          duration: "7 days",
        },
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "As needed for pain",
          duration: "5 days",
        },
      ],
      diagnosis: "Upper Respiratory Infection",
      notes: "Take medication with food. Drink plenty of water.",
      status: "active",
    },
    {
      id: 2,
      prescriptionNumber: "RX-2024-002",
      doctor: {
        name: "Dr. Sarah Ahmed",
        specialization: "General Practitioner",
      },
      date: new Date(Date.now() - 604800000).toISOString(),
      medications: [
        {
          name: "Vitamin D",
          dosage: "1000 IU",
          frequency: "Once daily",
          duration: "30 days",
        },
      ],
      diagnosis: "Vitamin D Deficiency",
      notes: "Take in the morning with breakfast.",
      status: "active",
    },
    {
      id: 3,
      prescriptionNumber: "RX-2024-003",
      doctor: {
        name: "Dr. Mohammed Ali",
        specialization: "Dermatologist",
      },
      date: new Date(Date.now() - 1209600000).toISOString(),
      medications: [
        {
          name: "Hydrocortisone Cream",
          dosage: "1%",
          frequency: "Apply twice daily",
          duration: "14 days",
        },
      ],
      diagnosis: "Eczema",
      notes: "Apply to affected areas only. Avoid contact with eyes.",
      status: "completed",
    },
  ]

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medications.some((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  )

  const activePrescriptions = filteredPrescriptions.filter((p) => p.status === "active")
  const completedPrescriptions = filteredPrescriptions.filter((p) => p.status === "completed")

  const PrescriptionCard = ({ prescription }) => (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-gray-900 dark:text-white text-lg">
              {prescription.prescriptionNumber}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {prescription.diagnosis}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              prescription.status === "active"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400"
            }`}
          >
            {prescription.status === "active" ? "Active" : "Completed"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Doctor and Date */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <User className="h-4 w-4" />
            <span>{prescription.doctor.name}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>{new Date(prescription.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Medications */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Medications
          </h4>
          <div className="space-y-2">
            {prescription.medications.map((medication, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {medication.name}
                  </p>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {medication.dosage}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {medication.frequency} • {medication.duration}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {prescription.notes && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> {prescription.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Prescriptions</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage your medical prescriptions
        </p>
      </div>

      {/* Search */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by prescription number, doctor, diagnosis, or medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {prescriptions.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {activePrescriptions.length}
                </p>
              </div>
              <Pill className="h-8 w-8 text-green-400 dark:text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                  {completedPrescriptions.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-gray-400 dark:text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Prescriptions */}
      {activePrescriptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Active Prescriptions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePrescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Prescriptions */}
      {completedPrescriptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Prescription History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedPrescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPrescriptions.length === 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">No prescriptions found</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                {searchTerm
                  ? "Try adjusting your search"
                  : "Your prescriptions will appear here after doctor consultations"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
