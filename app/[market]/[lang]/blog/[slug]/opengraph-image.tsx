import { ImageResponse } from 'next/og'
import { brand } from '@/lib/brand'
import { sanityFetch } from '@/sanity/lib/live'
import { getLanguageByCode } from '@/lib/i18n'

export const runtime = 'edge'
export const alt = `${brand.name} Blog`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

interface PageParams {
  params: Promise<{ market: string; lang: string; slug: string }>
}

async function getPost(slug: string, language: string) {
  const result = await sanityFetch({
    query: `
    *[_type == "post" && slug.current == $slug][0]{
      "title": coalesce(title[$language], title.en, title),
      "excerpt": coalesce(excerpt[$language], excerpt.en, excerpt),
    }`,
    params: { slug, language },
  })
  return result.data
}

export default async function Image({ params }: PageParams) {
  const { market, lang, slug } = await params
  const languageConfig = getLanguageByCode(lang)
  const post = await getPost(slug, languageConfig?.code || 'en')

  const title = post?.title || `${brand.name} Blog`
  const excerpt = post?.excerpt || `Read the latest from ${brand.name}`

  // Load the Bungee display font
  const fontData = await fetch(
    new URL('../../../../../public/fonts/Bungee-Regular.woff', import.meta.url)
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
      {/* Blog badge */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#D6117A',
          color: '#000000',
          padding: '12px 24px',
          borderRadius: '9999px',
          fontSize: 24,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        BLOG
      </div>

      {/* Title */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
          marginTop: 40,
        }}
      >
        <h1
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        {excerpt && (
          <p
            style={{
              fontSize: 28,
              color: '#aaaaaa',
              lineHeight: 1.4,
              maxWidth: '90%',
            }}
          >
            {excerpt}
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
          {market.toUpperCase()} · {lang.toUpperCase()}
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
