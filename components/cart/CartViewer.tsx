'use client'

import { motion, AnimatePresence } from 'framer-motion'
import SvgIcon from '@/components/ui/SvgIcon'
import closeIcon from '@/icons/system/close.svg'
import trashIcon from '@/icons/system/trash.svg'
import cartIcon from '@/icons/ui/cart.svg'
import plusIcon from '@/icons/controllers/button-plus.svg'
import minusIcon from '@/icons/controllers/button-minus.svg'
import { useCart } from '@/contexts/CartContext'
import { useMarketFormatting } from '@/hooks/useMarketFormatting'
import { createCheckout } from '@/app/actions/createCheckout'
import { useState } from 'react'
import ImageWithSkeleton from '@/components/ui/ImageWithSkeleton'

export default function CartViewer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    isOpen,
    closeCart,
    itemCount,
  } = useCart()
  const { formatCurrency, market } = useMarketFormatting()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const checkoutUrl = await createCheckout(items, market?.code || 'us')
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Unable to proceed to checkout. Please try again.')
      setIsCheckingOut(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Cart Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-brand-ink shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <SvgIcon
                  src={cartIcon}
                  className="w-6 h-6 text-brand-primary"
                />
                <h2 className="text-2xl font-heading-bold">
                  Cart ({itemCount})
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
              >
                <SvgIcon src={closeIcon} className="w-6 h-6" />
                <span className="sr-only">Close cart</span>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <SvgIcon
                    src={cartIcon}
                    className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4"
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <motion.div
                      key={item.variantId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex gap-4"
                    >
                      {item.image && (
                        <ImageWithSkeleton
                          src={item.image}
                          alt={item.title}
                          width={80}
                          height={80}
                          // 1. Pass the exact dimensions via class for the container
                          containerClassName="w-20 h-20 rounded-md bg-gray-50 shrink-0"
                          // 2. Styling for the actual image
                          className="object-cover"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading-bold text-sm mb-1 truncate">
                          {item.title}
                        </h3>
                        <p className="text-brand-primary font-bold text-lg mb-2">
                          {formatCurrency(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            aria-label={`Decrease quantity of ${item.title}`}
                            className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                          >
                            <SvgIcon src={minusIcon} className="w-5 h-5" />
                          </button>
                          <span className="w-8 text-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            aria-label={`Increase quantity of ${item.title}`}
                            className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:outline-none"
                          >
                            <SvgIcon src={plusIcon} className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.variantId)}
                        aria-label={`Remove ${item.title} from cart`}
                        className="p-3 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors self-start focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
                      >
                        <SvgIcon src={trashIcon} className="w-5 h-5" />
                        <span className="sr-only">Remove from cart</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 p-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-heading-bold">
                  <span>Total</span>
                  <span className="text-brand-primary">
                    {formatCurrency(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  aria-label={
                    isCheckingOut
                      ? 'Redirecting to checkout'
                      : 'Proceed to checkout'
                  }
                  aria-busy={isCheckingOut}
                  className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-heading-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {isCheckingOut ? 'Redirecting to Shopify...' : 'Checkout'}
                </button>

                <button
                  onClick={clearCart}
                  aria-label="Remove all items from cart"
                  className="w-full text-sm text-gray-500 hover:text-red-600 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded py-2"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
