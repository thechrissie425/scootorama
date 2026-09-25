import { groq } from 'next-sanity'

/**
 * SANITY GROQ QUERY FRAGMENTS - PRODUCTION READY
 *
 * Comprehensive, modular GROQ fragments for consistent data fetching across the application.
 * Each fragment handles localization, accessibility, performance optimization, and error handling.
 *
 * === HERO FRAGMENTS (Enhanced) ===
 * ✅ HERO_FRAGMENT: Standard hero sections with full localization and CTA support
 * ✅ HERO_PRODUCT_FRAGMENT: Product-specific heroes with enhanced image metadata
 * ✅ HERO_SPLIT_FRAGMENT: Reality Breach style split heroes with video support
 *
 * === KEY FEATURES ===
 * 🌐 Complete localization support with smart fallbacks
 * 🖼️ Enhanced image metadata for performance (LQIP, aspect ratios, palette)
 * ♿ Accessibility-ready with alt text and ARIA support
 * 🔗 Comprehensive CTA handling with validation
 * 📊 Translation status tracking for content management
 * ⚡ Performance optimizations for Core Web Vitals
 *
 * @version 2.1.0
 * @author Scootorama Development Team
 * @hygiene-check ✅ Comprehensive audit completed
 */

// --- 1. FRAGMENTS (The Building Blocks) ---

const PRICING_FRAGMENT = groq`
  _type == 'pricingBlock' => {
    "title": coalesce(title[$language], title.en, title),
    layoutVariant,
    tiers[]->{
      _id,
      "title": coalesce(title[$language], title.en, title), 
      tierId,
      "tagline": coalesce(tagline[$language], tagline.en, tagline),
      "badgeText": coalesce(badgeText[$language], badgeText.en, badgeText),
      themeColor,
      "heroImage": heroImage.asset->url,
      prices,
      "ctaLabel": cta.label,
      "includedFeatures": *[_type == "feature" && ^.tierId in availability] {
        _id,
        "title": coalesce(title[$language], title.en, title),
        "pricingLabel": coalesce(pricingLabel[$language], pricingLabel.en, pricingLabel),
        "tooltipDescription": coalesce(tooltipDescription[$language], tooltipDescription.en, tooltipDescription),
        rank,
        availability
      } | order(rank asc)
    }
  }
`

// === STANDARD HERO FRAGMENT ===
// Covers the main hero schema type with comprehensive localization and accessibility
const HERO_FRAGMENT = groq`
  _type == 'hero' => {
    _key,
    _type,
    
    // Localized content fields
    "heading": coalesce(heading[$language], heading.en, heading),
    "subheading": coalesce(subheading[$language], subheading.en, subheading),
    
    // Layout and design
    layout,
    theme,
    
    // Enhanced image data with metadata
    backgroundImage {
      asset,
      hotspot,
      crop,
      alt,
      "metadata": asset->metadata {
        dimensions,
        lqip,
        palette {
          dominant {
            background,
            foreground
          }
        }
      }
    },
    
    // CTA with comprehensive link data
    cta {
      "label": coalesce(label[$language], label.en, label),
      linkType,
      externalUrl,
      internalLink->{
        _type,
        "slug": slug.current,
        "title": coalesce(title[$language], title.en, title)
      }
    },
    
    // Accessibility and performance metadata
    ariaLabel,
    priority,
    
    // Translation status for content management
    "hasTranslations": defined(heading[$language]) || defined(subheading[$language])
  }
`

// === HERO PRODUCT FRAGMENT ===
// Specialized hero for product pages with enhanced metadata and performance optimization
const HERO_PRODUCT_FRAGMENT = groq`
  _type == 'heroProduct' => {
    _key,
    _type,
    
    "eyebrow": coalesce(eyebrow[$language], eyebrow.en, eyebrow),
    "title": coalesce(title[$language], title.en, title),
    "description": coalesce(description[$language], description.en, description),
    
    productImage {
      asset,
      hotspot,
      crop,
      alt,
      "metadata": asset->metadata {
        dimensions,
        lqip,
        palette {
          dominant {
            background,
            foreground
          }
        }
      }
    },
    
    backgroundImage {
      asset,
      hotspot,
      crop,
      alt,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "lqip": asset->metadata.lqip
    },
    
    theme,
    
    "hasTranslations": defined(eyebrow[$language]) || defined(title[$language]) || defined(description[$language]),

    // 👇 CLEAN STANDARD VERSION
    "product": product->{
       "price": store.priceRange.minVariantPrice.amount,
       "originalPrice": store.compareAtPriceRange.maxVariantPrice.amount,
       "currency": store.priceRange.minVariantPrice.currencyCode,
       "shopifyVariantId": store.variants[0]->store.id,
       "fulfillment": fulfillment,
       // Standard Shopify Sync location for the thumbnail
       "thumbnail": store.previewImageUrl
    }
  }
`

const FIRECRACKER_FRAGMENT = groq`
  _type == 'firecracker' => {
    _id,
    _type,
    _key,
    layout,
    theme,
    backgroundColor,
    heading,
    subheading,
    marketingImage,
    cta,
    product->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      slug,
      image,
      stickers[]{
        "text": coalesce(label[$language], label.en, label, text),
        "label": coalesce(label[$language], label.en, label),
        color,
        style,
        rotation,
        position,
        customPosition,
        displayType,
        type,
        x,
        y,
        top,
        left,
        bottom,
        right
      },
      // Fetch ALL market data, not just current market
      markets[]{
        region,
        price,
        compareAtPrice,
        currency,
        fulfillmentMethod
      }
    },
    products[]->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      slug,
      image,
      stickers[]{
        "text": coalesce(label[$language], label.en, label, text),
        "label": coalesce(label[$language], label.en, label),
        color,
        style,
        rotation,
        position,
        customPosition,
        displayType,
        type,
        x,
        y,
        top,
        left,
        bottom,
        right
      },
      // Fetch ALL market data, not just current market
      markets[]{
        region,
        price,
        compareAtPrice,
        currency,
        fulfillmentMethod
      }
    },
    // Confetti configuration (nested object)
    confettiConfig {
      generate,
      palette
    },
    // Carousel settings (nested object)
    carouselSettings {
      autoRotate,
      rotationSpeed,
      showIndicators,
      showArrows
    },
    // Debug: Try alternative field names (these probably won't work)
    enableConfetti,
    colorPalette,
    confetti,
    confettiEnabled, 
    colors,
    confettiColors,
    // Legacy fields
    showConfetti,
    confettiColor,
    autoplay,
    autoplayDelay,
    showDots,
    showArrows
  }
`

// === HERO SPLIT FRAGMENT ===
// Reality Breach style hero with enhanced localization
const HERO_SPLIT_FRAGMENT = groq`
  _type == 'heroSplit' => {
    _id,
    _key,
    _type,
    
    // Localized content
    "heading": coalesce(heading[$language], heading.en, heading),
    "subheading": coalesce(subheading[$language], subheading.en, subheading),
    "description": coalesce(description[$language], description.en, description),
    
    // Media assets with enhanced metadata
    heroImage {
      asset,
      hotspot,
      crop,
      alt,
      "aspectRatio": asset->metadata.dimensions.aspectRatio
    },
    heroImageMobile {
      asset,
      hotspot,
      crop,
      alt
    },
    
    // Video assets
    videoHardware,
    videoSoftware,
    
    // CTA with localization
    cta {
      "label": coalesce(label[$language], label.en, label),
      linkType,
      externalUrl,
      internalLink->{
        "slug": slug.current,
        "title": coalesce(title[$language], title.en, title)
      }
    },
    
    // Layout and design
    alignment,
    theme,
    
    // Translation status
    "hasTranslations": defined(heading[$language]) || defined(subheading[$language])
  }
`

const RIVER_FRAGMENT = groq`
  _type == 'river' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    "subtitle": coalesce(subtitle[$language], subtitle.en, subtitle),
    layout,
    items[]{
      _key,
      layout, 
      source == 'reference' => {
        featureRef->{
          "title": coalesce(title[$language], title.en, title),
          "description": coalesce(description[$language], description.en, description),
          "image": {
            "asset": thumbnail.asset,
            "hotspot": thumbnail.hotspot,
            "crop": thumbnail.crop,
            "alt": thumbnail.alt
          },
          "videoUrl": video
        }
      },
      source == 'manual' => {
        "title": coalesce(title[$language], title.en, title),
        "description": coalesce(description[$language], description.en, description),
        "image": {
          "asset": image.asset,
          "hotspot": image.hotspot,
          "crop": image.crop,
          "alt": image.alt
        },
        "videoUrl": video
      }
    }
  }
`

const STATS_FRAGMENT = groq`
  _type == 'statsGrid' => {
    _key,
    _type,
    theme,
    stats[]->{
      _id,
      "label": coalesce(label[$language], label.en, label),
      smartValue
    }
  }
`

// --- SOCIAL PROOF FRAGMENT ---
const SOCIAL_PROOF_FRAGMENT = groq`
  _id,
  "quote": coalesce(quote[$language], quote.en, quote),
  "author": coalesce(author[$language], author.en, author),
  "role": coalesce(role[$language], role.en, role),
  type,
  avatar,
  publicationColor,
  starRating
`

const SOCIAL_PROOF_SECTION_FRAGMENT = groq`
  _type == 'socialProofSection' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    layout,
    items[]->{
      ${SOCIAL_PROOF_FRAGMENT}
    }
  }
`

// --- RE-ADDED MISSING FRAGMENTS ---

const CAROUSEL_FRAGMENT = groq`
  _type == 'carousel' => {
    _id,
    _key,
    _type,
    heading,
    layout,
    theme,
    // UI Control Settings - structured for component
    "carouselSettings": {
      "autoRotate": autoplay,
      "rotationSpeed": autoplayDelay,
      "showIndicators": showDots,
      "showArrows": showArrows,
      "showCounter": showCounter
    },
    loop,
    slidesToShow,
    slidesToScroll,
    items[]->{ 
      _id, 
      _type, 
      "title": coalesce(title[$language], title.en, title), 
      "thumbnail": {
        "asset": image.asset,
        "hotspot": image.hotspot,
        "crop": image.crop,
        "alt": image.alt
      },
      "description": coalesce(description[$language], description.en, description),
      "overlayHeading": coalesce(overlayHeading[$language], overlayHeading.en, overlayHeading), 
      "content": coalesce(content[$language], content.en, content), 
      "videoUrl": video 
    }
  }
`

const INSTAGRAM_VIDEO_GRID_FRAGMENT = groq`
  _type == 'instagramVideoGrid' => {
    _key,
    _type,
    "heading": coalesce(heading[$language], heading.en, heading),
    "subheading": coalesce(subheading[$language], subheading.en, subheading),
    columns,
    showCaptions,
    videos[]->{
      _id,
      _key,
      title,
      video {
        asset->{
          _id,
          url,
          mimeType,
          size
        }
      },
      thumbnail {
        asset,
        hotspot,
        crop,
        alt
      },
      username,
      instagramHandle,
      instagramPostUrl,
      caption
    }
  }
`

const FEATURES_BY_CATEGORY_FRAGMENT = groq`
  _type == 'featuresByCategory' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    "subheading": coalesce(subheading[$language], subheading.en, subheading),
    categories,
    cardLayout,
    showImages,
    showDescription,
    backgroundColor,
    maxFeaturesPerCategory,
    "features": *[_type == "feature" && featureType in ^.categories] | order(displayPriority desc, title asc) {
      _id,
      "title": coalesce(title[$language], title.en, title),
      "tagline": coalesce(tagline[$language], tagline.en, tagline),
      "description": coalesce(description[$language], description.en, description),
      featureType,
      "slug": slug.current,
      isNewFeature,
      isFeatured,
      "image": {
        "asset": {
          "url": image.asset->url
        },
        "alt": coalesce(image.alt[$language], image.alt.en, image.alt)
      }
    }
  }
`

const TRANSFORMATION_TABS_FRAGMENT = groq`
  _type == 'transformationTabs' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    "subheading": coalesce(subheading[$language], subheading.en, subheading),
    tabStyle,
    showBenefits,
    showFeatures,
    backgroundColor,
    "goals": goals[]->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      "description": coalesce(description[$language], description.en, description),
      "shortDescription": coalesce(shortDescription[$language], shortDescription.en, shortDescription),
      timeframe,
      difficulty,
      "beforeState": coalesce(beforeState[$language], beforeState.en, beforeState),
      "afterState": coalesce(afterState[$language], afterState.en, afterState),
      icon,
      "supportingBenefits": *[_type == "benefit" && references(^._id)] | order(displayPriority desc) [0...4] {
        _id,
        "title": coalesce(title[$language], title.en, title),
        emotionalCategory
      },
      "enablingFeatures": *[_type == "feature" && references(^._id)] [0...4] {
        _id,
        "title": coalesce(title[$language], title.en, title),
        "slug": slug.current
      }
    }
  }
`

const GOALS_SECTION_FRAGMENT = groq`
  _type == 'goalsSection' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    "subheading": coalesce(subheading[$language], subheading.en, subheading),
    layout,
    showTimeframe,
    showTransformation,
    "ctaText": coalesce(ctaText[$language], ctaText.en, ctaText),
    backgroundColor,
    "goals": goals[]->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      "description": coalesce(description[$language], description.en, description),
      "shortDescription": coalesce(shortDescription[$language], shortDescription.en, shortDescription),
      timeframe,
      difficulty,
      "beforeState": coalesce(beforeState[$language], beforeState.en, beforeState),
      "afterState": coalesce(afterState[$language], afterState.en, afterState),
      icon
    }
  }
`

const BENEFITS_SECTION_FRAGMENT = groq`
  _type == 'benefitsSection' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    "subheading": coalesce(subheading[$language], subheading.en, subheading),
    selectionMode,
    layout,
    showIcons,
    showLinkedFeatures,
    backgroundColor,
    maxItems,
    
    // Manual selection - resolve benefit references
    "manualBenefits": benefits[]->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      "description": coalesce(description[$language], description.en, description),
      emotionalCategory,
      displayPriority,
      displayStyle,
      icon,
      "enabledByFeatures": enabledByFeatures[]->{
        _id,
        "title": coalesce(title[$language], title.en, title),
        "slug": slug.current
      }
    },
    
    // For persona filtering
    "filterPersonaId": filterByPersona->_id,
    
    // For goal filtering  
    "filterGoalId": filterByGoal->_id,
    
    // All benefits (for filtered modes) - sorted by priority
    "allBenefits": *[_type == "benefit"] | order(displayPriority desc) {
      _id,
      "title": coalesce(title[$language], title.en, title),
      "description": coalesce(description[$language], description.en, description),
      emotionalCategory,
      displayPriority,
      displayStyle,
      icon,
      "targetPersonaIds": targetPersonas[]->_id,
      "supportsGoalIds": supportsGoals[]->_id,
      "enabledByFeatures": enabledByFeatures[]->{
        _id,
        "title": coalesce(title[$language], title.en, title),
        "slug": slug.current
      }
    }
  }
`

const FEATURE_GRID_FRAGMENT = groq`
  _type == 'featureGrid' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    layout,
    items[]{
      _key,
      _type,
      _type == 'manualItem' => {
        "title": coalesce(title[$language], title.en, title),
        "subtitle": coalesce(subtitle[$language], subtitle.en, subtitle),
        "image": {
          "asset": image.asset,
          "hotspot": image.hotspot,
          "crop": image.crop,
          "alt": image.alt
        },
        size,
        theme,
        link
      },
      _type == 'contentReference' => {
        size,
        theme,
        overrideTitle,
        overrideSubtitle,
        content->{
          _type,
          "title": coalesce(title[$language], title.en, title),
          "slug": slug.current,
          "image": {
            "asset": image.asset,
            "hotspot": image.hotspot,
            "crop": image.crop,
            "alt": image.alt
          },
          "thumbnail": {
            "asset": thumbnail.asset,
            "hotspot": thumbnail.hotspot,
            "crop": thumbnail.crop,
            "alt": thumbnail.alt
          },
          avatar,
          quote,
          hook,
          "description": coalesce(description[$language], description.en, description),
          status,
          type
        }
      }
    }
  }
`

const CONTENT_DISPLAY_FRAGMENT = groq`
  _type == 'contentDisplay' => {
    layout,
    "heading": coalesce(heading[$language], heading.en, heading),
    items[]{
      _key,
      _type,
      _type == 'manualItem' => {
        "title": coalesce(title[$language], title.en, title),
        "subtitle": coalesce(subtitle[$language], subtitle.en, subtitle),
        "image": {
          "asset": image.asset,
          "hotspot": image.hotspot,
          "crop": image.crop,
          "alt": image.alt
        },
        size,
        theme,
        link
      },
      _type == 'contentReference' => {
        size,
        theme,
        overrideTitle,
        overrideSubtitle,
        content->{
          _type,
          "title": coalesce(title[$language], title.en, title),
          "slug": slug.current,
          "image": {
            "asset": image.asset,
            "hotspot": image.hotspot,
            "crop": image.crop,
            "alt": image.alt
          },
          "thumbnail": {
            "asset": image.asset,
            "hotspot": image.hotspot,
            "crop": image.crop,
            "alt": image.alt
          },
          avatar,
          "video": video,
          "content": coalesce(content[$language], content.en, content),
          "overlayHeading": coalesce(overlayHeading[$language], overlayHeading.en, overlayHeading),
          quote,
          hook,
          "description": coalesce(description[$language], description.en, description),
          status,
          type,
        }
      },
      _type == 'carouselItem' => {
        _key,
        "title": coalesce(title[$language], title.en, title),
        "thumbnail": {
          "asset": image.asset,
          "hotspot": image.hotspot,
          "crop": image.crop,
          "alt": image.alt
        },
        "videoUrl": video,
        "overlayHeading": coalesce(overlayHeading[$language], overlayHeading.en, overlayHeading),
        "content": coalesce(content[$language], content.en, content)
      }
    }
  }
`

const TABS_FRAGMENT = groq`
  _type == 'tabs' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    items[]{
      _key,
      tabLabel,
      content->{
        _id,
        _type,
        "title": coalesce(title[$language], title.en, title),
        "description": coalesce(description[$language], description.en, description),
        "image": {
          "asset": image.asset,
          "hotspot": image.hotspot,
          "crop": image.crop,
          "alt": image.alt
        }
      },
      "customImage": {
        "asset": customImage.asset,
        "hotspot": customImage.hotspot,
        "crop": customImage.crop,
        "alt": customImage.alt
      }
    }
  }
`

const FAQ_FRAGMENT = groq`
  _type == 'faqSection' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    loadMode,
    
    // Manual selection - get referenced FAQ items with i18n
    loadMode == 'manual' => {
      "questions": questions[]->{_id, "question": coalesce(question[$language], question.en, question), "answer": coalesce(answer[$language], answer.en, answer)},
      footerLink
    },
    
    // Tag-based loading - query FAQ items by tag
    loadMode == 'tag' => {
      "questions": *[_type == 'faqItem' && references(^.filterTag._ref)] | order(_createdAt desc) [0..4]{
        _id,
        "question": coalesce(question[$language], question.en, question),
        "answer": coalesce(answer[$language], answer.en, answer)
      },
      limit,
      footerLink,
      "tagTitle": coalesce(filterTag->title[$language], filterTag->title.en, filterTag->title)
    }
  }
`

const PRODUCT_GRID_FRAGMENT = groq`
  _type == 'productGrid' => {
    "heading": coalesce(heading[$language], heading.en, heading),
    layout,
    columns,
    showPricing,
    
    // 🔴 WAS: ctaText,
    // 🟢 FIXED: Unwrap the localized string
    "ctaText": coalesce(ctaText[$language], ctaText.en, ctaText),

    products[]->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      
      // 🔴 WAS: "slug": slug.current (products don't have slugs anymore)
      // 🟢 FIXED: Fetch the slug from the related productPage
      "slug": *[_type == "productPage" && references(^._id)][0].slug.current,
      
      "description": coalesce(description[$language], description.en, description),
      "image": {
        "asset": image.asset,
        "hotspot": image.hotspot,
        "crop": image.crop,
        "alt": image.alt
      },
      "marketData": coalesce(
        markets[region == $market][0],
        markets[0]
      ){
        price,
        compareAtPrice,
        currency,
        releaseDate,
        fulfillmentMethod,
        "isNew": releaseDate > dateTime(now()) - 7776000
      },
      stickers[]->{
        "label": coalesce(label[$language], label.en, label),
        color
      }
    }
  }
`

// --- 2. THE MASTER PAGE QUERY ---
export const PAGE_QUERY = groq`{
  "page": *[_type == "page" && (
    slug.current == $slug || 
    (_id == $slug + "-" + $language && language == $language) ||
    sourceDocument == $slug
  )] | order(
    select(language == $language => 0, 1),
    _createdAt desc
  )[0]{
    _id,
    "title": coalesce(title[$language], title.en, title),
    "slug": slug.current,
    language,
    sourceDocument,
    translationMethod,
    "seoTitle": coalesce(seo.metaTitle[$language], seo.metaTitle.en),
    "seoDescription": coalesce(seo.metaDescription[$language], seo.metaDescription.en),
    content[disabled != true]{
      _type,
      _key,
      _id,
      
      // Content fragments
      ${HERO_FRAGMENT},
      ${PRICING_FRAGMENT},
      ${FIRECRACKER_FRAGMENT},
      ${HERO_SPLIT_FRAGMENT},
      ${HERO_PRODUCT_FRAGMENT},
      ${RIVER_FRAGMENT},
      ${STATS_FRAGMENT},
      ${SOCIAL_PROOF_SECTION_FRAGMENT},
      ${CAROUSEL_FRAGMENT},
      ${FEATURE_GRID_FRAGMENT},
      ${CONTENT_DISPLAY_FRAGMENT},
      ${TABS_FRAGMENT},
      ${FAQ_FRAGMENT},
      ${PRODUCT_GRID_FRAGMENT},
      ${BENEFITS_SECTION_FRAGMENT},
      ${GOALS_SECTION_FRAGMENT},
      ${TRANSFORMATION_TABS_FRAGMENT},
      ${FEATURES_BY_CATEGORY_FRAGMENT}
    }
  },
  
  // Basic settings
  "settings": *[_type == "siteSettings"][0]{
    _id,
    mainNav[]{
      _key,
      "label": coalesce(label[$language], label.en, label),
      labelLocal,
      type,
      link->{ "slug": slug.current },
      
      // Mega menu data
      featuredCard{
        heading,
        "image": {
          "asset": image.asset,
          "hotspot": image.hotspot,
          "crop": image.crop,
          "alt": image.alt
        },
        link->{ "slug": slug.current }
      },
      subLinks[]{
        _key,
        title,
        targetPage->{ "slug": slug.current },
        url,
        icon,
        "description": coalesce(description[$language], description.en, description)
      }
    },
    "copyrightText": coalesce(copyrightText[$language], copyrightText.en, copyrightText)
  }
}`

// --- MEMBERSHIP PAGE QUERY ---
export const MEMBERSHIP_PAGE_QUERY = groq`
*[_type == "membershipPage"][0]{
  "title": coalesce(title[$language], title.en, title),
  
  // Debug: Get raw references first
  "rawRefs": {
    "standard": standardTier._ref,
    "plus": plusTier._ref,
    "household": householdTier._ref
  },
  
  // 1. GET PLAN DETAILS (Price + The Critical 'tierId')
  "plans": {
    "standard": standardTier->{ 
      "price": prices[currency == "USD"][0].monthlyPrice,
      "prices": prices[currency == "USD"],
      "id": tierId,
      "title": coalesce(title[$language], title.en, title)
    },
    "plus": plusTier->{ 
      "price": prices[currency == "USD"][0].monthlyPrice,
      "prices": prices[currency == "USD"],
      "id": tierId,
      "title": coalesce(title[$language], title.en, title)
    },
    "household": householdTier->{ 
      "price": prices[currency == "USD"][0].monthlyPrice,
      "prices": prices[currency == "USD"],
      "id": tierId,
      "title": coalesce(title[$language], title.en, title)
    }
  },
  
  // 2. GET FEATURES & THEIR AVAILABILITY
  benefits[]{
    _key,
    layout,
    "media": media.asset->url,
    "mediaAspect": media.asset->metadata.dimensions.aspectRatio,
    "title": coalesce(feature->title[$language], feature->title.en, feature->title),
    "description": coalesce(feature->description[$language], feature->description.en, feature->description),
    // The Array of Tier IDs this feature is available on
    "availability": feature->availability[],
    // Debug: Get the raw feature reference
    "rawFeatureRef": feature._ref
  }
}`

// --- PRODUCT PAGE QUERIES ---

const PRODUCT_PAGE_FRAGMENT = groq`
  _id,
  _type,
  "slug": slug.current,
  
  // Referenced product data with localization
  product->{
    _id,
    "title": coalesce(title[$language], title.en, title),
    "description": coalesce(description[$language], description.en, description),
    "image": {
      "asset": image.asset,
      "hotspot": image.hotspot,
      "crop": image.crop,
      "alt": image.alt
    },
    "slug": slug.current,
    stickers[]->{
      _id,
      "label": coalesce(label[$language], label.en, label),
      color,
      type,
      position,
      customPosition
    },
    markets[]{
      region,
      currency,
      price,
      compareAtPrice,
      fulfillmentMethod,
      shopifyVariantId,
      releaseDate,
      "isNew": releaseDate > dateTime(now()) - 7776000
    }
  },
  
  // Marketing overrides (already localized)
  "marketingTitle": coalesce(marketingTitle[$language], marketingTitle.en, marketingTitle),
  
  // Computed title (marketing override or product title)
  "title": coalesce(marketingTitle[$language], marketingTitle.en, marketingTitle),
  
  // Hero section with proper localization
  hero {
    "eyebrow": coalesce(eyebrow[$language], eyebrow.en, eyebrow),
    "title": coalesce(title[$language], title.en, title),
    "description": coalesce(description[$language], description.en, description),
    productImage { 
      asset,
      hotspot,
      crop,
      alt
    },
    backgroundImage { 
      asset,
      hotspot,
      crop,
      alt
    },
    theme
  },
  
  // Marketing content modules
  features[]{
    _type,
    _key,
    ${FIRECRACKER_FRAGMENT},
    ${RIVER_FRAGMENT},
    ${STATS_FRAGMENT},
    ${CAROUSEL_FRAGMENT}
  },
  
  // Additional marketing sections (appear after tabbed content)
  additionalSections[]{
    ${INSTAGRAM_VIDEO_GRID_FRAGMENT},
    ${SOCIAL_PROOF_FRAGMENT},
    ${RIVER_FRAGMENT}
  },
  
  // Structured tech specs with automatic unit conversion
  techSpecs[]{
    category,
    specs[]{
      label,
      specType,
      value,
      minValue,
      maxValue,
      textValue,
      unit,
      description
    }
  },
  
  // Target audience segments
  whoIsItFor[]{
    title,
    subtitle,
    icon,
    features[]
  },
  
  // Product type for default audience targeting
  productType,
  
  // Legacy technical specs (PortableText)
  "specs": coalesce(specs[$language], specs.en, specs)
`

export const PRODUCT_PAGE_QUERY = groq`
*[_type == "productPage" && slug.current == $slug][0]{
  ${PRODUCT_PAGE_FRAGMENT}
}`

export const PRODUCT_PAGE_BY_MARKET_QUERY = groq`
*[_type == "productPage" && slug.current == $slug][0]{
  ${PRODUCT_PAGE_FRAGMENT},
  "seoTitle": coalesce(seo.metaTitle[$language], seo.metaTitle.en),
  "seoDescription": coalesce(seo.metaDescription[$language], seo.metaDescription.en),
  
  // Get market-specific commerce data from the referenced product
  "marketData": product->markets[region == $market][0]{
    region,
    currency,
    price,
    compareAtPrice,
    fulfillmentMethod,
    shopifyVariantId,
    releaseDate,
    "isNew": releaseDate > dateTime(now()) - 7776000
  },
  "uiLabels": *[_type == "siteSettings"][0].productPageLabels {
    productInfo,
    keyFeatures,
    techSpecs,
    whoItsFor,
    pricingUI
  }
}`

export const PRODUCT_PAGES_QUERY = groq`
*[_type == "productPage"] | order(_updatedAt desc) {
  ${PRODUCT_PAGE_FRAGMENT}
}`

// --- CAMPAIGN PAGE QUERY ---
export const CAMPAIGN_QUERY = groq`
*[_type == "campaign" && slug.current == $slug][0]{
  _id,
  "title": coalesce(title.en, title),
  status,
  dates,
  "image": image,
  "logo": logo{
    asset->{
      url
    }
  },
  primaryColor,
  secondaryColor,
  "hook": coalesce(hook.en, hook),
  mechanics,
  faqs[]->{
    "question": coalesce(question.en, question),
    "answer": answer.en
  },
  unlocks[]{
    _key,
    "name": coalesce(name.en, name),
    "requirement": coalesce(requirement.en, requirement),
    "description": coalesce(description.en, description),
    "image": image
  },
  cta{
    "label": coalesce(label.en, label),
    "url": select(
      defined(externalUrl) => externalUrl,
      internalLink->_type == "membershipPage" => "/membership",
      defined(internalLink) => "/" + internalLink->slug.current,
      url
    ),
    style
  },
  resources
}`

// --- CAMPAIGN EXPERIENCE QUERY ---
// Scroll-driven storytelling experiences (e.g., Scootorama: Unlocked)
export const CAMPAIGN_EXPERIENCE_QUERY = groq`
*[_type == "campaignExperience" && slug.current == $slug][0]{
  _id,
  "title": coalesce(title[$language], title.en, title),
  "tagline": coalesce(tagline[$language], tagline.en, tagline),
  "description": coalesce(description[$language], description.en, description),
  
  // Hero branding
  heroLogo {
    asset->{url},
    alt
  },
  themeColor,
  
  // Particle configuration
  particleConfig {
    enabled,
    style,
    colors,
    density
  },
  
  // XP configuration
  xpConfig {
    maxXP,
    showXPCounter,
    showProgressBar,
    progressBarPosition,
    velocityMultiplier
  },
  
  // Navigation settings
  navigation {
    enabled,
    style,
    position
  },
  
  // Scenes with full content
  scenes[] {
    sceneId,
    xpThreshold,
    "unlockMessage": coalesce(unlockMessage[$language], unlockMessage.en, unlockMessage),
    "headline": coalesce(headline[$language], headline.en, headline),
    "subheadline": coalesce(subheadline[$language], subheadline.en, subheadline),
    "description": coalesce(description[$language], description.en, description),
    
    // Background
    background {
      type,
      video {
        asset->{url}
      },
      image {
        asset->{url},
        alt
      },
      gradient,
      overlayOpacity
    },
    
    // Featured product reference
    featuredProduct->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      slug,
      image {
        asset->{url},
        alt
      },
      markets[] {
        region,
        price,
        compareAtPrice,
        currency
      }
    },
    
    // Features
    features[]->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      "description": coalesce(description[$language], description.en, description),
      image {
        asset->{url},
        alt
      },
      video {
        asset->{url}
      }
    },
    
    // Benefits
    benefits[]->{
      _id,
      "title": coalesce(title[$language], title.en, title),
      "description": coalesce(description[$language], description.en, description),
      icon
    },
    
    // Pricing tiers
    pricingTiers[]->{
      _id,
      tierId,
      "name": coalesce(title[$language], title.en, title),
      "description": coalesce(tagline[$language], tagline.en, tagline),
      themeColor,
      prices[] {
        region,
        amount,
        currency
      }
    },
    
    // Effects
    effects {
      confetti,
      confettiColors,
      glow,
      glowColor,
      velocityEffects
    },
    
    // CTA
    cta {
      "label": coalesce(label[$language], label.en, label),
      linkType,
      externalUrl,
      internalLink->{
        _type,
        "slug": slug.current
      }
    }
  },
  
  // SEO
  seo {
    "metaTitle": coalesce(metaTitle[$language], metaTitle.en, metaTitle),
    "metaDescription": coalesce(metaDescription[$language], metaDescription.en, metaDescription)
  },
  shareImage {
    asset->{url},
    alt
  }
}`

// 🟢 FIX: Updated _type to "siteSettings" and used 'groq'
export const SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0]{ 
    _id,
    mainNav[]{
      _key,
      "label": coalesce(labelLocal[$language], label),
      labelLocal,
      type,
      link->{ _type, "slug": slug.current },
      
      // Mega menu data with localization
      featuredCard{
        "heading": coalesce(headingLocal[$language], heading),
        "image": {
          "asset": image.asset,
          "hotspot": image.hotspot,
          "crop": image.crop,
          "alt": image.alt
        },
        link->{ _type, "slug": slug.current }
      },
      subLinks[]{
        _key,
        "title": coalesce(titleLocal[$language], title),
        targetPage->{ _type, "slug": slug.current },
        url,
        icon,
        "description": coalesce(descriptionLocal[$language], description)
      }
    },
    footerNav[]{
      _key,
      "heading": coalesce(headingLocal[$language], heading),
      headingLocal,
      links[]{
        _key,
        "label": coalesce(labelLocal[$language], label),
        labelLocal,
        url,
        targetPage->{
          slug
        }
      }
    },
    socialLinks[]{
      platform,
      url
    },
    copyrightText
  }
`
export const BLOG_POST_QUERY = groq`
  *[_type == "post" && slug.current == $slug && (!defined(__i18n_lang) || __i18n_lang == $language)][0]{
    // 🟢 1. Document-Level Fields (No coalesce needed)
    title,
    "publishedAt": _createdAt,
    excerpt,
    "seoTitle": seo.metaTitle,
    "seoDescription": seo.metaDescription,
    
    hero,

    // 🟢 2. Simple Array (No projection needed)
    keyTakeaways,

    // 🟢 3. References (Field-Level)
    // Authors and Campaigns are likely shared documents, so we still coalesce INSIDE them.
    authors[]->{
      "name": coalesce(name[$language], name.en, name),
      "role": coalesce(role[$language], role.en, role),
      image
    },

    relatedCampaign->{
      "title": coalesce(title[$language], title.en, title),
      status,
      slug
    },

    // 🟢 4. The Body
    body[]{
      ...,
      // Expand the Product Plug reference
      _type == "productPlug" => {
        ...,
        product->{
          "title": coalesce(title[$language], title.en, title),
          slug,
          prices,
          heroImage
        }
      },
      // Expand the Image reference
      _type == "image" => {
        ...,
        asset->{
          _id,
          url
        },
        caption // Plain string now
      },
      // Expand the Route reference (CRITICAL: Needs all fields)
      _type == "routeCard" => {
        ...,
        "route": route->{
           "routeId": _id,
           "name": coalesce(name[$language], name.en, name),
           world,
           sportType,
           "distance": coalesce(distance, distanceKm, 0),
           "elevation": coalesce(elevation, elevationMeters, 0),
           difficulty,
           "description": coalesce(description[$language], description.en, description),
           "highlights": coalesce(highlights[$language], highlights.en, highlights),
           heroImage,
           mapImage,
           deeplink,
           tags
        }
      },
      _type == "block" => @
    }
  }
`
