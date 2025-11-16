"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[200px] md:text-[250px] font-bold text-gray-200 dark:text-gray-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 px-8 py-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Page Not Found
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400">
            It might have been moved or deleted, or you may have typed the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <Home className="mr-2 h-5 w-5" />
              Go to Homepage
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto border-gray-300 dark:border-gray-600"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            You might be interested in:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/services">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
                Services
              </Button>
            </Link>
            <Link href="/doctors">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
                Our Doctors
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
                Health Blog
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
