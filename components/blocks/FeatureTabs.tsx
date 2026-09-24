'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getImageProps } from '@/lib/imageHelpers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// 👇 Import shared types
import { BaseBlockProps, LocalizedString, SanityImage } from '@/types'

// Helper to safely render localized content
const getLocalized = (
  content: LocalizedString | undefined,
  language: string = 'en'
): string => {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content[language] || content.en || Object.values(content)[0] || ''
}

// 2. DEFINE THE DATA SHAPE
interface TabItem {
  _key: string
  tabLabel: string
  content: {
    _id?: string
    _type?: string
    title: LocalizedString
    description: LocalizedString
    image: SanityImage
  } | null
  customImage?: SanityImage
}

// 👇 Extend BaseBlockProps to accept context from page.tsx
export interface FeatureTabsProps extends BaseBlockProps {
  heading?: LocalizedString
  items: TabItem[]
  title?: LocalizedString
  subtitle?: LocalizedString
  theme?: 'light' | 'dark'
  // Support for alternative tabs structure
  tabs?: Array<{
    _key?: string
    title?: string
    subtitle?: string
    features?: Array<{
      _id?: string
      title?: string
      description?: string
      icon?: SanityImage
    }>
    benefits?: Array<{
      _id?: string
      title?: string
      description?: string
      icon?: SanityImage
    }>
  }>
}

export function FeatureTabs({
  heading,
  items,
  title,
  subtitle,
  theme = 'light',
  tabs,
  // 👇 Receive context props (prevents TS error)
  market: _market = 'us',
  language = 'en',
}: FeatureTabsProps) {
  // Resolve localized strings
  const resolvedHeading = getLocalized(heading, language)
  const resolvedTitle = getLocalized(title, language)
  const resolvedSubtitle = getLocalized(subtitle, language)

  const displayTitle = resolvedTitle || resolvedHeading

  // Handle items array
  const displayItems = items && items.length > 0 ? items : []

  // If new tabs structure is provided, transform it to legacy format for compatibility
  // Note: This transformation assumes the data inside 'tabs' is already strings,
  // or simple objects. If they are localized, this mapping logic might need adjustment.
  const transformedItems =
    (tabs?.map((tab, index) => ({
      _key: tab._key || `tab-${index}`,
      tabLabel: tab.title || `Tab ${index + 1}`,
      content: {
        title: tab.subtitle || tab.title || '',
        description:
          tab.features?.map(f => f.description).join(' ') ||
          tab.benefits?.map(b => b.description).join(' ') ||
          '',
        image: tab.features?.[0]?.icon || tab.benefits?.[0]?.icon,
      },
      customImage: undefined,
    })) as TabItem[]) || []

  const finalItems = displayItems.length > 0 ? displayItems : transformedItems

  if (finalItems.length === 0) return null

  // Default to the first tab being open
  const defaultTab = finalItems[0]._key

  return (
    <section
      className={cn(
        'py-24',
        theme === 'dark' ? 'bg-brand-ink text-white' : 'bg-white text-brand-ink'
      )}
    >
      <div className="container mx-auto px-4">
        {/* HEADING */}
        {displayTitle && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading-bold mb-4">
              {displayTitle}
            </h2>
            {resolvedSubtitle && (
              <p className="text-lg text-muted-foreground">
                {resolvedSubtitle}
              </p>
            )}
          </div>
        )}

        {/* TABS ROOT */}
        <Tabs defaultValue={defaultTab} className="flex flex-col items-center">
          {/* MENU */}
          <TabsList className="mb-12 h-auto p-1 bg-muted/50 rounded-full border">
            {finalItems.map(item => (
              <TabsTrigger
                key={item._key}
                value={item._key}
                className="rounded-full px-6 py-2 text-base data-[state=active]:bg-brand-primary data-[state=active]:text-white transition-all"
              >
                {item.tabLabel}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* CONTENT PANELS */}
          {finalItems.map(item => {
            const content = item.content
            const displayImage = item.customImage || content?.image

            if (!content) return null

            const contentTitle = getLocalized(content.title, language)
            const contentDesc = getLocalized(content.description, language)

            // Generate optimized image props
            const imageProps = getImageProps(
              displayImage,
              'feature',
              contentTitle
            )

            return (
              <TabsContent
                key={item._key}
                value={item._key}
                className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* TEXT */}
                  <div className="space-y-6 text-center md:text-left">
                    <h3 className="text-3xl font-heading-bold tracking-tight">
                      {contentTitle}
                    </h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {contentDesc}
                    </p>
                  </div>

                  {/* IMAGE */}
                  {imageProps?.src && (
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-muted">
                      <Image
                        {...imageProps}
                        alt={imageProps.alt || contentTitle || 'Feature image'}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
