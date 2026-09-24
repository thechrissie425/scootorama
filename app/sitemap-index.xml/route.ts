import { brand } from '@/lib/brand'
import { sanityFetch } from '@/sanity/lib/live'
import { SUPPORTED_MARKETS } from '@/lib/i18n'

const SITE_URL = brand.siteUrl
const MAX_URLS_PER_SITEMAP = 50000

/**
 * Lightweight query to count total URLs without fetching all data
 */
const SITEMAP_COUNT_QUERY = `{
  "pageCount": count(*[_type == "page" && !(_id in path("drafts.**"))]),
  "postCount": count(*[_type == "post" && !(_id in path("drafts.**"))]),
  "productCount": count(*[_type == "product" && !(_id in path("drafts.**"))]),
  "routeCount": count(*[_type == "route" && !(_id in path("drafts.**"))]),
  "campaignCount": count(*[_type == "campaign" && status == "active" && !(_id in path("drafts.**"))]),
  "membershipPageCount": count(*[_type == "membershipPage" && !(_id in path("drafts.**"))])
}`

interface ContentCounts {
  pageCount: number
  postCount: number
  productCount: number
  routeCount: number
  campaignCount: number
  membershipPageCount: number
}

/**
 * Calculate total URLs including all market/language combinations
 */
function calculateTotalUrls(counts: ContentCounts): number {
  const staticPageCount = 6 // Homepage, membership, products, blog, routes, campaigns
  const totalContentItems =
    staticPageCount +
    counts.pageCount +
    counts.postCount +
    counts.productCount +
    counts.routeCount +
    counts.campaignCount +
    counts.membershipPageCount

  // Calculate number of market/language combinations
  let localeCount = 1 // US English (root level)
  SUPPORTED_MARKETS.forEach(market => {
    market.languages.forEach(langCode => {
      // Skip US English (already counted)
      if (market.code === 'us' && langCode === 'en') return
      localeCount++
    })
  })

  return totalContentItems * localeCount
}

/**
 * Generate sitemap index XML
 */
function generateSitemapIndexXML(sitemapCount: number): string {
  const now = new Date().toISOString()
  const sitemaps = Array.from({ length: sitemapCount }, (_, i) => i)
    .map(
      i => `
  <sitemap>
    <loc>${SITE_URL}/sitemap-${i}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}
</sitemapindex>`
}

/**
 * Sitemap Index Route Handler
 * Only generates index when URL count exceeds 50,000
 * Otherwise redirects to main sitemap.xml
 */
export async function GET() {
  // Fetch content counts
  const { data } = (await sanityFetch({
    query: SITEMAP_COUNT_QUERY,
    params: {},
  })) as { data: ContentCounts }

  if (!data) {
    return new Response('No content found', { status: 404 })
  }

  const totalUrls = calculateTotalUrls(data)
  console.log(`📊 Total sitemap URLs: ${totalUrls}`)

  // If under 50k, redirect to main sitemap
  if (totalUrls <= MAX_URLS_PER_SITEMAP) {
    console.log('✅ Using single sitemap.xml')
    return Response.redirect(new URL('/sitemap.xml', SITE_URL), 301)
  }

  // Generate sitemap index for split sitemaps
  const sitemapCount = Math.ceil(totalUrls / MAX_URLS_PER_SITEMAP)
  console.log(`📄 Generating sitemap index with ${sitemapCount} sitemaps`)

  const xml = generateSitemapIndexXML(sitemapCount)

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
