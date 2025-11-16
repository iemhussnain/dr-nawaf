"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  User,
  Eye,
  Clock,
  ArrowLeft,
  Loader2,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [params.slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/api/blog/${params.slug}`)

      if (response.data.success) {
        const postData = response.data.data
        setPost(postData)

        // Fetch related posts in the same category
        if (postData.category) {
          fetchRelatedPosts(postData.category, postData._id)
        }
      } else {
        router.push("/blog")
      }
    } catch (error) {
      console.error("Fetch post error:", error)
      router.push("/blog")
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedPosts = async (category, excludeId) => {
    try {
      const response = await axiosInstance.get(
        `/api/blog?category=${category}&status=published&limit=3`
      )

      if (response.data.success) {
        const related = response.data.data.posts.filter(
          (p) => p._id !== excludeId
        )
        setRelatedPosts(related)
      }
    } catch (error) {
      console.error("Fetch related posts error:", error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getReadingTime = (content) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const title = post?.title || ""

    let shareUrl = ""
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
        return
    }

    window.open(shareUrl, "_blank", "width=600,height=400")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Article not found</p>
          <Button onClick={() => router.push("/blog")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/blog")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              {/* Header */}
              <div className="mb-8">
                <Badge className="mb-4">{post.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  {post.title}
                </h1>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>
                        Dr. {post.author.firstName} {post.author.lastName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{getReadingTime(post.content)} min read</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{post.views} views</span>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="mb-8 rounded-lg overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded">
                  <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* Content */}
              <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-8">
                  <div
                    className="prose dark:prose-invert max-w-none
                      prose-headings:text-gray-900 dark:prose-headings:text-white
                      prose-p:text-gray-600 dark:prose-p:text-gray-400
                      prose-a:text-blue-600 dark:prose-a:text-blue-400
                      prose-strong:text-gray-900 dark:prose-strong:text-white
                      prose-code:text-gray-900 dark:prose-code:text-white
                      prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
                      prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-400
                      prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                      prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Link key={index} href={`/blog?tag=${tag}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          #{tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Info */}
              {post.author && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      About the Author
                    </h3>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Dr. {post.author.firstName} {post.author.lastName}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {post.author.specialization}
                        </p>
                        {post.author.bio && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {post.author.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sticky top-4">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Article
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Share on Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Share on Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleShare("linkedin")}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    Share on LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleShare("copy")}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost._id}
                        href={`/blog/${relatedPost.slug}`}
                        className="block group"
                      >
                        <div className="space-y-1">
                          {relatedPost.featuredImage && (
                            <div className="relative h-24 rounded overflow-hidden">
                              <img
                                src={relatedPost.featuredImage}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
