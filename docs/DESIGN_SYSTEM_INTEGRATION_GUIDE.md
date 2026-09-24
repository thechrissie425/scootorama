# Design System Integration & Automation Strategy

**Status:** ✅ Phase 1 Complete - Token Infrastructure Operational  
**Owner:** Engineering + UX/UI Partnership  
**Last Updated:** January 14, 2026

> **Looking for the actual process?** This document covers strategy and rationale.
> The runnable, step-by-step workflow lives in [DESIGN_SYSTEM_WORKFLOW.md](./DESIGN_SYSTEM_WORKFLOW.md) —
> token sync (`npm run tokens:check`), Figma-to-component steps, Code Connect setup,
> and the current list of Figma↔code divergences.

---

## Executive Summary

This document outlines the strategy for integrating Scootorama's design system (managed in zeroheight) with the zweb-next-gen codebase, enabling automated updates while maintaining code quality and production stability.

**✅ COMPLETED (Phase 1):**

- Design token infrastructure with Style Dictionary v4
- 200+ semantic color tokens from Figma design system
- Automated build system with TypeScript support
- Full Tailwind CSS integration
- Switch and Checkbox components themed with design tokens
- Storybook integration for component documentation

**Key Objectives:**

- ✅ UX/UI team owns design system values in `design-tokens/tokens.json`
- ✅ Automated token generation from JSON → TypeScript exports
- ✅ Staged review process via Git pull requests
- ⏳ Visual regression testing (Chromatic/Storybook recommended)
- ✅ Version control for all design system updates

---

## 1. Current State Assessment

### ✅ What We Have (Completed)

- **Design Tokens System:** Style Dictionary v4 with 200+ tokens
- **Token Categories:** Colors, Typography, Spacing, Radius, Stroke
- **Icon System:** Consolidated to single library (lucide-react, 1000+ icons)
- **UI Framework:** shadcn/ui (component library)
- **Styling:** Tailwind CSS fully integrated with design tokens
- **Component Architecture:** React components with design token theming
- **Storybook:** Component playground with token documentation
- **Build Automation:** `npm run build:tokens` regenerates exports
- **Type Safety:** Full TypeScript declarations for all tokens

### ✅ Resolved Pain Points

- ✅ **Automated token sync:** Style Dictionary generates code from tokens.json
- ✅ **Single source of truth:** `design-tokens/tokens.json` is version controlled
- ✅ **Systematic review:** All token changes go through Git PR process
- ✅ **Clear ownership:** UX/UI owns tokens.json, Engineering reviews PRs
- ✅ **No drift:** Code auto-generates from tokens, impossible to diverge

### ⏳ Remaining Challenges

- ⏳ Figma Tokens plugin setup (for bi-directional Figma ↔ Git sync)
- ⏳ Visual regression testing integration (Chromatic recommended)
- ⏳ Complete component library theming (6 of ~35 components done)
- ⏳ Custom Scootorama icon library (SVGR setup for Figma-exported SVGs)
- ⏳ zeroheight documentation sync (manual update process)

---

## 2. Design System Integration Architecture

### ✅ IMPLEMENTED: Source of Truth Model

**Design Tokens in Git = Single Source of Truth**

zeroheight is NOT a source of truth - it's a **documentation platform** that displays design decisions, usage guidelines, and component specs. The actual source values live in version-controlled JSON files.

```
┌─────────────────────────────────────────────────────────────┐
│         SINGLE SOURCE OF TRUTH (Version Controlled)         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  zweb-next-gen/design-tokens/tokens.json               │ │
│  │  {                                                      │ │
│  │    "color": {                                          │ │
│  │      "brand": {                                        │ │
│  │        "primary": { "value": "#FF6B00" }               │ │
│  │      }                                                  │ │
│  │    },                                                   │ │
│  │    "spacing": { "md": { "value": "16px" } }            │ │
│  │  }                                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│  - Versioned in Git (pull request review)                  │
│  - Owned by UX/UI team (engineering reviews)               │
│  - Edited via Figma Tokens plugin OR manual JSON edits    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Automated Sync (GitHub Actions)
                              │
        ┌─────────────────────┼──────────────────────┐
        ▼                     ▼                      ▼
┌──────────────┐   ┌──────────────────┐   ┌───────────────────┐
│    Figma     │   │  Tailwind Config │   │   zeroheight      │
│   (Tokens    │   │  (Production)    │   │  (Documentation)  │
│   Plugin)    │   │                  │   │                   │
├──────────────┤   ├──────────────────┤   ├───────────────────┤
│ - Syncs      │   │ tailwind.config  │   │ - Usage guides    │
│   tokens TO  │   │ {                │   │ - Component specs │
│   Figma for  │   │   colors: {...}  │   │ - Accessibility   │
│   designers  │   │   spacing: {...} │   │ - Examples        │
│ - Designers  │   │ }                │   │ - NOT a token API │
│   work in    │   │                  │   │                   │
│   Figma,     │   │ Auto-generated   │   │ Manually updated  │
│   changes    │   │ from tokens.json │   │ by UX/UI team     │
│   export to  │   │                  │   │                   │
│   tokens.json│   │                  │   │                   │
└──────────────┘   └──────────────────┘   └───────────────────┘

                              │
                              │ (Code changes only)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   ZWEB-NEXT-GEN CODEBASE                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Component Code (React)                                │ │
│  │  - Uses Tailwind classes (text-primary, space-y-md)   │ │
│  │  - Inherits token values automatically                │ │
│  │  - Manual implementation by engineering               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Visual Regression Tests
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    STAGING ENVIRONMENT                      │
│  - Preview design changes in context                        │
│  - Chromatic screenshots (before/after)                    │
│  - Engineering + UX/UI review together                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Approved PR
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION                                │
└─────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Git is the source of truth** - `design-tokens/tokens.json` is version-controlled and reviewed via PR
2. **Figma syncs FROM tokens.json** - Designers work in Figma, but changes export back to JSON (not the other way)
3. **zeroheight documents decisions** - Not a programmatic source; it's a human-readable reference
4. **Code auto-generates from tokens** - Tailwind config is built from tokens.json via Style Dictionary

---

## 3. The Two-Layer Approach

### Layer 1: Design Tokens (Automated) ✅ COMPLETE

**Status:** FULLY IMPLEMENTED

This layer is now operational with Style Dictionary v4 transforming `design-tokens/tokens.json` into TypeScript/JavaScript exports.

**What are Design Tokens?**
Atomic design values (colors, spacing, typography, shadows, etc.) stored as JSON.

**Example: `design-tokens.json`**

```json
{
  "color": {
    "brand": {
      "primary": "#FF6B00",
      "secondary": "#0066FF",
      "accent": "#00D4AA"
    },
    "neutral": {
      "50": "#FAFAFA",
      "900": "#171717"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px"
  },
  "typography": {
    "font-family": {
      "sans": "Circular, -apple-system, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "font-size": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px"
    }
  }
}
```

**Workflow:**

1. **Figma/Code:** UX/UI updates design tokens in Figma (using Figma Tokens plugin) OR edits `design-tokens/tokens.json` directly in GitHub
2. **Export to Git:** Figma Tokens plugin commits changes to `design-tokens/tokens.json` (or manual commit)
3. **Automation:** GitHub Action triggers on commit:
   - Runs Style Dictionary to transform tokens
   - Updates `tailwind.config.ts` with new values
   - Creates pull request with before/after comparison
4. **Review:** Engineering reviews auto-generated PR (verify changes are intentional)
5. **Merge:** PR approved → tokens go live in production
6. **Sync to Figma:** GitHub Action pushes tokens BACK to Figma (keeps Figma in sync with Git SSoT)
7. **Update zeroheight:** UX/UI manually updates documentation (or automated if zeroheight API supports it)

**Tools:**

- **Figma Tokens Plugin** (https://www.figma.com/community/plugin/843461159747178978)
- **Style Dictionary** (https://amzn.github.io/style-dictionary/) - Transforms tokens into CSS, SCSS, JS, Tailwind
- **GitHub Actions** - Automates token transformation and PR creation

---

### Layer 2: Component Changes (Manual Review) ⏳ IN PROGRESS

**Status:** ~15% Complete (5 of ~30 components themed)

**Completed Components:**

- ✅ Switch (3 sizes with semantic ColorToggle\* tokens)
- ✅ Checkbox (3 sizes with semantic ColorInput\* tokens, indeterminate state)
- ✅ Label (Scootorama Fondo typography)
- ✅ Button (legacy theming, will be updated to ColorAction\* tokens)

**Why Manual?**

- Component logic is complex (props, state, accessibility)
- Design updates may require code refactoring
- Breaking changes need engineering review
- Visual regression testing required

**Workflow:**

1. **Figma:** UX/UI updates button component design
2. **zeroheight:** Documentation updated with new specs
3. **Notification:** Engineering team notified of design change
4. **Engineering:** Developer implements component changes
5. **Visual Regression:** Automated screenshots compare before/after
6. **Review:** UX/UI + Engineering review changes together
7. **Deploy:** Approved changes go live

**Tools:**

- **Chromatic** (https://www.chromatic.com/) - Visual regression testing for Storybook
- **Percy** (https://percy.io/) - Visual testing platform
- **Storybook** (https://storybook.js.org/) - Component playground + documentation

---

## 4. Feasibility Assessment

### ✅ **IMPLEMENTED: Automated Design Token Sync**

**Status:** COMPLETE AND OPERATIONAL

**Current Implementation:**

- ✅ Style Dictionary v4 with TypeScript support
- ✅ 200+ semantic tokens exported from tokens.json
- ✅ Full Tailwind CSS integration via design-tokens.js
- ✅ GitHub Action that creates PRs on token changes
- ✅ Build automation: `npm run build:tokens`
- ✅ TypeScript declarations for all tokens (lib/design-tokens.d.ts)

**Token Categories:**

- Colors: Brand, semantic, neutral, scrim, action, toggle, input, formField, nav, feedback, surface, canvas, alert, pace
- Typography: Sprint (10), Fondo (10), Chrono (3) variants
- Spacing: 16 semantic values (none → jumbo)
- Radius: 10 values (none → circular)
- Stroke: 6 border widths (none → megaChonk)

**See [SHADCN_INTEGRATION_STATUS.md](./SHADCN_INTEGRATION_STATUS.md) for detailed component tracking.**

---

### ⏳ **IN PROGRESS: Component Library Theming**

**Confidence:** Emerging (establishing best practices as we go)

**Current Implementation Pattern:**

**Reference Implementations:**

- ✅ Switch component: Template for toggle-style components
  - Exact Figma dimensions: small (44×24), medium (52×28), large (60×32)
  - Semantic tokens: ColorToggleFillActive/Inactive, ColorToggleStrokeActive/Inactive
  - CSS custom properties bridge design tokens to Radix UI data-state selectors
  - CVA (class-variance-authority) for size variants
- ✅ Checkbox component: Template for input-style components
  - Three sizes: small (16×16), medium (20×20), large (24×24)
  - Semantic tokens: ColorInputFillDefault, ColorInputStroke, ColorFormFieldStrokeDefault
  - Indeterminate state with proper icon handling
  - Full Storybook stories (7 stories including AllStates comprehensive view)

- ✅ Icon System: Consolidated library approach
  - Migrated from 3 libraries (@heroicons/react, @radix-ui/react-icons, lucide-react) to single source
  - All components now use lucide-react (1000+ icons, tree-shakeable)
  - Future-ready for custom Scootorama icons via SVGR automation
  - Establishes pattern for icon size tokens when custom icons are added

**Established Workflow:**

1. **Extract Figma specs**: Exact dimensions, colors, states
2. **Map to semantic tokens**: Choose appropriate ColorAction*/ColorToggle*/ColorInput\* tokens
3. **Create CVA variants**: Size variants with exact dimensions
4. **Apply tokens via CSS custom properties**: Bridge to Radix UI data-state selectors
5. **Add CSS layer**: Component-specific data-state styling
6. **Create Storybook stories**: All sizes, states, and comprehensive AllStates view
7. **Document tokens used**: List all tokens in story description

**See [SHADCN_INTEGRATION_STATUS.md](./SHADCN_INTEGRATION_STATUS.md) for complete component theming guide.**

---

## 5. Recommended Workflow

### ✅ Phase 1: Design Tokens Automation (COMPLETE)

**Completed Steps:**

**✅ Step 1: Style Dictionary Integration**

```bash
npm install --save-dev style-dictionary
# ✅ Installed and configured with TypeScript support
```

**✅ Step 2: Token Build System**

File: `scripts/build-tokens.js` (complete implementation)

```javascript
const StyleDictionary = require('style-dictionary')
const config = {
  source: ['design-tokens/tokens.json'],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'lib/',
      files: [
        {
          destination: 'design-tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'lib/',
      files: [
        {
          destination: 'design-tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
  },
}
StyleDictionary.extend(config).buildAllPlatforms()
```

**✅ Step 3: Tailwind Integration**

```javascript
// tailwind.config.ts (complete integration)
import * as tokens from './lib/design-tokens'

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          orange: {
            light: tokens.ColorBrandPrimaryLight,
            base: tokens.ColorBrandPrimaryBase,
            dark: tokens.ColorBrandPrimaryDark,
          },
          // ... etc
        },
        toggle: {
          active: {
            fill: tokens.ColorToggleFillActive,
            stroke: tokens.ColorToggleStrokeActive,
            content: tokens.ColorToggleContentActive,
          },
          inactive: {
            fill: tokens.ColorToggleFillInactive,
            stroke: tokens.ColorToggleStrokeInactive,
            content: tokens.ColorToggleContentInactive,
          },
        },
        // ... all 200+ semantic tokens mapped
      },
    },
  },
}
```

**✅ Step 4: GitHub Action for Auto-Sync**

```yaml
# .github/workflows/design-tokens-sync.yml (operational)
name: Design Tokens Sync

on:
  push:
    paths:
      - 'design-tokens/**/*.json'
  workflow_dispatch:

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build:tokens
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          commit-message: 'chore: sync design tokens'
          title: '🎨 Design Tokens Update'
          body: |
            Automated design token sync from design-tokens/tokens.json

            **Review Checklist:**
            - [ ] Color changes reviewed
            - [ ] Spacing changes reviewed
            - [ ] Typography changes reviewed
          branch: design-tokens/auto-sync
```

---

### ⏳ Phase 2: Component Theming (IN PROGRESS)

**Current Progress: 17% Complete (6 of ~35 components)**

**Completed:**

- ✅ Switch (ColorToggle\* tokens, 3 sizes, Storybook stories)
- ✅ Checkbox (ColorInput\* tokens, 3 sizes, indeterminate state, Storybook stories)
- ✅ Label (Scootorama Fondo typography)
- ✅ Icon System (consolidated to lucide-react)

**Next Components:**

- ⏳ Custom Scootorama Icons (SVGR setup for Figma SVG exports)
- ⏳ Radio Group (planned, will follow Checkbox pattern)
- ⏳ Button refresh (update to ColorAction\* semantic tokens)
- ⏳ Input, Textarea, Select (ColorFormField\* tokens)

**Component Theming Template:**

```typescript
// Example: components/ui/radio-group.tsx
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import * as tokens from '@/lib/design-tokens'
import { cva, type VariantProps } from 'class-variance-authority'

const radioVariants = cva(
  'grid place-content-center aspect-square rounded-full border-2',
  {
    variants: {
      size: {
        small: 'h-4 w-4',
        medium: 'h-5 w-5',
        large: 'h-6 w-6',
      },
    },
    defaultVariants: { size: 'medium' },
  }
)

export function RadioGroupItem({ size, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      className={radioVariants({ size })}
      style={{
        borderRadius: tokens.RadiusCircular,
        borderWidth: tokens.StrokeChonk,
        '--radio-checked-bg': tokens.ColorInputFillDefault,
        '--radio-unchecked-bg': tokens.ColorNeutralWhiteBase,
        '--radio-checked-border': tokens.ColorInputStroke,
        '--radio-unchecked-border': tokens.ColorFormFieldStrokeDefault,
      }}
      {...props}
    />
  )
}
```

**See [SHADCN_INTEGRATION_STATUS.md](./SHADCN_INTEGRATION_STATUS.md) for detailed component roadmap.**

---

### 🔮 Phase 3: Visual Regression Testing (PLANNED)

name: Visual Regression Tests

on: push

jobs:
chromatic:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4
with:
fetch-depth: 0

      - uses: actions/setup-node@v4

      - run: npm ci

      - name: Run Chromatic
        uses: chromaui/action@latest
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          exitZeroOnChanges: true # Don't fail on changes, just report

````

**Step 2: Component Change Notification System**

**Figma Webhook → Discord/Slack:**

```typescript
// app/api/webhooks/figma-updates/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { file_key, event_type, component_name } = await req.json()

  if (event_type === 'COMPONENT_UPDATED') {
    // Send notification to engineering team
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: 'POST',
      body: JSON.stringify({
        text: `🎨 Design Update: ${component_name} was updated in Figma`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Component Updated:* ${component_name}\n*Figma File:* <https://figma.com/file/${file_key}|View in Figma>\n\n*Action Required:* Review design changes and update component code.`,
            },
          },
        ],
      }),
    })
  }

  return NextResponse.json({ received: true })
}
````

---

### Phase 3: Staging & Review Process (Ongoing)

**Engineer Workflow:**

1. **Receive Notification:** Slack/Discord alert when design changes in Figma
2. **Review Design:** Open Figma, check zeroheight docs for updated specs
3. **Create Branch:** `git checkout -b design/update-primary-button`
4. **Implement Changes:** Update React component code
5. **Update Storybook:** Add/update component stories
6. **Preview Locally:** `npm run storybook` - visual check
7. **Commit & Push:** Chromatic runs visual regression tests automatically
8. **Create PR:** Include Chromatic link showing before/after screenshots
9. **Request Review:** Tag UX/UI team for design approval
10. **Deploy to Staging:** Preview changes in production-like environment
11. **Approval:** Both engineering + design approve
12. **Merge & Deploy:** Changes go live

**UX/UI Workflow:**

1. **Update Figma:** Make design changes to components
2. **Update zeroheight:** Document component changes (props, usage guidelines)
3. **Notify Engineering:** Slack message or automated webhook
4. **Review PR:** Check Chromatic screenshots, verify implementation matches design
5. **Approve/Request Changes:** Comment on PR with feedback
6. **Final Approval:** Sign off when implementation matches design intent

---

## 6. Ownership Model

### Clear Boundaries

| **Responsibility**                    | **Owner**   | **Collaborator**              |
| ------------------------------------- | ----------- | ----------------------------- |
| Design token values (colors, spacing) | UX/UI       | Engineering (review)          |
| Component visual design (Figma)       | UX/UI       | -                             |
| Component code implementation (React) | Engineering | UX/UI (review)                |
| Accessibility (ARIA, keyboard nav)    | Engineering | UX/UI (consult)               |
| Documentation (zeroheight)            | UX/UI       | Engineering (technical notes) |
| Storybook component stories           | Engineering | UX/UI (review)                |
| Visual regression test approval       | Both        | -                             |
| Production deployment                 | Engineering | -                             |

### Shared Accountability

**Design System Team (Recommended):**

- 1-2 UX/UI designers
- 1-2 Frontend engineers
- Meet weekly to review changes
- Shared ownership of component library quality

---

## 7. Tool Recommendations

### Essential Tools

**Design Token Management:**

- ✅ **Figma Tokens Plugin** - Export tokens from Figma
- ✅ **Style Dictionary** - Transform tokens into code
- ✅ **GitHub Actions** - Automate token sync

**Visual Regression Testing:**

- ✅ **Chromatic** (Recommended) - $149/month for unlimited snapshots
  - Pros: Seamless Storybook integration, UI review flow, Figma integration
  - Cons: Cost scales with team size
- ⚠️ **Percy** - Alternative, similar pricing
- ⚠️ **Playwright Visual Comparisons** - Free, more setup required

**Component Documentation:**

- ✅ **Storybook** - Component playground + docs (already familiar to team)
- ✅ **zeroheight** - Design system documentation (already in use)

**Collaboration:**

- ✅ **Slack/Discord Webhooks** - Notifications for design changes
- ✅ **Figma Comments API** - Link Figma comments to GitHub issues

### Nice-to-Have Tools

**Component Code Generation (Experimental):**

- **Anima** (https://www.animaapp.com/) - Figma to React code
  - Pros: Generates basic component structure
  - Cons: Code quality varies, still requires heavy refactoring
  - **Verdict:** Not recommended for production use

- **Builder.io** (https://www.builder.io/) - Visual development platform
  - Pros: WYSIWYG editor, non-technical content editing
  - Cons: Vendor lock-in, adds complexity
  - **Verdict:** Overkill for component library

**Design Linting:**

- **Design Lint** (Figma plugin) - Catches design inconsistencies
- **Specify** (https://specifyapp.com/) - Design token management platform (alternative to Style Dictionary)

---

## 8. Implementation Timeline

### Month 1: Foundation

- **Week 1:** Setup Figma Tokens plugin, export initial token set
- **Week 2:** Integrate Style Dictionary, automate token → Tailwind sync
- **Week 3:** Setup Chromatic, create initial Storybook stories for core components
- **Week 4:** Create GitHub Actions for automated workflows

### Month 2: Process Refinement

- **Week 5-6:** Document component change workflow, train teams
- **Week 7:** Implement first design change end-to-end (pilot)
- **Week 8:** Retrospective, refine process based on learnings

### Month 3: Scale

- **Week 9-10:** Migrate all core components to Storybook
- **Week 11:** Setup Figma webhooks for automated notifications
- **Week 12:** Document best practices, create onboarding guide for new team members

---

## 9. Cost Analysis

| **Tool**                       | **Cost** | **Frequency** | **Annual**      |
| ------------------------------ | -------- | ------------- | --------------- |
| Chromatic (Team plan)          | $149/mo  | Monthly       | $1,788          |
| Figma Tokens (Free tier)       | $0       | -             | $0              |
| Style Dictionary (Open source) | $0       | -             | $0              |
| Storybook (Open source)        | $0       | -             | $0              |
| GitHub Actions (included)      | $0       | -             | $0              |
| **Total**                      | -        | -             | **$1,788/year** |

**ROI:**

- **Time Savings:** 10-15 hours/month on manual design → code translation
- **Reduced Errors:** 80% fewer design/code inconsistencies
- **Faster Iterations:** Design changes deployed in days (not weeks)
- **Annual Value:** $10K-15K in engineering time savings

---

## 10. Best Practices (Industry Learnings)

### From Shopify Polaris

- **Design tokens are versioned** (semantic versioning like code)
- **Breaking changes are flagged** in automated PR descriptions
- **Migration guides** provided when components change significantly

### From GitHub Primer

- **Components have "tiers"** (stable, beta, alpha, deprecated)
- **Changelogs are automated** via conventional commits
- **Visual regression tests run on every PR** (not just design changes)

### From Airbnb

- **Design system team is embedded** (not siloed)
- **Weekly design/eng sync meetings** review pending changes
- **"Design QA" role** reviews implementation accuracy before production

### From Stripe

- **Design tokens in Git are single source of truth** (Figma, code, and docs all sync FROM the JSON file)
- **Token changes go through PR review** (engineering reviews before merging)
- **Component props map to design properties** (variant="primary" not color="orange")
- **Documentation is code-generated** (reduces manual sync burden)

---

## 11. Success Metrics

**Quantitative:**

- **Token sync time:** < 5 minutes from Figma update → PR created
- **Component change time:** < 2 days from design update → production
- **Visual regression test coverage:** 90%+ of components
- **Design/code drift incidents:** < 1 per quarter

**Qualitative:**

- UX/UI team confidence in production implementation accuracy
- Engineering team satisfaction with design handoff process
- Reduced "does this match the design?" questions in PR reviews

---

## 12. FAQs

**Q: Can we fully automate component updates from Figma?**  
A: No. Design-to-code automation tools exist but produce low-quality code requiring significant refactoring. Manual implementation by engineers is industry best practice.

**Q: What happens if a design change breaks the website?**  
A: Visual regression tests (Chromatic) catch breaking changes. Engineers review before merging. No automated deploys to production.

**Q: Who approves design token changes?**  
A: Engineering reviews automated PR, approves if changes are intentional. For breaking changes (e.g., primary color shift), UX/UI + Engineering collaborate.

**Q: How do we handle design changes mid-sprint?**  
A: Design changes are treated as new work items. Urgent changes are prioritized; non-urgent changes go in backlog.

**Q: What if zeroheight and Figma get out of sync?**  
A: `design-tokens/tokens.json` in Git is the single source of truth. If there's a conflict:

1. Git repo (tokens.json) wins
2. Figma syncs FROM Git (automated via GitHub Action)
3. zeroheight is manually updated by UX/UI team (documentation layer only)

**Q: Where do designers actually edit token values?**  
A: Two options:

1. **Preferred:** Edit in Figma using Figma Tokens plugin → plugin commits to Git
2. **Alternative:** Edit `design-tokens/tokens.json` directly in GitHub → syncs back to Figma via GitHub Action

**Q: Why not use zeroheight as the source of truth?**  
A: zeroheight lacks a programmatic API for token export. It's built to _display_ design decisions, not _generate_ code. Git provides version control, PR review, and automated transformations.

**Q: Can content operators make design changes?**  
A: No. Design system changes require UX/UI + Engineering collaboration. Content operators work within existing component system.

---

## 13. Next Steps

1. **Share this document** with UX/UI team for feedback
2. **Validate tooling choices** (Chromatic vs Percy, etc.)
3. **Request Chromatic trial** (14-day free trial available)
4. **Setup Figma Tokens plugin** (2-hour spike)
5. **Pilot with one component** (e.g., Button) before scaling
6. **Schedule kickoff meeting** with UX/UI + Engineering to align on workflow

---

## 14. References

- **Style Dictionary:** https://amzn.github.io/style-dictionary/
- **Figma Tokens Plugin:** https://www.figma.com/community/plugin/843461159747178978
- **Chromatic:** https://www.chromatic.com/
- **Shopify Polaris:** https://polaris.shopify.com/
- **GitHub Primer:** https://primer.style/
- **Design Tokens W3C Spec:** https://design-tokens.github.io/community-group/format/
- **Storybook:** https://storybook.js.org/

---

**Document Owner:** Engineering Team  
**Reviewers:** UX/UI Team, Product Management  
**Status:** Draft - Pending Review  
**Next Review:** After UX/UI team feedback
