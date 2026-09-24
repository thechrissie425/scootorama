/**
 * Takeover preview plumbing shared by proxy.ts (sets the cookie) and
 * lib/takeoverManager.ts (reads it). Kept dependency-free so the proxy stays
 * small.
 *
 * Visiting any page with ?takeover=<previewToken> previews that takeover
 * regardless of its schedule or targeting; ?takeover=off returns to the live
 * (scheduled) behavior.
 */
export const TAKEOVER_PREVIEW_PARAM = 'takeover'
export const TAKEOVER_PREVIEW_COOKIE = 'takeover_preview'
