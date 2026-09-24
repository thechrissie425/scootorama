/**
 * World dictionary: read access to the Scootorama route catalog.
 *
 * Route data lives in lib/worlds.ts. These helpers keep an async API so a
 * remote catalog could be swapped in later without touching callers.
 */
import { ROUTES, type WorldRoute } from '@/lib/worlds'

export type { WorldRoute }

export async function fetchWorldRoutes(): Promise<WorldRoute[]> {
  return ROUTES
}

export async function getRouteById(id: string): Promise<WorldRoute | null> {
  return ROUTES.find(r => r.id === id) || null
}

export async function searchRoutes(query: string): Promise<WorldRoute[]> {
  const lowerQuery = query.toLowerCase()
  return ROUTES.filter(
    r =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.world.toLowerCase().includes(lowerQuery)
  )
}

export async function getRoutesByWorld(): Promise<
  Record<string, WorldRoute[]>
> {
  const byWorld: Record<string, WorldRoute[]> = {}
  for (const route of ROUTES) {
    ;(byWorld[route.world] ||= []).push(route)
  }
  return byWorld
}
