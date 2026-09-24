module.exports = {
  // Only the curated token file builds. design-tokens/generated/ is a Figma
  // mirror for review, and figma-mapping.json is config, not tokens.
  source: ['design-tokens/tokens.json'],
  platforms: {
    js: {
      transformGroup: 'js',
      buildPath: 'lib/',
      files: [
        {
          destination: 'design-tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'lib/',
      files: [
        {
          destination: 'design-tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
  },
}
