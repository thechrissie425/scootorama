# Sitemap Implementation Guide

## Overview

The Scootorama Next-Gen website implements **automatic sitemap generation** with intelligent splitting to handle large-scale multi-market content.

### Key Features

✅ **Automatic Generation**: Sitemaps build automatically from Sanity content  
✅ **Multi-Market Support**: Includes all market/language URL variations  
✅ **50k URL Limit Compliance**: Auto-splits when exceeding sitemap spec  
✅ **Dynamic Content**: Real-time updates as content changes  
✅ **SEO Optimized**: Proper priorities, lastmod dates, and change frequencies

---

## Architecture

### File Structure

```
app/
├── sitemap.ts                      # Main sitemap (single file)
├── sitemap-[number]/
│   └── route.ts                    # Split sitemaps (50k chunks)
├── sitemap-index.xml/
│   └── route.ts                    # Sitemap index generator
└── robots.ts                       # Robots.txt with sitemap reference
```

### URL Pattern

**Under 50,000 URLs** (current state):

- Access: `/sitemap.xml`
- Returns: Single XML sitemap with all URLs

**Over 50,000 URLs** (future scaling):

- Access: `/sitemap-index.xml`
- Returns: Sitemap index listing split files
- Split files: `/sitemap-0.xml`, `/sitemap-1.xml`, etc.
- Each split: Max 50,000 URLs

---

## Implementation Details

### 1. Main Sitemap (`app/sitemap.ts`)

**Purpose**: Primary sitemap for sites with ≤ 50k URLs

**Content Sources**:

- Static pages (homepage, membership, products, blog, routes, campaigns)
- Dynamic pages from Sanity (`page` documents)
- Blog posts (`post` documents)
- Products (`product` documents)
- Routes (`route` documents)
- Active campaigns (`campaign` documents with `status == "active"`)
- Membership pages (`membershipPage` documents)

**URL Generation**:

```typescript
// US English (root level)
;/products/fitwz -
  ride /
    // Localized versions
    de /
    de /
    products /
    scootorama -
  ride / fr / fr / products / scootorama -
  ride / es / es / products / scootorama -
  ride / uk / en / products / scootorama -
  ride / jp / ja / products / scootorama -
  ride
```

**Metadata**:

- `lastModified`: From Sanity `_updatedAt` field
- `changeFrequency`: Daily for static, weekly for dynamic
- `priority`: 1.0 (homepage) → 0.6 (routes)

### 2. Split Sitemaps (`app/sitemap-[number]/route.ts`)

**Purpose**: Handle sites with > 50k URLs

**How it works**:

1. Fetches all content from Sanity
2. Generates complete URL list
3. Slices into 50k-URL chunks based on route parameter
4. Returns XML for requested chunk

**Example URLs**:

- `/sitemap-0.xml` → URLs 0-49,999
- `/sitemap-1.xml` → URLs 50,000-99,999
- `/sitemap-2.xml` → URLs 100,000-149,999

**Response**:

- Format: XML sitemap
- Cache: 1 hour (`Cache-Control: public, max-age=3600`)
- 404: If chunk index out of range

### 3. Sitemap Index (`app/sitemap-index.xml/route.ts`)

**Purpose**: Orchestrates split sitemaps

**Smart Behavior**:

```typescript
if (totalUrls <= 50000) {
  redirect('/sitemap.xml') // Use single sitemap
} else {
  return sitemapIndex // Generate index
}
```

**Performance Optimization**:

- Uses lightweight `count()` queries
- Calculates total without fetching all data
- Formula: `(content items) × (locale combinations)`

**Sitemap Index XML**:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://scootorama.example/sitemap-0.xml</loc>
    <lastmod>2026-01-15T12:00:00Z</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://scootorama.example/sitemap-1.xml</loc>
    <lastmod>2026-01-15T12:00:00Z</lastmod>
  </sitemap>
</sitemapindex>
```

### 4. Robots.txt (`app/robots.ts`)

**Purpose**: Direct search engines to sitemap

```typescript
{
  userAgent: '*',
  allow: '/',
  disallow: ['/studio/', '/api/', '/translation-manager/'],
  sitemap: 'https://scootorama.example/sitemap.xml'
}
```

**Blocked paths**:

- `/studio/` - Sanity Studio
- `/api/` - API routes
- `/translation-manager/` - Internal tools
- `/translation-qa/`, `/translation-test/`, `/image-test/`, `/shadcn-test/`

---

## URL Calculation

### Market/Language Combinations

```typescript
// From lib/i18n.ts SUPPORTED_MARKETS
const locales = [
  { market: 'us', lang: 'en' }, // Root level (/)
  { market: 'us', lang: 'es' }, // /us/es/
  { market: 'de', lang: 'de' }, // /de/de/
  { market: 'de', lang: 'en' }, // /de/en/
  { market: 'fr', lang: 'fr' }, // /fr/fr/
  { market: 'fr', lang: 'en' }, // /fr/en/
  { market: 'es', lang: 'es' }, // /es/es/
  { market: 'es', lang: 'en' }, // /es/en/
  { market: 'uk', lang: 'en' }, // /uk/en/
  { market: 'jp', lang: 'ja' }, // /jp/ja/
]
// Total: 10 locale combinations
```

### Example Calculation

**Current Content** (estimated):

- Static pages: 6
- Dynamic pages: 50
- Blog posts: 100
- Products: 10
- Routes: 323
- Campaigns: 5
- Membership pages: 3

**Total unique items**: 497

**Total URLs**: `497 items × 10 locales = 4,970 URLs`

**Status**: ✅ Single sitemap sufficient (well under 50k limit)

---

## SEO Best Practices

### Priority Values

| Content Type  | Priority | Reasoning                   |
| ------------- | -------- | --------------------------- |
| Homepage      | 1.0      | Most important page         |
| Products      | 0.9      | High-value conversion pages |
| Membership    | 0.9      | Key revenue driver          |
| Blog          | 0.8      | Regular content updates     |
| Dynamic Pages | 0.8      | Marketing content           |
| Routes        | 0.6      | Supplementary content       |
| Campaigns     | 0.7      | Time-sensitive promotions   |

### Change Frequency

| Content Type | Frequency | Reasoning          |
| ------------ | --------- | ------------------ |
| Static Pages | daily     | Marketing updates  |
| Blog Posts   | weekly    | Periodic additions |
| Products     | weekly    | Occasional updates |
| Routes       | weekly    | Stable content     |
| Campaigns    | weekly    | Active promotions  |

### Last Modified

- **Source**: Sanity `_updatedAt` field
- **Format**: ISO 8601 datetime
- **Purpose**: Help search engines prioritize fresh content

---

## Testing

### Local Development

```bash
# Start dev server
npm run dev

# Test main sitemap
curl http://localhost:3000/sitemap.xml

# Test split sitemap (if implemented)
curl http://localhost:3000/sitemap-0.xml

# Test sitemap index
curl http://localhost:3000/sitemap-index.xml

# Test robots.txt
curl http://localhost:3000/robots.txt
```

### Production

```bash
# Verify sitemap
curl https://scootorama.example/sitemap.xml

# Check URL count
curl -s https://scootorama.example/sitemap.xml | grep -c '<loc>'

# Validate XML
curl -s https://scootorama.example/sitemap.xml | xmllint --noout -
```

### Google Search Console

1. Submit sitemap: `https://scootorama.example/sitemap.xml`
2. Monitor coverage reports
3. Check indexing status
4. Review crawl errors

---

## Monitoring

### Key Metrics

**URL Count**:

- Monitor total URLs in sitemap
- Alert if approaching 50k limit
- Check console logs: `📊 Generated X sitemap URLs`

**Content Freshness**:

- Verify `lastmod` dates update
- Check Sanity `_updatedAt` propagation
- Ensure cache invalidation works

**Performance**:

- Sitemap generation time
- Cache hit rates
- Response times

### Console Logs

```typescript
// Single sitemap
'📊 Generated 4970 sitemap URLs'

// Approaching limit
'⚠️ URL count (45000) exceeds 50000. Use sitemap-[number].xml for split sitemaps.'

// Split sitemaps
'📊 Total sitemap URLs: 75000'
'📄 Generating sitemap index with 2 sitemaps'
```

---

## Future Scaling

### When to Use Split Sitemaps

**Threshold**: 50,000 URLs

**Current Growth Projections**:

- **Routes**: 323 (stable)
- **Blog Posts**: ~100 → ~500/year growth
- **Products**: ~10 → ~50 total
- **Pages**: ~50 → ~200 total

**Estimated Years to 50k**:

- Current: 4,970 URLs
- Growth: ~500 URLs/year
- Years to limit: ~90 years at current rate

**Conclusion**: Single sitemap sufficient for foreseeable future

### Migration Path

If URL count grows unexpectedly:

1. **Monitor console logs** for warnings
2. **Update robots.txt** to reference `/sitemap-index.xml`
3. **Resubmit to Google Search Console**
4. **Test split sitemaps** locally
5. **Verify all chunks** load correctly

---

## Troubleshooting

### Sitemap Not Updating

**Issue**: Content changes not reflected in sitemap

**Solutions**:

1. Clear Next.js cache: `rm -rf .next`
2. Check Sanity API token permissions
3. Verify `_updatedAt` field exists on documents
4. Rebuild: `npm run build`

### 404 on Sitemap

**Issue**: `/sitemap.xml` returns 404

**Solutions**:

1. Check file exists: `app/sitemap.ts`
2. Verify build completed: `npm run build`
3. Check TypeScript errors: `npm run typecheck`
4. Restart dev server

### URLs Missing from Sitemap

**Issue**: Expected URLs not appearing

**Solutions**:

1. Check Sanity query filters (`!(_id in path("drafts.**"))`)
2. Verify document type matches query
3. Check `slug.current` field exists
4. Review `status` field (campaigns must be "active")

### XML Validation Errors

**Issue**: Invalid XML syntax

**Solutions**:

1. Validate with: `curl -s URL | xmllint --noout -`
2. Check URL encoding (spaces, special chars)
3. Verify XML namespace declarations
4. Test with online validators

---

## Related Documentation

- [SEO & Canonical URLs](.github/copilot-instructions.md#7-seo--canonical-urls-critical)
- [Hreflang Tags](.github/copilot-instructions.md#9-hreflang-tags-critical)
- [Open Graph Images](.github/copilot-instructions.md#11-open-graph-og-images-critical)
- [Market Configuration](lib/i18n.ts)
- [GROQ Queries](sanity/lib/queries.ts)

---

## Google Sitemap Protocol

**Official Spec**: https://www.sitemaps.org/protocol.html

**Key Requirements**:

- Max 50,000 URLs per sitemap file
- Max 50MB uncompressed size
- UTF-8 encoding required
- Must use `<urlset>` root element
- Sitemap index for multiple files

**Compliance**: ✅ All requirements met
