#!/usr/bin/env node
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

// Check if --create-tasks flag is present
const shouldCreateTasks = process.argv.includes('--create-tasks')

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ Error: NEXT_PUBLIC_SANITY_PROJECT_ID is not set')
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('❌ Error: NEXT_PUBLIC_SANITY_DATASET is not set')
  process.exit(1)
}

if (!process.env.SANITY_API_READ_TOKEN) {
  console.error('❌ Error: SANITY_API_READ_TOKEN is not set')
  console.error('This script requires read access to fetch documents.')
  process.exit(1)
}

if (shouldCreateTasks && !process.env.SANITY_API_TOKEN) {
  console.error('❌ Error: SANITY_API_TOKEN is required for task creation')
  console.error('Please set SANITY_API_TOKEN in your .env.local file')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2026-01-08',
  token: process.env.SANITY_API_READ_TOKEN,
})

const writeClient = shouldCreateTasks
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      useCdn: false,
      apiVersion: '2026-01-08',
      token: process.env.SANITY_API_TOKEN,
    })
  : null

async function createValidationTask(
  documentId: string,
  documentType: string,
  title: string,
  description: string,
  severity: 'critical' | 'warning' | 'info',
  issues: string[]
) {
  if (!writeClient) return

  try {
    await writeClient.create({
      _type: 'validationTask',
      title,
      description,
      severity,
      documentReference: {
        _type: 'reference',
        _ref: documentId,
      },
      issues,
      status: 'open',
      createdAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error(`Failed to create task for ${documentId}:`, error.message)
  }
}

interface TranslationIssue {
  _id: string
  _type: string
  pageTitle?: string
  showTranslationFields?: boolean
  missingLanguages: string[]
}

const LANGUAGES = ['es', 'fr', 'de', 'ja']
const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
}

async function auditTranslations() {
  console.log('\n🌐 Starting Translation Completeness Audit...\n')

  const localizableTypes = [
    'product',
    'campaign',
    'page',
    'post',
    'membershipPage',
    'faqItem',
    'benefit',
    'feature',
    'socialProof',
    'pricingTier',
  ]

  // Check 1: Documents with showTranslationFields enabled but missing translations
  console.log('📋 Checking documents flagged for translation...')

  const incompleteTranslations: TranslationIssue[] = []

  for (const lang of LANGUAGES) {
    const docs = await client.fetch<any[]>(
      `
      *[_type in $types && showTranslationFields == true && !defined(title.${lang})] {
        _id, 
        _type, 
        "pageTitle": title.en,
        showTranslationFields
      }
    `,
      { types: localizableTypes }
    )

    docs.forEach(doc => {
      const existing = incompleteTranslations.find(d => d._id === doc._id)
      if (existing) {
        existing.missingLanguages.push(lang)
      } else {
        incompleteTranslations.push({
          ...doc,
          missingLanguages: [lang],
        })
      }
    })
  }

  if (incompleteTranslations.length > 0) {
    console.log(
      `\n⚠️  Incomplete Translations (${incompleteTranslations.length} documents):`
    )
    incompleteTranslations.slice(0, 10).forEach(doc => {
      const langList = doc.missingLanguages
        .map(l => LANGUAGE_NAMES[l])
        .join(', ')
      console.log(`   • ${doc._type}: ${doc.pageTitle || doc._id}`)
      console.log(`     Missing: ${langList}`)
    })
    if (incompleteTranslations.length > 10) {
      console.log(`   ... and ${incompleteTranslations.length - 10} more`)
    }
    console.log()
  } else {
    console.log('✅ All flagged documents have complete translations\n')
  }

  // Check 2: Documents with NO translation fields enabled (potential candidates)
  console.log('📊 Checking documents without translation fields enabled...')
  const untranslatedDocs = await client.fetch<any[]>(
    `
    *[_type in $types && !defined(showTranslationFields) || showTranslationFields == false] {
      _id, 
      _type, 
      "pageTitle": title.en
    }
  `,
    { types: localizableTypes }
  )

  if (untranslatedDocs.length > 0) {
    console.log(
      `\n💡 Not Enabled for Translation (${untranslatedDocs.length} documents):`
    )
    console.log(
      `   These documents could be translated but aren't flagged yet.`
    )
    untranslatedDocs.slice(0, 5).forEach(doc => {
      console.log(`   • ${doc._type}: ${doc.pageTitle || doc._id}`)
    })
    if (untranslatedDocs.length > 5) {
      console.log(`   ... and ${untranslatedDocs.length - 5} more`)
    }
    console.log()
  } else {
    console.log('✅ All documents are enabled for translation\n')
  }

  // Check 3: Translation coverage by content type
  console.log('📈 Translation Coverage by Content Type:')
  console.log()

  for (const type of localizableTypes) {
    const total = await client.fetch<number>(`count(*[_type == "${type}"])`)
    const withTranslations = await client.fetch<number>(
      `count(*[_type == "${type}" && showTranslationFields == true])`
    )

    if (total > 0) {
      const percentage = Math.round((withTranslations / total) * 100)
      const bar =
        '█'.repeat(Math.floor(percentage / 5)) +
        '░'.repeat(20 - Math.floor(percentage / 5))
      console.log(
        `   ${type.padEnd(20)} ${bar} ${percentage}% (${withTranslations}/${total})`
      )
    }
  }
  console.log()

  // Summary
  console.log('═'.repeat(60))
  const totalIssues = incompleteTranslations.length

  if (totalIssues === 0) {
    console.log('\n✅ All translations are complete!\n')
  } else {
    console.log('\n📊 Translation Audit Summary:')
    console.log(
      `   • Documents with incomplete translations: ${incompleteTranslations.length}`
    )
    console.log(
      `   • Documents not enabled for translation: ${untranslatedDocs.length}`
    )
    console.log(`\n   Total issues: ${totalIssues}`)

    if (shouldCreateTasks) {
      console.log('\n📝 Creating validation tasks in Sanity Studio...\n')
      let tasksCreated = 0

      // Create tasks for incomplete translations
      for (const doc of incompleteTranslations) {
        const langList = doc.missingLanguages
          .map(l => LANGUAGE_NAMES[l])
          .join(', ')
        await createValidationTask(
          doc._id,
          doc._type,
          `Incomplete Translations: ${doc.pageTitle || doc._id}`,
          `This ${doc._type} has translation fields enabled but is missing translations for: ${langList}. Complete the missing translations in Sanity Studio.`,
          'warning',
          doc.missingLanguages.map(
            l => `Missing ${LANGUAGE_NAMES[l]} translation`
          )
        )
        tasksCreated++
      }

      console.log(
        `✅ Created ${tasksCreated} validation tasks in Sanity Studio\n`
      )
    } else {
      console.log('\n💡 Tip: Complete missing translations in Sanity Studio')
      console.log(
        '   Or run with --create-tasks to create tasks automatically\n'
      )
    }
  }
}

auditTranslations().catch(error => {
  console.error('\n❌ Translation audit failed:', error.message)
  process.exit(1)
})
