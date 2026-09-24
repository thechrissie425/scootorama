import { redirect } from 'next/navigation'

// For any root-level routes that don't have specific handlers,
// we'll redirect them to the localized version for now
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const path = slug ? slug.join('/') : ''

  // If this is a URL that looks like it should be localized content,
  // redirect to the US English version
  redirect(`/us/en/${path}`)
}
