// Environment variables must be referenced literally (process.env.NAME), never
// via a computed key: Next.js and the Sanity CLI only inline values into
// browser bundles (such as the embedded Studio) when they can see the name.
//
// NEXT_PUBLIC_* is read by the Next.js app and the /studio route.
// SANITY_STUDIO_* is read when running the standalone Studio (`npm run studio`).

const MISSING_PROJECT_ID = 'missing-project-id'

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  process.env.SANITY_STUDIO_API_VERSION ||
  '2025-12-12'

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  'production'

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  MISSING_PROJECT_ID

// Without this, a missing ID surfaces as a confusing CORS error against a
// non-existent project. Restart the dev server after editing .env.local.
if (projectId === MISSING_PROJECT_ID) {
  console.error(
    'Sanity project ID is not set. Add NEXT_PUBLIC_SANITY_PROJECT_ID to .env.local (next to package.json) and restart `npm run dev`.'
  )
}
