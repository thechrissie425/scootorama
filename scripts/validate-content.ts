#!/usr/bin/env node
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Validate environment variables
if (
  !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_SANITY_DATASET
) {
  console.error('❌ Error: Missing required environment variables')
  console.error(
    '   Please ensure NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are set'
  )
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2026-01-08',
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN,
})

// Check if we have write access
const hasWriteAccess = !!(
  process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN
)

interface ValidationResult {
  documentId: string
  documentType: string
  issues: string[]
}

async function validateContent() {
  const results: ValidationResult[] = []

  console.log('🔍 Running content validation checks...\n')

  // Check 1: Missing SEO metadata
  console.log('   Checking SEO metadata...')
  const productsWithoutSEO = await client.fetch(`
    *[_type in ["product", "campaign", "page", "post", "membershipPage"] && !defined(seo.title)] {
      _id, _type, title
    }
  `)

  productsWithoutSEO.forEach((doc: any) => {
    results.push({
      documentId: doc._id,
      documentType: doc._type,
      issues: ['Missing SEO metadata'],
    })
  })

  // Check 2: Incomplete translations
  console.log('   Checking translations...')
  const incompleteTranslations = await client.fetch(`
    *[_type in ["product", "campaign", "page", "post"] && showTranslationFields == true] {
      _id,
      _type,
      "missingES": !defined(title.es),
      "missingFR": !defined(title.fr),
      "missingDE": !defined(title.de),
      "missingJA": !defined(title.ja)
    }
  `)

  incompleteTranslations.forEach((doc: any) => {
    const missing = []
    if (doc.missingES) missing.push('Spanish')
    if (doc.missingFR) missing.push('French')
    if (doc.missingDE) missing.push('German')
    if (doc.missingJA) missing.push('Japanese')

    if (missing.length > 0) {
      results.push({
        documentId: doc._id,
        documentType: doc._type,
        issues: [`Missing translations: ${missing.join(', ')}`],
      })
    }
  })

  // Check 3: Broken references
  console.log('   Checking references...')
  const brokenRefs = await client.fetch(`
    *[_type == "page"] {
      _id,
      "brokenRefs": content[]->._id == null
    }[brokenRefs]
  `)

  brokenRefs.forEach((doc: any) => {
    results.push({
      documentId: doc._id,
      documentType: 'page',
      issues: ['Contains broken references'],
    })
  })

  // Check 4: Missing images
  console.log('   Checking images...')
  const missingImages = await client.fetch(`
    *[_type in ["product", "campaign"] && !defined(image)] {
      _id, _type
    }
  `)

  missingImages.forEach((doc: any) => {
    results.push({
      documentId: doc._id,
      documentType: doc._type,
      issues: ['Missing featured image'],
    })
  })

  // Output results
  console.log('\n📊 Content Validation Report\n')
  console.log(`Total issues found: ${results.length}\n`)

  if (results.length === 0) {
    console.log('✅ All content is valid!\n')
    process.exit(0)
  }

  // Group by document type
  const byType = results.reduce(
    (acc, r) => {
      acc[r.documentType] = acc[r.documentType] || []
      acc[r.documentType].push(r)
      return acc
    },
    {} as Record<string, ValidationResult[]>
  )

  Object.entries(byType).forEach(([type, issues]) => {
    console.log(`\n${type.toUpperCase()} (${issues.length} issues):`)
    issues.forEach(issue => {
      console.log(`  ❌ ${issue.documentId}`)
      issue.issues.forEach(i => console.log(`     - ${i}`))
    })
  })

  console.log(
    '\n💡 Tip: Fix these issues in Sanity Studio to improve content quality\n'
  )

  // Create tasks in Sanity if --create-tasks flag is passed
  if (process.argv.includes('--create-tasks')) {
    if (!hasWriteAccess) {
      console.log(
        '⚠️  Cannot create tasks: No SANITY_API_TOKEN found in environment'
      )
      console.log(
        '   Add SANITY_API_TOKEN to .env.local to enable task creation\n'
      )
    } else {
      console.log('📝 Creating tasks in Sanity...\n')
      await createTasksInSanity(results)
    }
  } else {
    console.log(
      '💡 Run with --create-tasks flag to automatically create tasks in Sanity\n'
    )
  }

  process.exit(1)
}

async function createTasksInSanity(results: ValidationResult[]) {
  // First, clear existing validation tasks
  const existingTasks = await client.fetch(
    `*[_type == "validationTask" && status == "open"]._id`
  )

  if (existingTasks.length > 0) {
    console.log(`   Removing ${existingTasks.length} old open tasks...`)
    const transaction = client.transaction()
    existingTasks.forEach((id: string) => transaction.delete(id))
    await transaction.commit()
  }

  // Create new tasks
  const transaction = client.transaction()
  let created = 0

  for (const result of results) {
    const taskId = `validation-${result.documentId}-${Date.now()}-${created}`

    // Determine severity
    let severity = 'warning'
    if (result.issues.some(i => i.includes('SEO'))) severity = 'critical'
    if (result.issues.some(i => i.includes('broken references')))
      severity = 'critical'

    transaction.create({
      _type: 'validationTask',
      _id: taskId,
      title: `${result.documentType}: Fix validation issues`,
      description: `Found ${result.issues.length} issue(s) in this ${result.documentType} document.`,
      severity,
      documentReference: {
        _type: 'reference',
        _ref: result.documentId,
      },
      issues: result.issues,
      status: 'open',
      createdAt: new Date().toISOString(),
    })

    created++
  }

  await transaction.commit()
  console.log(`   ✅ Created ${created} tasks in Sanity Studio`)
  console.log(
    `   📋 View tasks at: http://localhost:3333/structure/validationTasks\n`
  )
}

validateContent().catch(error => {
  console.error('\n❌ Validation failed with error:\n')
  console.error(error)
  process.exit(1)
})
