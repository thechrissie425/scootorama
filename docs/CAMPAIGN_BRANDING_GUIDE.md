# Campaign Branding Guide

_Updated: January 10, 2026_

## Overview

Campaigns support two levels of branding customization:

1. **Campaign Logo & Colors**: Basic branding for campaign identity (this guide)
2. **Takeover Themes**: Advanced theming system for full site takeovers (see [Takeover Integration Guide](./TAKEOVER_INTEGRATION_GUIDE.md))

This guide covers the **basic campaign branding fields** available in all campaign documents.

## Branding Fields

### 1. Campaign Logo

- **Field**: `logo` (Image)
- **Location**: Campaign schema → Overview tab
- **Recommended**: Transparent PNG, minimum 400px wide
- **Usage**: Displays above campaign title in hero section
- **Impact**: Replaces or complements the default Scootorama branding with campaign-specific identity

### 2. Primary Color

- **Field**: `primaryColor` (Color picker)
- **Location**: Campaign schema → Overview tab
- **Default**: Hot Pink (#F85A17)
- **Usage Applied To**:
  - Background gradients (ambient glow effects)
  - Status badge indicator
  - Calendar date text
  - CTA button background
  - Title gradient (start color)
  - Section header gradients
  - Unlock card hover borders
  - Step number badges
  - Resource card hover effects
  - Resource link icons

### 3. Secondary Color

- **Field**: `secondaryColor` (Color picker)
- **Location**: Campaign schema → Overview tab
- **Default**: Scootorama Blue (#1CA0FB)
- **Usage Applied To**:
  - Background gradients (complementary glow)
  - Title gradient (end color)
  - Section header gradients (end color)
  - Unlock requirement badges

## Visual Implementation

### Color Theming Strategy

The component uses CSS custom properties for dynamic theming:

```tsx
style={{
  '--campaign-primary': primaryColor,
  '--campaign-secondary': secondaryColor,
}}
```

### Gradient Formula

Custom branded campaigns use a sophisticated three-color gradient:

```
primary → white → secondary
```

This creates a premium, high-end look that maintains readability while showcasing brand colors.

### Hover Effects

Interactive elements smoothly transition to brand colors:

- **CTA buttons**: Reverse gradient direction on hover
- **Unlock cards**: Border color shifts to primary with glow
- **Step numbers**: Enhanced shadow with primary color
- **Resource cards**: Border and text shift to primary

### Fallback Behavior

If no branding is set:

- Colors default to Hot Pink and Blue
- Standard Scootorama branding maintained
- No logo displayed
- Classic Scootorama gradient patterns used

## Design Philosophy

### Sharp & Classy

1. **Premium Materials**: Glass morphism with backdrop blur effects
2. **Sophisticated Shadows**: Multi-layered shadows using brand colors
3. **Smooth Animations**: 300-500ms transitions for refined interactions
4. **Color Discipline**: Brand colors used intentionally, not overwhelmingly
5. **Contrast Balance**: White text with colored accents, never sacrificing readability

### Brand Consistency

- Logo maintains aspect ratio and drop shadow
- Colors are consistently applied across all interactive elements
- Gradients flow in consistent directions (left to right for titles)
- Hover states are predictable and cohesive

## Examples

### Tour de Scootorama

```
Logo: Tour de Scootorama official logo
Primary: #FF6B00 (Tour Orange)
Secondary: #0047AB (Tour Blue)
```

### Scootorama Racing League

```
Logo: ZRL championship badge
Primary: #DC2626 (Racing Red)
Secondary: #FBBF24 (Gold)
```

### Training Camp

```
Logo: Camp emblem
Primary: #10B981 (Performance Green)
Secondary: #8B5CF6 (Recovery Purple)
```

## Technical Notes

### Performance

- Inline styles used for dynamic colors (no CSS-in-JS overhead)
- Mouse events handle hover effects (CSS can't access JS variables)
- Logo uses Next.js Image optimization
- Gradients pre-calculated in component, not on every render

### Browser Compatibility

- CSS custom properties supported in all modern browsers
- Fallback colors ensure graceful degradation
- Background gradients use standard CSS syntax

### Accessibility

- Color contrast maintained with white text
- Logo has descriptive alt text
- Interactive elements have visible focus states
- Brand colors don't interfere with status indicators (active/completed)

## Best Practices

### Choosing Colors

1. **High Contrast**: Ensure colors pop against black background
2. **Energy Level**: Bright, saturated colors for active campaigns
3. **Complementary**: Choose colors that work well together in gradients
4. **Brand Alignment**: Match official campaign/partner colors
5. **Test at Scale**: Preview on different screen sizes

### Logo Guidelines

1. **Transparency**: Use PNG with transparent background
2. **Scalability**: Vector or high-resolution raster (2x minimum)
3. **Simplicity**: Clear and readable at various sizes
4. **Color**: Can be full color, monochrome, or use campaign colors
5. **Spacing**: Ensure logo has internal padding/breathing room

### When to Customize

- **Major events**: Tour de Scootorama, ZRL Championships
- **Brand partnerships**: Guest campaigns, collaborations
- **Special occasions**: Holidays, anniversaries, milestone events
- **Unique themes**: When campaign has distinct visual identity

### When to Use Defaults

- **Standard events**: Weekly group rides, regular races
- **Ongoing programs**: Basic training plans, achievement series
- **Quick campaigns**: Short-duration or promotional events
- **Scootorama-branded**: Events without external partners

## Advanced Theming

For **full site takeovers** with advanced features, use the **Takeover System**:

### Takeover vs. Basic Branding

| Feature           | Basic Branding (This Guide)     | Takeover System                                             |
| ----------------- | ------------------------------- | ----------------------------------------------------------- |
| Logo              | ✅ Yes                          | ✅ Yes (via sticker library)                                |
| Colors            | ✅ 2 colors (primary/secondary) | ✅ 5+ colors (primary/secondary/tertiary/accent/confetti[]) |
| Fonts             | ❌ No                           | ✅ Custom Google Fonts (heading/body/accent)                |
| Confetti          | ❌ No                           | ✅ Customizable colors, density, particle shapes            |
| Gradient Overlays | ❌ No                           | ✅ Dynamic hero backgrounds                                 |
| Market Targeting  | ❌ No                           | ✅ Market-specific activations                              |
| A/B Testing       | ❌ No                           | ✅ Built-in variant support                                 |
| Component Scope   | ❌ Campaign pages only          | ✅ Heroes, Firecracker, Product Pages                       |
| CSS Injection     | ❌ No                           | ✅ Server-side CSS variables                                |

**When to use Takeover System:**

- Black Friday / Cyber Monday sales
- Major product launches (e.g., Cruiser Deluxe)
- Partnership campaigns requiring full branding
- Events needing confetti and special effects

**See:** [Takeover Integration Guide](./TAKEOVER_INTEGRATION_GUIDE.md) for implementation.

## Future Enhancements

Basic branding enhancements under consideration:

- **Tertiary color**: For even more variety
- **Typography options**: Custom fonts per campaign (or use Takeover System)
- **Pattern overlays**: Geometric backgrounds
- **Dark/light modes**: Alternative color schemes
- **Mobile optimizations**: Responsive color intensity

_Note: Many advanced features are already available via the Takeover System._

## Support

For questions or customization requests, refer to:

- Schema definition: `/sanity/schemaTypes/campaign.ts`
- Component implementation: `/components/blocks/CampaignContent.tsx`
- Query structure: `/sanity/lib/queries.ts` (CAMPAIGN_QUERY)
