"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProductForm } from "@/components/forms/ProductForm"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/api/products/${params.id}`)

      if (response.data.success) {
        setProduct(response.data.data)
      } else {
        toast.error(response.data.error || "Failed to fetch product")
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Fetch product error:", error)
      router.push("/admin/products")
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

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Product not found</p>
        <Button
          onClick={() => router.push("/admin/products")}
          className="mt-4"
        >
          Back to Products
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
          onClick={() => router.push("/admin/products")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Product
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update product information
        </p>
      </div>

      {/* Form */}
      <ProductForm product={product} isEdit={true} />
    </div>
  )
}
