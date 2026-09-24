'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import {
  Card,
  Text,
  Stack,
  Autocomplete,
  Button,
  Flex,
  Select,
} from '@sanity/ui'
import { set, unset, useFormValue, useClient } from 'sanity'
import type { StringInputProps } from 'sanity'

import type { WorldRoute } from '@/lib/worlds'

/**
 * Custom Sanity input component for selecting a route from the world catalog
 * Two-step selection: First pick world, then pick route
 * Automatically populates route data fields when a route is selected
 */
export function RouteSelector(props: StringInputProps) {
  const { value, onChange, elementProps } = props
  const client = useClient({ apiVersion: '2024-01-01' })
  const documentValue = useFormValue([]) as any // Get the full document

  const [routes, setRoutes] = useState<WorldRoute[]>([])
  const [loading, setLoading] = useState(true)

  // Selection State
  const [selectedWorld, setSelectedWorld] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  // 1. Derive selectedRoute directly from value (No local state needed)
  const selectedRoute = useMemo(() => {
    if (!value || routes.length === 0) return null
    return routes.find(r => r.id === value) || null
  }, [value, routes])

  // Fetch routes from API route
  useEffect(() => {
    // console.log('RouteSelector: Fetching routes from /api/routes')
    fetch('/api/routes')
      .then(res => res.json())
      .then(data => {
        setRoutes(data.routes || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('RouteSelector: Failed to load routes:', err)
        setLoading(false)
      })
  }, [])

  // 🟢 FIX: REMOVED THE PROBLEMATIC useEffect HERE
  // We don't need to sync "selectedWorld" because the dropdown is hidden
  // when a route is active anyway.

  // Get unique worlds from routes
  const worlds = useMemo(
    () => Array.from(new Set(routes.map(r => r.world))).sort(),
    [routes]
  )

  const handleRouteSelect = useCallback(
    (routeId: string) => {
      const route = routes.find(r => r.id === routeId)
      if (!route) return

      // Set the routeId field value
      onChange(set(route.id))

      // Get the document ID
      const documentId = documentValue?._id
      if (!documentId) {
        console.error('RouteSelector: No document ID found')
        return
      }

      // Auto-generate slug from name
      const slugValue = route.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

      // Patch the document directly to populate all route data
      // console.log('RouteSelector: Patching document', documentId)
      client
        .patch(documentId)
        .set({
          name: { en: route.name },
          world: route.world,
          sportType: route.sportType,
          distance: route.distanceKm,
          elevation: route.elevationMeters,
          difficulty: route.difficulty,
          slug: { _type: 'slug', current: slugValue },
        })
        .commit()
        .then(() => {
          // console.log('RouteSelector: Successfully populated route data')
        })
        .catch(err => {
          console.error('RouteSelector: Failed to patch document:', err)
        })
    },
    [routes, onChange, client, documentValue]
  )

  const handleClearRoute = useCallback(() => {
    setSelectedWorld('')
    setSearchTerm('')

    // Clear the routeId field
    onChange(unset())

    // Get the document ID
    const documentId = documentValue?._id
    if (!documentId) return

    // Clear all route data fields from the document
    client
      .patch(documentId)
      .unset([
        'name',
        'world',
        'sportType',
        'distance',
        'elevation',
        'difficulty',
        'slug',
      ])
      .commit()
      .catch(err => {
        console.error('RouteSelector: Failed to clear document fields:', err)
      })
  }, [onChange, client, documentValue])

  // Filter routes by selected world and search term
  const filteredRoutes = useMemo(
    () =>
      routes.filter(r => {
        const matchesWorld = !selectedWorld || r.world === selectedWorld
        const matchesSearch =
          !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesWorld && matchesSearch
      }),
    [routes, selectedWorld, searchTerm]
  )

  const routeOptions = useMemo(
    () =>
      filteredRoutes.map(route => ({
        value: route.id,
        payload: `${route.name} (${route.distanceKm.toFixed(1)} km, ${Math.round(route.elevationMeters)} m)`,
      })),
    [filteredRoutes]
  )

  return (
    <Card {...elementProps}>
      <Stack space={3}>
        {selectedRoute ? (
          <Card padding={4} radius={2} shadow={1} tone="primary">
            <Stack space={3}>
              <Flex justify="space-between" align="center">
                <Text weight="bold" size={2}>
                  {selectedRoute.name}
                </Text>
                <Button
                  text="Change Route"
                  tone="default"
                  mode="ghost"
                  onClick={handleClearRoute}
                />
              </Flex>
              <Stack space={2}>
                <Text size={1} muted>
                  Route ID: {selectedRoute.id}
                </Text>
                <Text size={1} muted>
                  World: {selectedRoute.world}
                </Text>
                <Text size={1} muted>
                  Distance: {selectedRoute.distanceKm.toFixed(1)} km
                </Text>
                <Text size={1} muted>
                  Elevation: {Math.round(selectedRoute.elevationMeters)} m
                </Text>
                <Text size={1} muted>
                  Type: {selectedRoute.sportType}
                </Text>
              </Stack>
            </Stack>
          </Card>
        ) : (
          <Stack space={3}>
            {/* Step 1: Select World */}
            <Stack space={2}>
              <Text size={1} weight="semibold">
                1. Select World
              </Text>
              <Select
                fontSize={2}
                value={selectedWorld}
                onChange={e => {
                  setSelectedWorld(e.currentTarget.value)
                  setSearchTerm('') // Reset search when world changes
                }}
                disabled={loading}
              >
                <option value="">Choose a world...</option>
                {worlds.map(world => (
                  <option key={world} value={world}>
                    {world} ({routes.filter(r => r.world === world).length}{' '}
                    routes)
                  </option>
                ))}
              </Select>
            </Stack>

            {/* Step 2: Select Route (only shown after world is selected) */}
            {selectedWorld && (
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  2. Select Route
                </Text>
                <Autocomplete
                  id="route-selector-autocomplete"
                  fontSize={2}
                  icon={() => <Text>🛴</Text>}
                  loading={loading}
                  options={routeOptions}
                  placeholder={`Search ${selectedWorld} routes...`}
                  value={searchTerm}
                  onChange={setSearchTerm}
                  onSelect={handleRouteSelect}
                  openButton
                />
                {searchTerm && filteredRoutes.length === 0 && (
                  <Card padding={3} tone="caution">
                    <Text size={1}>
                      No routes found matching &quot;{searchTerm}&quot; in{' '}
                      {selectedWorld}
                    </Text>
                  </Card>
                )}
              </Stack>
            )}
          </Stack>
        )}

        {loading && (
          <Card padding={3}>
            <Text size={1} muted>
              Loading routes...
            </Text>
          </Card>
        )}
      </Stack>
    </Card>
  )
}
