import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  ;(await draftMode()).disable()

  const url = new URL(request.url)
  const redirectTo = url.searchParams.get('redirect') || '/'

  redirect(redirectTo)
}
