/**
 * Scootorama starter content as Sanity documents.
 *
 * Pure data: no network access, so it can be validated offline. Pass a map of
 * image name -> uploaded Sanity asset _id (see IMAGE_NAMES).
 */
import { HOME_SLUG } from '../../lib/brand'
import { ROUTES, WORLDS } from '../../lib/worlds'

const TIERS = {
  standard: 'Clubhouse Pass',
  deluxe: 'Deluxe Pass',
  family: 'Family Pass',
} as const

// ----------------------------------------------------------------- helpers

let keyCounter = 0
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`

/** Localized string/text field ({ en }) */
const L = (en: string) => ({ en })

/** Localized portable text field ({ en: [blocks] }) */
const LB = (...paragraphs: string[]) => ({
  en: paragraphs.map(text => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  })),
})

const ref = (_ref: string) => ({ _type: 'reference', _ref })
const keyedRef = (_ref: string) => ({ _type: 'reference', _ref, _key: key() })
const slug = (current: string) => ({ _type: 'slug', current })

let assetIds: Record<string, string> = {}

const img = (name: string, alt: string) => {
  if (!assetIds[name]) throw new Error(`Image not uploaded: ${name}`)
  return { _type: 'image', asset: ref(assetIds[name]), alt }
}

const internalLink = (label: string, targetId: string, style = 'primary') => ({
  _type: 'link',
  label: L(label),
  style,
  linkType: 'internal',
  internalLink: ref(targetId),
})

export const worldImage = (worldId: string) => `world-${worldId}`

/** Every image the content references, by name (see imageFileName) */
export const IMAGE_NAMES = [
  'home-hero',
  ...WORLDS.map(w => worldImage(w.id)),
  'product-cruiser-deluxe',
  'product-kick-stand',
  'product-honk-honk-buttons',
  'campaign-luau-week',
  'campaign-saucer-season',
  'lockup-luau-week',
  'lockup-saucer-season',
]

/** File in scripts/seed/images for an image name (lockups are transparent PNGs) */
export const imageFileName = (name: string) =>
  `${name}${name.startsWith('lockup-') ? '.png' : '.jpg'}`

const color = (hex: string) => ({ _type: 'color', hex })

// --------------------------------------------------------------- documents

export function buildDocuments(
  images: Record<string, string>
): Record<string, unknown>[] {
  assetIds = images
  keyCounter = 0
  const docs: Record<string, unknown>[] = []

  // --- Routes (one per catalog entry) ---
  for (const r of ROUTES) {
    const world = WORLDS.find(w => w.name === r.world)!
    docs.push({
      _id: `route-${r.id}`,
      _type: 'route',
      routeId: r.id,
      name: L(r.name),
      slug: slug(r.id),
      world: r.world,
      sportType: r.sportType,
      distance: r.distanceKm,
      elevation: r.elevationMeters,
      difficulty: r.difficulty,
      description: L(r.description),
      highlights: L(r.highlights),
      tags: r.tags,
      featured: !!r.featured,
      heroImage: img(worldImage(world.id), `${r.world}: ${r.name}`),
    })
  }

  // --- Membership features (drive the pricing comparison) ---
  const features = [
    {
      id: 'feature-all-worlds',
      title: 'All six wacky worlds',
      description:
        'Unlimited scooting in Bora Bora, Alamo-Rama, Dino Detour and friends.',
      type: 'worlds',
      tiers: [TIERS.standard, TIERS.deluxe, TIERS.family],
      image: worldImage('bora-bora-bungalow-bay'),
    },
    {
      id: 'feature-group-rides',
      title: 'Parade group rides',
      description:
        'Join hundreds of Scooters in costume for scheduled parades with a live marching band.',
      type: 'social',
      tiers: [TIERS.standard, TIERS.deluxe, TIERS.family],
      image: worldImage('petit-paree'),
    },
    {
      id: 'feature-kick-plans',
      title: 'Kick training plans',
      description:
        'Structured plans from "First Push" to "Gâteau Tower Champion", built by our coaching team.',
      type: 'training',
      tiers: [TIERS.standard, TIERS.deluxe, TIERS.family],
      image: worldImage('dino-detour'),
    },
    {
      id: 'feature-races',
      title: 'Saucer Cup racing',
      description:
        'Weekly races with tractor beams, rubber-chicken drafts and a trophy shaped like a cake.',
      type: 'racing',
      tiers: [TIERS.deluxe, TIERS.family],
      image: worldImage('roswell-saucer-speedway'),
    },
    {
      id: 'feature-honk-stats',
      title: 'Honk analytics',
      description:
        'Zoom Power, cadence and honks-per-minute, charted in glorious technicolor.',
      type: 'analytics',
      tiers: [TIERS.deluxe, TIERS.family],
      image: worldImage('niagara-honeymoon-heights'),
    },
    {
      id: 'feature-family-profiles',
      title: 'Up to five family profiles',
      description:
        'One pass for the whole household, with separate progress, costumes and bragging rights.',
      type: 'social',
      tiers: [TIERS.family],
      image: worldImage('alamo-rama'),
    },
  ]
  features.forEach((f, i) =>
    docs.push({
      _id: f.id,
      _type: 'feature',
      title: L(f.title),
      slug: slug(f.id.replace('feature-', '')),
      description: L(f.description),
      featureType: f.type,
      availability: f.tiers,
      rank: i + 1,
      pricingLabel: L(f.title),
      tooltipDescription: L(f.description),
      image: img(f.image, f.title),
      isActive: true,
    })
  )

  // --- Pricing tiers ---
  const tier = (
    id: string,
    tierId: string,
    title: string,
    tagline: string,
    usd: [number, number],
    gbp: [number, number],
    color: string,
    image: string,
    badge?: string
  ) => ({
    _id: id,
    _type: 'pricingTier',
    title: L(title),
    tierId,
    tagline: L(tagline),
    prices: [
      {
        _key: key(),
        currency: 'USD',
        monthlyPrice: usd[0],
        annualPrice: usd[1],
        trialDays: 14,
      },
      {
        _key: key(),
        currency: 'GBP',
        monthlyPrice: gbp[0],
        annualPrice: gbp[1],
        trialDays: 14,
      },
    ],
    ...(badge ? { badgeText: L(badge) } : {}),
    themeColor: color,
    heroImage: img(image, title),
    cta: internalLink('Start free trial', 'membership'),
  })
  docs.push(
    tier(
      'tier-clubhouse',
      TIERS.standard,
      'Clubhouse Pass',
      'Every world, every parade, one tiny price.',
      [9.99, 99],
      [8.99, 89],
      '#00858C',
      worldImage('bora-bora-bungalow-bay')
    ),
    tier(
      'tier-deluxe',
      TIERS.deluxe,
      'Deluxe Pass',
      'Racing, honk analytics and a gold bow tie.',
      [14.99, 149],
      [12.99, 129],
      '#D6117A',
      worldImage('roswell-saucer-speedway'),
      'Most honked'
    ),
    tier(
      'tier-family',
      TIERS.family,
      'Family Pass',
      'Up to five Scooters under one roof.',
      [21.99, 219],
      [18.99, 189],
      '#8B5CF6',
      worldImage('alamo-rama')
    )
  )

  // --- Products + product pages ---
  const products = [
    {
      id: 'cruiser-deluxe',
      title: 'Cruiser Deluxe',
      type: 'cruiser',
      image: 'product-cruiser-deluxe',
      description:
        'The all-in-one smart scooter with chrome fenders, auto-resistance deck and factory-fitted streamers.',
      eyebrow: 'Smart scooter',
      heroTitle: 'The Cruiser Deluxe',
      heroCopy:
        'Chrome fenders, a self-adjusting kick deck and streamers that flutter faster the harder you push. It is the whole playhouse on two wheels.',
      usd: 1299,
      gbp: 1149,
      stickers: [{ text: 'New!', style: 'starburst', color: '#FFD21F' }],
      specs: [
        ['Weight', 'single', 14.5, 'kilograms'],
        ['Deck length', 'single', 58, 'centimeters'],
        ['Max resistance', 'single', 900, 'watts'],
        ['Rider height', 'range', [140, 200], 'centimeters'],
      ],
      highlights: [
        [
          'Auto-Kick deck',
          'The deck reads your push and sets the resistance, from boardwalk breeze to cake-tower climb.',
          worldImage('petit-paree'),
        ],
        [
          'Streamers that react',
          'Factory-fitted streamers flutter faster the harder you kick. Pure, unmeasurable joy.',
          'product-cruiser-deluxe',
        ],
        [
          'Every world, day one',
          'Unbox, plug in and you are gliding through Bora Bora before the kettle boils.',
          worldImage('bora-bora-bungalow-bay'),
        ],
      ],
      who: [
        {
          title: 'First-time Scooters',
          subtitle: 'Unbox, plug in, push off.',
          icon: 'Users',
          features: ['Assembles in 10 minutes', 'Kid-to-grown-up adjustable'],
        },
        {
          title: 'Parade regulars',
          subtitle: 'Realistic feel for long cruises.',
          icon: 'Zap',
          features: ['Road-feel deck', 'Built-in Honk-Honk Buttons'],
        },
      ],
    },
    {
      id: 'kick-stand',
      title: 'Kick-Stand',
      type: 'kickstand',
      image: 'product-kick-stand',
      description:
        'Turn the scooter you already own into a Scootorama scooter with this smart roller stand.',
      eyebrow: 'Indoor trainer',
      heroTitle: 'The Kick-Stand',
      heroCopy:
        'Clip in any kick scooter, press the big yellow button and you are gliding through Petit Paree before your tea goes cold.',
      usd: 449,
      gbp: 399,
      stickers: [],
      specs: [
        ['Weight', 'single', 9, 'kilograms'],
        ['Max resistance', 'single', 650, 'watts'],
        ['Wheel sizes', 'text', 'Fits 100–230 mm wheels', 'none'],
      ],
      highlights: [
        [
          'Keep your ride',
          'Clamp in the kick scooter you already love. No tools, no fuss, no goodbyes.',
          'product-kick-stand',
        ],
        [
          'Real road feel',
          'A weighted chrome roller gives every push the glide of a freshly paved boardwalk.',
          worldImage('alamo-rama'),
        ],
        [
          'Folds flat',
          'Slides under the sofa when you are done, next to the other things you are not using.',
          worldImage('dino-detour'),
        ],
      ],
      who: [
        {
          title: 'Scooter owners',
          subtitle: 'Keep the ride you love.',
          icon: 'Wrench',
          features: ['Tool-free clamp', 'Folds flat under the sofa'],
        },
      ],
    },
    {
      id: 'honk-honk-buttons',
      title: 'Honk-Honk Buttons',
      type: 'controller',
      image: 'product-honk-honk-buttons',
      description:
        'Handlebar controllers with a genuine rubber bulb horn. Steer, emote and honk without letting go.',
      eyebrow: 'Controllers',
      heroTitle: 'Honk-Honk Buttons',
      heroCopy:
        'Two chunky handlebar pods and one extremely satisfying bulb horn. Trigger power-ups, wave to friends and honk at dinosaurs.',
      usd: 79,
      gbp: 69,
      stickers: [{ text: 'Honk!', style: 'circle', color: '#FF4FA8' }],
      specs: [
        ['Battery life', 'text', 'About 40 hours of honking', 'none'],
        ['Weight (pair)', 'single', 0.3, 'kilograms'],
      ],
      highlights: [
        [
          'Power-ups at your thumbs',
          'Trigger Rocket Streamers and Bubble Shields without letting go of the bars.',
          'product-honk-honk-buttons',
        ],
        [
          'A genuine bulb horn',
          'Real rubber, real honk. Your fellow Scooters will hear you coming across the lagoon.',
          worldImage('niagara-honeymoon-heights'),
        ],
        [
          'Wave, cheer, emote',
          'Say hi to the little green locals in Roswell with one press.',
          worldImage('roswell-saucer-speedway'),
        ],
      ],
      who: [
        {
          title: 'Every Scooter',
          subtitle: 'Works with the Cruiser Deluxe and the Kick-Stand.',
          icon: 'Zap',
          features: ['Bluetooth pairing', 'Swappable bulb colors'],
        },
      ],
    },
  ]

  for (const p of products) {
    docs.push({
      _id: `product-${p.id}`,
      _type: 'product',
      title: L(p.title),
      image: img(p.image, p.title),
      description: L(p.description),
      stickers: p.stickers.map(s => ({
        _key: key(),
        text: s.text,
        style: s.style,
        rotation: -8,
        position: 'top-right',
        displayType: 'text',
        color: s.color,
      })),
      markets: [
        {
          _key: key(),
          region: 'US',
          currency: 'USD',
          price: p.usd,
          releaseDate: '2026-06-01',
          fulfillmentMethod: 'direct',
        },
        {
          _key: key(),
          region: 'UK',
          currency: 'GBP',
          price: p.gbp,
          releaseDate: '2026-06-01',
          fulfillmentMethod: 'direct',
        },
      ],
    })
    docs.push({
      _id: `productPage-${p.id}`,
      _type: 'productPage',
      product: ref(`product-${p.id}`),
      slug: slug(p.id),
      marketingTitle: L(p.title),
      productType: p.type,
      hero: {
        _type: 'heroProduct',
        eyebrow: L(p.eyebrow),
        title: L(p.heroTitle),
        description: L(p.heroCopy),
        productImage: img(p.image, p.title),
        theme: 'dark',
      },
      techSpecs: [
        {
          _key: key(),
          _type: 'techSpec',
          category: L('The nitty gritty'),
          specs: p.specs.map(([label, specType, value, unit]) => ({
            _key: key(),
            label: L(label as string),
            specType,
            unit,
            ...(specType === 'single' ? { value } : {}),
            ...(specType === 'range'
              ? {
                  minValue: (value as number[])[0],
                  maxValue: (value as number[])[1],
                }
              : {}),
            ...(specType === 'text' ? { textValue: L(value as string) } : {}),
          })),
        },
      ],
      whoIsItFor: p.who.map(w => ({ _key: key(), _type: 'whoIsItFor', ...w })),
      features: [
        {
          _key: key(),
          _type: 'river',
          heading: L(`Why you’ll love the ${p.title}`),
          items: p.highlights.map(([title, description, image]) => ({
            _key: key(),
            _type: 'riverItem',
            source: 'manual',
            title: L(title),
            description: L(description),
            image: img(image, title),
            layout: 'auto',
          })),
        },
      ],
    })
  }

  // --- Stats ---
  const stats: [string, number, string, string?][] = [
    ['stat-worlds', WORLDS.length, 'Wacky worlds'],
    ['stat-routes', ROUTES.length, 'Routes to scoot', '+'],
    ['stat-honks', 12000000, 'Honks honked', '+'],
    ['stat-dinos', 0, 'Dinosaurs harmed'],
  ]
  for (const [id, value, label, suffix] of stats) {
    docs.push({
      _id: id,
      _type: 'stat',
      label: L(label),
      smartValue: {
        _type: 'smartNumber',
        value,
        unit: 'none',
        notation: value >= 10000 ? 'compact' : 'standard',
        ...(suffix ? { suffix } : {}),
      },
    })
  }

  // --- Social proof ---
  const quotes = [
    [
      'I came for the cardio. I stayed because a brontosaurus waved at me.',
      'Dolores P.',
      'Scooter since 2026',
      'community',
    ],
    [
      'My kids race me up the cake tower every night. I have never lost so gracefully.',
      'Marcus T.',
      'Family Pass holder',
      'community',
    ],
    [
      'The most joyful thing to happen to indoor fitness since the invention of the snack break.',
      'The Daily Kick',
      'Fictional fitness weekly',
      'industry',
    ],
  ]
  quotes.forEach(([quote, author, role, type], i) =>
    docs.push({
      _id: `proof-${i + 1}`,
      _type: 'socialProof',
      quote: L(quote),
      author: L(author),
      role: L(role),
      type,
      starRating: 5,
      ...(type === 'industry' ? { publicationColor: '#A00C5A' } : {}),
    })
  )

  // --- FAQs ---
  const faqs: [string, string][] = [
    [
      'Do I need a special scooter?',
      'Nope. The Kick-Stand works with most kick scooters, or grab the all-in-one Cruiser Deluxe.',
    ],
    [
      'Is Scootorama a real product?',
      'Scootorama is a fictional brand built as a design and engineering portfolio piece. The honks, sadly, are also fictional.',
    ],
    [
      'Can the whole family ride?',
      'Yes! The Family Pass covers up to five profiles, each with their own progress and costumes.',
    ],
    [
      'Is there really a basement in Alamo-Rama?',
      'We are legally unable to comment.',
    ],
  ]
  faqs.forEach(([q, a], i) =>
    docs.push({
      _id: `faq-${i + 1}`,
      _type: 'faqItem',
      question: L(q),
      answer: LB(a),
    })
  )

  // --- Membership page ---
  docs.push({
    _id: 'membership',
    _type: 'membershipPage',
    title: L('Clubhouse Pass'),
    slug: slug('membership'),
    standardTier: ref('tier-clubhouse'),
    plusTier: ref('tier-deluxe'),
    householdTier: ref('tier-family'),
    benefits: features.map((f, i) => ({
      _key: key(),
      feature: ref(f.id),
      media: img(f.image, f.title),
      layout: i % 3 === 0 ? 'full' : 'half',
    })),
  })

  // --- Home page ---
  docs.push({
    _id: 'page-home',
    _type: 'page',
    title: L('Home'),
    slug: slug(HOME_SLUG),
    seo: {
      _type: 'seo',
      metaTitle: L('Scootorama | The wackiest scooter adventure on Earth'),
      metaDescription: L(
        'Kick, glide and honk your way through Bora Bora, the Alamo, a desert full of dinosaurs and more. Indoor scootering, but make it a playhouse.'
      ),
    },
    content: [
      {
        _key: key(),
        _type: 'hero',
        heading: L('Kick. Glide. Honk.'),
        subheading: L(
          'Indoor scootering through the wackiest wonders of the world. Bora Bora before breakfast, the Alamo after lunch.'
        ),
        layout: 'bottom-left',
        backgroundImage: img(
          'home-hero',
          'A scooter on a checkerboard road under a smiling sun, with palm trees, a cake tower, a flying saucer and a dinosaur on the horizon'
        ),
        cta: internalLink('Get your Clubhouse Pass', 'membership'),
        priority: 'high',
      },
      {
        _key: key(),
        _type: 'statsGrid',
        theme: 'light',
        stats: stats.map(([id]) => keyedRef(id)),
      },
      {
        _key: key(),
        _type: 'river',
        heading: L('Why Scootorama?'),
        subtitle: L('Because treadmills never waved back.'),
        items: [
          {
            _key: key(),
            _type: 'riverItem',
            source: 'manual',
            title: L('Six worlds. Zero chill.'),
            description: L(
              'Glide overwater bungalows in Bora Bora, dodge giant dinosaurs on the Dino Detour and climb a seven-layer cake tower in Petit Paree.'
            ),
            image: img(
              worldImage('bora-bora-bungalow-bay'),
              'Bora Bora Bungalow Bay'
            ),
            layout: 'auto',
          },
          {
            _key: key(),
            _type: 'riverItem',
            source: 'manual',
            title: L('Parades, not pelotons'),
            description: L(
              'Join a costumed parade with a live marching band, or race the Saucer Cup under a tractor beam.'
            ),
            image: img(
              worldImage('roswell-saucer-speedway'),
              'Roswell Saucer Speedway'
            ),
            layout: 'auto',
          },
          {
            _key: key(),
            _type: 'riverItem',
            source: 'manual',
            title: L('Honk your heart out'),
            description: L(
              'Honk-Honk Buttons put power-ups, emotes and a real rubber bulb horn right on your handlebars.'
            ),
            image: img('product-honk-honk-buttons', 'Honk-Honk Buttons'),
            layout: 'auto',
          },
        ],
      },
      {
        _key: key(),
        _type: 'featureGrid',
        heading: L('Pick a world, any world'),
        items: WORLDS.map((w, i) => ({
          _key: key(),
          _type: 'manualItem',
          title: L(w.name),
          subtitle: L(w.tagline),
          image: img(worldImage(w.id), w.name),
          size: i === 0 ? 'big' : i === 3 ? 'wide' : 'square',
          theme: i % 2 === 0 ? 'light' : 'dark',
          link: '/us/en/routes',
        })),
      },
      {
        _key: key(),
        _type: 'productGrid',
        heading: L('Gear up'),
        columns: 3,
        showPricing: true,
        ctaText: L('Take a look'),
        products: products.map(p => keyedRef(`product-${p.id}`)),
      },
      {
        _key: key(),
        _type: 'pricingBlock',
        title: L('Pick your pass'),
        layoutVariant: 'cards',
        tiers: ['tier-clubhouse', 'tier-deluxe', 'tier-family'].map(keyedRef),
      },
      {
        _key: key(),
        _type: 'socialProofSection',
        heading: L('Scooters are saying'),
        layout: 'grid',
        items: quotes.map((_, i) => keyedRef(`proof-${i + 1}`)),
      },
      {
        _key: key(),
        _type: 'faqSection',
        heading: L('Frequently honked questions'),
        loadMode: 'manual',
        questions: faqs.map((_, i) => keyedRef(`faq-${i + 1}`)),
      },
    ],
  })

  // --- Site settings (header, footer, UI labels) ---
  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    mainNav: [
      {
        _key: key(),
        _type: 'navItem',
        label: 'Shop',
        type: 'mega',
        featuredCard: {
          heading: 'Meet the Cruiser Deluxe',
          image: img('product-cruiser-deluxe', 'Cruiser Deluxe'),
          link: ref('productPage-cruiser-deluxe'),
        },
        subLinks: products.map(p => ({
          _key: key(),
          _type: 'subLink',
          title: p.title,
          targetPage: ref(`productPage-${p.id}`),
          description: p.eyebrow,
        })),
      },
      {
        _key: key(),
        _type: 'navItem',
        label: 'Worlds',
        type: 'mega',
        subLinks: [
          {
            _key: key(),
            _type: 'subLink',
            title: 'All routes',
            url: '/us/en/routes',
            icon: 'map',
            description: `${ROUTES.length} routes across ${WORLDS.length} worlds`,
          },
        ],
      },
      {
        _key: key(),
        _type: 'navItem',
        label: 'Clubhouse Pass',
        type: 'link',
        link: ref('membership'),
      },
    ],
    footerNav: [
      {
        _key: key(),
        heading: 'Play',
        links: [
          { _key: key(), label: 'Worlds & routes', url: '/routes' },
          { _key: key(), label: 'Clubhouse Pass', url: '/membership' },
        ],
      },
      {
        _key: key(),
        heading: 'Shop',
        links: products.map(p => ({
          _key: key(),
          label: p.title,
          url: `/products/${p.id}`,
        })),
      },
    ],
    socialLinks: [
      {
        _key: key(),
        platform: 'Instagram',
        url: 'https://instagram.com/scootorama.example',
      },
      {
        _key: key(),
        platform: 'YouTube',
        url: 'https://youtube.com/@scootorama.example',
      },
    ],
    copyrightText: L(
      '© Scootorama. A fictional brand made for a portfolio. No dinosaurs were harmed.'
    ),
    productPageLabels: {
      productInfo: L('Product info'),
      keyFeatures: L('Key features'),
      techSpecs: L('Tech specs'),
      whoItsFor: L('Who it’s for'),
    },
    pricingUI: {
      monthlyLabel: L('Monthly'),
      annualLabel: L('Yearly'),
      discountLabel: L('2 months free'),
      saveUpTo: L('Save up to'),
      ctaFallback: L('Start free trial'),
    },
  })

  // --- Campaign takeovers ---
  // Each campaign is three documents: a takeoverTheme (look), a
  // takeoverActivation (schedule, targeting, placement) and a campaign page.
  const takeovers = [
    {
      id: 'luau-week',
      name: 'Luau Week',
      description:
        'Summer luau on Bora Bora Bungalow Bay: hibiscus coral, lagoon teal and a confetti welcome.',
      colors: {
        primary: '#C7361C',
        secondary: '#0B7A7C',
        tertiary: '#0B3B3F',
        accent: '#FFD21F',
        confetti: ['#FF5A36', '#FFD21F', '#2CC4C4', '#7CC21E', '#FF4FA8'],
      },
      effects: { confetti: true, confettiDensity: 'medium', particles: 'none' },
      art: 'campaign-luau-week',
      lockup: 'lockup-luau-week',
      start: '2027-06-21T00:00:00Z',
      end: '2027-06-28T23:59:00Z',
      banner:
        'Luau Week is here: double confetti on every Bora Bora route through June 28.',
      bannerCta: 'Grab a lei',
      campaign: {
        title: 'Luau Week',
        hook: 'Seven days of sunset scoots, tiki-torch parades and the world’s largest virtual lei.',
        mechanics: [
          'Ride any Bora Bora Bungalow Bay route to earn a flower for your lei',
          'Collect 7 flowers in 7 days to complete the Grand Lei',
          'Join the nightly Tiki Torch Twilight parade for a bonus hibiscus',
        ],
        unlocks: [
          [
            'Grand Lei',
            'Complete all 7 flowers',
            'A full-color lei for your Scooter, worn with pride.',
            worldImage('bora-bora-bungalow-bay'),
          ],
          [
            'Tiki Torch Streamers',
            'Ride 3 twilight parades',
            'Handlebar streamers that flicker like torchlight.',
            'product-cruiser-deluxe',
          ],
          [
            'Coconut Horn',
            'Honk 100 times during the week',
            'Your Honk-Honk Buttons now make a very satisfying “bonk”.',
            'product-honk-honk-buttons',
          ],
        ],
      },
    },
    {
      id: 'saucer-season',
      name: 'Saucer Season',
      description:
        'After-dark takeover from Roswell Saucer Speedway: neon lime, deep space purple and twinkling stars.',
      colors: {
        primary: '#6D28D9',
        secondary: '#4D7C0F',
        tertiary: '#0D0826',
        accent: '#7CC21E',
        confetti: ['#7CC21E', '#2CC4C4', '#FF4FA8'],
      },
      effects: { confetti: false, confettiDensity: 'low', particles: 'stars' },
      art: 'campaign-saucer-season',
      lockup: 'lockup-saucer-season',
      start: '2026-10-24T00:00:00Z',
      end: '2026-11-02T23:59:00Z',
      banner:
        'Saucer Season has landed: race the Saucer Cup under the tractor beam until November 2.',
      bannerCta: 'Beam me up',
      campaign: {
        title: 'Saucer Season',
        hook: 'The saucers are back over Roswell. Race by starlight, collect crop circles and get beamed up in style.',
        mechanics: [
          'Race any Roswell Saucer Speedway route after dark to enter the Saucer Cup',
          'Pass through crop circles to fill your tractor-beam meter',
          'Top 100 Scooters each night get beamed to the leaderboard mothership',
        ],
        unlocks: [
          [
            'Little Green Co-Pilot',
            'Finish 5 Saucer Cup races',
            'A tiny alien rides in your front basket and cheers you on.',
            worldImage('roswell-saucer-speedway'),
          ],
          [
            'Tractor-Beam Deck',
            'Collect 50 crop circles',
            'Your deck glows lime whenever you draft.',
            'product-kick-stand',
          ],
          [
            'Theremin Horn',
            'Honk at 10 saucers',
            'Every honk now goes “wooOOoo”.',
            'product-honk-honk-buttons',
          ],
        ],
      },
    },
  ]

  for (const t of takeovers) {
    docs.push({
      _id: `takeoverTheme-${t.id}`,
      _type: 'takeoverTheme',
      name: t.name,
      slug: slug(t.id),
      description: t.description,
      colors: {
        primary: color(t.colors.primary),
        secondary: color(t.colors.secondary),
        tertiary: color(t.colors.tertiary),
        accent: color(t.colors.accent),
        confetti: t.colors.confetti.map(hex => ({
          ...color(hex),
          _key: key(),
        })),
      },
      effects: { ...t.effects, glow: false },
      fonts: {},
      branding: { logo: img(t.lockup, `${t.name} logo`) },
      hero: {
        backgroundPattern: img(t.art, `${t.name} key art`),
        overlayOpacity: 75,
        gradientOverlay: color(t.colors.tertiary),
        textShadow: true,
      },
    })
    docs.push({
      _id: `takeoverActivation-${t.id}`,
      _type: 'takeoverActivation',
      name: t.name,
      description: t.description,
      theme: ref(`takeoverTheme-${t.id}`),
      startDate: t.start,
      endDate: t.end,
      isActive: true,
      targeting: { markets: ['us', 'uk'], segments: ['all'] },
      takeover: {
        enabled: true,
        scope: 'global',
        navBar: {
          backgroundColor: color(t.colors.tertiary),
          logo: img(t.lockup, `${t.name} logo`),
        },
        globalBanner: {
          enabled: true,
          text: L(t.banner),
          backgroundColor: color(t.colors.tertiary),
          ctaText: L(t.bannerCta),
          ctaUrl: `/campaigns/${t.id}`,
        },
      },
      applyTo: {
        hero: true,
        firecracker: true,
        productPages: true,
        checkout: false,
      },
      previewToken: t.id,
      analytics: { utmCampaign: t.id.replace(/-/g, '_') },
    })
    docs.push({
      _id: `campaign-${t.id}`,
      _type: 'campaign',
      title: L(t.campaign.title),
      slug: slug(t.id),
      status: 'upcoming',
      dates: { start: t.start, end: t.end },
      image: img(t.art, `${t.name} key art`),
      logo: img(t.lockup, `${t.name} logo`),
      primaryColor: color(t.colors.primary),
      secondaryColor: color(t.colors.secondary),
      hook: L(t.campaign.hook),
      mechanics: t.campaign.mechanics,
      unlocks: t.campaign.unlocks.map(
        ([name, requirement, description, image]) => ({
          _key: key(),
          name: L(name),
          requirement,
          description: L(description),
          image: img(image, name),
        })
      ),
      faqs: [keyedRef('faq-2'), keyedRef('faq-4')],
      cta: internalLink('Get your Clubhouse Pass', 'membership'),
    })
  }

  return docs
}
