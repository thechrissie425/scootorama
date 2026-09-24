# Icons

Monochrome SVG icons used across the site. Most are from [Lucide](https://lucide.dev)
(ISC license, see `LICENSE-lucide.txt`); the category chips (`ui/categories/*`) and the
honk horn (`ui/emotes/emote-honk.svg`) are Scootorama originals drawn in the same style.

All icons share one format: a 24×24 `viewBox`, 2px round strokes, `stroke="currentColor"`
and a 32×32 default size, so they inherit text color and scale cleanly.

## Structure

```
icons/
├── controllers/     # Plus / minus controls
├── system/          # Arrows, close, check, calendar, map, share, trash…
└── ui/
    ├── badges/      # Profile badges (verified, parade leader, route…)
    ├── battery/     # Battery states
    ├── categories/  # Race category chips A–E
    ├── connections/ # Bluetooth, Wi-Fi, mobile app, direct connect
    ├── emotes/      # Honk, full speed, wave, toast…
    ├── markers/     # Map markers (you, group leader, ghost, pace bot)
    ├── metrics/     # Zoom Power, kick cadence, speed, distance, elevation…
    ├── navigation/  # Turn directions
    ├── powerups/    # Tailwind, anvil drop, rubber-chicken draft…
    ├── score/, signal/, sports/, time/
    └── *.svg        # General UI (cart, clock, trophy, crown…)
```

## Usage

**`SvgIcon`** (preferred for static icons): the SVG is inlined as a data URI at build time
(see `inline-svg-loader.js`) and rendered as a CSS mask, so it takes the current text color.

```tsx
import SvgIcon from '@/components/ui/SvgIcon'
import cartIcon from '@/icons/ui/cart.svg'

<SvgIcon src={cartIcon} className="h-5 w-5 text-brand-primary" />
```

**`Icon`** renders the SVG inline as a React component (Storybook and CMS inline icons):

```tsx
import { Icon } from '@/components/ui/icon'
import Honk from '@/icons/ui/emotes/emote-honk.svg?react'

<Icon as={Honk} size={24} label="Honk" />
```

**Inline icons in rich text**: editors pick from the list in
`sanity/schemaTypes/objects/inlineIcon.ts`; `components/blocks/InlineIcon.tsx` maps each
value to its SVG.

## Adding an icon

1. Copy the SVG from `lucide-static` (or draw one on the same 24×24, 2px-stroke grid).
2. Set `width="32" height="32"` and keep `stroke="currentColor"`.
3. Save it under the right folder with a kebab-case name, then import it where needed (and
   add it to `InlineIcon.tsx` plus the schema list if editors should be able to use it).
