# Design Tokens

This directory contains Scootorama's design tokens - the single source of truth for colors, typography, spacing, and other design values used across the application.

## 🎯 Quick Start

### Making Changes

1. Edit `tokens.json` with your token updates
2. Run `npm run build:tokens` to generate output files
3. Commit both `tokens.json` AND the generated files in `lib/`
4. Create a pull request

### Using Tokens in Code

```javascript
// Import generated tokens
import {
  ColorBrandPrimaryBase,
  TypographyFontFamilyHeadingBold,
} from '@/lib/design-tokens'

// Use in components
;<div style={{ color: ColorBrandPrimaryBase }}>Hot Pink!</div>
```

## 📁 File Structure

```
design-tokens/
├── tokens.json           # SOURCE OF TRUTH - Edit this file
└── README.md            # This file

lib/                      # Auto-generated (DO NOT EDIT)
├── design-tokens.js     # ES6 exports
└── design-tokens.d.ts   # TypeScript declarations
```

## 🔄 Automated Workflow

When you push changes to `design-tokens/tokens.json`:

1. ✅ GitHub Action detects changes
2. ✅ Runs `npm run build:tokens`
3. ✅ Creates pull request with generated files
4. ✅ Engineering reviews + approves
5. ✅ Merge → tokens go live

## 🎨 Token Structure

### Colors

```json
{
  "color": {
    "brand": {
      "orange": {
        "base": { "value": "#F85A17" },
        "light": { "value": "#FF7753" },
        "dark": { "value": "#C85214" }
      }
    }
  }
}
```

**Naming Convention:**

- `brand.*` - Primary brand colors (orange, blue, green, black, white, gray)
- `semantic.*` - Semantic colors (orange, blue, green, pink, red, yellow, cyan, gold, navy, skyBlue)
- `neutral.*` - Neutral grays and blacks
- `scrim.*` - Transparent overlays (black, white, darkGrey with opacity variants)

**Semantic System Colors:**

- `action.*` - Button and action colors (primary, secondary, tertiary, disabled)
- `toggle.*` - Toggle/switch component colors (active/inactive states)
- `input.*` - Form input colors (default, alternate, highlight, press)
- `formField.*` - Form field colors (default, press, error states)
- `nav.*` - Navigation colors (ghosted, standard with active/default states)
- `feedback.*` - Feedback colors (danger, informative, success, warning)
- `surface.*` - Surface colors (default, alternate, highlight)
- `canvas.*` - Canvas/background colors
- `alert.*` - Alert colors
- `focusBorder.*` - Focus border colors
- `pace.*` - Pace zone colors (A through E)
- `trainingStatus.*` - Training status colors
- `trainingZone.*` - Training zone colors
- `utility.*` - Utility colors for general use
- `scrim.*` - Scrim overlay colors

### Typography

```json
{
  "typography": {
    "fontFamily": {
      "sprint": {
        "bold": { "value": "Fredoka-SemiBold, system-ui, sans-serif" }
      }
    }
  }
}
```

**Font Families:**

- `sprint.*` - Scootorama Sprint (display font)
- `fondo.*` - Scootorama Fondo (body font)
- `chrono.*` - Scootorama Chrono (monospace/data font)

### Spacing

```json
{
  "spacing": {
    "none": { "value": "0" },
    "ultraCompact": { "value": "2px" },
    "extraCompact": { "value": "4px" },
    "compact": { "value": "6px" },
    "relaxed": { "value": "16px" },
    "jumbo": { "value": "64px" }
  }
}
```

**Spacing Tokens:**

- 16 tokens from `none` (0) to `jumbo` (64px)
- Semantic names: ultraCompact, compact, narrow, relaxed, expanded, etc.
- Use with margin, padding, gap, space utilities

### Radius

```json
{
  "radius": {
    "none": { "value": "0" },
    "small": { "value": "8px" },
    "medium": { "value": "12px" },
    "large": { "value": "16px" },
    "circular": { "value": "99px" }
  }
}
```

**Radius Tokens:**

- 10 tokens from `none` (0) to `circular` (99px)
- Includes xxSmall, xSmall, small, medium, large, xLarge, xxLarge, xxxLarge
- Use with border-radius utilities

### Stroke Width

```json
{
  "stroke": {
    "none": { "value": "0" },
    "fine": { "value": "1px" },
    "chonk": { "value": "2px" },
    "heckinChonk": { "value": "4px" },
    "heftyChonk": { "value": "6px" },
    "megaChonk": { "value": "8px" }
  }
}
```

**Stroke Tokens:**

- 6 tokens for border widths
- Use with border-width, outline, ring, and divide utilities

## 🔗 Integration Points

### Current Integration

- ✅ Direct imports in components
- ✅ Auto-generated TypeScript types
- ✅ Version controlled in Git
- ✅ **Tailwind CSS theme integration** - All tokens available as Tailwind utilities
  - Colors: `text-orange`, `bg-brand-secondary`, `border-navy`
  - Typography: `font-heading-bold`, `font-body`
  - Spacing: `p-relaxed`, `m-jumbo`, `gap-compact`
  - Radius: `rounded-medium`, `rounded-circular`
  - Stroke: `border-chonk`, `border-megaChonk`

### Future Integration (Roadmap)

- ⏳ Figma sync (via Figma Tokens plugin)
- ⏳ CSS custom properties output
- ⏳ Dark mode variants
- ⏳ Additional design token categories (shadows, transitions, etc.)

## 📚 Resources

- [Style Dictionary Documentation](https://amzn.github.io/style-dictionary/)
- [Design System Integration Guide](../docs/DESIGN_SYSTEM_INTEGRATION_GUIDE.md)
- [W3C Design Tokens Spec](https://design-tokens.github.io/community-group/format/)

## ⚠️ Important Notes

1. **Never edit generated files** - They will be overwritten on next build
2. **Always commit tokens.json changes** - This is the source of truth
3. **Run build:tokens before committing** - Keep generated files in sync
4. **Use semantic versioning** - Breaking changes require major version bump

## 🤝 Contributing

### Adding New Tokens

1. Add to `tokens.json` following existing patterns
2. Run `npm run build:tokens`
3. Verify output in `lib/design-tokens.js`
4. Update this README if adding new categories
5. Create pull request with descriptive title

### Naming Conventions

- Use camelCase for token names
- Use semantic names (e.g., `primary` not `orange`)
- Include variants (base, light, dark) for colors
- Group related tokens under common parent

---

**Maintained by:** Engineering Team + UX/UI Design  
**Last Updated:** January 13, 2026
