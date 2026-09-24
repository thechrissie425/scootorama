import { ImageResponse } from 'next/og'
import { brand } from '@/lib/brand'
import { sanityFetch } from '@/sanity/lib/live'
import { PRODUCT_PAGE_BY_MARKET_QUERY } from '@/sanity/lib/queries'
import { DEFAULT_LANGUAGE } from '@/lib/i18n'

export const runtime = 'edge'
export const alt = `${brand.name} Gear`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

interface PageParams {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: PageParams) {
  const { slug } = await params

  // Fetch product data
  const { data: product } = await sanityFetch({
    query: PRODUCT_PAGE_BY_MARKET_QUERY,
    params: {
      slug,
      language: DEFAULT_LANGUAGE.code,
      market: 'US',
    },
  })

  const title = product?.seoTitle || product?.hero?.title || brand.name
  const description =
    product?.seoDescription || product?.hero?.description || brand.tagline

  // Load the Bungee display font
  const fontData = await fetch(
    new URL('../../../public/fonts/Bungee-Regular.woff', import.meta.url)
  ).then(res => res.arrayBuffer())

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #241E3A 0%, #5B2FC9 100%)',
        padding: '80px',
      }}
    >
      {/* Title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: 20,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              fontSize: 32,
              color: '#aaaaaa',
              lineHeight: 1.4,
              maxWidth: '80%',
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer with brand wordmark */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#D6117A',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          {brand.wordmark}
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#666666',
            textTransform: 'uppercase',
          }}
        >
          PRODUCTS
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Bungee',
          data: fontData,
          style: 'normal',
          weight: 900,
        },
      ],
    }
  )
}
