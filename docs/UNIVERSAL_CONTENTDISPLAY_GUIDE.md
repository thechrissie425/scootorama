# Universal ContentDisplay System Guide

## ✅ **IMPLEMENTED**: Multi-Content Type Support

The ContentDisplay component now supports **ALL** content types in any layout!

### Supported Content Types

| Content Type        | Image Field | Title          | Description   | Meta     |
| ------------------- | ----------- | -------------- | ------------- | -------- |
| 🎯 **Campaign**     | `poster`    | `title`        | `hook`        | `status` |
| ⚡ **Feature**      | `thumbnail` | `title`        | `description` | -        |
| 📦 **Product**      | `image`     | `title` (i18n) | `description` | -        |
| 💬 **Social Proof** | `avatar`    | `quote`        | `type`        | `type`   |

### Universal Image Detection

The system automatically detects images in this priority order:

1. `poster` → Campaigns
2. `image` → Products, general content
3. `thumbnail` → Features
4. `avatar` → Social proof

### Smart Field Handling

**Titles**: Automatically handles i18n product titles

```typescript
// Products: { en: "Scootorama", ja: "ズウィフト" } → "Scootorama"
// Others: "Regular title" → "Regular title"
```

**Descriptions**: Chooses the best available content

```typescript
// Campaign: Uses 'hook' field
// Feature/Product: Uses 'description' field
// Social Proof: Uses 'quote' field
```

**Metadata**: Content-type appropriate

```typescript
// Campaign: Shows 'status' (Active, Upcoming)
// Social Proof: Shows 'type' (Community, Industry)
// Product/Feature: Shows 'description'
```

## Usage Examples

### Mixed Bento Grid

```typescript
// In Sanity Studio: ContentDisplay section
layout: 'grid'
items: [
  { contentReference: campaignRef, size: 'big' },
  { contentReference: featureRef, size: 'square' },
  { contentReference: socialProofRef, size: 'wide' },
  { contentReference: productRef, size: 'tall' },
]
```

### Testimonial Carousel

```typescript
layout: 'carousel'
items: [
  { contentReference: socialProof1 },
  { contentReference: socialProof2 },
  { contentReference: socialProof3 },
]
```

### Product Showcase River

```typescript
layout: 'grid'
items: [
  { contentReference: product1, size: 'square' },
  { contentReference: feature1, size: 'square' },
  { contentReference: product2, size: 'wide' },
  { contentReference: socialProof1, size: 'tall' },
]
```

## Benefits

✅ **Flexible Content Mixing**: Any content type in any layout  
✅ **Graceful Fallbacks**: Missing fields handled automatically  
✅ **Designer Freedom**: Create rich, varied content experiences  
✅ **Scalable**: Easy to add new content types in the future  
✅ **Type Safe**: Full TypeScript support

## Next Steps

1. **Test Mixed Content**: Create ContentDisplay sections with multiple content types
2. **Design Exploration**: Experiment with different content combinations
3. **Content Strategy**: Plan which content works best in which layouts
4. **Performance**: Monitor loading with diverse content types

## Example Content Combinations

### Homepage Hero Grid

```
[Campaign Big 2x2] [Feature Tall] [Social Proof]
[Product Square]   [Feature Tall] [Product Wide]
```

### Product Page Social Proof

```
Social Proof 1 → Social Proof 2 → Related Product → Social Proof 3
```

### Feature Discovery

```
[Feature Wide] [Social Proof] [Feature Square]
[Product Tall] [Feature Square] [Campaign Square]
```
