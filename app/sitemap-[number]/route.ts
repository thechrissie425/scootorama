import { brand } from '@/lib/brand'
import { NextRequest } from 'next/server'
import { sanityFetch } from '@/sanity/lib/live'
import { SUPPORTED_MARKETS } from '@/lib/i18n'

const SITE_URL = brand.siteUrl
const MAX_URLS_PER_SITEMAP = 50000

/**
 * GROQ query to fetch all content that should appear in sitemap
 */
const SITEMAP_CONTENT_QUERY = `{
  "pages": *[_type == "page" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  },
  "posts": *[_type == "post" && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
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
  posts: Array<{ slug: string; _updatedAt: string }>
  products: Array<{ slug: string; _updatedAt: string }>
  routes: Array<{ slug: string; _updatedAt: string }>
  campaigns: Array<{ slug: string; _updatedAt: string }>
  membershipPages: Array<{ slug: string; _updatedAt: string }>
}

interface SitemapEntry {
  loc: string
  lastmod: string
  changefreq: string
  priority: number
}

/**
 * Generate sitemap entries for a specific content type across all markets/languages
 */
function generateContentUrls(
  items: Array<{ slug: string; _updatedAt: string }>,
  pathPrefix: string,
  priority: number = 0.7
): SitemapEntry[] {
  const urls: SitemapEntry[] = []

  items.forEach(item => {
    if (!item.slug) return

    // Add US English version (root level)
    urls.push({
      loc: `${SITE_URL}${pathPrefix}/${item.slug}`,
      lastmod: new Date(item._updatedAt).toISOString(),
      changefreq: 'weekly',
      priority,
    })

    // Add localized versions for all other market/language combinations
    SUPPORTED_MARKETS.forEach(market => {
      market.languages.forEach(langCode => {
        // Skip US English (already added above)
        if (market.code === 'us' && langCode === 'en') return

        urls.push({
          loc: `${SITE_URL}/${market.code}/${langCode}${pathPrefix}/${item.slug}`,
          lastmod: new Date(item._updatedAt).toISOString(),
          changefreq: 'weekly',
          priority,
        })
      })
    })
  })

  return urls
}

/**
 * Generate sitemap entries for static pages
 */
function generateStaticUrls(): SitemapEntry[] {
  const staticPages = [
    { path: '', priority: 1.0 },
    { path: '/membership', priority: 0.9 },
    { path: '/products', priority: 0.9 },
    { path: '/blog', priority: 0.8 },
    { path: '/routes', priority: 0.8 },
    { path: '/campaigns', priority: 0.7 },
  ]

  const urls: SitemapEntry[] = []
  const now = new Date().toISOString()

  staticPages.forEach(page => {
    // Add US English version (root level)
    urls.push({
      loc: `${SITE_URL}${page.path}`,
      lastmod: now,
      changefreq: 'daily',
      priority: page.priority,
    })

    // Add localized versions
    SUPPORTED_MARKETS.forEach(market => {
      market.languages.forEach(langCode => {
        // Skip US English (already added above)
        if (market.code === 'us' && langCode === 'en') return

        urls.push({
          loc: `${SITE_URL}/${market.code}/${langCode}${page.path}`,
          lastmod: now,
          changefreq: 'daily',
          priority: page.priority,
        })
      })
    })
  })

  return urls
}

/**
 * Generate XML sitemap string from entries
 */
function generateSitemapXML(entries: SitemapEntry[]): string {
  const xmlEntries = entries
    .map(
      entry => `
  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlEntries}
</urlset>`
}

/**
 * Dynamic route handler for split sitemaps
 * Handles requests to /sitemap-0.xml, /sitemap-1.xml, etc.
 */
// 🟢 FIX: Used 'any' for params type to bypass the Next.js build constraint error
export async function GET(
  request: NextRequest,
  props: { params: Promise<any> }
) {
  const params = await props.params
  const { number } = params

  const sitemapIndex = parseInt(number, 10)

  if (isNaN(sitemapIndex) || sitemapIndex < 0) {
    return new Response('Invalid sitemap number', { status: 400 })
  }

  // Fetch all content
  const { data } = (await sanityFetch({
    query: SITEMAP_CONTENT_QUERY,
    params: {},
  })) as { data: SitemapContent }

  if (!data) {
    return new Response('No content found', { status: 404 })
  }

  // Generate all URL entries
  const allUrls: SitemapEntry[] = [
    ...generateStaticUrls(),
    ...generateContentUrls(data.pages || [], '', 0.8),
    ...generateContentUrls(data.posts || [], '/blog', 0.7),
    ...generateContentUrls(data.products || [], '/products', 0.9),
    ...generateContentUrls(data.routes || [], '/routes', 0.6),
    ...generateContentUrls(data.campaigns || [], '/campaigns', 0.7),
    ...generateContentUrls(data.membershipPages || [], '/membership', 0.8),
  ]

  // Calculate pagination
  const startIndex = sitemapIndex * MAX_URLS_PER_SITEMAP
  const endIndex = startIndex + MAX_URLS_PER_SITEMAP
  const chunk = allUrls.slice(startIndex, endIndex)

  if (chunk.length === 0) {
    return new Response('Sitemap index out of range', { status: 404 })
  }

  const xml = generateSitemapXML(chunk)

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
