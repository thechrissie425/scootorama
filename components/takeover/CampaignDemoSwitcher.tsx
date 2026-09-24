'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import type { TakeoverSummary } from '@/lib/takeoverManager'
import { TAKEOVER_PREVIEW_PARAM } from '@/lib/takeoverPreview'

interface CampaignDemoSwitcherProps {
  catalog: TakeoverSummary[]
  /** The takeover currently applied, if any */
  active?: { name: string; previewToken?: string; isPreview?: boolean } | null
}

type Status = 'live' | 'scheduled' | 'ended' | 'paused'

function statusOf(t: TakeoverSummary, now = Date.now()): Status {
  if (!t.isActive) return 'paused'
  const start = Date.parse(t.startDate)
  const end = Date.parse(t.endDate)
  if (now < start) return 'scheduled'
  if (now > end) return 'ended'
  return 'live'
}

const STATUS_LABEL: Record<Status, string> = {
  live: 'Live now',
  scheduled: 'Scheduled',
  ended: 'Ended',
  paused: 'Paused',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

/**
 * Portfolio demo control for the campaign takeover system.
 *
 * Lists every takeover configured in Sanity with its schedule and targeting,
 * and lets visitors preview one site-wide via ?takeover=<previewToken>
 * (handled by proxy.ts). Hide it with NEXT_PUBLIC_CAMPAIGN_DEMO=false.
 */
export default function CampaignDemoSwitcher({
  catalog,
  active,
}: CampaignDemoSwitcherProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  if (process.env.NEXT_PUBLIC_CAMPAIGN_DEMO === 'false') return null
  if (!catalog.length && !active) return null

  const href = (token: string) =>
    `${pathname}?${TAKEOVER_PREVIEW_PARAM}=${encodeURIComponent(token)}`

  return (
    <div className="fixed left-4 bottom-4 z-[9999] font-body text-brand-ink">
      {open && (
        <div
          id="campaign-demo-panel"
          className="mb-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border-[3px] border-brand-ink bg-brandWhite p-4 shadow-[6px_6px_0_0_#241E3A]"
        >
          <p className="font-display text-lg uppercase leading-tight">
            Campaign takeovers
          </p>
          <p className="mt-1 text-sm leading-snug opacity-80">
            Marketing schedules a takeover in Sanity: a <strong>theme</strong>{' '}
            (colors, key art, effects) plus an <strong>activation</strong>{' '}
            (dates, markets, scope, banner). Preview one to see it re-skin the
            whole site.
          </p>

          <ul className="mt-3 space-y-2">
            {catalog.map(t => {
              const status = statusOf(t)
              const isCurrent = active?.previewToken === t.previewToken
              return (
                <li key={t.previewToken}>
                  <a
                    href={href(t.previewToken)}
                    aria-current={isCurrent ? 'true' : undefined}
                    className={`block rounded-xl border-2 p-3 transition-colors hover:border-brand-ink ${
                      isCurrent
                        ? 'border-brand-ink bg-brand-ink/5'
                        : 'border-brand-ink/20'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="flex h-5 w-8 overflow-hidden rounded-full border-2 border-brand-ink"
                        aria-hidden="true"
                      >
                        <span
                          className="h-full w-1/2"
                          style={{ background: t.primary }}
                        />
                        <span
                          className="h-full w-1/2"
                          style={{ background: t.secondary || t.primary }}
                        />
                      </span>
                      <span className="font-heading-bold">{t.name}</span>
                      <span className="ml-auto rounded-full bg-brand-ink px-2 py-0.5 text-[10px] font-heading-bold uppercase tracking-wide text-brandWhite">
                        {isCurrent ? 'Previewing' : STATUS_LABEL[status]}
                      </span>
                    </span>
                    {t.description && (
                      <span className="mt-1 block text-xs leading-snug opacity-80">
                        {t.description}
                      </span>
                    )}
                    <span className="mt-1 block text-[11px] opacity-70">
                      {formatDate(t.startDate)} – {formatDate(t.endDate)} ·{' '}
                      {(t.markets || []).map(m => m.toUpperCase()).join(', ')} ·{' '}
                      {t.scope || 'global'}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>

          <a
            href={href('off')}
            className="mt-3 block rounded-xl border-2 border-brand-ink/20 p-2 text-center text-sm font-heading-bold hover:border-brand-ink"
          >
            {active?.isPreview
              ? 'Stop previewing (back to live schedule)'
              : 'Default theme'}
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="campaign-demo-panel"
        className="flex items-center gap-2 rounded-full border-[3px] border-brand-ink bg-brandWhite px-4 py-2 font-heading-bold text-sm shadow-[4px_4px_0_0_#241E3A] transition-transform hover:-translate-y-0.5"
      >
        <span aria-hidden="true">🎪</span>
        {active ? (
          <span>
            {active.isPreview ? 'Previewing' : 'Live'}:{' '}
            <span className="text-brand-primary">{active.name}</span>
          </span>
        ) : (
          <span>Campaign demo</span>
        )}
      </button>
    </div>
  )
}
