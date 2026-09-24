'use client'

import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PortableText } from '@portabletext/react'
// 👇 Import the standard type for Rich Text content
import type { PortableTextBlock } from '@portabletext/types'
// 👇 Import your shared types (removed PortableText from here)
import { BaseBlockProps, LocalizedString } from '@/types'

// Helper
function getLocalized(text?: LocalizedString, lang: string = 'en') {
  if (!text) return ''
  if (typeof text === 'string') return text
  return text[lang] || text.en || Object.values(text)[0] || ''
}

// --- Types ---
interface FaqItem {
  _id?: string
  question: LocalizedString
  // 👇 Use the correct standard type here
  answer: PortableTextBlock[]
}

// 👇 Extend BaseBlockProps
export interface FaqSectionProps extends BaseBlockProps {
  heading?: LocalizedString
  questions?: FaqItem[]
  theme?: 'light' | 'dark'
  loadMode?: 'manual' | 'tag'
  limit?: number
  tagTitle?: string
  footerLink?: {
    title?: string
    href?: string
  }
}

export function FaqSection({
  heading = 'Frequently Asked Questions',
  questions = [],
  theme = 'light',
  loadMode,
  tagTitle,
  footerLink,
  // 👇 Receive context props from page loop
  market = 'us',
  language = 'en',
}: FaqSectionProps) {
  if (!questions || questions.length === 0) return null

  // Localize Heading
  const headingText = getLocalized(heading, language)
  const displayTitle =
    loadMode === 'tag' && tagTitle
      ? `${headingText} - ${tagTitle}`
      : headingText

  return (
    <section
      className={cn(
        'py-24',
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
      )}
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-heading-bold text-center mb-12">
          {displayTitle}
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {questions.map((item, idx) => (
            <AccordionItem
              key={item._id || idx}
              value={item._id || `item-${idx}`}
              className="border-b-slate-200 dark:border-b-slate-800"
            >
              <AccordionTrigger className="text-lg font-heading-bold hover:no-underline hover:text-brand-primary transition-colors text-left">
                {getLocalized(item.question, language)}
              </AccordionTrigger>

              <AccordionContent className="text-base text-muted-foreground prose dark:prose-invert max-w-none pt-2 pb-4">
                {/* The PortableText component renders the block array */}
                <PortableText value={item.answer} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {footerLink?.href && (
          <div className="text-center mt-8">
            <a
              href={footerLink.href}
              className="inline-flex items-center text-brand-primary hover:text-brand-primary-dark font-heading-semibold"
            >
              {footerLink.title || 'View all questions'}
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
