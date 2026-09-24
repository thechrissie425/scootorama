#!/usr/bin/env tsx
/**
 * Structured Data Audit Script
 * Validates JSON-LD structured data implementation across content
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

interface AuditResult {
  type: string
  total: number
  missingStructuredData: number
  percentage: number
  issues: Array<{
    _id: string
    title: string
    missingSchemas: string[]
  }>
}

const SCHEMA_REQUIREMENTS: Record<
  string,
  { schemas: string[]; description: string }
> = {
  page: {
    schemas: ['WebPage', 'BreadcrumbList'],
    description: 'Landing pages should have WebPage and Breadcrumb schemas',
  },
  post: {
    schemas: ['Article', 'BreadcrumbList'],
    description: 'Blog posts should have Article and Breadcrumb schemas',
  },
  campaign: {
    schemas: ['Product', 'BreadcrumbList', 'Organization'],
    description:
      'Campaigns should have Product, Breadcrumb, and Organization schemas',
  },
  product: {
    schemas: ['Product', 'BreadcrumbList', 'Organization'],
    description:
      'Products should have Product, Breadcrumb, and Organization schemas',
  },
  membershipPage: {
    schemas: ['Product', 'BreadcrumbList'],
    description: 'Membership pages should have Product and Breadcrumb schemas',
  },
}

async function auditStructuredData(createTasks = false): Promise<void> {
  console.log('🔍 Auditing Structured Data Implementation...\n')

  const results: AuditResult[] = []
  let totalIssues = 0

  for (const [contentType, config] of Object.entries(SCHEMA_REQUIREMENTS)) {
    console.log(`📄 Checking ${contentType}...`)

    const query = `*[_type == $contentType && !(_id in path("drafts.**"))] {
      _id,
      "title": coalesce(title.en, title, name.en, name),
      hasStructuredData
    }`

    const documents = await client.fetch(query, { contentType })

    const issues = documents
      .filter((doc: any) => !doc.hasStructuredData)
      .map((doc: any) => ({
        _id: doc._id,
        title: doc.title || 'Untitled',
        missingSchemas: config.schemas,
      }))

    const percentage =
      documents.length > 0
        ? Math.round(
            ((documents.length - issues.length) / documents.length) * 100
          )
        : 100

    results.push({
      type: contentType,
      total: documents.length,
      missingStructuredData: issues.length,
      percentage,
      issues,
    })

    totalIssues += issues.length

    // Progress bar
    const bar =
      '█'.repeat(Math.floor(percentage / 5)) +
      '░'.repeat(20 - Math.floor(percentage / 5))
    console.log(
      `  ${bar} ${percentage}% (${documents.length - issues.length}/${documents.length})`
    )

    if (issues.length > 0) {
      console.log(`  ⚠️  ${issues.length} documents missing structured data`)
    }
    console.log()
  }

  // Summary
  console.log('📊 STRUCTURED DATA AUDIT SUMMARY')
  console.log('═'.repeat(60))
  console.log()

  results.forEach(result => {
    const emoji =
      result.percentage === 100 ? '✅' : result.percentage >= 75 ? '🟡' : '🔴'
    console.log(`${emoji} ${result.type}: ${result.percentage}% coverage`)
    console.log(
      `   ${result.total - result.missingStructuredData}/${result.total} documents have structured data`
    )
    if (result.missingStructuredData > 0) {
      const config = SCHEMA_REQUIREMENTS[result.type]
      console.log(`   Missing: ${config.schemas.join(', ')}`)
    }
    console.log()
  })

  console.log('═'.repeat(60))
  console.log(`Total Issues: ${totalIssues}`)
  console.log()

  // Create Sanity tasks if requested
  if (createTasks && totalIssues > 0) {
    console.log('📝 Creating Sanity validation tasks...\n')

    const mutations = results.flatMap(result =>
      result.issues.map(issue => ({
        create: {
          _type: 'validationTask',
          title: `Add structured data to ${result.type}: ${issue.title}`,
          description: `This ${result.type} is missing required structured data schemas.\n\nRequired schemas:\n${issue.missingSchemas.map(s => `- ${s}`).join('\n')}\n\n${SCHEMA_REQUIREMENTS[result.type].description}`,
          severity: 'high' as const,
          status: 'open' as const,
          documentReference: {
            _type: 'reference',
            _ref: issue._id,
          },
          issues: issue.missingSchemas.map(
            schema => `Missing ${schema} schema`
          ),
          createdAt: new Date().toISOString(),
        },
      }))
    )

    try {
      const transaction = client.transaction()
      mutations.forEach(m => {
        transaction.create(m.create)
      })
      await transaction.commit()
      console.log(
        `✅ Created ${mutations.length} validation tasks in Sanity Studio\n`
      )
    } catch (error) {
      console.error('❌ Error creating tasks:', error)
    }
  }

  // Implementation guidance
  if (totalIssues > 0) {
    console.log('💡 IMPLEMENTATION GUIDANCE')
    console.log('═'.repeat(60))
    console.log()
    console.log('1. Add structured data field to schemas:')
    console.log('   hasStructuredData: { type: "boolean", hidden: true }')
    console.log()
    console.log('2. Use StructuredData component in page templates:')
    console.log(
      '   import { StructuredData } from "@/components/StructuredData"'
    )
    console.log(
      '   import { generateProductSchema } from "@/lib/structuredData"'
    )
    console.log()
    console.log('3. Example usage in page.tsx:')
    console.log('   <StructuredData data={generateProductSchema({')
    console.log('     name: product.title,')
    console.log('     price: product.price,')
    console.log('     currency: "USD"')
    console.log('   })} />')
    console.log()
    console.log('4. Re-run audit after implementation')
    console.log()
  } else {
    console.log('🎉 All documents have required structured data!')
  }
}

// Parse command line arguments
const createTasks = process.argv.includes('--create-tasks')

auditStructuredData(createTasks).catch(console.error)
