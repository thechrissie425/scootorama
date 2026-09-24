import type { StructureResolver } from 'sanity/structure'
import { CogIcon } from '@sanity/icons'
import { apiVersion } from './env'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = S =>
  S.list()
    .title('Content')
    .items([
      // MAIN CONTENT SECTION
      S.listItem()
        .title('📝 Content Creation')
        .child(
          S.list()
            .title('Create & Edit Content')
            .items([
              S.listItem()
                .title('Product Pages')
                .schemaType('productPage')
                .child(S.documentTypeList('productPage')),
              S.listItem()
                .title('🎮 Game Campaigns')
                .id('gameCampaigns')
                .schemaType('campaign')
                .child(S.documentTypeList('campaign')),
              S.listItem()
                .title('Blog Posts')
                .schemaType('post')
                .child(S.documentTypeList('post')),
              S.listItem()
                .title('Pages')
                .schemaType('page')
                .child(S.documentTypeList('page')),
              S.listItem()
                .title('Products')
                .schemaType('product')
                .child(S.documentTypeList('product')),
              S.listItem()
                .title('Membership')
                .schemaType('membershipPage')
                .child(S.documentTypeList('membershipPage')),
            ])
        ),

      S.divider(),

      // TAKEOVER SYSTEM
      S.listItem()
        .title('🎯 Takeover System')
        .id('takeoverSystem')
        .child(
          S.list()
            .title('Takeover Management')
            .id('takeoverManagement')
            .items([
              S.listItem()
                .title('🔥 Active Takeovers')
                .id('activeTakeovers')
                .schemaType('takeoverActivation')
                .child(
                  S.documentTypeList('takeoverActivation')
                    .title('Takeover Activations')
                    .filter('_type == "takeoverActivation" && isActive == true')
                ),
              S.listItem()
                .title('📅 All Activations')
                .id('allTakeoverActivations')
                .schemaType('takeoverActivation')
                .child(S.documentTypeList('takeoverActivation')),
              S.listItem()
                .title('🎨 Takeover Themes')
                .id('takeoverThemes')
                .schemaType('takeoverTheme')
                .child(S.documentTypeList('takeoverTheme')),
            ])
        ),

      S.divider(),

      // CONTENT LIBRARY
      S.listItem()
        .title('📚 Content Library')
        .child(
          S.list()
            .title('Content Components')
            .items([
              S.listItem()
                .title('📦 Products')
                .schemaType('product')
                .child(S.documentTypeList('product')),
              S.listItem()
                .title('✨ Features')
                .schemaType('feature')
                .child(S.documentTypeList('feature')),
              S.listItem()
                .title('👤 Authors')
                .schemaType('author')
                .child(S.documentTypeList('author')),
              S.listItem()
                .title('🏷️ Tags')
                .schemaType('tag')
                .child(S.documentTypeList('tag')),
              S.listItem()
                .title('❓ FAQ Items')
                .schemaType('faqItem')
                .child(S.documentTypeList('faqItem')),
              S.listItem()
                .title('📊 Social Proof')
                .child(
                  S.list()
                    .title('Social Proof Content')
                    .items([
                      S.listItem()
                        .title('💬 Testimonials')
                        .schemaType('socialProof')
                        .child(S.documentTypeList('socialProof')),
                      S.listItem()
                        .title('📱 Instagram Videos')
                        .schemaType('instagramVideoCard')
                        .child(S.documentTypeList('instagramVideoCard')),
                    ])
                ),
              S.listItem()
                .title('💎 Benefits')
                .schemaType('benefit')
                .child(S.documentTypeList('benefit')),
              S.listItem()
                .title('📈 Stats')
                .schemaType('stat')
                .child(S.documentTypeList('stat')),
              S.listItem()
                .title('💰 Pricing Tiers')
                .schemaType('pricingTier')
                .child(S.documentTypeList('pricingTier')),
              S.listItem()
                .title('🏆 Stickers')
                .schemaType('sticker')
                .child(S.documentTypeList('sticker')),
              S.listItem()
                .title('🛴 Routes')
                .schemaType('route')
                .child(
                  S.documentTypeList('route')
                    .title('All Routes')
                    .filter('_type == "route"')
                    .defaultOrdering([{ field: 'world', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // VALIDATION TASKS SECTION
      S.listItem()
        .title('✅ Validation Tasks')
        .child(
          S.list()
            .title('Content Quality Tasks')
            .items([
              S.listItem()
                .title('🔴 Open Tasks')
                .child(
                  S.documentTypeList('validationTask')
                    .title('Open Validation Tasks')
                    .filter('_type == "validationTask" && status == "open"')
                    .apiVersion(apiVersion)
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),
              S.listItem()
                .title('🟡 In Progress')
                .child(
                  S.documentTypeList('validationTask')
                    .title('Tasks In Progress')
                    .filter(
                      '_type == "validationTask" && status == "in_progress"'
                    )
                    .apiVersion(apiVersion)
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),
              S.listItem()
                .title('🔴 Critical Issues')
                .child(
                  S.documentTypeList('validationTask')
                    .title('Critical Validation Issues')
                    .filter(
                      '_type == "validationTask" && severity == "critical" && status != "resolved"'
                    )
                    .apiVersion(apiVersion)
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),
              S.listItem()
                .title('📋 All Tasks')
                .schemaType('validationTask')
                .child(
                  S.documentTypeList('validationTask').defaultOrdering([
                    { field: 'createdAt', direction: 'desc' },
                  ])
                ),
            ])
        ),

      S.divider(),

      // TRANSLATION MANAGEMENT SECTION
      S.listItem()
        .title('🌐 Translation Center')
        .child(
          S.list()
            .title('Translation Management')
            .items([
              S.listItem()
                .title('📊 Translation Dashboard')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('All Translation Projects')
                    .menuItems([
                      S.menuItem()
                        .title('Create Translation Task')
                        .action('create')
                        .params({ type: 'translationStatus' }),
                    ])
                ),

              S.listItem()
                .title('🤖 Automated Tasks')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('Auto-Generated Tasks')
                    .filter(
                      '_type == "translationStatus" && autoGenerated == true'
                    )
                    .apiVersion(apiVersion)
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),

              S.listItem()
                .title('🔴 High Priority')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('High Priority Tasks')
                    .filter(
                      '_type == "translationStatus" && priority == "high"'
                    )
                    .apiVersion(apiVersion)
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),

              S.listItem()
                .title("👤 Ismael's Tasks")
                .child(
                  S.documentTypeList('translationStatus')
                    .title('Tasks for Ismael Parra')
                    .filter(
                      '_type == "translationStatus" && defaultTranslator == "Ismael Parra"'
                    )
                    .apiVersion(apiVersion)
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),

              S.listItem()
                .title('⏳ Not Started')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('Tasks Not Started')
                    .filter(
                      '_type == "translationStatus" && (languages.spanish.status == "not_started" || languages.french.status == "not_started" || languages.german.status == "not_started" || languages.japanese.status == "not_started")'
                    )
                    .apiVersion(apiVersion)
                    .defaultOrdering([
                      { field: 'createdAt', direction: 'desc' },
                    ])
                ),

              S.listItem()
                .title('🔴 Critical Priority')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('Critical Translation Tasks')
                    .filter('priority == "critical"')
                    .apiVersion(apiVersion)
                ),

              S.listItem()
                .title('📋 Ready for Translation')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('Ready for Translation')
                    .filter(
                      'languages.german.status == "not_started" || languages.french.status == "not_started" || languages.spanish.status == "not_started" || languages.japanese.status == "not_started"'
                    )
                    .apiVersion(apiVersion)
                ),

              S.listItem()
                .title('🔄 In Progress')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('Translation In Progress')
                    .filter(
                      'languages.german.status == "in_progress" || languages.french.status == "in_progress" || languages.spanish.status == "in_progress" || languages.japanese.status == "in_progress"'
                    )
                    .apiVersion(apiVersion)
                ),

              S.listItem()
                .title('🔵 Needs Review')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('Translation Review Required')
                    .filter(
                      'languages.german.status == "review" || languages.french.status == "review" || languages.spanish.status == "review" || languages.japanese.status == "review"'
                    )
                    .apiVersion(apiVersion)
                ),

              S.listItem()
                .title('✅ Completed')
                .child(
                  S.documentTypeList('translationStatus')
                    .title('Translation Complete')
                    .filter(
                      'languages.german.status == "complete" && languages.french.status == "complete" && languages.spanish.status == "complete" && languages.japanese.status == "complete"'
                    )
                    .apiVersion(apiVersion)
                ),

              S.divider(),

              S.listItem()
                .title('📈 By Content Type')
                .child(
                  S.list()
                    .title('Translation by Content Type')
                    .items([
                      S.listItem()
                        .title('🛍️ Product Pages')
                        .child(
                          S.documentTypeList('translationStatus')
                            .filter('contentType == "productPage"')
                            .apiVersion(apiVersion)
                        ),
                      S.listItem()
                        .title('🎯 Campaigns')
                        .child(
                          S.documentTypeList('translationStatus')
                            .filter('contentType == "campaign"')
                            .apiVersion(apiVersion)
                        ),
                      S.listItem()
                        .title('📝 Blog Posts')
                        .child(
                          S.documentTypeList('translationStatus')
                            .filter('contentType == "post"')
                            .apiVersion(apiVersion)
                        ),
                      S.listItem()
                        .title('📦 Products')
                        .child(
                          S.documentTypeList('translationStatus')
                            .filter('contentType == "product"')
                            .apiVersion(apiVersion)
                        ),
                      S.listItem()
                        .title('✨ Features')
                        .child(
                          S.documentTypeList('translationStatus')
                            .filter('contentType == "feature"')
                            .apiVersion(apiVersion)
                        ),
                      S.listItem()
                        .title('👤 Authors')
                        .child(
                          S.documentTypeList('translationStatus')
                            .filter('contentType == "author"')
                            .apiVersion(apiVersion)
                        ),
                      S.listItem()
                        .title('🏷️ Tags')
                        .child(
                          S.documentTypeList('translationStatus')
                            .filter('contentType == "tag"')
                            .apiVersion(apiVersion)
                        ),
                      S.listItem()
                        .title('❓ FAQ Items')
                        .child(
                          S.documentTypeList('translationStatus')
                            .filter('contentType == "faqItem"')
                            .apiVersion(apiVersion)
                        ),
                    ])
                ),
            ])
        ),

      S.divider(),

      // SETTINGS
      S.listItem()
        .title('⚙️ Site Configuration')
        .child(
          S.list()
            .title('Site Settings')
            .items([
              S.listItem()
                .title('⚙️ Site Settings')
                .schemaType('siteSettings')
                .id('siteSettings')
                .icon(CogIcon)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
            ])
        ),
    ])
