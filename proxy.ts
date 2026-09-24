import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n'
import {
  TAKEOVER_PREVIEW_COOKIE,
  TAKEOVER_PREVIEW_PARAM,
} from '@/lib/takeoverPreview'

// Define valid markets to prevent false positives
const VALID_MARKETS = ['us', 'eu', 'uk', 'ca', 'au', 'jp']
const VALID_LANGS = SUPPORTED_LANGUAGES.map(lang => lang.code)

const EXCLUDED_PATHS = [
  '/api',
  '/studio',
  '/_next',
  '/favicon.ico',
  '/sitemap.xml',
  '/robots.txt',
]

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // 1. SKIP INTERNAL PATHS
  if (EXCLUDED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 2. TAKEOVER PREVIEW: ?takeover=<previewToken> stores the token in a
  // session cookie (read by getActiveTakeover) and redirects to the clean URL,
  // so the preview persists across navigation. ?takeover=off clears it.
  const takeover = searchParams.get(TAKEOVER_PREVIEW_PARAM)
  if (takeover !== null) {
    const clean = request.nextUrl.clone()
    clean.searchParams.delete(TAKEOVER_PREVIEW_PARAM)
    const response = NextResponse.redirect(clean)
    if (takeover === '' || takeover === 'off') {
      response.cookies.delete(TAKEOVER_PREVIEW_COOKIE)
    } else {
      response.cookies.set(TAKEOVER_PREVIEW_COOKIE, takeover, {
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
      })
    }
    return response
  }

  // 🟢 FIX: We removed the "US/EN Trap".
  // Now, we simply allow the request to pass through to the Next.js router.
  // The folder structure app/[market]/[lang]/... will handle it from here.

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
