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

async function auditSEO() {
  console.log('\n🔍 Starting SEO Audit...\n')

  interface SEOIssue {
    _id: string
    _type: string
    pageTitle?: string
    title?: string
    length?: number
  }

  // Check 1: Missing SEO titles
  console.log('📋 Checking for missing SEO titles...')
  const missingTitles = await client.fetch<SEOIssue[]>(`
    *[_type in ["product", "campaign", "page", "post", "membershipPage"] && !defined(seo.title)] {
      _id, _type, "pageTitle": title.en
    }
  `)

  if (missingTitles.length > 0) {
    console.log(`\n❌ Missing SEO Titles (${missingTitles.length}):`)
    missingTitles.slice(0, 10).forEach(doc => {
      console.log(`   • ${doc._type}: ${doc.pageTitle || doc._id}`)
    })
    if (missingTitles.length > 10) {
      console.log(`   ... and ${missingTitles.length - 10} more`)
    }
    console.log()
  } else {
    console.log('✅ All documents have SEO titles\n')
  }

  // Check 2: Titles too long (>60 chars)
  console.log('📏 Checking SEO title lengths...')
  const longTitles = await client.fetch<SEOIssue[]>(`
    *[_type in ["product", "campaign", "page", "post", "membershipPage"] && length(seo.title) > 60] {
      _id, _type, "title": seo.title, "length": length(seo.title)
    }
  `)

  if (longTitles.length > 0) {
    console.log(`\n⚠️  SEO Titles Too Long (${longTitles.length}):`)
    longTitles.slice(0, 10).forEach(doc => {
      console.log(
        `   • ${doc._type}: ${doc.title?.substring(0, 50)}... (${doc.length} chars, should be ≤60)`
      )
    })
    if (longTitles.length > 10) {
      console.log(`   ... and ${longTitles.length - 10} more`)
    }
    console.log()
  } else {
    console.log('✅ All SEO titles are optimal length\n')
  }

  // Check 3: Missing descriptions
  console.log('📋 Checking for missing SEO descriptions...')
  const missingDescriptions = await client.fetch<SEOIssue[]>(`
    *[_type in ["product", "campaign", "page", "post", "membershipPage"] && !defined(seo.description)] {
      _id, _type, "pageTitle": title.en
    }
  `)

  if (missingDescriptions.length > 0) {
    console.log(
      `\n❌ Missing SEO Descriptions (${missingDescriptions.length}):`
    )
    missingDescriptions.slice(0, 10).forEach(doc => {
      console.log(`   • ${doc._type}: ${doc.pageTitle || doc._id}`)
    })
    if (missingDescriptions.length > 10) {
      console.log(`   ... and ${missingDescriptions.length - 10} more`)
    }
    console.log()
  } else {
    console.log('✅ All documents have SEO descriptions\n')
  }

  // Check 4: Descriptions too long (>160 chars)
  console.log('📏 Checking SEO description lengths...')
  const longDescriptions = await client.fetch<SEOIssue[]>(`
    *[_type in ["product", "campaign", "page", "post", "membershipPage"] && length(seo.description) > 160] {
      _id, _type, "description": seo.description, "length": length(seo.description)
    }
  `)

  if (longDescriptions.length > 0) {
    console.log(`\n⚠️  SEO Descriptions Too Long (${longDescriptions.length}):`)
    longDescriptions.slice(0, 10).forEach((doc: any) => {
      console.log(
        `   • ${doc._type}: ${doc.description?.substring(0, 50)}... (${doc.length} chars, should be ≤160)`
      )
    })
    if (longDescriptions.length > 10) {
      console.log(`   ... and ${longDescriptions.length - 10} more`)
    }
    console.log()
  } else {
    console.log('✅ All SEO descriptions are optimal length\n')
  }

  // Check 5: Missing OG images
  console.log('🖼️  Checking for missing Open Graph images...')
  const missingOgImages = await client.fetch<SEOIssue[]>(`
    *[_type in ["product", "campaign", "page", "post", "membershipPage"] && !defined(seo.image)] {
      _id, _type, "pageTitle": title.en
    }
  `)

  if (missingOgImages.length > 0) {
    console.log(`\n⚠️  Missing Open Graph Images (${missingOgImages.length}):`)
    missingOgImages.slice(0, 10).forEach(doc => {
      console.log(`   • ${doc._type}: ${doc.pageTitle || doc._id}`)
    })
    if (missingOgImages.length > 10) {
      console.log(`   ... and ${missingOgImages.length - 10} more`)
    }
    console.log()
  } else {
    console.log('✅ All documents have Open Graph images\n')
  }

  // Summary
  console.log('═'.repeat(60))
  const totalIssues =
    missingTitles.length +
    longTitles.length +
    missingDescriptions.length +
    longDescriptions.length +
    missingOgImages.length

  if (totalIssues === 0) {
    console.log('✅ All SEO metadata is optimized!\n')
  } else {
    console.log('\n📊 SEO Audit Summary:')
    console.log(`   • Missing titles: ${missingTitles.length}`)
    console.log(`   • Titles too long: ${longTitles.length}`)
    console.log(`   • Missing descriptions: ${missingDescriptions.length}`)
    console.log(`   • Descriptions too long: ${longDescriptions.length}`)
    console.log(`   • Missing OG images: ${missingOgImages.length}`)
    console.log(`\n   Total issues: ${totalIssues}`)

    if (shouldCreateTasks) {
      console.log('\n📝 Creating validation tasks in Sanity Studio...\n')
      let tasksCreated = 0

      // Create tasks for missing titles
      for (const doc of missingTitles) {
        await createValidationTask(
          doc._id,
          doc._type,
          `Missing SEO Title: ${doc.pageTitle || doc._id}`,
          `This ${doc._type} is missing an SEO title. Add a concise, descriptive title (≤60 characters) in the SEO tab.`,
          'critical',
          ['SEO title is required for search engine visibility']
        )
        tasksCreated++
      }

      // Create tasks for long titles
      for (const doc of longTitles) {
        await createValidationTask(
          doc._id,
          doc._type,
          `SEO Title Too Long: ${doc.title?.substring(0, 30)}...`,
          `This ${doc._type} has an SEO title that's ${doc.length} characters (should be ≤60). Shorten it for better search results.`,
          'warning',
          [
            `Current length: ${doc.length} characters`,
            'Recommended: ≤60 characters',
          ]
        )
        tasksCreated++
      }

      // Create tasks for missing descriptions
      for (const doc of missingDescriptions) {
        await createValidationTask(
          doc._id,
          doc._type,
          `Missing SEO Description: ${doc.pageTitle || doc._id}`,
          `This ${doc._type} is missing an SEO description. Add a compelling description (≤160 characters) in the SEO tab.`,
          'critical',
          ['SEO description is required for search engine visibility']
        )
        tasksCreated++
      }

      // Create tasks for long descriptions
      for (const doc of longDescriptions) {
        await createValidationTask(
          doc._id,
          doc._type,
          `SEO Description Too Long: ${(doc as any).description?.substring(0, 30)}...`,
          `This ${doc._type} has an SEO description that's ${doc.length} characters (should be ≤160). Shorten it for better search results.`,
          'warning',
          [
            `Current length: ${doc.length} characters`,
            'Recommended: ≤160 characters',
          ]
        )
        tasksCreated++
      }

      // Create tasks for missing OG images
      for (const doc of missingOgImages) {
        await createValidationTask(
          doc._id,
          doc._type,
          `Missing Open Graph Image: ${doc.pageTitle || doc._id}`,
          `This ${doc._type} is missing an Open Graph image. Add an image in the SEO tab for better social media sharing.`,
          'warning',
          [
            'OG image improves social media previews',
            'Recommended size: 1200x630px',
          ]
        )
        tasksCreated++
      }

      console.log(
        `✅ Created ${tasksCreated} validation tasks in Sanity Studio\n`
      )
    } else {
      console.log(
        '\n💡 Tip: Fix these in Sanity Studio under the SEO tab of each document'
      )
      console.log(
        '   Or run with --create-tasks to create tasks automatically\n'
      )
    }
  }
}

auditSEO().catch(error => {
  console.error('\n❌ SEO audit failed:', error.message)
  process.exit(1)
})
