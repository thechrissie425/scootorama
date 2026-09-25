# Scootorama Next-Gen AI Coding Agent Instructions

## Project Overview

This is an enterprise-grade multi-market e-commerce platform built with **Next.js 14 (App Router)**, **Sanity CMS**, and **Shopify integration**. The system serves 6+ markets with full internationalization, automated translation workflows, and real-time inventory.

## Critical Architecture Patterns

### 1. Routing & Localization

**Multi-Market Routing Structure:**

```
/                        → US English (default)
/us/es/                  → US Spanish
/[market]/[lang]/        → Localized markets (e.g., /de/de/, /fr/fr/, /uk/en/)
```

- **Market-to-Region Mapping**: Markets (us, de, fr, es, uk, jp) map to pricing regions (US, EU, UK, JP)
  - `de`, `fr`, `es` all use `EU` pricing region
  - See `lib/i18n.ts` for complete market configuration
- **Language Resolution**: Use `getLanguageByCode()` and `getLocaleFromCode()` from `lib/i18n.ts`
- **URL Patterns**: US market supports English (`/`) and Spanish (`/us/es/`)

### 2. Data Fetching (CRITICAL)

**Always use `sanityFetch` from `@/sanity/lib/live`** - never the raw Sanity client:

```typescript
import { sanityFetch } from '@/sanity/lib/live'

const { data } = await sanityFetch({
  query: PAGE_QUERY,
  params: { slug, language: locale },
})
```

**GROQ Query Patterns:**

- All queries use `$language` parameter for localized field selection
- Localized fields use `coalesce()`: `"title": coalesce(title[$language], title.en, title)`
- Comprehensive query fragments in `sanity/lib/queries.ts` (HERO_FRAGMENT, PRICING_FRAGMENT, etc.)
- **Never write inline GROQ** - use or extend existing fragments from `queries.ts`

### 3. Field-Level Localization (SCHEMA PATTERN)

**All content uses field-level localization** (NOT document-level):

```typescript
// Schema pattern (see sanity/schemaTypes/product.ts)
defineField({
  name: 'title',
  type: 'object',
  fields: [
    { name: 'en', type: 'string', validation: rule => rule.required() },
    {
      name: 'es',
      type: 'string',
      hidden: ({ document }) => !document?.showTranslationFields,
    },
    {
      name: 'fr',
      type: 'string',
      hidden: ({ document }) => !document?.showTranslationFields,
    },
    {
      name: 'de',
      type: 'string',
      hidden: ({ document }) => !document?.showTranslationFields,
    },
    {
      name: 'ja',
      type: 'string',
      hidden: ({ document }) => !document?.showTranslationFields,
    },
  ],
})
```

- **Toggle Control**: `showTranslationFields` boolean hides/shows non-English fields in Studio
- **Translation Automation**: Use custom document actions: `autoCreateTranslationTask`, `exportTranslationStrings`
- **API Endpoint**: `/api/auto-translate` with OpenAI GPT-3.5-turbo (fallback: Google Translate)

### 4. Shopify Integration

**Multi-Market Shopify Instances:**

- US: `US_SHOPIFY_DOMAIN` / `US_SHOPIFY_TOKEN`
- UK: `UK_SHOPIFY_DOMAIN` / `UK_SHOPIFY_TOKEN`
- EU: `EU_SHOPIFY_DOMAIN` / `EU_SHOPIFY_TOKEN`

**Data Flow:**

1. `InventoryProvider` context wraps product pages
2. `getInventory()` server action fetches real-time pricing/stock
3. `BuyBox` component displays market-specific prices
4. `createCheckout()` generates Shopify checkout URLs with cart items

**Never hardcode prices** - always fetch from Shopify via `getInventory(variantId, market)`

### 5. Component Architecture

**Block-Based Content System:**

- `components/blocks/` contains all content blocks (Hero, River, Firecracker, etc.)
- `app/[market]/[lang]/(site)/[[...slug]]/page.tsx` - main page renderer with block type switching
- Each block type has corresponding GROQ fragment in `sanity/lib/queries.ts`

**Key Component Pattern (see [[...slug]]/page.tsx lines 235-331):**

```typescript
const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  heroProduct: HeroProduct,
  firecracker: Firecracker,
  river: River,
  // ... etc
}

content?.map(block => {
  const Component = blockComponents[block._type]
  return Component ? <Component key={block._key} {...block} /> : null
})
```

### 6. Market-Specific Formatting

**Always use `useMarketFormatting()` hook** for currency/measurements:

```typescript
const { formatPrice, formatDistance, formatWeight } = useMarketFormatting(
  market,
  language
)
```

- Handles currency symbols, decimal separators, and position
- Converts between imperial/metric based on market
- See `hooks/useMarketFormatting.ts` and `lib/i18n.ts` for config

### 7. SEO & Canonical URLs (CRITICAL)

**All pages must generate self-referencing canonical tags** to prevent duplicate content issues.

**Implementation Pattern:**

1. **Root Layout** (`app/layout.tsx`) defines `metadataBase`:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://scootorama.example'
  ),
  // ...
}
```

2. **All page routes** must export `generateMetadata` with canonical URLs:

```typescript
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { market, lang, slug } = await params
  return {
    alternates: {
      canonical: `/${market}/${lang}/${slug}`,
    },
  }
}
```

**Canonical URL Rules:**

- US default routes: `/` (NOT `/us/en/`)
- US product pages: `/products/cruiser-deluxe` (NOT `/us/en/products/cruiser-deluxe`)
- Localized pages: `/de/de/`, `/fr/fr/products/kick-stand`
- Blog posts: `/blog/slug` for US, `/${market}/${lang}/blog/slug` for localized

**Why this matters:**

- Prevents duplicate content penalties from having `/` and `/us/en/` serve the same content
- Tells search engines which URL is the "official" version
- Critical for multi-market sites with overlapping content

### 8. Trailing Slash Consistency (CRITICAL)

**Next.js Configuration** enforces strict trailing slash policy:

```typescript
// next.config.mjs
const nextConfig = {
  trailingSlash: false, // Enforce no trailing slashes
  // ...
}
```

**Behavior:**

- `trailingSlash: false` → `/products/cruiser-deluxe` (preferred) and `/products/cruiser-deluxe/` → 301 redirects to `/products/cruiser-deluxe`
- Automatic 301 redirects prevent duplicate content dilution
- Consistent URL structure across all pages

**Why this matters:**

- Search engines treat `/page` and `/page/` as different URLs
- Without enforcement, both versions can be indexed separately
- Dilutes page authority and creates duplicate content penalties
- Next.js handles redirects automatically via routing engine

### 9. Hreflang Tags (CRITICAL)

**Automatic hreflang tag generation** for all pages based on route structure.

**Implementation:**

1. **Helper function** in `lib/i18n.ts`:

```typescript
export const generateHreflangAlternates = (
  basePath: string = ''
): Record<string, string> => {
  const alternates: Record<string, string> = {}

  // Add all market/language combinations
  SUPPORTED_MARKETS.forEach(market => {
    market.languages.forEach(langCode => {
      const lang = getLanguageByCode(langCode)
      if (!lang) return

      let path = `/${market.code}/${langCode}`
      if (basePath) path += `/${basePath}`

      alternates[lang.locale] = path // e.g., 'en-US': '/us/en/products/cruiser-deluxe'
    })
  })

  alternates['x-default'] = basePath ? `/${basePath}` : '/' // US English is default
  return alternates
}
```

2. **Usage in generateMetadata**:

```typescript
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params
  return {
    alternates: {
      canonical: `/products/${slug}`,
      languages: generateHreflangAlternates(`products/${slug}`),
    },
  }
}
```

**Generated hreflang output** (example for `/products/cruiser-deluxe`):

- `en-US`: `/products/cruiser-deluxe`
- `de-DE`: `/de/de/products/cruiser-deluxe`
- `fr-FR`: `/fr/fr/products/cruiser-deluxe`
- `es-ES`: `/es/es/products/cruiser-deluxe`
- `ja-JP`: `/jp/ja/products/cruiser-deluxe`
- `x-default`: `/products/cruiser-deluxe`

**Why this matters:**

- Tells search engines about language/region variants of the same page
- Prevents wrong language version appearing in search results
- Critical for international SEO and user experience
- Google uses this to serve the correct language version to users

### 10. Dynamic SEO Metadata (CRITICAL)

**All pages support dynamic, overrideable SEO metadata** using the Next.js Metadata API.

**Implementation Pattern:**

1. **Sanity Schema** - All content types have optional SEO fields:

```typescript
// Already exists in sanity/schemaTypes/objects/seo.ts
{
  name: 'seo',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      type: 'object',
      // Localized with validation (max 60 chars)
    },
    {
      name: 'metaDescription',
      type: 'object',
      // Localized with validation (max 160 chars)
    }
  ]
}
```

2. **GROQ Queries** - Fetch SEO overrides:

```typescript
\"seoTitle\": coalesce(seo.metaTitle[$language], seo.metaTitle.en),
\"seoDescription\": coalesce(seo.metaDescription[$language], seo.metaDescription.en)
```

3. **generateMetadata Functions** - Use overrides or auto-generate:

```typescript
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { data } = await sanityFetch({ query: PAGE_QUERY, params })

  // Use SEO override if present, otherwise auto-generate from content
  const title = data?.seoTitle || `${data?.title} | Scootorama`
  const description = data?.seoDescription || 'Default description'

  return {
    title,
    description,
    alternates: { canonical, languages },
  }
}
```

**SEO Best Practices:**

**Titles:**

- Max 60 characters (Google truncates ~60)
- Format: `{Page Title} | Scootorama` or `{Product Name} | Scootorama`
- Front-load important keywords
- Must be unique per page
- Validation enforced in Sanity Studio

**Descriptions:**

- 150-160 characters ideal (Google shows ~155-160)
- Active voice, include primary keyword
- Include call-to-action when appropriate
- Must be unique per page (no duplicates)
- Validation enforced in Sanity Studio

**Why this matters:**

- SEO titles/descriptions are the first impression in search results
- Overrides allow fine-tuned optimization without changing page content
- Auto-generation ensures no pages lack metadata
- Character count validation prevents truncation

### 11. Open Graph (OG) Images (CRITICAL)

**The system automatically generates OG images** for all dynamic pages using Next.js `next/og` ImageResponse API.

**Implementation Pattern:**

All dynamic routes have corresponding `opengraph-image.tsx` files that auto-generate branded social sharing images:

- `app/[market]/[lang]/(site)/[[...slug]]/opengraph-image.tsx` (localized pages)
- `app/products/[slug]/opengraph-image.tsx` (US products)
- `app/blog/[slug]/opengraph-image.tsx` (US blog)
- `app/[market]/[lang]/(site)/blog/[slug]/opengraph-image.tsx` (localized blog)

**OG Image Structure:**

```typescript
import { ImageResponse } from 'next/og'
import { sanityFetch } from '@/sanity/lib/live'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  // 1. Fetch page data from Sanity
  const { data } = await sanityFetch({ query, params })

  // 2. Extract title/description from SEO or content
  const title = data?.seoTitle || data?.title || 'Scootorama'
  const description = data?.seoDescription || 'Default'

  // 3. Load custom fonts (Inter Bold from public/fonts/)
  const fontData = await fetch(new URL('...')).then(res => res.arrayBuffer())

  // 4. Return ImageResponse with branded template
  return new ImageResponse(
    (
      <div style={{ /* Scootorama branded design */ }}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    ),
    { ...size, fonts: [{ name: 'Inter', data: fontData }] }
  )
}
```

**Branded Template Design:**

- **Size**: 1200x630px (standard OG image dimensions)
- **Background**: Black gradient (`#000000` to `#1a1a1a`)
- **Branding**: Scootorama orange (`#FF6B00`) for logo/accents
- **Typography**: Inter Bold font, uppercase titles
- **Market Indicator**: Shows market/language code (e.g., "DE · DE")
- **Content-Specific**: Blog posts show "BLOG" badge, products show product info

**generateMetadata Integration:**

All `generateMetadata` functions include `openGraph` field:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const title = '...'
  const description = '...'
  const imageUrl = post?.hero?.image
    ? urlFor(post.hero.image).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website', // or 'article' for blog posts
      locale: languageConfig.locale,
      url: canonicalPath,
      images: imageUrl ? [imageUrl] : undefined, // Falls back to auto-generated
    },
    alternates: { canonical, languages },
  }
}
```

**Fallback Strategy:**

- Sanity `shareImage` field (manual upload) can override auto-generated images
- If manual `shareImage` exists and included in metadata `images` array, it takes precedence
- Otherwise, Next.js serves auto-generated OG image from `opengraph-image.tsx`

**Why this matters:**

- Social platforms (Twitter/X, LinkedIn, Slack, Discord) display rich previews
- Branded OG images increase click-through rates from social shares
- Auto-generation ensures every page has a proper social image
- No manual uploads required for basic pages
- Edge runtime ensures fast image generation at request time

## Development Workflows

### Running the Application

```bash
npm run dev              # Next.js dev server (port 3000)
npm run studio           # Sanity Studio (port 3333)
npm run build            # Production build
npm run typecheck        # TypeScript validation (no emit)
```

### Translation Workflows

```bash
# Monitor translation corruption
npm run monitor-corruption
npm run fix-corruption

# Flag AI-translated content
npm run flag-ai-translation

# Translate via API (from Sanity Studio document actions)
# Or use /api/auto-translate endpoint directly
```

### Key Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
US_SHOPIFY_DOMAIN / US_SHOPIFY_TOKEN
UK_SHOPIFY_DOMAIN / UK_SHOPIFY_TOKEN
EU_SHOPIFY_DOMAIN / EU_SHOPIFY_TOKEN
OPENAI_API_KEY (for translations)
```

## Common Pitfalls

❌ **DON'T**: Create separate documents per language (old i18n plugin pattern)  
✅ **DO**: Use field-level localization with language object structure

❌ **DON'T**: Use raw Sanity client or `client.fetch()`  
✅ **DO**: Use `sanityFetch` from `@/sanity/lib/live` for automatic updates

❌ **DON'T**: Write inline GROQ queries  
✅ **DO**: Use/extend fragments from `sanity/lib/queries.ts`

❌ **DON'T**: Hardcode `/us/en/` URLs  
✅ **DO**: Use `/` for US market, `/[market]/[lang]/` for others

❌ **DON'T**: Hardcode prices or currency symbols  
✅ **DO**: Fetch from Shopify and use `useMarketFormatting()` hook

❌ **DON'T**: Forget the `$language` parameter in GROQ queries  
✅ **DO**: Always pass `language: locale` in sanityFetch params

## Reference Documentation

**Essential reading** (in `docs/` directory):

- `ARCHITECTURE_GUIDE.md` - Complete system mental model
- `TRANSLATION_TECHNICAL_GUIDE.md` - Translation system implementation
- `ENTERPRISE_LOCALIZATION_GUIDE.md` - Field-level localization patterns

**Key files to understand:**

- `lib/i18n.ts` - Market/language configuration (single source of truth)
- `sanity/lib/queries.ts` - GROQ fragments (979 lines of production queries)
- `app/[market]/[lang]/(site)/[[...slug]]/page.tsx` - Main page renderer pattern
- `sanity.config.ts` - Singleton actions, localizable types, document actions

## Sanity Studio Specifics

**Singleton Types** (one instance only): `siteSettings`  
**Localizable Types** (with translation actions): `page`, `post`, `campaign`, `product`, `faqItem`, `benefit`, `feature`, `socialProof`, `pricingTier`, `author`, `tag`, `membershipPage`, `stat`

**Auto-save delay**: 10 seconds (configured to reduce re-render flickering)

**Preview Integration:**

- Visual Editor at `/studio/editor` (presentationTool)
- Preview API route: `/api/draft` (enables draft mode)
- Custom PreviewIframe component for side-by-side editing

### 12. Dynamic Robots.txt Configuration (CRITICAL)

**CMS-driven robots.txt** prevents bot traps and optimizes crawl budget.

**Implementation:**

```typescript
// app/robots.ts - Dynamic async function
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { data } = await sanityFetch({
    query: `*[_type == "siteSettings"][0]{
      "robotRules": robots{userAgent, allow, disallow, crawlDelay}
    }`,
  })

  const defaultDisallow = [
    '/studio/',
    '/api/',
    '/translation-manager/',
    '/*?*variant=*', // Variant URLs (bot trap)
    '/*?*utm_*', // UTM parameters (duplicate content)
    '/*?*ref=*', // Referral parameters (duplicate content)
  ]

  return {
    rules: [
      {
        userAgent: data?.robotRules?.userAgent || '*',
        allow: data?.robotRules?.allow || '/',
        disallow: [...defaultDisallow, ...(data?.robotRules?.disallow || [])],
        crawlDelay: data?.robotRules?.crawlDelay,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

**Query Parameter Blocking:**

- `/*?*variant=*` - Prevents crawling infinite variant URLs
- `/*?*utm_*` - Blocks UTM tracking parameters (duplicate content)
- `/*?*ref=*` - Blocks referral parameters (waste crawl budget)

**CMS Configuration:**

Navigate to **Site Settings > SEO > Robots.txt Configuration** in Sanity Studio:

- `userAgent`: Target specific bots (`*` for all)
- `allow`: Explicitly allowed paths (e.g., `/`)
- `disallow`: Additional blocked paths beyond defaults
- `crawlDelay`: Seconds between requests (for aggressive bots)

**Why this matters:**

- Prevents bot traps from query parameters creating infinite URL variations
- Saves crawl budget by blocking low-value admin/API paths
- Marketing team can adjust without code deployment
- Default blocks protect against common crawl budget waste

### 13. Automatic WebP/AVIF Image Serving (CRITICAL)

**Next.js automatically serves WebP/AVIF** based on browser support via Accept header negotiation.

**Configuration (next.config.mjs):**

```javascript
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'], // Browser-based auto-selection
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75], // Bandwidth optimized
  },
}
```

**How it works:**

1. Browser sends Accept header: `Accept: image/avif,image/webp,*/*`
2. Next.js responds with best supported format:
   - Modern browsers: **AVIF** (50% smaller than JPEG)
   - Older browsers: **WebP** (30% smaller than JPEG)
   - Fallback: **Original format** (JPEG/PNG)

**Format Selection Logic:**

- Chrome 85+, Edge: Receives AVIF
- Safari 14+, Firefox: Receives WebP
- Older browsers: Receives original JPEG/PNG

**Always use next/image component:**

```tsx
import Image from 'next/image'

// ✅ Automatic format optimization
<Image src={imageUrl} alt="..." width={800} height={600} />

// ❌ No optimization (don't use <img> tags)
<img src={imageUrl} alt="..." />
```

**Performance Impact:**

- AVIF: 50% smaller file size vs JPEG (imperceptible quality loss)
- WebP: 30% smaller file size vs JPEG
- Automatic responsive sizing based on device
- Lazy loading below the fold

**Why this matters:**

- 30-50% bandwidth reduction across all images
- Faster page loads and better Core Web Vitals
- No developer action required - fully automatic
- Browser detection ensures maximum compatibility

### 14. Alt Text Enforcement (CRITICAL)

**All images must have alt text** for accessibility (WCAG 2.1 AA) and SEO compliance.

**Three-Layer Validation:**

1. **Sanity Studio** - CMS validation prevents saving without alt text
2. **ESLint** - Build fails if next/image missing alt prop
3. **TypeScript** - Compile-time error if alt prop missing

**Sanity Enhanced Image Schema:**

```typescript
// sanity/schemaTypes/objects/enhancedImage.ts
{
  name: 'enhancedImage',
  type: 'image',
  fields: [
    {
      name: 'alt',
      type: 'string',
      validation: rule => rule.custom(alt => {
        // Required (can be empty for decorative)
        if (alt === undefined) {
          return 'Alt text required. Use empty string for decorative images.'
        }

        // Quality standards if not empty
        if (alt.length > 0) {
          if (alt.length < 10) return 'Alt text should be descriptive (min 10 chars)'
          if (alt.length > 200) return 'Alt text should be concise (max 200 chars)'
          if (alt.toLowerCase().startsWith('image of')) {
            return 'Avoid "image of" - describe what is shown'
          }
        }

        return true
      })
    },
    {
      name: 'isDecorative',
      type: 'boolean',
      validation: rule => rule.custom((isDecorative, context) => {
        const alt = context.parent?.alt

        // Decorative images must have empty alt
        if (isDecorative && alt?.length > 0) {
          return 'Decorative images must have empty alt text ("")'
        }

        // Empty alt must be marked as decorative
        if (!isDecorative && (!alt || alt.length === 0)) {
          return 'Images with empty alt must be marked as decorative'
        }

        return true
      })
    }
  ]
}
```

**ESLint Configuration:**

```javascript
// eslint.config.mjs
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      'jsx-a11y/alt-text': [
        'error',
        {
          elements: ['img'],
          img: ['Image'], // Next.js Image component
        },
      ],
    },
  },
]
```

**Alt Text Best Practices:**

```tsx
// ✅ Good: Descriptive, specific, 10-200 characters
<Image
  src="/cruiser-deluxe.jpg"
  alt="Cruiser Deluxe smart scooter with chrome fenders and streamers"
  width={1200}
  height={800}
/>

// ❌ Poor: Too vague, redundant phrase
alt="Image of a scooter"
alt="Product"
alt="Scooter"

// ✅ Decorative: Empty alt for background patterns/dividers
<Image src="/wave-pattern.svg" alt="" width={1920} height={100} />
```

**Sanity Studio User Experience:**

- Alt text field shows character counter (10-200 range)
- Real-time validation errors prevent saving
- "Decorative Image" checkbox explicitly marks decorative images
- Empty alt requires decorative checkbox (prevents accidents)

**Build-Time Enforcement:**

```bash
# ESLint errors on missing alt
npm run build
# Error: jsx-a11y/alt-text - <Image> missing alt prop
```

**Why this matters:**

- WCAG 2.1 Level AA accessibility compliance
- Google uses alt text for image search ranking
- Screen readers announce image content to visually impaired users
- Better page relevance signals for SEO
- Prevents accidental omission of critical accessibility info
