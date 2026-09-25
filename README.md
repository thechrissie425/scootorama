# Scootorama

**The wackiest indoor scooter adventure on Earth.** Kick, glide and honk your way through over-romanticized wonders of the world, from Bora Bora Bungalow Bay to Alamo-Rama.

Scootorama is a **fictional brand** and this repository is a **portfolio piece**: a production-grade marketing and commerce site for an imaginary connected-fitness product, built to show how a modern headless stack handles multi-market content, campaign theming and a component-driven design system.

---

## What it demonstrates

| Area                     | Highlights                                                                                                                                                                                                   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Headless CMS**         | Sanity v5 with an embedded Studio at `/studio`, a block-based page builder (hero, river, feature grid, stats, pricing, social proof, FAQ, product grid and more), Presentation/visual editing and draft mode |
| **Multi-market routing** | `/[market]/[lang]/…` routes for US, UK, DE, FR, ES and JP, with per-market currency, units and number formatting plus hreflang alternates                                                                    |
| **Localization**         | Field-level translations (en, es, fr, de, ja) with an AI-assisted translate action in the Studio and translation audit scripts                                                                               |
| **Commerce**             | Product pages with per-market pricing, availability and fulfillment, a cart and a membership comparison driven by CMS pricing tiers                                                                          |
| **Campaign takeovers**   | Scheduled, segment-aware campaign themes that re-skin the header, heroes and product pages via CSS variables, plus a scroll-driven "Unlocked" campaign experience                                            |
| **Design system**        | Style Dictionary design tokens (with a Figma variable sync), Tailwind, shadcn/ui primitives, a custom SVG icon system and Storybook 10                                                                       |
| **SEO**                  | Sitemap index with chunked sitemaps, CMS-driven robots.txt, JSON-LD structured data and dynamic Open Graph images                                                                                            |
| **Content ops**          | Seed script with generated illustrations, content validation, SEO and structured-data audits, and pre-commit quality gates                                                                                   |

## Campaign takeovers

A takeover re-skins the whole site for a marketing moment without a deploy. Two ship with the seed content:

| Campaign          | Look                                                                 | Schedule                      |
| ----------------- | -------------------------------------------------------------------- | ----------------------------- |
| **Luau Week**     | Hibiscus coral, lagoon teal, lei-garland key art, confetti welcome   | Jun 21–28, 2027 · US, UK      |
| **Saucer Season** | Deep-space purple, neon lime, flying-saucer key art, twinkling stars | Oct 24 – Nov 2, 2026 · US, UK |

**Try it:** open the 🎪 **Campaign demo** button (bottom left) and pick one, or add `?takeover=luau-week` or `?takeover=saucer-season` to any URL. `?takeover=off` returns to the live schedule.

### How it works

1. **Theme** (`takeoverTheme`): colors, confetti palette, effects (confetti, stars), hero key art and overlay, logo lockup.
2. **Activation** (`takeoverActivation`): start/end dates, markets and audience segments, scope (global, campaign pages or product pages), which surfaces it applies to (hero, product pages, Firecracker), a global banner, a nav bar logo, optional A/B theme variants and a preview token.
3. **Campaign page** (`campaign`): the story behind it: hook, how to take part, unlockable rewards, FAQs and a call to action at `/campaigns/<slug>`.

At request time `getActiveTakeover()` (`lib/takeoverManager.ts`) picks the activation that is live for the visitor's market and segment, or the one named by a preview token. `generateCampaignCSS()` turns its theme into CSS variables, and because the Tailwind brand colors (`brand-primary`, `brand-secondary`, `brand-ink` and the button tokens) read those variables, every button, badge, link and dark section follows the campaign with zero client JavaScript. The hero swaps in the campaign key art, the header gains the banner and lockup, and `TakeoverEffects` adds the confetti or stars (skipped for visitors who prefer reduced motion).

Previews are handled in `proxy.ts`: `?takeover=<token>` is stored in a session cookie and the visitor is redirected to the clean URL, so the preview follows them around the site and ignores the schedule, which is how marketing reviews a campaign before launch.

## The brand

- **Look:** 1980s Saturday-morning TV meets roadside kitsch. Hot pink, turquoise, lime, sunshine yellow and grape on cream, with checkerboards, sunbursts and chunky ink outlines.
- **Type:** Bungee (display), Fredoka (headings), Nunito (body), Righteous (numerals), Pacifico (script accents). All SIL Open Font License, self-hosted in `public/fonts`.
- **Worlds:** Bora Bora Bungalow Bay, Alamo-Rama, Dino Detour, Niagara Honeymoon Heights, Petit Paree and Roswell Saucer Speedway, with 30 routes in two ride modes (Kick workouts and Cruise sightseeing). See `lib/worlds.ts`.
- **Gear:** the Cruiser Deluxe smart scooter, the Kick-Stand indoor trainer and Honk-Honk Buttons handlebar controllers.
- **Membership:** Clubhouse, Deluxe and Family passes.

Brand identity lives in one place, `lib/brand.ts`, so the name, URL, logo and palette can change without touching components.

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **CMS:** Sanity v5, next-sanity, GROQ
- **Styling:** Tailwind CSS 3, Style Dictionary tokens, shadcn/ui, Framer Motion
- **Tooling:** Storybook 10 + Vitest, ESLint, Prettier, Husky + lint-staged

## Getting started

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Create a Sanity project

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) with a `production` dataset.
2. Put its project ID in `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Under **API → Tokens**, create an **Editor** token and set it as both `SANITY_API_TOKEN` and `SANITY_API_READ_TOKEN` (use a separate Viewer token for `SANITY_API_READ_TOKEN` in deployed environments).
4. Under **API → CORS origins**, add `http://localhost:3000` with **Allow credentials** enabled.

### 3. Seed starter content

```bash
npm run seed
```

This uploads the illustration set and writes the homepage, site settings, products, pricing tiers, membership page, stats, quotes, FAQs and all 30 routes. Every document has a fixed ID, so re-running never duplicates content.

Re-running is safe once you've edited content in the Studio: by default the seed only creates documents that don't exist yet and never modifies existing ones.

| Command                    | Existing documents                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------ |
| `npm run seed`             | Left untouched (only missing documents are created)                                  |
| `npm run seed -- --update` | Refreshed from the seed, except any document holding an image uploaded in the Studio |
| `npm run seed -- --force`  | All overwritten with seed content (a full reset)                                     |

### 4. Run it

```bash
npm run dev
```

- Site: [localhost:3000/us/en](http://localhost:3000/us/en)
- Studio: [localhost:3000/studio](http://localhost:3000/studio)
- Storybook: `npm run storybook`

## Scripts

| Script                                                                              | Purpose                                                          |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                                                                       | Build design tokens, then start Next.js                          |
| `npm run build`                                                                     | Production build (tokens first)                                  |
| `npm run seed`                                                                      | Create missing starter content in Sanity (never overwrites)      |
| `npm run seed:art`                                                                  | Regenerate the illustration set (Python + Playwright)            |
| `npm run storybook`                                                                 | Component workshop                                               |
| `npm run typecheck` / `npm run lint`                                                | Static checks                                                    |
| `npm run validate`                                                                  | Content validation against the dataset                           |
| `npm run seo:audit` / `npm run structured-data:audit` / `npm run translation:audit` | Content audits                                                   |
| `npm run tokens:sync`                                                               | Pull design tokens from a Figma variable library                 |
| `npm run generate:block`                                                            | Scaffold a new content block (schema, query fragment, component) |

## Project structure

```
app/                  Next.js routes ([market]/[lang], studio, api, sitemaps, OG images)
components/blocks/    CMS-driven page blocks
components/ui/        Design-system primitives (buttons, icons, shadcn/ui)
contexts/, hooks/     Cart, inventory, market formatting, scroll XP
design-tokens/        Token source (tokens.json) and Figma mapping
icons/                SVG icon library
lib/                  Brand config, worlds catalog, i18n, takeover engine, commerce
sanity/               Schemas, GROQ queries, Studio structure and plugins
scripts/seed/         Seed content, illustrations and art pipeline
stories/              Storybook stories
docs/                 Architecture and implementation guides
```

## Documentation

Deeper guides live in [`docs/`](docs/README.md): architecture, content blocks, localization, the campaign takeover system, the design-system workflow, sitemaps and structured data.

## Credits

Scootorama is fictional. Any resemblance to real scooters, playhouses or basements under historic forts is entirely coincidental. Illustrations are generated from code in `scripts/seed/art`. Fonts are licensed under the SIL Open Font License.
