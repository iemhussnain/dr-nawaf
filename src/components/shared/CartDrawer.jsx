"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Package,
  ArrowRight,
} from "lucide-react"
import useCartStore from "@/store/cart-store"
import { toast } from "sonner"

export function CartDrawer() {
  const router = useRouter()
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getItemCount,
    getSubtotal,
    getTax,
    getShippingFee,
    getTotal,
  } = useCartStore()

  const handleQuantityChange = (productId, newQuantity, stock) => {
    if (newQuantity <= 0) {
      removeItem(productId)
      return
    }

    if (newQuantity > stock) {
      toast.error("Quantity exceeds available stock")
      return
    }

    updateQuantity(productId, newQuantity)
  }

  const handleCheckout = () => {
    closeCart()
    router.push("/checkout")
  }

  const subtotal = getSubtotal()
  const tax = getTax()
  const shippingFee = getShippingFee()
  const total = getTotal()

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col bg-white dark:bg-gray-800">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({getItemCount()})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add some products to get started!
            </p>
            <SheetClose asChild>
              <Button onClick={() => router.push("/shop")}>
                Continue Shopping
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">
                        SAR {item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1, item.stock)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1, item.stock)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
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
                      <p className="font-semibold text-gray-900 dark:text-white">
                        SAR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Totals */}
            <SheetFooter className="flex-col gap-4 -mx-6 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    SAR {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (VAT 15%)</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    SAR {tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {shippingFee === 0 ? (
                      <span className="text-green-600 dark:text-green-400">FREE</span>
                    ) : (
                      `SAR ${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {subtotal < 500 && subtotal > 0 && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Add SAR {(500 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}

                <Separator className="my-2" />

                <div className="flex justify-between text-base font-semibold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    SAR {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/shop")}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
