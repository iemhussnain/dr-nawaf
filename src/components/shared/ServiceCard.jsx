"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Calendar, ArrowRight } from "lucide-react"

export function ServiceCard({ service }) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-gray-900 dark:text-white text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {service.name}
            </CardTitle>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
              {service.category}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {service.description}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {service.duration} min
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                SAR {service.price}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link href={`/services/${service._id}`} className="flex-1">
            <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600">
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href={`/services/${service._id}/book`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
