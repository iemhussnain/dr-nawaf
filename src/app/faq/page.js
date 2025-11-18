"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState(null)

  const faqs = [
    {
      id: 1,
      category: "Appointments",
      question: "How do I book an appointment?",
      answer: "You can book an appointment by visiting our Doctors page, selecting your preferred doctor, and choosing an available time slot. Alternatively, you can call our front desk."
    },
    {
      id: 2,
      category: "Appointments",
      question: "How can I cancel or reschedule my appointment?",
      answer: "You can cancel or reschedule your appointment through your patient portal or by calling our office at least 24 hours in advance."
    },
    {
      id: 3,
      category: "General",
      question: "What are your working hours?",
      answer: "We are open Sunday to Thursday from 9:00 AM to 9:00 PM, and Friday to Saturday from 2:00 PM to 9:00 PM."
    },
    {
      id: 4,
      category: "General",
      question: "Where is Dr. Nawaf Medical Center located?",
      answer: "We are located in Riyadh, Saudi Arabia. Please visit our Contact page for detailed address and directions."
    },
    {
      id: 5,
      category: "Billing",
      question: "Do you accept insurance?",
      answer: "Yes, we accept most major insurance providers. Please contact us to verify if your insurance is accepted."
    },
    {
      id: 6,
      category: "Billing",
      question: "What payment methods do you accept?",
      answer: "We accept cash, credit/debit cards, and insurance coverage. Online payments can be made through our patient portal."
    },
    {
      id: 7,
      category: "Services",
      question: "What medical services do you provide?",
      answer: "We provide comprehensive medical services including general consultations, specialist care, diagnostic services, and pharmacy services. Visit our Services page for a complete list."
    },
    {
      id: 8,
      category: "Services",
      question: "Do you offer home visits?",
      answer: "Yes, we offer home visit services for patients who cannot visit the clinic. Please contact us to schedule a home visit."
    },
  ]

  const categories = [...new Set(faqs.map(faq => faq.category))]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const groupedFaqs = categories.reduce((acc, category) => {
    acc[category] = filteredFaqs.filter(faq => faq.category === category)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find answers to common questions about our services
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-lg"
          />
        </div>

        {/* FAQs by Category */}
        <div className="space-y-8">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            categoryFaqs.length > 0 && (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {category}
                </h2>
                <div className="space-y-3">
                  {categoryFaqs.map((faq) => (
                    <Card key={faq.id}>
                      <CardHeader
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                            {faq.question}
                          </CardTitle>
                          {expandedId === faq.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </CardHeader>
                      {expandedId === faq.id && (
                        <CardContent>
                          <p className="text-gray-600 dark:text-gray-400">
                            {faq.answer}
                          </p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Contact Section */}
        <Card className="mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Still have questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Can't find the answer you're looking for? Please contact our support team.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
