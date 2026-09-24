import { cookies } from 'next/headers'
import { sanityFetch } from '@/sanity/lib/live'
import { groq } from 'next-sanity'
import { TAKEOVER_PREVIEW_COOKIE } from '@/lib/takeoverPreview'

/**
 * Campaign Theme from Sanity
 */
export interface TakeoverTheme {
  _id: string
  name: string
  slug: { current: string }
  colors: {
    primary?: { hex: string }
    secondary?: { hex: string }
    tertiary?: { hex: string }
    accent?: { hex: string }
    confetti?: Array<{ hex: string }>
  }
  effects?: {
    confetti?: boolean
    confettiDensity?: 'low' | 'medium' | 'high'
    particles?: 'none' | 'stars' | 'snowflakes' | 'hearts'
    glow?: boolean
  }
  fonts?: {
    heading?: string
    body?: string
    accent?: string
  }
  branding?: {
    logo?: any
    logoLight?: any
    logoDark?: any
    icon?: any
  }
  hero?: {
    backgroundPattern?: any
    backgroundVideo?: any
    overlayOpacity?: number
    gradientOverlay?: { hex: string }
    textShadow?: boolean
  }
}

/**
 * Campaign Activation from Sanity
 */
export interface TakeoverActivation {
  _id: string
  name: string
  theme: TakeoverTheme
  startDate: string
  endDate: string
  isActive: boolean
  targeting: {
    markets: string[]
    segments: string[]
    excludeSegments?: string[]
  }
  abTest?: {
    enabled: boolean
    variants?: Array<{
      theme: TakeoverTheme
      weight: number
    }>
    conversionGoal?: string
  }
  takeover?: {
    enabled: boolean
    scope?: 'global' | 'campaign-pages-only' | 'product-pages-only'
    navBar?: {
      backgroundColor?: { hex: string }
      logo?: any
    }
    globalBanner?: {
      enabled: boolean
      text?: Record<string, string>
      backgroundColor?: { hex: string }
      ctaText?: Record<string, string>
      ctaUrl?: string
    }
  }
  applyTo?: {
    firecracker?: boolean
    hero?: boolean
    productPages?: boolean
    checkout?: boolean
  }
  previewToken?: string
  /** True when this takeover was selected by a preview token, not the schedule */
  isPreview?: boolean
}

const ACTIVATION_PROJECTION = groq`{
    _id,
    name,
    theme->{
      _id,
      name,
      slug,
      colors,
      effects,
      fonts,
      branding,
      hero
    },
    startDate,
    endDate,
    isActive,
    targeting,
    abTest{
      enabled,
      variants[]{
        theme->{
          _id,
          name,
          slug,
          colors,
          effects,
          fonts,
          branding,
          hero
        },
        weight
      },
      conversionGoal
    },
    takeover,
    applyTo,
    previewToken
  }`

/**
 * GROQ query for active campaigns
 */
const ACTIVE_CAMPAIGNS_QUERY = groq`
  *[_type == "takeoverActivation"
    && isActive == true
    && dateTime(startDate) <= dateTime(now())
    && dateTime(endDate) >= dateTime(now())
  ] ${ACTIVATION_PROJECTION}
`

/** Preview ignores schedule and targeting so a takeover can be reviewed before launch */
const PREVIEW_CAMPAIGN_QUERY: string = groq`
  *[_type == "takeoverActivation" && previewToken == $previewToken][0] ${ACTIVATION_PROJECTION}
`

/** Summary of every takeover that can be previewed (for the campaign demo switcher) */
export interface TakeoverSummary {
  name: string
  description?: string
  previewToken: string
  startDate: string
  endDate: string
  isActive: boolean
  markets: string[]
  scope?: string
  primary?: string
  secondary?: string
}

export async function getTakeoverCatalog(): Promise<TakeoverSummary[]> {
  const { data } = (await sanityFetch({
    query: groq`*[_type == "takeoverActivation" && defined(previewToken)] | order(startDate asc) {
      name,
      description,
      previewToken,
      startDate,
      endDate,
      isActive,
      "markets": targeting.markets,
      "scope": takeover.scope,
      "primary": theme->colors.primary.hex,
      "secondary": theme->colors.secondary.hex
    }`,
    params: {},
  })) as { data: TakeoverSummary[] | null }
  return data || []
}

/** Preview token stored by proxy.ts from ?takeover=<token>, if any */
export async function getPreviewToken(): Promise<string | undefined> {
  try {
    return (await cookies()).get(TAKEOVER_PREVIEW_COOKIE)?.value
  } catch {
    // Outside a request scope (e.g. static generation)
    return undefined
  }
}

/**
 * Options for getting active campaign
 */
export interface GetActiveCampaignOptions {
  market: string
  segment?: string
  userId?: string
  preview?: string // Preview token
  scope?: 'global' | 'campaign-pages-only' | 'product-pages-only'
}

/**
 * Simple hash function for deterministic A/B variant assignment
 * Same user always gets same variant
 */
function hashUserId(userId: string): number {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

/**
 * Select A/B test variant based on user ID
 * Uses deterministic hashing to ensure consistency
 */
function selectVariant(
  variants: Array<{ theme: TakeoverTheme; weight: number }>,
  userId: string
): TakeoverTheme {
  const hash = hashUserId(userId)
  const bucket = hash % 100 // 0-99

  let cumulative = 0
  for (const variant of variants) {
    cumulative += variant.weight
    if (bucket < cumulative) {
      return variant.theme
    }
  }

  // Fallback to first variant
  return variants[0].theme
}

/**
 * Get the active campaign for current context
 * Server-side only - uses sanityFetch for automatic revalidation
 */
export async function getActiveTakeover(
  options: GetActiveCampaignOptions
): Promise<TakeoverActivation | null> {
  const { market, segment = 'all', userId, scope } = options
  const normalizedMarket = market.toLowerCase()
  const normalizedSegment = segment.toLowerCase()

  // Preview token (explicit option, else the cookie set by proxy.ts)
  const preview = options.preview ?? (await getPreviewToken())
  if (preview) {
    const { data: previewCampaign } = (await sanityFetch({
      query: PREVIEW_CAMPAIGN_QUERY,
      params: { previewToken: preview },
    })) as { data: TakeoverActivation | null }
    if (previewCampaign) {
      return { ...previewCampaign, isPreview: true }
    }
  }

  // Fetch all active campaigns
  const { data: campaigns } = (await sanityFetch({
    query: ACTIVE_CAMPAIGNS_QUERY,
    params: {},
  })) as { data: TakeoverActivation[] | null }

  if (!campaigns || campaigns.length === 0) {
    return null
  }

  // Filter by targeting rules
  const targetedCampaigns = campaigns.filter((campaign: TakeoverActivation) => {
    const campaignMarkets = (campaign.targeting?.markets || []).map(m =>
      m.toLowerCase()
    )

    // Check market targeting
    if (!campaignMarkets.includes(normalizedMarket)) {
      return false
    }

    // Check segment targeting
    const segments = (campaign.targeting?.segments || []).map(s =>
      s.toLowerCase()
    )
    if (!segments.includes('all') && !segments.includes(normalizedSegment)) {
      return false
    }

    // Check excluded segments
    const excludeSegments = (campaign.targeting?.excludeSegments || []).map(s =>
      s.toLowerCase()
    )
    if (excludeSegments.includes(normalizedSegment)) {
      return false
    }

    // Check takeover scope if provided
    if (scope && campaign.takeover?.enabled) {
      if (
        campaign.takeover.scope !== 'global' &&
        campaign.takeover.scope !== scope
      ) {
        return false
      }
    }

    return true
  })

  if (targetedCampaigns.length === 0) {
    return null
  }

  // Pick the most relevant active campaign:
  // 1) campaigns with takeover enabled first
  // 2) then the most recent by startDate
  const campaign = [...targetedCampaigns].sort((a, b) => {
    const aEnabled = a.takeover?.enabled ? 1 : 0
    const bEnabled = b.takeover?.enabled ? 1 : 0
    if (aEnabled !== bEnabled) {
      return bEnabled - aEnabled
    }

    const aStart = Date.parse(a.startDate || '') || 0
    const bStart = Date.parse(b.startDate || '') || 0
    return bStart - aStart
  })[0]

  // Handle A/B testing
  if (campaign.abTest?.enabled && campaign.abTest.variants && userId) {
    // Select variant based on user ID
    const selectedTheme = selectVariant(campaign.abTest.variants, userId)
    return {
      ...campaign,
      theme: selectedTheme,
    }
  }

  return campaign
}

/**
 * Generate CSS custom properties from campaign theme
 * For zero-JS theme application
 */
const hexToRgb = (hex: string): [number, number, number] | null => {
  const h = hex.replace('#', '').trim()
  const full = h.length === 3 ? h.replace(/./g, c => c + c) : h
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Mix a color toward white (amount > 0) or black (amount < 0) */
const shade = ([r, g, b]: [number, number, number], amount: number) => {
  const target = amount > 0 ? 255 : 0
  const t = Math.abs(amount)
  return [r, g, b].map(c => Math.round(c + (target - c) * t)).join(' ')
}

/**
 * Overrides a themeable Tailwind color scale (see tailwind.config.ts). Light
 * and dark steps are derived so hovers, borders and gradients follow along.
 */
function themeScaleVars(name: string, hex?: string): string[] {
  const rgb = hex ? hexToRgb(hex) : null
  if (!rgb) return []
  return [
    `--color-${name}: ${rgb.join(' ')};`,
    `--color-${name}-light: ${shade(rgb, 0.3)};`,
    `--color-${name}-dark: ${shade(rgb, -0.25)};`,
  ]
}

export function generateCampaignCSS(theme: TakeoverTheme): string {
  // Site-wide re-skin: every brand-primary / brand-secondary / brand-ink
  // utility (buttons, badges, links, dark sections) follows the theme.
  const vars: string[] = [
    ...themeScaleVars('brand-primary', theme.colors?.primary?.hex),
    ...themeScaleVars('brand-secondary', theme.colors?.secondary?.hex),
    ...themeScaleVars('brand-ink', theme.colors?.tertiary?.hex),
  ]

  // Colors
  if (theme.colors?.primary?.hex) {
    vars.push(`--campaign-primary: ${theme.colors.primary.hex};`)
  }
  if (theme.colors?.secondary?.hex) {
    vars.push(`--campaign-secondary: ${theme.colors.secondary.hex};`)
  }
  if (theme.colors?.tertiary?.hex) {
    vars.push(`--campaign-tertiary: ${theme.colors.tertiary.hex};`)
  }
  if (theme.colors?.accent?.hex) {
    vars.push(`--campaign-accent: ${theme.colors.accent.hex};`)
  }

  // Fonts
  if (theme.fonts?.heading) {
    vars.push(`--campaign-font-heading: ${theme.fonts.heading};`)
  }
  if (theme.fonts?.body) {
    vars.push(`--campaign-font-body: ${theme.fonts.body};`)
  }
  if (theme.fonts?.accent) {
    vars.push(`--campaign-font-accent: ${theme.fonts.accent};`)
  }

  // Hero effects
  if (theme.hero?.overlayOpacity !== undefined) {
    vars.push(`--campaign-hero-overlay: ${theme.hero.overlayOpacity / 100};`)
  }
  if (theme.hero?.gradientOverlay?.hex) {
    vars.push(`--campaign-hero-gradient: ${theme.hero.gradientOverlay.hex};`)
  }

  return `:root { ${vars.join(' ')} }`
}

/**
 * Check if campaign should apply to specific component
 */
export function shouldApplyCampaignTo(
  campaign: TakeoverActivation | null,
  component: 'firecracker' | 'hero' | 'productPages' | 'checkout'
): boolean {
  if (!campaign || !campaign.applyTo) return false
  return campaign.applyTo[component] === true
}
