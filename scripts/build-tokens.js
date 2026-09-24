#!/usr/bin/env node

const StyleDictionary = require('style-dictionary').default

console.log('🎨 Building design tokens...')

// Build tokens using the config file
const sd = new StyleDictionary('./style-dictionary.config.js')
sd.buildAllPlatforms()

console.log('✅ Design tokens built successfully!')
console.log('📦 Output: lib/design-tokens.js, lib/design-tokens.d.ts')
