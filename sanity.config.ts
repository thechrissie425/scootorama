// 1. IMPORTS
import React from 'react'
import { documentInternationalization } from '@sanity/document-internationalization'
import { visionTool } from '@sanity/vision'
import { defineConfig, type SanityDocument } from 'sanity'
import { structureTool, type StructureBuilder } from 'sanity/structure'
import { presentationTool, defineLocations } from 'sanity/presentation'
import { colorInput } from '@sanity/color-input'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { HOME_SLUG } from './lib/brand'
import PreviewIframe from './sanity/components/PreviewIframe'
import {
  autoCreateTranslationTask,
  autoCreateOnPublish,
  exportTranslationStrings,
} from './sanity/lib/documentActions'
import { assist } from '@sanity/assist'
import {
  EditIcon,
  ImagesIcon,
  EarthGlobeIcon,
  CogIcon,
  RocketIcon,
  CheckmarkCircleIcon,
} from '@sanity/icons'

// --- 2. CONFIGURATION CONSTANTS ---
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const singletonTypes = new Set(['siteSettings'])

const localizableTypes = new Set([
  'page',
  'post',
  'campaign',
  'campaignExperience',
  'product',
  'productPage',
  'faqItem',
  'benefit',
  'feature',
  'socialProof',
  'pricingTier',
  'author',
  'tag',
  'membershipPage',
  'stat',
  'takeoverTheme',
  'takeoverActivation',
  'persona',
  'fitnessGoal',
])

// --- 3. URL RESOLVER ---
// sanity.config.ts

function resolveUrl(doc: SanityDocument) {
  const slug = (doc?.slug as { current?: string })?.current

  console.log('🔮 Resolving URL for:', slug, 'returning: /us/en')

  // 1. Force the locale (stops "en-US" redirects)
  const baseUrl = '/us/en'

  // 2. HOMEPAGE TRAP: If slug is your home slug, stop here.
  if (slug === HOME_SLUG || !slug) {
    return baseUrl // Returns "/us/en"
  }

  // 3. Normal pages
  switch (doc._type) {
    case 'post':
    case 'blogPost':
      return `${baseUrl}/blog/${slug}`
    case 'product':
      return `${baseUrl}/products/${slug}`
    case 'campaign':
      return `${baseUrl}/campaigns/${slug}`
    default:
      return `${baseUrl}/${slug}`
  }
}

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  document: {
    unstable_autoSave: {
      delay: 10000,
    },
    actions: (input, context) => {
      if (singletonTypes.has(context.schemaType)) {
        return input.filter(
          ({ action }) => action && singletonActions.has(action)
        )
      }
      if (localizableTypes.has(context.schemaType)) {
        return [
          ...input,
          autoCreateTranslationTask,
          exportTranslationStrings,
          autoCreateOnPublish,
        ]
      }
      return input
    },
  },
  plugins: [
    structureTool({
      // --- 4. CUSTOM SIDEBAR STRUCTURE ---
      // We explicitly type 'S' as StructureBuilder to fix the red squiggles
      structure: (S: StructureBuilder) =>
        S.list()
          .title('Content')
          .items([
            // A. CONTENT CREATION FOLDER
            S.listItem()
              .title('Content Creation')
              .icon(EditIcon)
              .child(
                S.list()
                  .title('Content Creation')
                  .items([
                    S.documentTypeListItem('page').title('Pages'),
                    S.documentTypeListItem('productPage').title(
                      'Product Marketing Pages'
                    ),
                    S.documentTypeListItem('post').title('Blog Posts'),
                    S.documentTypeListItem('campaign').title(
                      'Campaigns / Events'
                    ),
                    S.documentTypeListItem('campaignExperience').title(
                      'Campaign Experiences'
                    ),
                    // Based on your file list, the name is likely 'membershipPage'
                    S.documentTypeListItem('membershipPage').title(
                      'Membership'
                    ),
                  ])
              ),

            // B. TAKEOVER SYSTEM FOLDER
            S.listItem()
              .title('Takeover System')
              .icon(RocketIcon)
              .child(
                S.list()
                  .title('Takeover System')
                  .items([
                    S.documentTypeListItem('takeoverTheme').title(
                      'Takeover Themes'
                    ),
                    S.documentTypeListItem('takeoverActivation').title(
                      'Takeover Activations'
                    ),
                  ])
              ),

            // C. CONTENT LIBRARY FOLDER
            S.listItem()
              .title('Content Library')
              .icon(ImagesIcon)
              .child(
                S.list()
                  .title('Content Library')
                  .items([
                    S.documentTypeListItem('product').title('Products'),
                    S.divider(),
                    S.documentTypeListItem('feature').title('Features'),
                    S.documentTypeListItem('benefit').title('Benefits'),
                    S.documentTypeListItem('socialProof').title('Social Proof'),
                    S.documentTypeListItem('pricingTier').title(
                      'Pricing Tiers'
                    ),
                    S.divider(),
                    S.documentTypeListItem('persona').title('Personas'),
                    S.documentTypeListItem('fitnessGoal').title(
                      'Fitness Goals'
                    ),
                    S.divider(),
                    S.documentTypeListItem('author').title('Authors'),
                    S.documentTypeListItem('faqItem').title('FAQs'),
                    S.documentTypeListItem('stat').title('Stats / Metrics'),
                    S.documentTypeListItem('route').title('Routes'),
                  ])
              ),

            S.divider(),

            // D. TRANSLATION CENTER FOLDER
            S.listItem()
              .title('Translation Center')
              .icon(EarthGlobeIcon)
              .child(
                S.list()
                  .title('Translation Center')
                  .items([
                    S.listItem()
                      .title('Auto-Translation Dashboard')
                      .child(
                        S.component(() => {
                          const AutoTranslationDashboard = React.lazy(
                            () =>
                              import('./sanity/components/AutoTranslationDashboard')
                          )
                          return React.createElement(
                            React.Suspense,
                            {
                              fallback: React.createElement(
                                'div',
                                {},
                                'Loading...'
                              ),
                            },
                            React.createElement(AutoTranslationDashboard)
                          )
                        }).title('Automated Translation Management')
                      ),
                    // THIS WAS THE CRASHER:
                    S.documentTypeListItem('translationStatus').title(
                      'Translation Management'
                    ),
                  ])
              ),

            // E. VALIDATION TASKS
            S.listItem()
              .title('Validation Tasks')
              .icon(CheckmarkCircleIcon)
              .child(
                S.documentList()
                  .title('Validation Tasks')
                  // Ensure you actually have a schema named 'validationTask'
                  .filter('_type == "validationTask"')
              ),

            S.divider(),

            // F. SITE CONFIGURATION
            S.listItem()
              .title('Site Configuration')
              .icon(CogIcon)
              .child(
                S.list()
                  .title('Site Configuration')
                  .items([
                    S.listItem()
                      .title('Site Settings')
                      .child(
                        S.document()
                          .schemaType('siteSettings')
                          .documentId('siteSettings')
                      ),
                    // Only uncomment if you have 'aiContext' schema
                    // S.documentTypeListItem('aiContext').title('AI Context'),
                  ])
              ),
          ]),

      // --- 5. PREVIEW LOGIC ---
      // We explicitly type the arguments to fix the red squiggles
      defaultDocumentNode: (
        S: StructureBuilder,
        { schemaType }: { schemaType: string }
      ) => {
        if (localizableTypes.has(schemaType)) {
          return S.document().views([
            S.view.form(),
            S.view
              .component(PreviewIframe)
              .title('Preview')
              .options({
                url: (doc: SanityDocument) => {
                  const path = resolveUrl(doc)
                  const baseUrl =
                    process.env.NODE_ENV === 'production'
                      ? 'https://your-production-domain.com'
                      : 'http://localhost:3000'

                  return `${baseUrl}${path}`
                },
              }),
          ])
        }
        return S.document().views([S.view.form()])
      },
    }),
    colorInput(),
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      name: 'editor',
      title: 'Visual Editor',

      // 1. THIS ENABLED THE COOKIE (The Handshake)
      previewUrl: {
        origin:
          typeof location === 'undefined'
            ? 'http://localhost:3000'
            : location.origin, // Uses the current URL automatically
        draftMode: {
          enable: '/api/draft', // Hits your route.ts
        },
      },

      // 2. THIS TELLS IT WHERE TO GO (The Navigation)
      resolve: {
        locations: {
          page: defineLocations({
            select: { slug: 'slug.current' },
            resolve: doc =>
              doc?.slug
                ? {
                    locations: [
                      { title: 'Preview', href: `/us/en/${doc.slug}` },
                    ],
                  }
                : null,
          }),
          post: defineLocations({
            select: { slug: 'slug.current' },
            resolve: doc =>
              doc?.slug
                ? {
                    locations: [
                      { title: 'Preview', href: `/us/en/blog/${doc.slug}` },
                    ],
                  }
                : null,
          }),
          product: defineLocations({
            select: { slug: 'slug.current' },
            resolve: doc =>
              doc?.slug
                ? {
                    locations: [
                      { title: 'Preview', href: `/us/en/products/${doc.slug}` },
                    ],
                  }
                : null,
          }),
          campaign: defineLocations({
            select: { slug: 'slug.current' },
            resolve: doc =>
              doc?.slug
                ? {
                    locations: [
                      {
                        title: 'Preview',
                        href: `/us/en/campaigns/${doc.slug}`,
                      },
                    ],
                  }
                : null,
          }),
        },
      },
    }),
    assist({
      translate: {
        document: {
          languageField: 'language',
        },
      },
    }),
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'fr', title: 'French' },
        { id: 'de', title: 'German' },
        { id: 'es', title: 'Spanish' },
        { id: 'ja', title: 'Japanese' },
      ],
      schemaTypes: ['post'], // 👈 ONLY apply to "post" (and maybe "page")
    }),
  ],
})
