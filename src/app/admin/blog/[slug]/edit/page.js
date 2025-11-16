"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { BlogForm } from "@/components/forms/BlogForm"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

export default function EditBlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [params.slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/api/blog/${params.slug}`)

      if (response.data.success) {
        setPost(response.data.data)
      } else {
        toast.error(response.data.error || "Failed to fetch post")
        router.push("/admin/blog")
      }
    } catch (error) {
      console.error("Fetch post error:", error)
      router.push("/admin/blog")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Post not found</p>
        <Button
          onClick={() => router.push("/admin/blog")}
          className="mt-4"
        >
          Back to Blog
        </Button>
      </div>
    )
  }

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
          Edit Blog Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update blog post information
        </p>
      </div>

      {/* Form */}
      <BlogForm post={post} isEdit={true} />
    </div>
  )
}
