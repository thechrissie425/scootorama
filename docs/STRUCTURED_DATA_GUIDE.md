# Structured Data Implementation Guide

**Updated**: January 8, 2026

## Overview

This guide covers the implementation of JSON-LD structured data (Schema.org) across the Scootorama Next-Gen application for improved SEO and search engine visibility.

## Why Structured Data Matters

- **Rich Search Results**: Enable rich snippets, product cards, and enhanced search listings
- **Better CTR**: Structured data can improve click-through rates by 20-30%
- **Voice Search**: Critical for voice assistant compatibility
- **Knowledge Graph**: Helps Google understand your content and brand

## Architecture

### Core Utilities

**Location**: `lib/structuredData.ts`

Provides helper functions for generating Schema.org JSON-LD:

```typescript
import {
  generateProductSchema,
  generateArticleSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/structuredData'
```

### Component

**Location**: `components/StructuredData.tsx`

React component for rendering JSON-LD in Next.js pages:

```typescript
import { StructuredData } from '@/components/StructuredData'
```

## Implementation Examples

### 1. Campaign Pages (Product Schema)

Add to `app/[market]/[lang]/campaigns/[slug]/page.tsx`:

```typescript
import { StructuredData } from '@/components/StructuredData'
import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/structuredData'
import { urlForImage } from '@/sanity/lib/image'

export default async function CampaignPage({ params }: PageProps) {
  const campaign = await getCampaign(params.slug, locale)

  // Generate structured data
  const productSchema = generateProductSchema({
    name: campaign.title,
    description: campaign.description,
    image: campaign.heroImage ? urlForImage(campaign.heroImage).width(1200).url() : undefined,
    price: campaign.price,
    currency: 'USD',
    availability: 'InStock',
    brand: 'Scootorama',
    sku: campaign.sku,
    url: `https://scootorama.example/${params.market}/${params.lang}/campaigns/${params.slug}`,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `https://scootorama.example/${params.market}/${params.lang}` },
    { name: 'Campaigns', url: `https://scootorama.example/${params.market}/${params.lang}/campaigns` },
    { name: campaign.title, url: `https://scootorama.example/${params.market}/${params.lang}/campaigns/${params.slug}` },
  ])

  return (
    <>
      <StructuredData data={[productSchema, breadcrumbSchema]} />
      {/* Rest of page content */}
    </>
  )
}
```

### 2. Blog Posts (Article Schema)

Add to `app/[market]/[lang]/blog/[slug]/page.tsx`:

```typescript
const articleSchema = generateArticleSchema({
  headline: post.title,
  description: post.excerpt,
  image: post.mainImage ? urlForImage(post.mainImage).width(1200).url() : undefined,
  datePublished: post.publishedAt,
  dateModified: post._updatedAt,
  author: {
    name: post.author.name,
    url: `https://scootorama.example/authors/${post.author.slug}`,
  },
  publisher: {
    name: 'Scootorama',
    url: 'https://scootorama.example',
    logo: 'https://scootorama.example/logo.png',
  },
})

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: 'https://scootorama.example' },
  { name: 'Blog', url: 'https://scootorama.example/blog' },
  { name: post.title, url: `https://scootorama.example/blog/${post.slug}` },
])

return (
  <>
    <StructuredData data={[articleSchema, breadcrumbSchema]} />
    {/* Rest of page content */}
  </>
)
```

### 3. Product Pages

```typescript
const productSchema = generateProductSchema({
  name: product.title,
  description: product.description,
  image: urlForImage(product.image).url(),
  price: inventory.price,
  currency: marketCurrency,
  availability: inventory.available ? 'InStock' : 'OutOfStock',
  brand: 'Scootorama',
  sku: product.sku,
})

return (
  <>
    <StructuredData data={productSchema} />
    {/* Product content */}
  </>
)
```

### 4. Organization Schema (Root Layout)

Add to `app/layout.tsx` for sitewide organization data:

```typescript
const organizationSchema = generateOrganizationSchema({
  name: 'Scootorama',
  url: 'https://scootorama.example',
  logo: 'https://scootorama.example/logo.png',
  sameAs: [
    'https://twitter.com/goscootorama',
    'https://facebook.com/scootorama',
    'https://instagram.com/goscootorama',
  ],
})

const websiteSchema = generateWebSiteSchema('https://scootorama.example', 'Scootorama')

return (
  <html>
    <head>
      <StructuredData data={[organizationSchema, websiteSchema]} />
    </head>
    <body>{children}</body>
  </html>
)
```

## Schema Types by Content Type

| Content Type       | Required Schemas                      | Priority |
| ------------------ | ------------------------------------- | -------- |
| **campaign**       | Product, BreadcrumbList, Organization | High     |
| **product**        | Product, BreadcrumbList               | High     |
| **post**           | Article, BreadcrumbList               | Medium   |
| **page**           | WebPage, BreadcrumbList               | Medium   |
| **membershipPage** | Product, BreadcrumbList               | High     |

## Tracking Implementation

### Add Schema Field

Add to all content types in Sanity schemas:

```typescript
defineField({
  name: 'hasStructuredData',
  type: 'boolean',
  title: 'Has Structured Data',
  description:
    'Indicates if JSON-LD structured data is implemented for this document',
  hidden: true,
  initialValue: false,
})
```

### Mark as Implemented

After adding structured data to a page template, update the field:

```typescript
// In your Sanity document
hasStructuredData: true
```

## Audit Script

Check structured data coverage across all content:

```bash
# Run audit report
npm run structured-data:audit

# Create Sanity tasks for missing structured data
npm run structured-data:audit:tasks
```

### Audit Output Example

```
🔍 Auditing Structured Data Implementation...

📄 Checking campaign...
  ████████████████████  100% (5/5)

📄 Checking post...
  ████████░░░░░░░░░░░░  45% (9/20)
  ⚠️  11 documents missing structured data

📊 STRUCTURED DATA AUDIT SUMMARY
═══════════════════════════════════════════════════════
✅ campaign: 100% coverage
   5/5 documents have structured data

🔴 post: 45% coverage
   9/20 documents have structured data
   Missing: Article, BreadcrumbList

Total Issues: 11
```

## Testing Structured Data

### 1. Google Rich Results Test

Test your structured data implementation:

```bash
https://search.google.com/test/rich-results
```

Paste your page URL to validate JSON-LD.

### 2. Schema.org Validator

```bash
https://validator.schema.org/
```

Validates against official Schema.org specifications.

### 3. Local Testing

View structured data in browser DevTools:

```javascript
// In browser console
document
  .querySelectorAll('script[type="application/ld+json"]')
  .forEach(script => {
    console.log(JSON.parse(script.textContent))
  })
```

## Best Practices

### 1. Always Include Breadcrumbs

Breadcrumbs improve navigation in search results:

```typescript
const breadcrumbs = generateBreadcrumbSchema([
  { name: 'Home', url: baseUrl },
  { name: category, url: `${baseUrl}/${category}` },
  { name: title, url: currentUrl },
])
```

### 2. Use Absolute URLs

Always use full URLs with protocol:

```typescript
// ✅ Good
url: 'https://scootorama.example/campaigns/winter'

// ❌ Bad
url: '/campaigns/winter'
```

### 3. Provide High-Quality Images

For products and articles, use large images:

```typescript
image: urlForImage(heroImage).width(1200).height(630).format('jpg').url()
```

### 4. Include Organization for Products

Link products to your organization:

```typescript
const productSchema = {
  ...generateProductSchema(productData),
  brand: {
    '@type': 'Brand',
    name: 'Scootorama',
  },
}
```

### 5. Keep Data Synchronized

Ensure structured data matches visible content:

```typescript
// Structured data should match page title
headline: pageTitle // Not a different title
```

## Migration Strategy

### Phase 1: High-Priority Content (Week 1)

1. ✅ Add Organization schema to root layout
2. ✅ Add Product schema to campaign pages
3. ✅ Add Product schema to product pages
4. ✅ Add breadcrumbs to all templates

### Phase 2: Content Pages (Week 2)

1. ✅ Add Article schema to blog posts
2. ✅ Add WebPage schema to landing pages
3. ✅ Add breadcrumbs to membership pages

### Phase 3: Validation & Optimization (Week 3)

1. ✅ Run structured-data:audit
2. ✅ Test with Google Rich Results
3. ✅ Fix any validation errors
4. ✅ Monitor search console for rich results

## Performance Considerations

### Minimal Bundle Impact

Structured data is rendered as static JSON - no JavaScript execution required.

### Server-Side Rendering

Generate structured data server-side for optimal performance:

```typescript
// In server component
export default async function Page() {
  const data = await fetchData() // Server-side
  const schema = generateProductSchema(data) // Server-side

  return <StructuredData data={schema} /> // Static HTML
}
```

### Caching

Structured data is cached with page content - no additional requests.

## Common Issues

### Issue: Structured Data Not Appearing

**Solution**: Ensure `<StructuredData>` is rendered in the page, not in a client component boundary.

### Issue: Validation Errors

**Solution**: Run Google Rich Results Test and fix reported issues. Common issues:

- Missing required fields (name, image for Product)
- Invalid URLs (use absolute URLs)
- Wrong date formats (use ISO 8601)

### Issue: Duplicate Schemas

**Solution**: Only render Organization schema once (in root layout), not on every page.

## Time Savings

**Implementation**: 2-4 hours upfront  
**Maintenance**: ~10 minutes per new content type  
**SEO Benefit**: 20-30% improvement in CTR from rich results

## Resources

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

---

**Next Steps**: Run `npm run structured-data:audit:tasks` to identify and create tasks for all missing structured data implementations.
