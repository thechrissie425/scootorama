# Takeover System Architecture

## Overview

The three-tier takeover system enables marketers to create and manage site-wide promotional takeovers with visual theming, targeting, A/B testing, and scheduling.

## Architecture Tiers

### Tier 1: Takeover Theme (Visual Identity)

**Schema:** `takeoverTheme.ts`

Defines the visual identity of a takeover:

- **Colors**: Primary, secondary, tertiary, accent, confetti colors
- **Effects**: Confetti, particles, glow, cursor trail
- **Typography**: Heading, body, and accent fonts
- **Branding**: Logo variants (light, dark, icon)
- **Hero Customization**: Background patterns/videos, overlay opacity
- **A/B Testing**: Variant support for visual experiments

### Tier 3: Takeover Activation (Rules & Targeting)

**Schema:** `takeoverActivation.ts`

Controls when and where takeovers appear:

- **Scheduling**: Start/end dates with manual override
- **Targeting**: Markets, user segments, exclusions
- **A/B Testing**: Multi-variant testing with traffic distribution
- **Takeover Settings**: Global, navigation, banner customization
- **Integration Points**: Firecracker, hero, product pages, checkout
- **Preview Mode**: Token-based preview before launch

### Tier 2: Sticker Library (Coming Soon)

Reusable takeover assets with template-based generation.

## Usage Examples

### Server Component Integration

```typescript
import { getActiveTakeover, generateTakeoverCSS, shouldApplyTakeoverTo } from '@/lib/takeoverManager'

export default async function Page({ params }: { params: { market: string; lang: string } }) {
  // Get active takeover for this context
  const takeover = await getActiveTakeover({
    market: params.market,
    segment: 'new-users', // From user session
    userId: 'user-123', // For A/B testing
    scope: 'takeover-pages-only',
  })

  return (
    <>
      {/* Inject CSS variables for zero-JS theming */}
      {takeover && (
        <style dangerouslySetInnerHTML={{
          __html: generateTakeoverCSS(takeover.theme)
        }} />
      )}

      {/* Apply theme to components */}
      {shouldApplyTakeoverTo(takeover, 'firecracker') && (
        <Firecracker theme={takeover.theme} />
      )}

      {shouldApplyTakeoverTo(takeover, 'hero') && (
        <Hero theme={takeover.theme} />
      )}
    </>
  )
}
```

### Preview Mode

Add `?takeover=<previewToken>` to any URL. `proxy.ts` stores the token in a
session cookie (`takeover_preview`) and redirects to the clean URL, so the
preview persists while navigating. `getActiveTakeover()` reads the cookie
automatically and returns that activation regardless of its schedule,
markets or segments (flagged with `isPreview: true`). `?takeover=off`
clears it.

```typescript
// Explicit token (overrides the cookie)
const takeover = await getActiveTakeover({
  market: 'us',
  preview: 'luau-week',
})
```

The portfolio build exposes this through the Campaign demo switcher
(`components/takeover/CampaignDemoSwitcher.tsx`), which lists every activation
with a preview token. Hide it with `NEXT_PUBLIC_CAMPAIGN_DEMO=false`.

### Site-wide theming

`generateCampaignCSS(theme)` sets `--color-brand-primary`,
`--color-brand-secondary` and `--color-brand-ink` (plus derived `-light` and
`-dark` steps) from the theme's primary, secondary and tertiary colors. The
Tailwind brand and action color scales read these variables (defaults come
from the design tokens), so every themed utility follows the takeover. Layouts
render `components/takeover/TakeoverLayer.tsx`, which injects the CSS, the
theme's effects (`TakeoverEffects`) and the demo switcher.

### A/B Testing

The system automatically assigns users to A/B test variants using deterministic hashing:

```typescript
// User "user-123" always gets the same variant
// User "user-456" might get a different variant
// Traffic distribution respects configured weights (e.g., 50/50, 70/30)
const takeover = await getActiveTakeover({
  market: 'us',
  userId: 'user-123', // Required for A/B testing
})
```

## CSS Variables

Takeovers inject CSS custom properties for zero-JS theming:

```css
:root {
  --takeover-primary: #ff6b35;
  --takeover-secondary: #004e89;
  --takeover-tertiary: #f7f7f7;
  --takeover-accent: #ffd23f;
  --takeover-font-heading: 'Bebas Neue', sans-serif;
  --takeover-font-body: 'Inter', sans-serif;
  --takeover-hero-overlay: 0.5;
  --takeover-hero-gradient: #ff6b35;
}
```

Use in components:

```css
.takeover-cta {
  background-color: var(--takeover-primary, #ff6600);
  font-family: var(--takeover-font-heading, inherit);
}
```

## Sanity Studio Workflow

### Creating a Takeover Theme

1. Navigate to **🚀 Takeover System** → **🎨 Takeover Themes**
2. Click **Create** → **Takeover Theme**
3. Fill in:
   - Theme name (e.g., "Winter Warriors 2026")
   - Color palette (primary, secondary, accent)
   - Effects (confetti, particles, glow)
   - Typography (font families)
   - Branding assets (logos, icons)
   - Hero customization
4. For A/B testing:
   - Create variant themes
   - Mark as variant with parent reference

### Creating a Takeover Activation

1. Navigate to **🚀 Takeover System** → **📅 All Activations**
2. Click **Create** → **Takeover Activation**
3. Configure:
   - **Name**: Internal reference
   - **Theme**: Select takeover theme
   - **Schedule**: Start/end dates
   - **Targeting**: Markets and user segments
   - **A/B Testing**: Enable and add variants with weights
   - **Takeover**: Global vs scoped, nav/banner customization
   - **Apply To**: Select components (firecracker, hero, etc.)
4. Publish to activate

### Preview Before Launch

1. Copy the **Preview Token** from takeover activation
2. Share URL: `https://scootorama.example?preview=YOUR_TOKEN`
3. Takeover appears even before start date

### Monitoring Active Takeovers

1. Navigate to **🚀 Takeover System** → **🎯 Active Takeovers**
2. See all currently running takeovers
3. Preview shows status emoji:
   - 🟢 Active (live now)
   - ⏰ Scheduled (future)
   - ✅ Ended (past)
   - ⏸️ Inactive (manually disabled)

## Performance Optimization

### Edge Caching (Future Enhancement)

```typescript
import { get } from '@vercel/edge-config'

// Cache takeovers at CDN edge for sub-ms lookups
const activeTakeovers = await get('active-takeovers')
```

### CSS Variables Strategy

- **Zero JavaScript overhead** - themes applied via CSS custom properties
- **Instant theme switching** - no JS bundle size impact
- **SSR-friendly** - injected server-side, no hydration mismatch

## Migration from Legacy Takeovers

Old `takeover` schema (takeover pages) are now under **Takeover Pages (Legacy)**.

New workflow:

1. Create `takeoverTheme` for visual identity
2. Create `takeoverActivation` for targeting/scheduling
3. Reference theme in activation

This separates concerns:

- **Themes** are reusable (e.g., "Holiday 2026" theme used across multiple activations)
- **Activations** control logic (when, where, who)
- **Content** remains in takeover pages or Firecracker blocks

## Next Steps

- [ ] Implement Edge Config caching for production
- [ ] Build analytics tracking for impressions/conversions
- [ ] Add Tier 2 (Sticker Library) with template generator
- [ ] Create admin dashboard for takeover performance
- [ ] Add visual preview in Sanity Studio (iframe integration)
