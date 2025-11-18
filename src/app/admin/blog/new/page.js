"use client"

import { BlogForm } from "@/components/forms/BlogForm"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NewBlogPostPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/blog")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Blog Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Write and publish a new article
        </p>
      </div>

      {/* Form */}
      <BlogForm />
    </div>
  )
}
