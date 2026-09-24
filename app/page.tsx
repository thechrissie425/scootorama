import { redirect } from 'next/navigation'
import { DEFAULT_MARKET, DEFAULT_LANGUAGE } from '@/lib/i18n'

export default function RootPage() {
  // Redirect to default market/language route where Footer is properly configured
  redirect(`/${DEFAULT_MARKET.code}/${DEFAULT_LANGUAGE.code}`)
}
