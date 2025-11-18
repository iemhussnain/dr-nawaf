"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/forms/ProductForm"
import { ArrowLeft } from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()

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
          Add New Product
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create a new product for your shop
        </p>
      </div>

      {/* Form */}
      <ProductForm />
    </div>
  )
}
