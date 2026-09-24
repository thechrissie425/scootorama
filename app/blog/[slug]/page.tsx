import { sanityFetch } from '@/sanity/lib/live'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import CustomPortableText from '@/components/blocks/CustomPortableText'
import SvgIcon from '@/components/ui/SvgIcon'
import { brand, absoluteUrl } from '@/lib/brand'
import calendarIcon from '@/icons/system/calendar.svg'
import { PortableTextBlock } from '@portabletext/types'
import {
  generateHreflangAlternates,
  getLanguageByCode,
  DEFAULT_LANGUAGE,
} from '@/lib/i18n'
import { generateArticleSchema } from '@/lib/structuredData'
import { StructuredData } from '@/components/StructuredData'
import { BLOG_POST_QUERY } from '@/sanity/lib/queries'

// 🟢 Force fresh data to debug the "0" issue (Remove later if needed)
export const revalidate = 0

// Helper to safely render localized content
const getLocalizedString = (
  content: string | { [key: string]: string } | null | undefined
): string => {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content?.en || Object.values(content)[0] || ''
}

// --- TYPES ---
interface PageParams {
  params: Promise<{ slug: string }>
}

interface BlogPost {
  title: string
  publishedAt: string
  excerpt?: string
  seoTitle?: string
  seoDescription?: string
  hero: {
    style: 'Standard' | 'Split' | 'Minimal' | 'Video Loop'
    image: {
      _type: 'image'
      asset: {
        _ref: string
        _type: 'reference'
      }
    }
    videoUrl?: string
  }
  keyTakeaways: string[]
  body: PortableTextBlock[]
  authors: {
    name: string
    role: string
    image: {
      _type: 'image'
      asset: {
        _ref: string
        _type: 'reference'
      }
    }
  }[]
  relatedCampaign?: {
    title: string
    slug: { current: string }
    status: string
  }
}

// --- DATA FETCHING ---
async function getPost(slug: string, language: string): Promise<BlogPost> {
  const result = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: { slug, language },
  })

  return result.data as BlogPost
}

// --- METADATA ---
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params

  // 🟢 Use your standard language logic
  // If getLanguageByCode('en') returns 'en-US', this will work perfectly.
  const lang = 'en'
  const languageConfig = getLanguageByCode(lang) || DEFAULT_LANGUAGE

  const post = await getPost(slug, languageConfig.code)

  if (!post) {
    return {
      title: 'Not Found',
    }
  }

  const title = post.seoTitle || `${post.title} | ${brand.name} Blog`
  const description =
    post.seoDescription || post.excerpt || `Read the latest from ${brand.name}`
  const imageUrl = post.hero?.image
    ? urlFor(post.hero.image).width(1200).height(630).url()
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: languageConfig.locale, // e.g. "en_US"
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      authors: post.authors?.map(author => author.name),
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `/blog/${slug}`,
      languages: generateHreflangAlternates(`blog/${slug}`),
    },
  }
}

// --- HERO COMPONENTS ---
function AuthorDateRow({
  post,
  variant = 'default',
  className = '',
}: {
  post: BlogPost
  variant?: 'default' | 'mobile' | 'mobile-inline'
  className?: string
}) {
  const baseClasses = {
    default: 'flex items-center gap-6 border-t border-brandWhite/20 pt-6',
    mobile: 'flex items-center gap-4 pb-6 border-b border-brandWhite/20',
    'mobile-inline':
      'flex items-center gap-4 pb-6 border-t border-brandWhite/20 pt-6',
  }

  const avatarSize = variant === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'

  return (
    <div className={`${baseClasses[variant]} ${className}`}>
      {post.authors?.map(author => (
        <div key={author.name} className="flex items-center gap-3">
          {author.image && (
            <div
              className={`${avatarSize} rounded-full overflow-hidden border border-brandWhite/20 relative`}
            >
              <Image
                src={urlFor(author.image).width(100).url()}
                alt={getLocalizedString(author.name)}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-heading-bold text-sm uppercase">
              {getLocalizedString(author.name)}
            </div>
            <div className="text-xs text-grey font-numeral uppercase tracking-wider">
              {variant === 'mobile'
                ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : getLocalizedString(author.role)}
            </div>
          </div>
        </div>
      ))}

      {variant !== 'mobile' && (
        <div className="flex items-center gap-2 text-sm text-grey">
          <SvgIcon src={calendarIcon} className="w-4 h-4" />
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      )}
    </div>
  )
}

function renderHeroSection(post: BlogPost) {
  switch (post.hero?.style) {
    case 'Standard':
    case 'Minimal':
    default:
      return (
        <div className="relative">
          {post.hero?.image && (
            <div className="relative h-96 lg:h-[70vh] w-full overflow-hidden">
              <Image
                src={urlFor(post.hero.image).width(1920).height(1080).url()}
                alt={getLocalizedString(post.title)}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/50 to-transparent" />
            </div>
          )}

          <div className="relative -mt-32 lg:-mt-40 z-10 max-w-4xl mx-auto px-6">
            <div className="bg-brand-ink/90 backdrop-blur-sm p-8 lg:p-12 rounded-xl border border-brandWhite/10">
              {post.relatedCampaign && (
                <span className="inline-block px-3 py-1 mb-6 border border-brand-primary text-brand-primary text-xs font-heading-bold uppercase tracking-widest rounded-full bg-brand-primary/10">
                  Part of {getLocalizedString(post.relatedCampaign.title)}
                </span>
              )}
              <h1 className="text-4xl lg:text-6xl font-display uppercase tracking-tighter leading-[0.85] mb-8 text-brandWhite">
                {getLocalizedString(post.title)}
              </h1>
              <AuthorDateRow post={post} />
            </div>
          </div>
        </div>
      )

    case 'Video Loop':
      return (
        <div className="relative h-screen w-full overflow-hidden">
          {post.hero?.videoUrl && (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={post.hero.videoUrl} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              {post.relatedCampaign && (
                <span className="inline-block px-3 py-1 mb-6 border border-brand-primary text-brand-primary text-xs font-heading-bold uppercase tracking-widest rounded-full bg-brand-primary/10">
                  Part of {getLocalizedString(post.relatedCampaign.title)}
                </span>
              )}
              <h1 className="text-4xl lg:text-7xl font-display uppercase tracking-tighter leading-[0.8] mb-8 text-brandWhite">
                {getLocalizedString(post.title)}
              </h1>
              <AuthorDateRow post={post} className="border-t-0 pt-0" />
            </div>
          </div>
        </div>
      )
  }
}

// --- PAGE COMPONENT ---
export default async function RootBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // 🟢 Use your standard logic for the root page
  // Ensures we try to load the default language data (e.g. 'en-US')

  const { slug } = await params
  const fullLocale = 'en-US'
  const sanityLang = fullLocale.split('-')[0] // 'en'
  console.log(`URL Locale: ${fullLocale} | Sanity Request: ${sanityLang}`) // Debug log

  const post = await getPost(slug, sanityLang)

  if (!post) notFound()

  const isSplitLayout = post.hero?.style === 'Split'
  const articleSchema = generateArticleSchema({
    headline: post.title,
    description: post.excerpt,
    image: post.hero?.image?.asset
      ? urlFor(post.hero.image).width(1200).height(630).url()
      : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: post.authors?.[0]
      ? {
          name: post.authors[0].name,
        }
      : undefined,
    publisher: {
      name: brand.name,
      url: brand.siteUrl,
      logo: absoluteUrl(brand.logo.mark),
    },
  })

  if (isSplitLayout) {
    return (
      <main className="min-h-screen bg-brand-ink text-brandWhite font-body selection:bg-brand-primary selection:text-brandWhite">
        <StructuredData data={articleSchema} />
        {/* Mobile Layout - Stacked */}
        <div className="lg:hidden">
          {post.hero?.image && (
            <div className="relative h-64 sm:h-80 w-full">
              <Image
                src={urlFor(post.hero.image).width(800).height(600).url()}
                alt={getLocalizedString(post.title)}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent" />
            </div>
          )}

          <div className="px-6 py-8 sm:px-8">
            <div className="mb-8">
              {post.relatedCampaign && (
                <span className="inline-block px-3 py-1 mb-6 border border-brand-primary text-brand-primary text-xs font-heading-bold uppercase tracking-widest rounded-full bg-brand-primary/10">
                  Part of {getLocalizedString(post.relatedCampaign.title)}
                </span>
              )}
              <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tighter leading-[0.9] mb-6 text-brandWhite">
                {getLocalizedString(post.title)}
              </h1>
              <AuthorDateRow post={post} variant="mobile" />
            </div>

            {post.keyTakeaways && post.keyTakeaways.length > 0 && (
              <div className="bg-brandWhite/5 border-l-4 border-brand-primary p-6 rounded-r-xl mb-8">
                <h3 className="text-brand-primary font-display uppercase text-sm tracking-widest mb-4">
                  What You&apos;ll Learn
                </h3>
                <ul className="space-y-2">
                  {post.keyTakeaways.map((point, i) => {
                    // 🟢 1. Resolve text (safely handles string or legacy object)
                    const text = getLocalizedString(point)

                    // 🟢 2. Safety Check: If empty, render NOTHING
                    if (!text) return null

                    return (
                      <li
                        key={i}
                        className="flex gap-3 text-base font-body leading-snug"
                      >
                        <span className="text-brand-primary font-bold">•</span>
                        {text}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            <div className="max-w-none">
              <CustomPortableText value={post.body} />
            </div>
          </div>
        </div>

        {/* Desktop Layout - Split Screen */}
        <div className="hidden lg:flex h-screen">
          <div className="w-1/2 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-8 py-24">
              <div className="mb-16">
                {post.relatedCampaign && (
                  <span className="inline-block px-3 py-1 mb-6 border border-brand-primary text-brand-primary text-xs font-heading-bold uppercase tracking-widest rounded-full bg-brand-primary/10">
                    Part of {post.relatedCampaign.title}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tighter leading-[0.9] mb-8 text-brandWhite">
                  {post.title}
                </h1>
                <AuthorDateRow post={post} />
              </div>

              {post.keyTakeaways && post.keyTakeaways.length > 0 && (
                <div className="bg-brandWhite/5 border-l-4 border-brand-primary p-6 rounded-r-xl mb-8">
                  <h3 className="text-brand-primary font-display uppercase text-sm tracking-widest mb-4">
                    What You&apos;ll Learn
                  </h3>
                  <ul className="space-y-2">
                    {post.keyTakeaways.map((point, i) => {
                      // 🟢 1. Resolve text (safely handles string or legacy object)
                      const text = getLocalizedString(point)

                      // 🟢 2. Safety Check: If empty, render NOTHING
                      if (!text) return null

                      return (
                        <li
                          key={i}
                          className="flex gap-3 text-base font-body leading-snug"
                        >
                          <span className="text-brand-primary font-bold">
                            •
                          </span>
                          {text}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              <div className="max-w-none pb-24">
                <CustomPortableText value={post.body} />
              </div>
            </div>
          </div>

          <div className="w-1/2 relative overflow-hidden">
            <div className="sticky top-0 h-screen">
              {post.hero?.image && (
                <Image
                  src={urlFor(post.hero.image).width(1200).height(1600).url()}
                  alt={getLocalizedString(post.title)}
                  fill
                  className="object-cover"
                  priority
                />
              )}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Standard layout
  return (
    <main className="min-h-screen bg-brand-ink text-brandWhite font-body selection:bg-brand-primary selection:text-brandWhite pb-24">
      <StructuredData data={articleSchema} />
      {renderHeroSection(post)}
      <div className="max-w-3xl mx-auto px-6">
        {post.keyTakeaways &&
          post.keyTakeaways.length > 0 &&
          post.hero?.style !== 'Standard' && (
            <div className="bg-brandWhite/5 border-l-4 border-brand-primary p-8 rounded-r-xl mb-16">
              <h3 className="text-brand-primary font-display uppercase text-sm tracking-widest mb-4">
                What You&apos;ll Learn
              </h3>
              <ul className="space-y-3">
                {post.keyTakeaways.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-lg font-body leading-snug"
                  >
                    <span className="text-brand-primary font-bold">•</span>
                    {getLocalizedString(point)}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {post.keyTakeaways &&
          post.keyTakeaways.length > 0 &&
          post.hero?.style === 'Standard' && (
            <div className="lg:hidden bg-brandWhite/5 border-l-4 border-brand-primary p-8 rounded-r-xl mb-16">
              <h3 className="text-brand-primary font-display uppercase text-sm tracking-widest mb-4">
                What You&apos;ll Learn
              </h3>
              <ul className="space-y-3">
                {post.keyTakeaways.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-lg font-body leading-snug"
                  >
                    <span className="text-brand-primary font-bold">•</span>
                    {getLocalizedString(point)}
                  </li>
                ))}
              </ul>
            </div>
          )}

        <div className="max-w-none">
          <CustomPortableText value={post.body} />
        </div>
      </div>
    </main>
  )
}
