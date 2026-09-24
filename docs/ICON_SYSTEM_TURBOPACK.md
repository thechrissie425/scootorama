# Scootorama Icon System - Turbopack Solution

## Overview

This document describes the implementation of a custom SVG icon system that works with **Next.js 16 Turbopack**, solving the incompatibility with `@svgr/webpack` while maintaining all design requirements.

## The Solution

Based on [this excellent Dev.to article](https://dev.to/vitalets/turbopack-a-better-way-to-inline-svg-in-nextjs-16-36em), we implemented a **data URI + CSS masking** approach that:

✅ **Inlines small SVGs as data URIs** (instant rendering, no HTTP requests)  
✅ **Enables color customization via CSS** (using `currentColor` and masking)  
✅ **Works with Turbopack** (custom loader, no webpack dependency)  
✅ **Conditionally inlines** (small icons inline, large images external)  
✅ **Avoids SVG-in-JS overhead** (stays as data URI, not DOM nodes)

## Architecture

### 1. Custom Turbopack Loader

**File**: `inline-svg-loader.js` (project root)

```javascript
const { optimize } = require('svgo')
const svgToMiniDataURI = require('mini-svg-data-uri')
const { imageSize } = require('image-size')

module.exports = function (content) {
  this.cacheable?.()

  const optimized = optimize(content)
  const src = svgToMiniDataURI(optimized.data)
  const { width, height } = imageSize(Buffer.from(content))
  const result = { src, width, height }

  return `export default ${JSON.stringify(result)};`
}
```

**What it does**:

1. Optimizes SVG markup with SVGO
2. Converts to compact data URI
3. Extracts intrinsic width/height
4. Returns `{ src, width, height }` object (same as Next.js Image)

### 2. Turbopack Configuration

**File**: `next.config.mjs`

```javascript
turbopack: {
  rules: {
    '*.svg': {
      loaders: ['./inline-svg-loader.js'],
      condition: {
        content: /^[\s\S]{0,4000}$/, // Inline SVGs smaller than ~4KB
      },
      as: '*.js',
    },
  },
}
```

**Conditional inlining**:

- Icons under ~4KB → inlined as data URIs
- Large SVGs (>4KB) → handled by Next.js default loader (external files)
- Both produce the same `{ src, width, height }` object format

### 3. SvgIcon Component

**File**: `components/ui/SvgIcon.tsx`

```typescript
import { type ComponentProps } from 'react'
import { type StaticImageData } from 'next/image'

type SvgIconProps = Omit<ComponentProps<'img'>, 'src'> & {
  src: StaticImageData
}

const EMPTY_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E`

export default function SvgIcon({
  src,
  width,
  height,
  style,
  className,
  ...props
}: SvgIconProps) {
  return (
    <img
      width={width ?? src.width}
      height={height ?? src.height}
      src={EMPTY_SVG}
      className={className}
      style={{
        ...style,
        backgroundColor: 'currentcolor',
        mask: `url("${src.src}") no-repeat center / contain`,
        WebkitMask: `url("${src.src}") no-repeat center / contain`,
      }}
      {...props}
    />
  )
}
```

**How CSS masking works**:

1. Renders `<img>` with empty SVG as `src`
2. Sets `width` and `height` to preserve intrinsic dimensions
3. Uses CSS `mask` property with the icon data URI
4. `backgroundColor: currentcolor` makes icon inherit text color

### 4. Usage Example

```tsx
import SvgIcon from '@/components/ui/SvgIcon'
import chevronLeft from '@/icons/ui/general-ui/chevron-left.svg'
import plusIcon from '@/icons/ui/general-ui/plus.svg'

// Default size (uses intrinsic dimensions from SVG)
<SvgIcon src={chevronLeft} />

// Custom size
<SvgIcon src={plusIcon} width={32} height={32} />

// Colored with Tailwind
<SvgIcon src={chevronLeft} className="text-orange" />

// Colored with inline style
<SvgIcon src={plusIcon} style={{ color: 'red' }} />

// Combined
<SvgIcon
  src={chevronLeft}
  width={48}
  height={48}
  className="text-orange"
/>
```

## Benefits Over Alternatives

### vs. SVGR (`@svgr/webpack`)

| Feature             | SVGR                 | Data URI + Masking    |
| ------------------- | -------------------- | --------------------- |
| Turbopack Support   | ❌ No                | ✅ Yes                |
| Bundle Size         | ❌ Large (SVG in JS) | ✅ Minimal (data URI) |
| DOM Overhead        | ❌ Many nodes        | ✅ Single `<img>`     |
| Color Customization | ✅ Full CSS          | ✅ Single color       |
| Instant Rendering   | ✅ Yes               | ✅ Yes                |

### vs. Next.js `<Image />`

| Feature             | `<Image />`     | Data URI + Masking |
| ------------------- | --------------- | ------------------ |
| HTTP Requests       | ❌ One per icon | ✅ None (inlined)  |
| Color Customization | ❌ No           | ✅ Yes             |
| Instant Rendering   | ❌ No           | ✅ Yes             |

### vs. SVG Sprites

| Feature           | Sprites                        | Data URI + Masking |
| ----------------- | ------------------------------ | ------------------ |
| Setup Complexity  | ❌ High                        | ✅ Low             |
| Turbopack Support | ❌ No (`emitFile` unsupported) | ✅ Yes             |
| Safari Filters    | ❌ Broken                      | ✅ Works           |

## Dependencies

```json
{
  "devDependencies": {
    "svgo": "^3.3.2",
    "mini-svg-data-uri": "^1.4.4",
    "image-size": "^1.1.1"
  }
}
```

Install: `npm install --save-dev svgo mini-svg-data-uri image-size`

## Testing

**Test Page**: `/icon-test`

Visit http://localhost:3000/icon-test to see:

- Default sizing (16x16 intrinsic)
- Large sizing (32x32, 48x48)
- Color variations (orange, red, Tailwind classes)
- Inline style customization

## Limitations

### Monochrome Icons Only

This approach works best for **single-color icons**. For multi-color icons:

- **Option 1**: Use Next.js `<Image />` (external file, no color customization)
- **Option 2**: Use SVGR with webpack mode: `npm run dev -- --webpack`

### CSS Masking Support

CSS masking is well-supported:

- ✅ Chrome/Edge 120+ (since 2023)
- ✅ Firefox 53+ (since 2017)
- ✅ Safari 15.4+ (since 2022)

## Migration from Lucide

Before (Lucide icons):

```tsx
import { ArrowLeft, Plus, Copy, Trash2 } from 'lucide-react'

<ArrowLeft className="h-4 w-4" />
<Plus className="h-6 w-6 text-orange" />
```

After (Scootorama icons):

```tsx
import SvgIcon from '@/components/ui/SvgIcon'
import chevronLeft from '@/icons/ui/general-ui/chevron-left.svg'
import plusIcon from '@/icons/ui/general-ui/plus.svg'

<SvgIcon src={chevronLeft} className="shrink-0" />
<SvgIcon src={plusIcon} width={24} height={24} className="text-orange" />
```

**Key differences**:

- Import SVG files directly (not React components)
- Pass SVG as `src` prop (like Next.js Image)
- Use `width`/`height` props instead of Tailwind size classes
- Size defaults to intrinsic dimensions (no need to specify)

## Files Modified

1. **Created**: `inline-svg-loader.js` - Custom Turbopack loader
2. **Created**: `components/ui/SvgIcon.tsx` - Icon component
3. **Modified**: `next.config.mjs` - Added Turbopack SVG rules
4. **Updated**: `components/membership/FamilyDashboard.tsx` - Migrated from Lucide
5. **Created**: `app/icon-test/page.tsx` - Test page

## Future Enhancements

1. **Package the loader**: Create npm package like [turbopack-inline-svg-loader](https://github.com/vitalets/turbopack-inline-svg-loader)
2. **Add hover animations**: Transition color/size on hover
3. **Create icon library**: Wrapper components for common icons
4. **Storybook stories**: Document all available Scootorama icons

## References

- [Original article](https://dev.to/vitalets/turbopack-a-better-way-to-inline-svg-in-nextjs-16-36em)
- [CSS Masking MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/mask)
- [Turbopack Loaders](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- [Breaking Up with SVG-in-JS](https://kurtextrem.de/posts/svg-in-js)
