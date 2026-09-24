/**
 * Single source of truth for brand identity.
 *
 * Components, metadata, structured data and OG images read from here rather
 * than hard-coding the brand, so a rename is a one-file change. Scootorama is
 * a fictional product built as a portfolio piece.
 */

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://scootorama.example'
).replace(/\/$/, '')

export const brand = {
  name: 'Scootorama',
  /** Uppercase wordmark used where the logo renders as text */
  wordmark: 'SCOOTORAMA',
  tagline: 'The wackiest scooter adventure on (or off) Earth.',
  description:
    'Scootorama is the indoor scootering playland where you kick, glide and honk your way through over-romanticized wonders of the world, from Bora Bora to the Alamo.',
  siteUrl,
  logo: {
    /** Square mark, used for structured data and favicons */
    mark: '/brand/scootorama-mark.svg',
    wordmark: '/brand/scootorama-wordmark.svg',
  },
  /** Raw hex values for contexts where Tailwind classes are unavailable (OG images, emails) */
  colors: {
    primary: '#D6117A',
    primaryLight: '#FF4FA8',
    secondary: '#00858C',
    secondaryLight: '#2CC4C4',
    lime: '#7CC21E',
    yellow: '#FFD21F',
    purple: '#8B5CF6',
    ink: '#241E3A',
    cream: '#FFFBF0',
  },
  social: {
    instagram: 'https://instagram.com/scootorama.example',
    youtube: 'https://youtube.com/@scootorama.example',
  },
  /** Community member nickname, e.g. "Welcome, Scooters!" */
  memberNoun: 'Scooter',
  memberNounPlural: 'Scooters',
} as const

/** Slug of the Sanity page document rendered at /[market]/[lang] */
export const HOME_SLUG = 'home'

/** Build an absolute URL on the brand site from a path */
export function absoluteUrl(path = '/'): string {
  return `${brand.siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
