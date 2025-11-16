"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Package,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import useCartStore from "@/store/cart-store"
import { toast } from "sonner"

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getTax,
    getShippingFee,
    getTotal,
  } = useCartStore()

  const handleQuantityChange = (productId, newQuantity, stock) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      toast.success("Item removed from cart")
      return
    }

    if (newQuantity > stock) {
      toast.error("Quantity exceeds available stock")
      return
    }

    updateQuantity(productId, newQuantity)
  }

  const subtotal = getSubtotal()
  const tax = getTax()
  const shippingFee = getShippingFee()
  const total = getTotal()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review your items and proceed to checkout
          </p>
        </div>

        {items.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start shopping to add items to your cart
              </p>
              <Link href="/shop">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Cart Items ({items.length})
                  </h2>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        {/* Product Image */}
                        <Link
                          href={`/shop/${item.slug}`}
                          className="relative w-24 h-24 rounded overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0"
                        >
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                            </div>
                          )}
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/shop/${item.slug}`}>
                            <h4 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2">
                              {item.name}
                            </h4>
                          </Link>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.category}
                          </p>
                          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mt-2">
                            SAR {item.price.toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(item._id, item.quantity - 1, item.stock)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                handleQuantityChange(item._id, item.quantity + 1, item.stock)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => {
                                removeItem(item._id)
                                toast.success("Item removed from cart")
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="font-bold text-xl text-gray-900 dark:text-white">
                            SAR {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Link href="/shop">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        SAR {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tax (VAT 15%)</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        SAR {tax.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {shippingFee === 0 ? (
                          <span className="text-green-600 dark:text-green-400">FREE</span>
                        ) : (
                          `SAR ${shippingFee.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    {subtotal < 500 && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                        Add SAR {(500 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    )}

                    <Separator className="my-4" />

                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">Total</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        SAR {total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
                    size="lg"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>

                  <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Free returns within 30 days
                    </p>
                    <p className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      100% Authentic products
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
