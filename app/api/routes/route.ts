import { NextResponse } from 'next/server'
import { fetchWorldRoutes } from '@/lib/worldDictionary'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const routes = await fetchWorldRoutes()

    return NextResponse.json({
      routes,
      count: routes.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in routes API:', error)

    return NextResponse.json(
      { error: 'Failed to load routes', routes: [], count: 0 },
      { status: 500 }
    )
  }
}
