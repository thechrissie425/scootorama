'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import SvgIcon from '@/components/ui/SvgIcon'
import cartIcon from '@/icons/ui/cart.svg'
import { useCart } from '@/contexts/CartContext'

export default function FloatingCartButton() {
  const { itemCount, openCart } = useCart()
  const pathname = usePathname()

  // Hide on studio routes
  if (pathname?.startsWith('/studio')) {
    return null
  }

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={openCart}
      aria-label={
        itemCount > 0 ? `Open cart with ${itemCount} items` : 'Open cart'
      }
      className="fixed bottom-6 right-6 bg-brand-primary hover:bg-brand-primary-dark text-white rounded-full p-4 shadow-2xl z-50 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary focus-visible:outline-none"
    >
      <SvgIcon src={cartIcon} className="w-6 h-6" />
      <span className="sr-only">Shopping cart</span>

      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
          >
            {itemCount}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
