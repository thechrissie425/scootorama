import { brand } from '@/lib/brand'
import { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { SUPPORTED_MARKETS } from '@/lib/i18n'

const SITE_URL = brand.siteUrl
const MAX_URLS_PER_SITEMAP = 50000

/**
 * GROQ query to fetch all content that should appear in sitemap
 * Includes: pages, blog posts, products, routes, campaigns
 */
const SITEMAP_CONTENT_QUERY = `{
  "pages": *[_type == "page" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  },
  "posts": *[_type == "post" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt,
    publishedAt
  },
  "products": *[_type == "product" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  },
  "routes": *[_type == "route" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  },
  "campaigns": *[_type == "campaign" && status == "active" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  },
  "membershipPages": *[_type == "membershipPage" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }
}`

interface SitemapContent {
  pages: Array<{ slug: string; _updatedAt: string }>
  posts: Array<{ slug: string; _updatedAt: string; publishedAt?: string }>
  products: Array<{ slug: string; _updatedAt: string }>
  routes: Array<{ slug: string; _updatedAt: string }>
  campaigns: Array<{ slug: string; _updatedAt: string }>
  membershipPages: Array<{ slug: string; _updatedAt: string }>
}

/**
 * Generate sitemap entries for a specific content type across all markets/languages
 */
function generateContentUrls(
  items: Array<{ slug: string; _updatedAt: string }>,
  pathPrefix: string,
  priority: number = 0.7
): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = []

  items.forEach(item => {
    if (!item.slug) return

    // Add US English version (root level)
    urls.push({
      url: `${SITE_URL}${pathPrefix}/${item.slug}`,
      lastModified: new Date(item._updatedAt),
      changeFrequency: 'weekly',
      priority,
    })

    // Add localized versions for all other market/language combinations
    SUPPORTED_MARKETS.forEach(market => {
      market.languages.forEach(langCode => {
        // Skip US English (already added above)
        if (market.code === 'us' && langCode === 'en') return

        urls.push({
          url: `${SITE_URL}/${market.code}/${langCode}${pathPrefix}/${item.slug}`,
          lastModified: new Date(item._updatedAt),
          changeFrequency: 'weekly',
          priority,
        })
      })
    })
  })

  return urls
}

/**
 * Generate sitemap entries for static pages (home, about, etc.)
 */
function generateStaticUrls(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: '', priority: 1.0 }, // Homepage
    { path: '/membership', priority: 0.9 },
    { path: '/products', priority: 0.9 },
    { path: '/blog', priority: 0.8 },
    { path: '/routes', priority: 0.8 },
    { path: '/campaigns', priority: 0.7 },
  ]

  const urls: MetadataRoute.Sitemap = []

  staticPages.forEach(page => {
    // Add US English version (root level)
    urls.push({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: page.priority,
    })

    // Add localized versions
    SUPPORTED_MARKETS.forEach(market => {
      market.languages.forEach(langCode => {
        // Skip US English (already added above)
        if (market.code === 'us' && langCode === 'en') return

        urls.push({
          url: `${SITE_URL}/${market.code}/${langCode}${page.path}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: page.priority,
        })
      })
    })
  })

  return urls
}

/**
 * Main sitemap export - automatically handles splitting if > 50k URLs
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = (await sanityFetch({
    query: SITEMAP_CONTENT_QUERY,
    params: {},
  })) as { data: SitemapContent }

  if (!data) {
    console.warn('⚠️ No sitemap content found from Sanity')
    return generateStaticUrls()
  }

  // Generate all URL entries
  const allUrls: MetadataRoute.Sitemap = [
    ...generateStaticUrls(),
    ...generateContentUrls(data.pages || [], '', 0.8),
    ...generateContentUrls(data.posts || [], '/blog', 0.7),
    ...generateContentUrls(data.products || [], '/products', 0.9),
    ...generateContentUrls(data.routes || [], '/routes', 0.6),
    ...generateContentUrls(data.campaigns || [], '/campaigns', 0.7),
    ...generateContentUrls(data.membershipPages || [], '/membership', 0.8),
  ]

  console.log(`📊 Generated ${allUrls.length} sitemap URLs`)

  // If under 50k URLs, return single sitemap
  if (allUrls.length <= MAX_URLS_PER_SITEMAP) {
    return allUrls
  }

  // If over 50k, we need sitemap index (handled by sitemap-index.ts)
  console.warn(
    `⚠️ URL count (${allUrls.length}) exceeds ${MAX_URLS_PER_SITEMAP}. Use sitemap-[number].xml for split sitemaps.`
  )

  // Return first chunk for main sitemap
  return allUrls.slice(0, MAX_URLS_PER_SITEMAP)
}
