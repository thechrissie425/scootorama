# Takeover Theme Integration Guide

## Overview

The takeover theme system allows campaign themes to override default styling across the site. This document explains how themes are applied to different components and how to extend the system.

## Architecture

### 1. Schema Configuration (`sanity/schemaTypes/takeoverActivation.ts`)

The `applyTo` field in Campaign Activations determines which components receive theme overrides:

```typescript
applyTo: {
  firecracker: boolean // Promotional banners
  hero: boolean // Hero sections (Hero, HeroSplit)
  productPages: boolean // Product detail pages (HeroProduct)
  checkout: boolean // Checkout flow (not yet implemented)
}
```

### 2. Server-Side Theme Fetching (`lib/takeoverManager.ts`)

```typescript
// Fetch active takeover for specific scope
const takeover = await getActiveTakeover({
  market: 'us',
  segment: 'all',
  scope: 'global' | 'product-pages-only' | 'campaign-pages-only',
})

// Check if theme should apply to component
if (takeover && shouldApplyCampaignTo(takeover, 'hero')) {
  // Apply theme
}
```

### 3. CSS Variable Injection

Themes generate CSS custom properties for zero-JS theming:

```typescript
generateCampaignCSS(theme) → `
  :root {
    --campaign-primary: #ff6b00;
    --campaign-secondary: #0084ff;
    --campaign-font-heading: 'Custom Font';
    --campaign-hero-overlay: 0.8;
  }
`
```

Injected in page renderers:

```tsx
{
  takeover && (
    <style
      dangerouslySetInnerHTML={{
        __html: generateCampaignCSS(takeover.theme),
      }}
    />
  )
}
```

## Component Integration

### Hero Components

**Files:**

- `components/blocks/Hero.tsx`
- `components/blocks/HeroSplit.tsx`
- `components/blocks/HeroProduct.tsx`

**Theme Props:**

```typescript
interface HeroProps extends BaseBlockProps {
  // ... other props
  takeoverTheme?: TakeoverTheme | null
}
```

**Styling Application:**

```tsx
// 1. Colors
style={{
  color: takeoverTheme?.colors?.primary?.hex || undefined,
  backgroundColor: takeoverTheme?.colors?.accent?.hex || undefined,
}}

// 2. Fonts
style={{
  fontFamily: takeoverTheme?.fonts?.heading || undefined,
}}

// 3. Effects
const textShadow = takeoverTheme?.hero?.textShadow
  ? 'drop-shadow-2xl'
  : 'drop-shadow-lg'
```

**Example - Hero Component:**

```tsx
<h1
  className="text-8xl uppercase"
  style={{
    fontFamily: takeoverTheme?.fonts?.heading,
    color: takeoverTheme?.colors?.primary?.hex,
  }}
>
  {heading}
</h1>

<Link
  href={ctaHref}
  style={{
    backgroundColor: takeoverTheme?.colors?.primary?.hex || '#ff6b00',
  }}
>
  {ctaLabel}
</Link>
```

### Firecracker Promotional Component

**File:** `components/blocks/Firecracker.tsx`

**Theme Integration:**

- **Confetti Colors**: Falls back to `confetti → secondary/tertiary/accent → defaults`
- **Confetti Density**: `low` (5), `medium` (8), `high` (12) particles
- **Particle Shapes**: `stars`, `snowflakes`, `hearts` with SVG clip paths
- **Glow Effect**: Dynamic color based on `theme.colors.primary.hex`
- **Accessibility**: Respects `prefers-reduced-motion`

### Product Pages

**File:** `app/[market]/[lang]/[[...slug]]/page.tsx`

**Implementation:**

```tsx
// Fetch theme with product-specific scope
const takeover = await getActiveTakeover({
  market: safeMarket,
  segment: 'all',
  scope: 'product-pages-only',
})

// Inject CSS
{
  takeover && shouldApplyCampaignTo(takeover, 'productPages') && (
    <style
      dangerouslySetInnerHTML={{
        __html: generateCampaignCSS(takeover.theme),
      }}
    />
  )
}

// Pass to HeroProduct
;<HeroProduct
  {...product.hero}
  takeoverTheme={
    takeover && shouldApplyCampaignTo(takeover, 'productPages')
      ? takeover.theme
      : null
  }
/>
```

## Theme Properties Reference

### Colors

```typescript
colors: {
  primary: {
    hex: '#ff6b00'
  } // Main brand color
  secondary: {
    hex: '#0084ff'
  } // Secondary accent
  tertiary: {
    hex: '#00ff88'
  } // Additional accent
  accent: {
    hex: '#ff0066'
  } // Highlight color
  confetti: [
    // Confetti particle colors
    { hex: '#ff6b00' },
    { hex: '#0084ff' },
  ]
}
```

### Fonts

```typescript
fonts: {
  heading: 'Bebas Neue' // Hero/title font
  body: 'Inter' // Body text font
  accent: 'Righteous' // Special elements
}
```

### Hero Effects

```typescript
hero: {
  backgroundPattern: Image // Background texture
  backgroundVideo: File // Background video
  overlayOpacity: 80 // 0-100
  gradientOverlay: {
    hex: '#000'
  } // Gradient color
  textShadow: true // Enhanced shadows
}
```

### Effects

```typescript
effects: {
  confetti: true // Enable confetti
  confettiDensity: 'low' | 'medium' | 'high'
  particles: 'none' | 'stars' | 'snowflakes' | 'hearts'
  glow: true // CTA glow effect
}
```

## Adding Theme Support to New Components

### 1. Update Type Definition

```typescript
// types/index.ts
import { TakeoverTheme } from '@/lib/takeoverManager'

export interface BlockContext {
  market?: string
  language?: string
  takeoverTheme?: TakeoverTheme | null // Add this
}
```

### 2. Add Prop to Component

```typescript
// components/blocks/YourComponent.tsx
import { TakeoverTheme } from '@/lib/takeoverManager'

interface YourComponentProps extends BaseBlockProps {
  // ... other props
  takeoverTheme?: TakeoverTheme | null
}

export default function YourComponent({
  // ... other props
  takeoverTheme,
}: YourComponentProps) {
  // Apply theme
}
```

### 3. Apply Dynamic Styles

```tsx
<div
  style={{
    backgroundColor: takeoverTheme?.colors?.primary?.hex,
    fontFamily: takeoverTheme?.fonts?.body,
  }}
>
  {/* Content */}
</div>
```

### 4. Use Fallback Patterns

```tsx
// Tailwind classes with conditional removal
className={cn(
  'bg-orange text-white',  // Default
  takeoverTheme && '!bg-transparent'  // Remove when themed
)}
style={{
  backgroundColor: takeoverTheme?.colors?.primary?.hex || undefined
}}
```

### 5. Pass Theme from Page Renderer

```tsx
// app/[market]/[lang]/[[...slug]]/page.tsx
case 'yourComponent':
  return (
    <YourComponent
      key={section._key}
      {...section}
      market={safeMarket}
      language={safeLang}
      takeoverTheme={
        takeover && shouldApplyCampaignTo(takeover, 'hero')
          ? takeover.theme
          : null
      }
    />
  )
```

### 6. Update Schema (if needed)

```typescript
// sanity/schemaTypes/takeoverActivation.ts
applyTo: {
  fields: [
    // ... existing fields
    {
      name: 'yourComponent',
      title: 'Your Component',
      type: 'boolean',
      initialValue: false,
    },
  ]
}
```

## Scope Targeting

Different scopes allow granular theme application:

| Scope                 | Use Case                | Example                      |
| --------------------- | ----------------------- | ---------------------------- |
| `global`              | Homepage, all pages     | Site-wide Black Friday theme |
| `product-pages-only`  | Product detail pages    | Product launch campaigns     |
| `campaign-pages-only` | Specific campaign pages | Event landing pages          |

```typescript
const takeover = await getActiveTakeover({
  market: 'us',
  segment: 'all',
  scope: 'product-pages-only', // Only applies to product pages
})
```

## Best Practices

### 1. Always Provide Fallbacks

```tsx
// ❌ BAD - breaks if no theme
style={{ color: takeoverTheme.colors.primary.hex }}

// ✅ GOOD - graceful fallback
style={{ color: takeoverTheme?.colors?.primary?.hex || '#ff6b00' }}
```

### 2. Conditional Tailwind Classes

```tsx
// Remove default classes when theme is active
className={cn(
  'text-orange',  // Default
  !takeoverTheme && 'bg-orange',  // Only if no theme
  takeoverTheme && 'bg-transparent'  // Override when themed
)}
```

### 3. CSS Variable Pattern

```tsx
// Use CSS variables for gradual adoption
<div className="text-[var(--campaign-primary,#ff6b00)]">
  Themed text with fallback
</div>
```

### 4. Accessibility

```tsx
// Respect motion preferences
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

const confettiEnabled =
  takeoverTheme?.effects?.confetti && !prefersReducedMotion
```

### 5. TypeScript Safety

```tsx
// Use optional chaining for nested properties
const glowColor = takeoverTheme?.colors?.primary?.hex
const headingFont = takeoverTheme?.fonts?.heading
```

## Testing Themes

### 1. Preview Mode

Access campaigns via preview token:

```
https://scootorama.example/?preview=abc123xyz
```

### 2. Market-Specific Testing

```
/us/en/  → US theme
/uk/en/  → UK theme
/de/de/  → EU theme
```

### 3. A/B Testing

Themes automatically select variant based on user ID:

```typescript
abTest: {
  enabled: true,
  variants: [
    { theme: themeA, weight: 50 },
    { theme: themeB, weight: 50 }
  ]
}
```

## Troubleshooting

### Theme Not Applying

1. **Check activation is active**: `isActive: true` and dates valid
2. **Verify market targeting**: Market must be in `targeting.markets`
3. **Confirm scope**: `scope` must match page type
4. **Check applyTo flags**: Component must have `applyTo.hero: true`

### Colors Not Showing

1. **Verify hex format**: Must be `#RRGGBB` format
2. **Check CSS specificity**: Inline styles should override classes
3. **Inspect element**: Look for `style="color: #ff6b00"` in DOM

### Fonts Not Loading

1. **Ensure font is loaded**: Add to `app/globals.css` or `<link>` tag
2. **Use exact font name**: Must match `font-family` value
3. **Fallback fonts**: Always provide fallback in CSS

## Current Implementation Status

✅ **Implemented:**

- Firecracker promotional component
- Hero section (Hero, HeroSplit)
- Product pages (HeroProduct)
- Server-side theme fetching
- CSS variable generation
- A/B testing support
- Market targeting
- Preview mode

❌ **Not Implemented:**

- Checkout flow theming
- Navigation bar override
- Global banner
- Analytics tracking integration

## Related Documentation

- [FIRECRACKER_OPTIMIZATION_REPORT.md](./FIRECRACKER_OPTIMIZATION_REPORT.md) - Firecracker-specific theming
- [TAKEOVER_SYSTEM_ARCHITECTURE.md](./TAKEOVER_SYSTEM_ARCHITECTURE.md) - Overall system design
- [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) - Application architecture
