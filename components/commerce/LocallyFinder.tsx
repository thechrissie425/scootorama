'use client'

import { useState, useEffect } from 'react'
// Updated Import: Radix UI Icons
import { ExternalLink } from 'lucide-react'
import { PhoneCallIcon } from 'lucide-react'

import { fetchLocallyStores } from '@/lib/locally'

interface LocallyFinderProps {
  market: string
}

export default function LocallyFinder({ market }: LocallyFinderProps) {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true) // 1. Start loading immediately

  // 2. Auto-fetch on mount
  useEffect(() => {
    const loadStores = async () => {
      try {
        const data = await fetchLocallyStores('mock-upc', 0, 0)
        setStores(data.stores)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadStores()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'limited_stock':
        return 'text-brand-primary-dark bg-brand-primary-50 border-brand-primary-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
      {/* HEADER */}
      <div className="bg-gray-50/50 p-6 border-b border-gray-100">
        <div className="text-center sm:text-left">
          <h3 className="font-display uppercase text-lg text-gray-900 leading-tight">
            Available Near You
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {market === 'jp'
              ? 'Showing retailers in Tokyo, Japan'
              : 'Locating nearest retailers...'}
          </p>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="p-12 text-center text-gray-500">
          <div className="animate-spin w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-heading-semibold uppercase text-sm tracking-wide">
            Checking Inventory...
          </p>
        </div>
      )}

      {/* RESULTS LIST */}
      {!loading && (
        <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100 scrollbar-thin scrollbar-thumb-gray-200 animate-in fade-in duration-500">
          {stores.map(store => (
            <div
              key={store.id}
              className="p-5 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-heading-bold text-gray-900 text-lg">
                    {store.name}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {store.address}
                  </p>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border font-bold ${getStatusColor(store.inventory_status)}`}
                >
                  {store.inventory_status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <a
                  href={store.directions_url}
                  target="_blank"
                  className="text-xs font-bold text-brand-secondary hover:text-brand-secondary-dark hover:underline flex items-center gap-1 uppercase tracking-wide"
                  rel="noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Directions ({store.distance}mi)
                </a>
                <a
                  href={`tel:${store.phone}`}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 uppercase tracking-wide"
                >
                  <PhoneCallIcon className="w-4 h-4" />
                  {store.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
