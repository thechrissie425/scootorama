#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const blockName = process.argv[2]

if (!blockName) {
  console.error('❌ Error: Block name is required')
  console.error('Usage: npm run generate:block <BlockName>')
  console.error('\nExample: npm run generate:block featureGrid')
  process.exit(1)
}

// Validate block name format
if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(blockName)) {
  console.error(
    '❌ Error: Block name must start with a letter and contain only letters and numbers'
  )
  console.error(`   Invalid: "${blockName}"`)
  console.error('   Valid examples: featureGrid, heroSection, contentBlock')
  process.exit(1)
}

const pascalCase = blockName.charAt(0).toUpperCase() + blockName.slice(1)
const camelCase = blockName.charAt(0).toLowerCase() + blockName.slice(1)

// 1. Create schema file
const schemaContent = `import { defineType, defineField } from 'sanity'
import { localizedString, localizedText } from '../lib/fieldHelpers'

export default defineType({
  name: '${camelCase}',
  title: '${pascalCase}',
  type: 'object',
  fields: [
    localizedString('title', 'Title', true),
    localizedText('description', 'Description'),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'image',
    },
  },
})
`

// 2. Create component file
const componentContent = `import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface ${pascalCase}Props {
  title?: { en?: string; es?: string; fr?: string; de?: string; ja?: string }
  description?: { en?: string; es?: string; fr?: string; de?: string; ja?: string }
  image?: any
  language?: string
}

export default function ${pascalCase}({ title, description, image, language = 'en' }: ${pascalCase}Props) {
  const displayTitle = title?.[language as keyof typeof title] || title?.en || ''
  const displayDescription = description?.[language as keyof typeof description] || description?.en || ''

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {image && (
            <div className="relative aspect-video">
              <Image
                src={urlFor(image).url()}
                alt={displayTitle}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
          
          <div>
            {displayTitle && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {displayTitle}
              </h2>
            )}
            
            {displayDescription && (
              <p className="text-lg text-gray-600">
                {displayDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
`

// Write files
const schemaPath = path.join(
  process.cwd(),
  'sanity',
  'schemaTypes',
  `${camelCase}.ts`
)
const componentPath = path.join(
  process.cwd(),
  'components',
  'blocks',
  `${pascalCase}.tsx`
)

// Check if files already exist
if (fs.existsSync(schemaPath)) {
  console.error(`❌ Error: Schema file already exists: ${camelCase}.ts`)
  console.error('   Choose a different name or delete the existing file first')
  process.exit(1)
}

if (fs.existsSync(componentPath)) {
  console.error(`❌ Error: Component file already exists: ${pascalCase}.tsx`)
  console.error('   Choose a different name or delete the existing file first')
  process.exit(1)
}

// Ensure directories exist
const schemaDir = path.dirname(schemaPath)
const componentDir = path.dirname(componentPath)

if (!fs.existsSync(schemaDir)) {
  fs.mkdirSync(schemaDir, { recursive: true })
}

if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true })
}

fs.writeFileSync(schemaPath, schemaContent)
fs.writeFileSync(componentPath, componentContent)

console.log(`\n✅ Generated new block: ${pascalCase}`)
console.log(`\n📁 Files created:`)
console.log(`   📄 sanity/schemaTypes/${camelCase}.ts`)
console.log(`   📄 components/blocks/${pascalCase}.tsx`)
console.log(`\n📝 Next steps to integrate this block:`)
console.log(`\n   1️⃣  Add to sanity/schemaTypes/index.ts:`)
console.log(`      import ${camelCase} from './${camelCase}'`)
console.log(`      // Add ${camelCase} to the schema array`)
console.log(`\n   2️⃣  Add GROQ fragment in sanity/lib/queries.ts:`)
console.log(`      export const ${camelCase.toUpperCase()}_FRAGMENT = \``)
console.log(`        _type == "${camelCase}" => {`)
console.log(`          ...,`)
console.log(`          "title": coalesce(title[$language], title.en, title),`)
console.log(`        }\``)
console.log(
  `\n   3️⃣  Import component in app/[market]/[lang]/(site)/[[...slug]]/page.tsx:`
)
console.log(
  `      import ${pascalCase} from '@/components/blocks/${pascalCase}'`
)
console.log(
  `      // Add to blockComponents object: ${camelCase}: ${pascalCase}`
)
console.log(`\n   4️⃣  Add to content query in [[...slug]]/page.tsx:`)
console.log(`      content[]{ ..., \${${camelCase.toUpperCase()}_FRAGMENT} }`)
console.log(`\n🎉 Done! Your new block is ready to use.`)
