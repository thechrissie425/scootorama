'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface TranslationStats {
  documentType: string
  total: number
  translated: {
    de: number
    fr: number
    es: number
    ja: number
  }
  completion: number
}

export default function AutoTranslationDashboard() {
  const [stats, setStats] = useState<TranslationStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTranslationStats = useCallback(async () => {
    try {
      // Mock data for demo - replace with actual Sanity queries
      const mockStats: TranslationStats[] = [
        {
          documentType: 'product',
          total: 15,
          translated: { de: 12, fr: 8, es: 10, ja: 5 },
          completion: 58,
        },
        {
          documentType: 'page',
          total: 8,
          translated: { de: 8, fr: 6, es: 7, ja: 4 },
          completion: 78,
        },
        {
          documentType: 'post',
          total: 25,
          translated: { de: 20, fr: 15, es: 18, ja: 10 },
          completion: 63,
        },
      ]

      setStats(mockStats)
      setIsLoading(false)
    } catch (_error) {
      console.error('Failed to load translation stats:', _error)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTranslationStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startBatchTranslation = async (documentType: string) => {
    try {
      const response = await fetch(
        `/api/auto-translate?type=${documentType}&batchSize=10`
      )
      const result = await response.json()

      if (result.success) {
        alert(
          `✅ Started translation for ${result.processedDocuments} ${documentType} documents`
        )
        loadTranslationStats()
      } else {
        alert(`❌ Translation failed: ${result.error}`)
      }
    } catch {
      alert('❌ Translation request failed')
    }
  }

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'text-green-600 bg-green-100'
    if (completion >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading translation status...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🌍 Automated Translation Dashboard
        </h1>
        <p className="text-gray-600">
          AI-powered localization for your Sanity CMS content
        </p>
      </div>

      {/* Translation Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Translation Coverage</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map(stat => (
            <div
              key={stat.documentType}
              className="bg-white rounded-lg border p-6 shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg capitalize">
                  {stat.documentType}s
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getCompletionColor(stat.completion)}`}
                >
                  {stat.completion}% complete
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Total documents:</span>
                  <span className="font-medium">{stat.total}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>🇩🇪 German:</span>
                    <span>
                      {stat.translated.de}/{stat.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🇫🇷 French:</span>
                    <span>
                      {stat.translated.fr}/{stat.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🇪🇸 Spanish:</span>
                    <span>
                      {stat.translated.es}/{stat.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>🇯🇵 Japanese:</span>
                    <span>
                      {stat.translated.ja}/{stat.total}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => startBatchTranslation(stat.documentType)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Auto-translate missing
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => startBatchTranslation('product')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium">🛍️ Products</div>
            <div className="text-sm text-gray-600">Translate all products</div>
          </button>

          <button
            onClick={() => startBatchTranslation('page')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium">📄 Pages</div>
            <div className="text-sm text-gray-600">Translate all pages</div>
          </button>

          <button
            onClick={() => startBatchTranslation('post')}
            className="p-4 border rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium">📝 Blog Posts</div>
            <div className="text-sm text-gray-600">Translate all posts</div>
          </button>

          <button
            onClick={() =>
              window.open('/api/auto-translate?type=campaign', '_blank')
            }
            className="p-4 border rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium">🎯 Campaigns</div>
            <div className="text-sm text-gray-600">Translate all campaigns</div>
          </button>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          🚀 Setup Instructions
        </h3>
        <div className="text-blue-800 space-y-2 text-sm">
          <p>
            <strong>For production translations:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>
              Add{' '}
              <code className="bg-blue-100 px-1 rounded">
                GOOGLE_TRANSLATE_API_KEY
              </code>{' '}
              to your environment variables
            </li>
            <li>
              Or add{' '}
              <code className="bg-blue-100 px-1 rounded">OPENAI_API_KEY</code>{' '}
              for AI-powered translations
            </li>
            <li>
              Configure your preferred translation service in{' '}
              <code className="bg-blue-100 px-1 rounded">
                /api/auto-translate
              </code>
            </li>
            <li>
              Set up webhooks for automatic translation on document publish
            </li>
          </ol>
          <p className="mt-3">
            <strong>Demo mode:</strong> Currently using mock translations for
            demonstration.
          </p>
        </div>
      </div>
    </div>
  )
}
