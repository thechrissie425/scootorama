import {
  generateCampaignCSS,
  getTakeoverCatalog,
  type TakeoverActivation,
} from '@/lib/takeoverManager'
import TakeoverEffects from './TakeoverEffects'
import CampaignDemoSwitcher from './CampaignDemoSwitcher'

/**
 * Everything a layout needs to apply a campaign takeover: the theme's CSS
 * variables (site-wide re-skin), its decorative effects and the portfolio
 * demo switcher.
 */
export default async function TakeoverLayer({
  takeover,
}: {
  takeover: TakeoverActivation | null
}) {
  const catalog = await getTakeoverCatalog()
  const hasBanner = Boolean(takeover?.takeover?.globalBanner?.enabled)
  const css = [
    takeover?.theme ? generateCampaignCSS(takeover.theme) : '',
    // Server-side estimate of nav + banner height, refined by Header.tsx
    hasBanner ? ':root { --site-header-offset: 120px; }' : '',
  ].join(' ')

  return (
    <>
      {css.trim() && <style dangerouslySetInnerHTML={{ __html: css }} />}
      {takeover?.theme && <TakeoverEffects theme={takeover.theme} />}
      <CampaignDemoSwitcher
        catalog={catalog}
        active={
          takeover
            ? {
                name: takeover.name,
                previewToken: takeover.previewToken,
                isPreview: takeover.isPreview,
              }
            : null
        }
      />
    </>
  )
}
