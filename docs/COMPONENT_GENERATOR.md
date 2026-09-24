# Component Generator Guide

**Last Updated:** January 8, 2026

## Overview

The component generator (`generate-block.ts`) is an automated tool that creates new block components with full localization support, TypeScript types, and integration-ready boilerplate. This tool saves **30-60 minutes** per component by automating schema creation, component scaffolding, and setup tasks.

## Quick Start

```bash
npm run generate:block <blockName>
```

### Example

```bash
npm run generate:block featureGrid
```

This generates:

- `sanity/schemaTypes/featureGrid.ts` - Sanity schema with field helpers
- `components/blocks/FeatureGrid.tsx` - React component with localization

## Naming Rules

✅ **Valid Names:**

- `featureGrid` → `FeatureGrid`
- `heroSection` → `HeroSection`
- `contentBlock` → `ContentBlock`
- `testimonialCarousel` → `TestimonialCarousel`

❌ **Invalid Names:**

- `123invalid` - Cannot start with numbers
- `feature-grid` - No hyphens or special characters
- `feature_grid` - No underscores

**Rule:** Block names must start with a letter and contain only alphanumeric characters.

## Generated Files

### 1. Schema File (`sanity/schemaTypes/[blockName].ts`)

Uses field helpers for DRY localization:

```typescript
import { defineType, defineField } from 'sanity'
import { localizedString, localizedText } from '../lib/fieldHelpers'

export default defineType({
  name: 'featureGrid',
  title: 'FeatureGrid',
  type: 'object',
  fields: [
    localizedString('title', 'Title', true), // Required field
    localizedText('description', 'Description'), // Optional field
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'image',
    },
  },
})
```

**Field Helpers:**

- `localizedString()` - Creates `{ en, es, fr, de, ja }` string fields
- `localizedText()` - Creates `{ en, es, fr, de, ja }` text areas
- Both handle `showTranslationFields` visibility automatically

### 2. Component File (`components/blocks/[BlockName].tsx`)

Full TypeScript component with localization:

```typescript
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface FeatureGridProps {
  title?: { en?: string; es?: string; fr?: string; de?: string; ja?: string }
  description?: { en?: string; es?: string; fr?: string; de?: string; ja?: string }
  image?: any
  language?: string
}

export default function FeatureGrid({
  title,
  description,
  image,
  language = 'en'
}: FeatureGridProps) {
  const displayTitle = title?.[language as keyof typeof title] || title?.en || ''
  const displayDescription = description?.[language as keyof typeof description] || description?.en || ''

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {image && (
            <div className="relative aspect-video">
              <Image
                src={urlFor(image).url()}
                alt={displayTitle}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}

          <div>
            {displayTitle && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {displayTitle}
              </h2>
            )}

            {displayDescription && (
              <p className="text-lg text-gray-600">
                {displayDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Component Features:**

- ✅ Full TypeScript types for all 5 languages
- ✅ Language fallback logic (language → en → empty string)
- ✅ Next.js Image optimization with `urlFor()`
- ✅ Responsive grid layout (mobile/desktop)
- ✅ Tailwind CSS styling
- ✅ Optional field handling

## Integration Steps

After generating a component, follow these 4 steps to integrate it into your app:

### 1️⃣ Add to Schema Index

**File:** `sanity/schemaTypes/index.ts`

```typescript
import featureGrid from './featureGrid'

export const schemaTypes = [
  // ... existing schemas
  featureGrid,
]
```

### 2️⃣ Create GROQ Fragment

**File:** `sanity/lib/queries.ts`

```typescript
export const FEATUREGRID_FRAGMENT = `
  _type == "featureGrid" => {
    ...,
    "title": coalesce(title[$language], title.en, title),
    "description": coalesce(description[$language], description.en, description),
    "image": image
  }
`
```

**Important:** Use `coalesce()` for localized field fallbacks with `$language` parameter.

### 3️⃣ Import Component

**File:** `app/[market]/[lang]/[[...slug]]/page.tsx`

```typescript
import FeatureGrid from '@/components/blocks/FeatureGrid'

const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  river: River,
  featureGrid: FeatureGrid, // Add this line
  // ... other blocks
}
```

### 4️⃣ Add to Content Query

**File:** `app/[market]/[lang]/[[...slug]]/page.tsx`

```typescript
const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  ...,
  content[]{
    ...,
    ${HERO_FRAGMENT},
    ${RIVER_FRAGMENT},
    ${FEATUREGRID_FRAGMENT}, // Add this line
    // ... other fragments
  }
}`
```

## Error Handling

The generator includes comprehensive validation:

### Missing Block Name

```bash
$ npm run generate:block

❌ Error: Block name is required
Usage: npm run generate:block <BlockName>

Example: npm run generate:block featureGrid
```

### Invalid Name Format

```bash
$ npm run generate:block 123invalid

❌ Error: Block name must start with a letter and contain only letters and numbers
   Invalid: "123invalid"
   Valid examples: featureGrid, heroSection, contentBlock
```

### File Already Exists

```bash
$ npm run generate:block hero

❌ Error: Component file already exists: Hero.tsx
   Choose a different name or delete the existing file first
```

**Safety:** The generator will **never** overwrite existing files.

## Customization

After generation, customize the component to your needs:

### Adding Custom Fields

**Schema:**

```typescript
defineField({
  name: 'ctaLink',
  title: 'CTA Link',
  type: 'url',
  validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
}),
defineField({
  name: 'items',
  title: 'Grid Items',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'feature' }] }],
}),
```

**Component:**

```typescript
interface FeatureGridProps {
  // ... existing props
  ctaLink?: string
  items?: any[]
}

export default function FeatureGrid({
  title,
  description,
  image,
  ctaLink,
  items,
  language = 'en',
}: FeatureGridProps) {
  // ... component logic
}
```

### Changing Layout

Modify the grid structure:

```tsx
{
  /* Change from 2-column to 3-column grid */
}
;<div className="grid grid-cols-1 md:grid-cols-3 gap-8">{/* ... */}</div>

{
  /* Or use a flex layout */
}
;<div className="flex flex-col md:flex-row gap-8">{/* ... */}</div>
```

### Adding Variants

Use Tailwind variants or props:

```typescript
interface FeatureGridProps {
  // ... existing props
  variant?: 'default' | 'dark' | 'gradient'
}

export default function FeatureGrid({
  // ... other props
  variant = 'default',
}: FeatureGridProps) {
  const bgClass = {
    default: 'bg-white',
    dark: 'bg-gray-900 text-white',
    gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
  }[variant]

  return (
    <section className={`py-12 md:py-24 ${bgClass}`}>
      {/* ... */}
    </section>
  )
}
```

## Advanced Patterns

### Nested Localized Objects

For complex nested structures:

```typescript
// Schema
defineField({
  name: 'cta',
  title: 'Call to Action',
  type: 'object',
  fields: [
    localizedString('text', 'Button Text', true),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'url',
    }),
  ],
}),

// Component
interface FeatureGridProps {
  cta?: {
    text?: { en?: string; es?: string; fr?: string; de?: string; ja?: string }
    link?: string
  }
  // ... other props
}

const displayCtaText = cta?.text?.[language as keyof typeof cta.text] || cta?.text?.en || ''
```

### Array of Localized Items

```typescript
// Schema
defineField({
  name: 'features',
  title: 'Features',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      localizedString('title', 'Title', true),
      localizedText('description', 'Description'),
    ],
  }],
}),

// Component
interface FeatureItem {
  title?: { en?: string; es?: string; fr?: string; de?: string; ja?: string }
  description?: { en?: string; es?: string; fr?: string; de?: string; ja?: string }
}

interface FeatureGridProps {
  features?: FeatureItem[]
  language?: string
}

{features?.map((feature, idx) => {
  const title = feature.title?.[language as keyof typeof feature.title] || feature.title?.en || ''
  const description = feature.description?.[language as keyof typeof feature.description] || feature.description?.en || ''

  return (
    <div key={idx}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
})}
```

## Best Practices

### 1. Semantic Naming

Choose names that describe the block's purpose:

✅ **Good:**

- `featureGrid` - Grid of features
- `heroWithVideo` - Hero section with video
- `testimonialCarousel` - Carousel of testimonials
- `pricingTable` - Table of pricing tiers

❌ **Avoid:**

- `block1`, `block2` - Not descriptive
- `newSection` - Too generic
- `temp` - Not production-ready

### 2. GROQ Fragment Patterns

Always use proper localization in fragments:

```typescript
// ✅ Good: Uses coalesce with language parameter
export const FEATUREGRID_FRAGMENT = `
  _type == "featureGrid" => {
    ...,
    "title": coalesce(title[$language], title.en, title),
    "description": coalesce(description[$language], description.en, description),
  }
`

// ❌ Bad: Hardcoded language
export const FEATUREGRID_FRAGMENT = `
  _type == "featureGrid" => {
    ...,
    "title": title.en,
  }
`
```

### 3. Component Props

Use optional chaining and fallbacks:

```typescript
// ✅ Good: Safe fallback chain
const displayTitle = title?.[language as keyof typeof title] || title?.en || ''

// ❌ Bad: Can throw errors if undefined
const displayTitle = title[language]
```

### 4. Styling Conventions

Follow project Tailwind patterns:

```tsx
{
  /* ✅ Good: Consistent spacing and responsive design */
}
;<section className="py-12 md:py-24">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-bold mb-4">{displayTitle}</h2>
  </div>
</section>

{
  /* ❌ Avoid: Inconsistent spacing */
}
;<section className="p-5">
  <h2 className="text-2xl mb-2">{displayTitle}</h2>
</section>
```

## Workflow Example

Complete example of creating and integrating a new block:

```bash
# 1. Generate the component
npm run generate:block testimonialCarousel

# 2. Customize the schema (add fields you need)
# Edit: sanity/schemaTypes/testimonialCarousel.ts

# 3. Customize the component (implement your design)
# Edit: components/blocks/TestimonialCarousel.tsx

# 4. Add to schema index
# Edit: sanity/schemaTypes/index.ts

# 5. Create GROQ fragment
# Edit: sanity/lib/queries.ts

# 6. Import and register component
# Edit: app/[market]/[lang]/[[...slug]]/page.tsx

# 7. Add to content query
# Edit: app/[market]/[lang]/[[...slug]]/page.tsx

# 8. Test in Sanity Studio
npm run studio

# 9. Test on frontend
npm run dev
```

## Troubleshooting

### "Cannot find module" Error

**Problem:** TypeScript can't find the generated files.

**Solution:** Run type checking:

```bash
npm run typecheck
```

If errors persist, restart your IDE/TypeScript server.

### Schema Not Appearing in Studio

**Problem:** New block type doesn't show in Sanity Studio.

**Solutions:**

1. Verify schema is imported in `sanity/schemaTypes/index.ts`
2. Check schema is added to the array export
3. Restart Sanity Studio: `npm run studio`
4. Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)

### Component Not Rendering

**Problem:** Block appears in Sanity but doesn't render on frontend.

**Checklist:**

- [ ] Component imported in `[[...slug]]/page.tsx`
- [ ] Component added to `blockComponents` object
- [ ] GROQ fragment created and added to content query
- [ ] Field names match between schema and component props
- [ ] Language parameter passed to component

### Localization Not Working

**Problem:** Content only shows English.

**Check:**

1. GROQ fragment uses `coalesce()` with `$language`
2. Query passes `language: locale` parameter
3. Component receives `language` prop
4. Fallback logic in component is correct

## Time Savings

**Per Component:**

- Manual schema creation: ~15-20 minutes
- Manual component creation: ~15-20 minutes
- TypeScript types: ~5-10 minutes
- Integration boilerplate: ~5-10 minutes
- **Total savings: 30-60 minutes per component**

**For a typical project with 20 custom blocks:**

- Manual approach: **10-20 hours**
- With generator: **1-2 hours** (for customization)
- **Total time saved: 8-18 hours**

## Related Documentation

- [Architecture Guide](./ARCHITECTURE_GUIDE.md) - System overview and patterns
- [Enterprise Localization Guide](./ENTERPRISE_LOCALIZATION_GUIDE.md) - Field-level localization
- [Translation Technical Guide](./TRANSLATION_TECHNICAL_GUIDE.md) - Translation workflows
- [Schema Audit](./SCHEMA_AUDIT.md) - Schema refactoring and field helpers

## Support

For questions or issues with the component generator:

1. Check this documentation first
2. Review existing block components for examples
3. See [ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md) for system patterns
4. Test with `npm run generate:block testBlock` to verify setup
