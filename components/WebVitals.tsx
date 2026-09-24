'use client'

import { useEffect } from 'react'
import { onCLS, onLCP, onFCP, onTTFB, onINP } from 'web-vitals'

/**
 * Web Vitals Reporter Component
 *
 * Tracks Core Web Vitals and sends them to console/analytics:
 * - CLS (Cumulative Layout Shift) - Target: < 0.1
 * - LCP (Largest Contentful Paint) - Target: < 2.5s
 * - FCP (First Contentful Paint) - Target: < 1.8s
 * - TTFB (Time to First Byte) - Target: < 800ms
 * - INP (Interaction to Next Paint) - Target: < 200ms (replaces FID)
 */
export default function WebVitals() {
  useEffect(() => {
    const reportWebVitals = (metric: any) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        const { name, value, rating, delta, id } = metric

        // Color code based on rating
        const color =
          rating === 'good'
            ? '✅'
            : rating === 'needs-improvement'
              ? '⚠️'
              : '❌'

        console.group(`${color} ${name}`)
        console.log('Value:', value.toFixed(2))
        console.log('Rating:', rating)
        console.log('Delta:', delta.toFixed(2))
        console.log('ID:', id)
        console.groupEnd()

        // Alert on CLS issues (our primary concern)
        if (name === 'CLS' && value >= 0.1) {
          console.warn(
            `⚠️ CLS threshold exceeded! Current: ${value.toFixed(3)}, Target: < 0.1`
          )
        }
      }

      // TODO: Send to analytics service in production
      // Example: analytics.track('web-vital', metric)
      // Recommended services:
      // - Vercel Analytics (built-in for Vercel deployments)
      // - Google Analytics 4
      // - Custom endpoint: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(metric) })
    }

    // Register all Core Web Vitals listeners
    onCLS(reportWebVitals)
    onLCP(reportWebVitals)
    onFCP(reportWebVitals)
    onTTFB(reportWebVitals)
    onINP(reportWebVitals)
  }, [])

  // This component doesn't render anything
  return null
}
