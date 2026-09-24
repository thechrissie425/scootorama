import { ReactNode } from 'react'

export const metadata = {
  title: 'Sanity Studio',
}

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
