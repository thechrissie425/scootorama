/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

'use client'

import { useEffect } from 'react'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'

// Remove force-static for client component
// export const dynamic = 'force-static'

// Remove problematic exports that don't exist in this version
// export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  useEffect(() => {
    // Suppress React DOM prop warnings and noisy Sanity Studio internals
    // This is a known issue with Sanity Studio and Next.js 16 / React 19
    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log
    const originalInfo = console.info

    const shouldSuppress = (msg: unknown): boolean => {
      if (typeof msg !== 'string') return false
      return (
        msg.includes('React does not recognize') ||
        msg.includes('disableTransition') ||
        msg.includes('Failed to decode stega') ||
        msg.includes('Encoded data has invalid length') ||
        msg.includes('No activity within') || // EventSource reconnection noise
        msg.includes('chars received') ||
        msg.includes('Reconnecting')
      )
    }

    console.error = (...args) => {
      if (shouldSuppress(args[0])) return
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      if (shouldSuppress(args[0])) return
      originalWarn.apply(console, args)
    }

    console.log = (...args) => {
      if (shouldSuppress(args[0])) return
      originalLog.apply(console, args)
    }

    console.info = (...args) => {
      if (shouldSuppress(args[0])) return
      originalInfo.apply(console, args)
    }

    return () => {
      console.error = originalError
      console.warn = originalWarn
      console.log = originalLog
      console.info = originalInfo
    }
  }, []) // Empty array - only run once on mount

  return <NextStudio config={config} />
}
