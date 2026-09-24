// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { draftMode } from 'next/headers'
import { SanityLive } from '@/sanity/lib/live'
import { CartProvider } from '@/contexts/CartContext'
import CartViewer from '@/components/cart/CartViewer'
import FloatingCartButton from '@/components/cart/FloatingCartButton'
import { VisualEditing } from 'next-sanity/visual-editing'
import WebVitals from '@/components/WebVitals'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDraftMode = (await draftMode()).isEnabled

  return (
    // ⚠️ Note: lang="en" is hardcoded here.
    // Ideally, you move <html> to the nested layout if you want strict SEO,
    // but for now, this is acceptable for a PoC.
    <html lang="en">
      <head>
        {/* DNS Prefetch for Sanity CDN */}
        <link rel="dns-prefetch" href="//cdn.sanity.io" />
        {/* Preconnect to Sanity CDN for faster image loading */}
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
      </head>
      <body style={{ fontFamily: 'Nunito-Regular, sans-serif' }}>
        <WebVitals />
        <CartProvider>
          {children}
          <CartViewer />
          <FloatingCartButton />
        </CartProvider>

        {/* Sanity Live enabled only in draft mode to prevent flickering in production */}
        {isDraftMode && (
          <>
            <SanityLive />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  )
}
