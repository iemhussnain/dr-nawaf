"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Tag, Package } from "lucide-react"
import useCartStore from "@/store/cart-store"
import { toast } from "sonner"

export function ProductCard({ product }) {
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = (e) => {
    e.preventDefault() // Prevent link navigation
    e.stopPropagation()

    if (product.stock <= 0) {
      toast.error("Product is out of stock")
      return
    }

    addItem(product, 1)
    toast.success(`${product.name} added to cart`)
    openCart()
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <Link href={`/shop/${product.slug}`}>
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group h-full overflow-hidden">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {hasDiscount && (
              <Badge className="bg-red-600 text-white">
                -{discountPercentage}%
              </Badge>
            )}
            {product.prescriptionRequired && (
              <Badge variant="outline" className="bg-white/90 dark:bg-gray-800/90">
                Rx Required
              </Badge>
            )}
          </div>

          {/* Stock Badge */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <Badge variant="outline" className="mb-2">
            {product.category}
          </Badge>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              SAR {product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                SAR {product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Info */}
          {product.stock > 0 && product.stock <= 10 && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
              Only {product.stock} left in stock
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
