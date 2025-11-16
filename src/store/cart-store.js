import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,

      // Actions
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item._id === product._id)

          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          // Add new item
          return {
            items: [...state.items, { ...product, quantity }],
          }
        })
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item._id === productId ? { ...item, quantity } : item
          ),
        }))
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item._id !== productId),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }))
      },

      openCart: () => {
        set({ isOpen: true })
      },

      closeCart: () => {
        set({ isOpen: false })
      },

      // Computed values
      getItemCount: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTax: () => {
        const { getSubtotal } = get()
        const subtotal = getSubtotal()
        // VAT 15% in Saudi Arabia
        return subtotal * 0.15
      },

      getShippingFee: () => {
        const { getSubtotal } = get()
        const subtotal = getSubtotal()
        // Free shipping over 500 SAR
        return subtotal >= 500 ? 0 : 50
      },

      getTotal: () => {
        const { getSubtotal, getTax, getShippingFee } = get()
        return getSubtotal() + getTax() + getShippingFee()
      },
    }),
    {
      name: 'dr-nawaf-cart',
      // Only persist items, not the drawer state
      partialize: (state) => ({ items: state.items }),
    }
  )
)

export default useCartStore
