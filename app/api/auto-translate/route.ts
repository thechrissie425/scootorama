import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'
import { revalidateTag } from 'next/cache'

// Create a Sanity client with write permissions for this API
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'de', 'fr', 'es', 'ja']

// Simple translation API integration (replace with your preferred service)
async function translateText(
  text: string,
  from: string,
  to: string
): Promise<string> {
  // Option 1: Google Translate API
  if (process.env.GOOGLE_TRANSLATE_API_KEY) {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: from,
          target: to,
          format: 'text',
        }),
      }
    )
    const data = await response.json()
    return data.data.translations[0].translatedText
  }

  // Option 2: OpenAI GPT (more natural translations)
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a professional translator. Translate the following text from ${from} to ${to}. Maintain the tone and context. For product/marketing content, keep it engaging and natural. Return only the translated text, no explanations.`,
              },
              { role: 'user', content: text },
            ],
            max_tokens: 1000,
            temperature: 0.3,
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error(
          `❌ OpenAI API error: ${response.status} ${response.statusText}`
        )
        console.error('Error details:', errorText)
        throw new Error(`OpenAI API failed: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log(
        '🔍 OpenAI API response structure:',
        JSON.stringify(data, null, 2)
      )

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Invalid OpenAI API response:', data)
        throw new Error('Invalid response from OpenAI API')
      }

      const translatedText = data.choices[0].message.content.trim()
      return translatedText
    } catch (error) {
      console.error('❌ OpenAI translation error:', error)
      throw error
    }
  }

  // Fallback: Simple mock translations for demo
  const mockTranslations = {
    de: {
      Hello: 'Hallo',
      Welcome: 'Willkommen',
      Product: 'Produkt',
      'Buy Now': 'Jetzt kaufen',
      'Learn More': 'Mehr erfahren',
      'About Us': 'Über uns',
      Contact: 'Kontakt',
    },
    fr: {
      Hello: 'Bonjour',
      Welcome: 'Bienvenue',
      Product: 'Produit',
      'Buy Now': 'Acheter maintenant',
      'Learn More': 'En savoir plus',
      'About Us': 'À propos',
      Contact: 'Contact',
    },
    es: {
      Hello: 'Hola',
      Welcome: 'Bienvenido',
      Product: 'Producto',
      'Buy Now': 'Comprar ahora',
      'Learn More': 'Saber más',
      'About Us': 'Acerca de',
      Contact: 'Contacto',
    },
    ja: {
      Hello: 'こんにちは',
      Welcome: 'ようこそ',
      Product: '製品',
      'Buy Now': '今すぐ購入',
      'Learn More': '詳細を見る',
      'About Us': '私たちについて',
      Contact: 'お問い合わせ',
    },
  }

  // Simple keyword matching for demo
  const translations = mockTranslations[to as keyof typeof mockTranslations]
  if (translations) {
    for (const [key, value] of Object.entries(translations)) {
      if (text.toLowerCase().includes(key.toLowerCase())) {
        return text.replace(new RegExp(key, 'gi'), value)
      }
    }
  }

  return `[AUTO-TRANSLATED ${to.toUpperCase()}] ${text}`
}

// Recursively translate all string fields in an object
// Keeping for potential future use
async function _translateObject(
  obj: any,
  fromLang: string,
  toLang: string
): Promise<any> {
  if (typeof obj === 'string') {
    return await translateText(obj, fromLang, toLang)
  }

  if (Array.isArray(obj)) {
    return Promise.all(
      obj.map(item => _translateObject(item, fromLang, toLang))
    )
  }

  if (obj && typeof obj === 'object') {
    const result = { ...obj }
    for (const [key, value] of Object.entries(obj)) {
      // Skip internal Sanity fields
      if (key.startsWith('_')) continue

      // Translate string values
      if (typeof value === 'string') {
        result[key] = await translateText(value, fromLang, toLang)
      }
      // Recursively handle nested objects
      else if (value && typeof value === 'object') {
        result[key] = await _translateObject(value, fromLang, toLang)
      }
    }
    return result
  }

  return obj
}

// Helper function to translate multilingual fields within a document
async function translateMultilingualFields(
  obj: any,
  fromLang: string,
  targetLanguages: string[],
  overwriteExisting = false
): Promise<any> {
  if (!obj || typeof obj !== 'object') return obj

  // Handle arrays
  if (Array.isArray(obj)) {
    return Promise.all(
      obj.map(item =>
        translateMultilingualFields(
          item,
          fromLang,
          targetLanguages,
          overwriteExisting
        )
      )
    )
  }

  const result = { ...obj }

  // Check if this is a multilingual field object (has language code keys)
  const hasLanguageKeys = Object.keys(obj).some(
    key => SUPPORTED_LANGUAGES.includes(key) && typeof obj[key] === 'string'
  )

  if (hasLanguageKeys && obj[fromLang]) {
    // This is a multilingual field - translate the source language to target languages
    const sourceText = obj[fromLang]
    for (const targetLang of targetLanguages) {
      const existingTranslation = obj[targetLang]
      const shouldTranslate =
        !existingTranslation ||
        existingTranslation === '' ||
        overwriteExisting ||
        (typeof existingTranslation === 'string' &&
          existingTranslation.includes('AUTO-TRANSLATED'))

      if (shouldTranslate) {
        console.log(
          `  🔤 Translating field from ${fromLang} to ${targetLang}${overwriteExisting ? ' (overwriting existing)' : ''}`
        )
        result[targetLang] = await translateText(
          sourceText,
          fromLang,
          targetLang
        )
      }
    }
  } else {
    // Recursively process nested objects
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('_')) continue // Skip Sanity internal fields
      if (value && typeof value === 'object') {
        result[key] = await translateMultilingualFields(
          value,
          fromLang,
          targetLanguages,
          overwriteExisting
        )
      }
    }
  }

  return result
}

export async function POST(request: NextRequest) {
  let documentId: string | undefined
  let provider: string | undefined

  try {
    const requestData = await request.json()
    documentId = requestData.documentId
    const {
      fromLanguage = 'en',
      targetLanguages,
      documentType: _documentType,
      overwriteExisting = false,
    } = requestData
    provider = requestData.provider || 'mock'

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 }
      )
    }

    // Fetch the source document
    const document = await client.fetch(`*[_id == $documentId][0]`, {
      documentId,
    })

    if (!document) {
      console.log(`❌ Document not found: ${documentId}`)
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    console.log(
      `✅ Found document: ${document._type} - ${document.title?.en || document.name?.en || documentId}`
    )

    const languages =
      targetLanguages ||
      SUPPORTED_LANGUAGES.filter(lang => lang !== fromLanguage)

    console.log(
      `🌍 Translating ${documentId} from ${fromLanguage} to ${languages.join(', ')}${overwriteExisting ? ' (overwriting existing)' : ''}`
    )

    // Translate multilingual fields within the same document
    const translatedDoc = await translateMultilingualFields(
      document,
      fromLanguage,
      languages,
      overwriteExisting
    )

    // Update the document with translations and enable translation fields
    const updatedDoc = {
      ...translatedDoc,
      showTranslationFields: true, // Enable the translation fields in Sanity Studio
      // Add translation metadata
      lastTranslationUpdate: new Date().toISOString(),
      translationProvider:
        provider === 'openai'
          ? 'openai'
          : provider === 'google'
            ? 'google'
            : 'mock',
    }

    // Update the existing document (don't create a new one)
    const _result = await client.createOrReplace(updatedDoc)
    console.log(
      `📋 Updated document with field-level translations: ${documentId}`
    )

    // Revalidate cache
    revalidateTag('sanity', {})

    return NextResponse.json({
      success: true,
      documentId,
      translatedLanguages: languages,
      translationCount: languages.length,
      message: `Added ${languages.length} field-level translations to document`,
    })
  } catch (error) {
    console.error('❌ Translation error for document:', documentId, error)
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack trace'
    )

    // Provide more detailed error information
    let errorMessage = 'Translation failed'
    let errorDetails = 'Unknown error'

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || error.message
    }

    console.error('Detailed error info:', {
      errorMessage,
      errorDetails,
      documentId,
      provider,
    })

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        documentId,
        provider,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

// Endpoint to translate all documents of a specific type
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const documentType = searchParams.get('type')
  const batchSize = parseInt(searchParams.get('batchSize') || '10')
  const provider = searchParams.get('provider') || 'mock'

  if (!documentType) {
    return NextResponse.json(
      { error: 'Document type required' },
      { status: 400 }
    )
  }

  try {
    // Get all documents of the specified type that don't have field-level translations
    const documents = await client.fetch(
      `
      *[_type == $documentType && (!defined(showTranslationFields) || showTranslationFields != true)]
      | order(_createdAt desc)
      [0...$batchSize]
      {_id, _type, title, name}
    `,
      { documentType, batchSize }
    )

    const results = []

    for (const doc of documents) {
      try {
        console.log(`🌍 Processing ${doc._id} for field-level translation`)

        // Get the base URL without query params for the internal request
        const baseUrl = new URL(request.url)
        const internalUrl = `${baseUrl.protocol}//${baseUrl.host}/api/auto-translate`

        // Auto-translate each document with field-level localization
        const translationResponse = await fetch(internalUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: doc._id,
            fromLanguage: 'en',
            targetLanguages: ['de', 'fr', 'es', 'ja'],
            provider,
          }),
        })

        if (!translationResponse.ok) {
          throw new Error(
            `Translation request failed: ${translationResponse.status} ${translationResponse.statusText}`
          )
        }

        const translationResult = await translationResponse.json()
        results.push({
          sourceDocument: doc._id,
          title: doc.title?.en || doc.title || doc.name,
          ...translationResult,
        })
      } catch (error) {
        console.error(`Failed to translate ${doc._id}:`, error)
        results.push({
          sourceDocument: doc._id,
          title: doc.title?.en || doc.title || doc.name,
          error: error instanceof Error ? error.message : 'Translation failed',
        })
      }
    }

    return NextResponse.json({
      success: true,
      documentType,
      processedDocuments: results.length,
      results,
      approach: 'field-level-localization',
    })
  } catch (error) {
    console.error('Batch translation error:', error)
    return NextResponse.json(
      {
        error: 'Batch translation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
