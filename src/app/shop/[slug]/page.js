"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ShoppingCart,
  Loader2,
  Package,
  Truck,
  Shield,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
} from "lucide-react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import useCartStore from "@/store/cart-store"
import { ProductCard } from "@/components/shared/ProductCard"
import { CartDrawer } from "@/components/shared/CartDrawer"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, openCart } = useCartStore()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      // Find product by slug
      const response = await axiosInstance.get(
        `/api/products?search=${params.slug}`
      )

      if (response.data.success && response.data.data.products.length > 0) {
        const foundProduct = response.data.data.products.find(
          (p) => p.slug === params.slug
        )

        if (foundProduct) {
          setProduct(foundProduct)

          // Fetch related products
          if (foundProduct.category) {
            fetchRelatedProducts(foundProduct.category, foundProduct._id)
          }
        } else {
          router.push("/shop")
        }
      } else {
        router.push("/shop")
      }
    } catch (error) {
      console.error("Fetch product error:", error)
      router.push("/shop")
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category, excludeId) => {
    try {
      const response = await axiosInstance.get(
        `/api/products?category=${category}&isActive=true&limit=4`
      )

      if (response.data.success) {
        const related = response.data.data.products.filter(
          (p) => p._id !== excludeId
        )
        setRelatedProducts(related)
      }
    } catch (error) {
      console.error("Fetch related products error:", error)
    }
  }

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error("Product is out of stock")
      return
    }

    if (quantity > product.stock) {
      toast.error("Quantity exceeds available stock")
      return
    }

    addItem(product, quantity)
    toast.success(`${product.name} added to cart`)
    openCart()
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Product not found
          </p>
          <Button onClick={() => router.push("/shop")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    )
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/shop")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-24 w-24 text-gray-300 dark:text-gray-600" />
                </div>
              )}

              {/* Badges */}
              {hasDiscount && (
                <Badge className="absolute top-4 left-4 bg-red-600 text-white text-lg px-3 py-1">
                  -{discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-blue-600"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SKU: {product.sku}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                SAR {product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                  SAR {product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}

              {product.prescriptionRequired && (
                <div className="mt-2 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Prescription Required</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white w-12 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Truck className="h-5 w-5" />
                <span className="text-sm">Free shipping on orders over SAR 500</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Shield className="h-5 w-5" />
                <span className="text-sm">100% Authentic Products</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Package className="h-5 w-5" />
                <span className="text-sm">Easy Returns & Exchanges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Product Description
            </h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  )
}
