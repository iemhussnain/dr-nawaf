"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Mock data
  const faqs = [
    {
      id: 1,
      question: "How do I book an appointment?",
      answer: "You can book an appointment by visiting our Doctors page, selecting your preferred doctor, and choosing an available time slot.",
      category: "Appointments",
      order: 1,
      isPublished: true
    },
    {
      id: 2,
      question: "What are your working hours?",
      answer: "We are open Sunday to Thursday from 9:00 AM to 9:00 PM, and Friday to Saturday from 2:00 PM to 9:00 PM.",
      category: "General",
      order: 2,
      isPublished: true
    },
    {
      id: 3,
      question: "Do you accept insurance?",
      answer: "Yes, we accept most major insurance providers. Please contact us to verify if your insurance is accepted.",
      category: "Billing",
      order: 3,
      isPublished: true
    },
    {
      id: 4,
      question: "How can I cancel or reschedule my appointment?",
      answer: "You can cancel or reschedule your appointment through your patient portal or by calling our office at least 24 hours in advance.",
      category: "Appointments",
      order: 4,
      isPublished: false
    },
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            FAQ Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage frequently asked questions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
              <DialogDescription>
                Create a new frequently asked question
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue="general">
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="appointments">Appointments</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="Enter the question..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  rows={6}
                  placeholder="Enter the answer..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  placeholder="1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Save FAQ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total FAQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {faqs.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Published
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {faqs.filter(f => f.isPublished).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Draft
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {faqs.filter(f => !f.isPublished).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              4
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ List */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ List</CardTitle>
          <CardDescription>View and manage all frequently asked questions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No FAQs found
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {faq.category}
                        </span>
                        {faq.isPublished ? (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Published
                          </span>
                        ) : (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                            Draft
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        className="flex items-start gap-2 text-left w-full group"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {faq.question}
                          </h3>
                          {expandedId === faq.id && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                        {expandedId === faq.id ? (
                          <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
