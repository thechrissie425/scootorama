# Content Block Guide: Building Persona-Driven Pages

This guide explains how to use Scootorama's content architecture to build conversion-optimized pages using the persona-driven content system.

---

## Quick Reference

| Block Type             | Best For                | Content Required                   |
| ---------------------- | ----------------------- | ---------------------------------- |
| **GoalsSection**       | Homepage, landing pages | 2-6 Goals selected                 |
| **BenefitsSection**    | Below hero, mid-page    | Benefits (manual or filtered)      |
| **TransformationTabs** | Conversion sections     | 2-5 Goals with before/after states |
| **FeaturesByCategory** | Feature exploration     | Features with categories assigned  |

---

## Content Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        PAGES                                 │
│   Built from reusable content blocks in Sanity Studio        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│   │ GoalsSection│  │TransformationTabs│  │FeaturesByCat. │  │
│   └──────┬──────┘  └────────┬─────────┘  └───────┬───────┘  │
│          │                  │                     │          │
│          ▼                  ▼                     ▼          │
│   ┌──────────────────────────────────────────────────────┐  │
│   │                  CONTENT TYPES                        │  │
│   │  ┌────────┐  ┌───────┐  ┌─────────┐  ┌──────────┐    │  │
│   │  │Personas│  │ Goals │  │Benefits │  │ Features │    │  │
│   │  └────────┘  └───────┘  └─────────┘  └──────────┘    │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Key Principle:** Create content once (Goals, Benefits, Features), display many times through different blocks.

---

## Block-by-Block Usage Guide

### 1. GoalsSection

**Purpose:** Let visitors self-identify with their fitness goal. Interactive cards that expand on hover/click to show transformation preview.

**When to use:**

- Homepage hero area or just below
- Landing pages targeting new visitors
- "Getting Started" pages
- Anywhere you want visitors to choose their path

**Configuration Options:**

| Setting                 | Options                            | Recommendation                                   |
| ----------------------- | ---------------------------------- | ------------------------------------------------ |
| **Layout**              | Grid (3 col), Grid (2 col), Scroll | 3-col for desktop-first, 2-col for mobile-first  |
| **Show Timeframe**      | Yes/No                             | Yes - gives realistic expectations               |
| **Show Transformation** | Yes/No                             | Yes - this is the key emotional hook             |
| **Background**          | Black, White, Gradient             | Black for impact, White for softer landing pages |

**Example Page Placement:**

```
┌────────────────────────────────┐
│            Hero                │
├────────────────────────────────┤
│        GoalsSection            │  ← "What do you want to achieve?"
│   ┌────┐  ┌────┐  ┌────┐      │
│   │Goal│  │Goal│  │Goal│      │
│   │ 1  │  │ 2  │  │ 3  │      │
│   └────┘  └────┘  └────┘      │
├────────────────────────────────┤
│      BenefitsSection           │
└────────────────────────────────┘
```

**Content Requirements:**

- Select 2-6 Goals from content library
- Each Goal needs: Title, Before State, After State, Timeframe
- Optional: Icon, Difficulty level

---

### 2. BenefitsSection

**Purpose:** Communicate emotional value propositions. Shows what users will experience/feel after using Scootorama.

**When to use:**

- Below hero to reinforce value props
- Mid-page to re-engage scrollers
- Above pricing to justify investment
- Feature pages to show outcomes

**Selection Modes:**

| Mode                  | Use Case                                        |
| --------------------- | ----------------------------------------------- |
| **Manual**            | Curate specific benefits for this page          |
| **By Persona**        | Auto-show benefits relevant to target persona   |
| **By Goal**           | Auto-show benefits that support a specific goal |
| **All (by priority)** | Show top N benefits by priority score           |

**Configuration Options:**

| Setting                  | Options                                         | Recommendation                                        |
| ------------------------ | ----------------------------------------------- | ----------------------------------------------------- |
| **Layout**               | Grid (3 col), Grid (2 col), Alternating (river) | Grid for impact, Alternating for storytelling         |
| **Show Icons**           | Yes/No                                          | Yes - improves scannability                           |
| **Show Linked Features** | Yes/No                                          | Yes for feature-focused pages, No for emotional pages |
| **Max Items**            | 3-8                                             | 3-4 for impact, 6-8 for comprehensive                 |

**Emotional Categories:**

Benefits are tagged with emotional categories for styling:

| Category      | Emoji | Color  | Use For                     |
| ------------- | ----- | ------ | --------------------------- |
| `mastery`     | 💪    | Purple | Performance/skill benefits  |
| `belonging`   | 🤝    | Green  | Social/community benefits   |
| `achievement` | 🏆    | Yellow | Progress/success benefits   |
| `convenience` | ⚡    | Blue   | Time/accessibility benefits |
| `fun`         | 🎉    | Pink   | Enjoyment benefits          |
| `confidence`  | 💪    | Purple | Self-efficacy benefits      |

**Example Configurations:**

**Homepage (Manual, Hero style):**

- Select: "Train Smarter", "Never Ride Alone", "See Real Progress"
- Layout: Grid (3 col)
- Show Icons: Yes
- Background: Black

**Persona Landing Page (By Persona):**

- Filter by: "Time-Crunched Professional"
- Layout: Alternating
- Show Linked Features: Yes
- Max Items: 4

---

### 3. TransformationTabs

**Purpose:** Deep-dive emotional comparison showing the journey from "before" to "after" for each goal.

**When to use:**

- Conversion-focused landing pages
- "Why Scootorama" sections
- Above testimonials
- Pricing page (above the fold)

**Configuration Options:**

| Setting           | Options                 | Recommendation                                      |
| ----------------- | ----------------------- | --------------------------------------------------- |
| **Tab Style**     | Pills, Underline, Boxed | Pills for modern, Underline for editorial           |
| **Show Benefits** | Yes/No                  | Yes - reinforces what they'll experience            |
| **Show Features** | Yes/No                  | Optional - adds detail but increases cognitive load |
| **Background**    | Black, Gray, White      | Gray (default) provides good contrast               |

**Example Page Placement:**

```
┌────────────────────────────────┐
│            Hero                │
├────────────────────────────────┤
│      TransformationTabs        │  ← "Your Transformation Journey"
│  [Tab 1] [Tab 2] [Tab 3]      │
│  ┌──────────┬──────────┐      │
│  │  BEFORE  │  AFTER   │      │
│  │  state   │  state   │      │
│  └──────────┴──────────┘      │
│  Benefits: ⚡ 💪 🤝            │
├────────────────────────────────┤
│      Social Proof              │
└────────────────────────────────┘
```

**Content Requirements:**

- Select 2-5 Goals
- Each Goal MUST have: `beforeState` and `afterState` filled in
- Benefits automatically pulled from Goals that reference supporting benefits

---

### 4. FeaturesByCategory

**Purpose:** Interactive feature browser that lets users explore by category. Reduces overwhelm by organizing 23+ features into digestible tabs.

**When to use:**

- Features page
- "How It Works" section
- Below goal/benefit sections (proof points)
- Product comparison pages

**Category Options:**

| Category       | Emoji | Example Features                                      |
| -------------- | ----- | ----------------------------------------------------- |
| `training`     | 🚴    | Structured Workouts, Training Plans, ERG Mode         |
| `social`       | 👥    | Group Rides, Clubs, Meetups                           |
| `racing`       | 🏁    | Events, Racing, Results & Rankings                    |
| `worlds`       | 🌍    | Virtual Worlds, Routes, Climbing                      |
| `analytics`    | 📊    | Zoom Power Testing, Honk Analytics, Progress Tracking |
| `hardware`     | ⚙️    | Smart Trainer Support, Device Compatibility           |
| `gamification` | 🎮    | Achievements, XP & Levels, Unlockables                |

**Configuration Options:**

| Setting                   | Options                          | Recommendation                                   |
| ------------------------- | -------------------------------- | ------------------------------------------------ |
| **Categories to Display** | Multi-select                     | 3-5 categories for focused pages                 |
| **Card Layout**           | Grid (3 col), Grid (2 col), List | Grid for visual features, List for descriptions  |
| **Show Images**           | Yes/No                           | Yes if features have good visuals                |
| **Show Description**      | Yes/No                           | Yes for exploratory pages, No for quick scanning |
| **Max per Category**      | 3-12                             | 6 is good default                                |

**Example Page Placement:**

```
┌────────────────────────────────┐
│       Hero / GoalsSection      │
├────────────────────────────────┤
│       BenefitsSection          │
├────────────────────────────────┤
│     FeaturesByCategory         │  ← "Everything Scootorama Has to Offer"
│  [Training] [Social] [Racing]  │
│  ┌────┐ ┌────┐ ┌────┐         │
│  │Feat│ │Feat│ │Feat│         │
│  │ 1  │ │ 2  │ │ 3  │         │
│  └────┘ └────┘ └────┘         │
├────────────────────────────────┤
│         FAQ / Pricing          │
└────────────────────────────────┘
```

---

## Page Templates

### Homepage

**Goal:** Introduce Scootorama, let visitors self-identify, show breadth of value.

```
1. Hero (existing)
   - Bold headline, video/image, CTA

2. GoalsSection
   - Heading: "What do you want to achieve?"
   - Goals: All 6 goals
   - Layout: Grid (3 col)
   - Show Transformation: Yes

3. BenefitsSection
   - Mode: Manual (top 3-4 benefits)
   - Layout: Grid
   - Show Icons: Yes

4. FeaturesByCategory
   - Categories: Training, Social, Racing
   - Max per category: 6
   - Show Images: Yes

5. Social Proof / Testimonials

6. Pricing Section
```

---

### Goal-Specific Landing Page (e.g., "Get Faster")

**Goal:** Convert visitors who have a specific goal in mind.

```
1. Hero
   - Headline speaks to goal: "Break Through Your Plateau"
   - CTA: Start Free Trial

2. TransformationTabs
   - Goals: Just the one goal (Improve Zoom Power)
   - Show Benefits: Yes
   - Tab style: Hidden (single goal = no tabs needed)

3. BenefitsSection
   - Mode: By Goal (Improve Zoom Power)
   - Layout: Alternating (river)
   - Max Items: 4

4. FeaturesByCategory
   - Categories: Training, Analytics
   - Focus on performance features

5. Social Proof (filtered to same goal)

6. CTA Section
```

---

### Persona Landing Page (e.g., "Time-Crunched Professional")

**Goal:** Speak directly to a specific user segment.

```
1. Hero
   - Headline: "Fit Fitness Into Your Schedule"
   - Image: Professional on trainer

2. BenefitsSection
   - Mode: By Persona (Time-Crunched Professional)
   - Layout: Grid (2 col)
   - Max Items: 4

3. GoalsSection
   - Goals: Build Consistency, Improve Zoom Power, Stay Fit Year-Round
   - Layout: Grid (3 col)

4. FeaturesByCategory
   - Categories: Training, Analytics
   - Highlight time-efficient features

5. Testimonials (from similar personas)

6. Pricing with "Every Minute Counts" benefit highlighted
```

---

### Features Page

**Goal:** Let users explore all Scootorama capabilities.

```
1. Hero
   - Headline: "Everything You Need to Train Smarter"

2. FeaturesByCategory (FULL)
   - Categories: All 7
   - Max per category: 12
   - Layout: Grid (3 col)
   - Show Images: Yes
   - Show Description: Yes

3. BenefitsSection
   - Mode: All by priority
   - Max Items: 8
   - Layout: Grid

4. CTA Section
```

---

## Best Practices

### Content Creation Checklist

**Before publishing a new Goal:**

- [ ] Title is action-oriented ("Get Faster" not "Speed")
- [ ] Before State captures emotional pain point
- [ ] After State paints aspirational outcome
- [ ] Timeframe is realistic
- [ ] Icon selected from icon library

**Before publishing a new Benefit:**

- [ ] Title is benefit-focused ("Never Ride Alone" not "Social Features")
- [ ] Description explains the emotional/practical value
- [ ] Emotional category assigned
- [ ] Linked to relevant Features
- [ ] Target Personas assigned
- [ ] Supports Goals assigned

**Before publishing a new Feature:**

- [ ] Title is clear and concise
- [ ] Tagline explains value in one line
- [ ] Category assigned
- [ ] Image uploaded (16:9)
- [ ] Description for feature pages

### Block Ordering Guidelines

**High-conversion page flow:**

1. **Hook** - Hero with emotional headline
2. **Self-identify** - GoalsSection or BenefitsSection
3. **Transform** - TransformationTabs showing before/after
4. **Prove** - Social proof / testimonials
5. **Explore** - FeaturesByCategory
6. **Convert** - Pricing / CTA

**Information-seeking page flow:**

1. **Hero** - Clear value prop
2. **Features** - FeaturesByCategory (full)
3. **Benefits** - BenefitsSection
4. **Social Proof**
5. **CTA**

### Common Mistakes to Avoid

❌ **Don't** use all blocks on every page - pick 2-3 that serve the page goal
❌ **Don't** show all 6 goals on conversion-focused pages - pick 2-3 relevant ones
❌ **Don't** use manual benefit selection when persona/goal filtering makes more sense
❌ **Don't** forget to fill in Before/After states - TransformationTabs depends on them
❌ **Don't** show features without benefits - features are "what," benefits are "so what"

✅ **Do** match block content to page visitor intent
✅ **Do** use consistent visual styling across blocks (same backgrounds)
✅ **Do** test different goal orderings - first goal gets most attention
✅ **Do** keep benefit sections to 3-4 items for maximum impact
✅ **Do** use feature categories strategically - don't show all 7 at once

---

## Technical Notes

### Adding a Block to a Page

1. Open the page in Sanity Studio
2. In the "Page Sections" field, click "+"
3. Select the block type (goalsSection, benefitsSection, etc.)
4. Configure the block settings
5. Publish the page

### Content Relationships

```
Personas ──references──▶ Goals (which goals this persona has)
Benefits ──references──▶ Features (which features enable this benefit)
Benefits ──references──▶ Personas (which personas this benefit targets)
Benefits ──references──▶ Goals (which goals this benefit supports)
Features ──categorized──▶ Feature Type (training, social, racing, etc.)
```

### GROQ Query Fragments

All blocks use fragments from `sanity/lib/queries.ts`:

- `GOALS_SECTION_FRAGMENT`
- `BENEFITS_SECTION_FRAGMENT`
- `TRANSFORMATION_TABS_FRAGMENT`
- `FEATURES_BY_CATEGORY_FRAGMENT`

These handle localization automatically via `$language` parameter.

---

## Quick Wins

### 5-Minute Page Improvements

1. **Add a GoalsSection below hero** - Increases engagement by letting visitors self-identify
2. **Switch BenefitsSection to persona filtering** - Shows more relevant content automatically
3. **Add TransformationTabs above pricing** - Reminds visitors of the transformation before asking for money
4. **Limit FeaturesByCategory to 3 categories** - Reduces overwhelm, increases feature click-through

### Content Audit Checklist

Run through your content library monthly:

- [ ] All Goals have Before/After states filled in
- [ ] All Benefits linked to at least one Feature
- [ ] All Benefits have Emotional Category assigned
- [ ] All Features have Category assigned
- [ ] All Features have images (16:9)
- [ ] Priority scores reflect actual importance
