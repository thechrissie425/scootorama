import { Metadata } from 'next'
import { sanityFetch } from '@/sanity/lib/live'
import { notFound } from 'next/navigation'
import RouteIndexGrid from '@/components/blocks/RouteIndexGrid'
import { brand } from '@/lib/brand'

const ROUTES_QUERY = `*[_type == "route"] | order(world asc, difficulty desc) {
  _id,
  routeId,
  "name": name.en,
  world,
  sportType,
  distance,
  elevation,
  difficulty,
  featured,
  tags,
  "description": description.en,
  "highlights": highlights.en,
  heroImage,
  mapImage,
  imageUrl,
  profileImageUrl,
  slug
}`

export const metadata: Metadata = {
  title: `Routes | ${brand.name}`,
  description:
    'Explore every route across Bora Bora Bungalow Bay, Alamo-Rama, Dino Detour and more. Find the perfect route for your next kick or cruise.',
}

interface RoutePageProps {
  params: Promise<{
    market: string
    lang: string
  }>
}

export default async function RoutesPage({ params }: RoutePageProps) {
  const { market, lang } = await params

  const { data: routes } = await sanityFetch({
    query: ROUTES_QUERY,
    params: {},
  })

  if (!routes || routes.length === 0) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-brand-ink">
      <RouteIndexGrid routes={routes} market={market} language={lang} />
    </main>
  )
}
