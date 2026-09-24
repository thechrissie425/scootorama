'use client'
import { HelpCircleIcon } from '@sanity/icons'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import {
  BrandAccordion,
  BrandAccordionContent,
  BrandAccordionItem,
  BrandAccordionTrigger,
} from '@/components/ui/BrandAccordion'

// Helper function to get localized string
const getLocalizedString = (
  value: string | { [key: string]: string },
  language: string = 'en'
): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[language] || value.en || Object.values(value)[0] || ''
  }
  return ''
}

interface FAQ {
  question: string | { [key: string]: string }
  answer: PortableTextBlock[]
}

interface FAQAccordionProps {
  faqs: FAQ[]
  locale?: string
}

export default function FAQAccordion({
  faqs,
  locale = 'en',
}: FAQAccordionProps) {
  return (
    <div className="mb-32">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-display uppercase tracking-tight mb-4 flex items-center justify-center gap-4">
          <HelpCircleIcon className="w-12 h-12 text-brand-primary" />
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Questions & Answers
          </span>
        </h2>
        <p className="text-lg text-white/60 font-body">
          Everything you need to know
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <BrandAccordion>
          {faqs.map((faq, i) => (
            <BrandAccordionItem key={i} value={`item-${i}`}>
              <BrandAccordionTrigger>
                <h3 className="font-heading-bold text-xl md:text-2xl text-white group-hover:text-brand-primary transition-colors duration-300 text-left">
                  {getLocalizedString(faq.question)
                    .replace(
                      /[\u200B-\u200D\uFEFF\u2028\u2029\u202A-\u202E]/g,
                      ''
                    )
                    .trim()}
                </h3>
              </BrandAccordionTrigger>

              <BrandAccordionContent>
                <div className="text-white/80 leading-relaxed prose prose-invert prose-lg max-w-none prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline">
                  <PortableText value={faq.answer} />
                </div>
              </BrandAccordionContent>
            </BrandAccordionItem>
          ))}
        </BrandAccordion>
      </div>
    </div>
  )
}
