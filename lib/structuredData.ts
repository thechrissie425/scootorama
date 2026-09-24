/**
 * Structured Data (Schema.org JSON-LD) Utilities
 * Generates SEO-optimized structured data for pages
 */

interface OrganizationData {
  name: string
  url: string
  logo: string
  sameAs?: string[]
}

interface ProductData {
  name: string
  description?: string
  image?: string
  price?: number
  currency?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  brand?: string
  sku?: string
  url?: string
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface ArticleData {
  headline: string
  description?: string
  image?: string
  datePublished?: string
  dateModified?: string
  author?: {
    name: string
    url?: string
  }
  publisher?: OrganizationData
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(
  data: OrganizationData
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: {
      '@type': 'ImageObject',
      url: data.logo,
    },
    ...(data.sameAs && { sameAs: data.sameAs }),
  }
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(data: ProductData): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    ...(data.description && { description: data.description }),
    ...(data.image && {
      image: {
        '@type': 'ImageObject',
        url: data.image,
      },
    }),
    ...(data.brand && {
      brand: {
        '@type': 'Brand',
        name: data.brand,
      },
    }),
    ...(data.sku && { sku: data.sku }),
  }

  // Add offers if price is available
  if (data.price) {
    schema.offers = {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency || 'USD',
      availability: `https://schema.org/${data.availability || 'InStock'}`,
      ...(data.url && { url: data.url }),
    }
  }

  return schema
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate Article structured data
 */
export function generateArticleSchema(data: ArticleData): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.headline,
    ...(data.description && { description: data.description }),
    ...(data.image && {
      image: {
        '@type': 'ImageObject',
        url: data.image,
      },
    }),
    ...(data.datePublished && { datePublished: data.datePublished }),
    ...(data.dateModified && { dateModified: data.dateModified }),
    ...(data.author && {
      author: {
        '@type': 'Person',
        name: data.author.name,
        ...(data.author.url && { url: data.author.url }),
      },
    }),
    ...(data.publisher && {
      publisher: {
        '@type': 'Organization',
        name: data.publisher.name,
        logo: {
          '@type': 'ImageObject',
          url: data.publisher.logo,
        },
      },
    }),
  }
}

/**
 * Generate WebSite structured data
 */
export function generateWebSiteSchema(
  url: string,
  name: string
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Render JSON-LD script tag
 */
export function renderStructuredData(
  data: Record<string, any> | Record<string, any>[]
): string {
  const schemas = Array.isArray(data) ? data : [data]
  return schemas
    .map(
      schema =>
        `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
    )
    .join('\n')
}
