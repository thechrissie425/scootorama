import { brand } from '@/lib/brand'
import { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/live'

const SITE_URL = brand.siteUrl

/**
 * Dynamic robots.txt configuration
 * Blocks crawl-heavy, low-value paths to prevent bot traps and conserve crawl budget
 * Can be configured via Sanity CMS (siteSettings) or falls back to defaults
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  // Fetch dynamic robot rules from Sanity (if configured)
  const { data } = await sanityFetch({
    query: `*[_type == "siteSettings"][0]{
      "robotRules": robots{
        userAgent,
        allow,
        disallow,
        crawlDelay
      }
    }`,
    params: {},
  }).catch(() => ({ data: null }))

  // Default blocked paths (high-traffic, low-SEO-value)
  const defaultDisallow = [
    '/studio/', // Sanity Studio (admin interface)
    '/api/', // API routes (no indexable content)
    '/*?*variant=*', // Variant URLs (duplicate content)
    '/*?*utm_*', // UTM tracking parameters
    '/*?*ref=*', // Referral parameters
  ]

  // Merge CMS-configured rules with defaults
  const disallowPaths = data?.robotRules?.disallow
    ? [...defaultDisallow, ...data.robotRules.disallow]
    : defaultDisallow

  return {
    rules: [
      {
        userAgent: data?.robotRules?.userAgent || '*',
        allow: data?.robotRules?.allow || '/',
        disallow: disallowPaths,
        // Optional crawl delay for aggressive bots (in seconds)
        ...(data?.robotRules?.crawlDelay && {
          crawlDelay: data.robotRules.crawlDelay,
        }),
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
