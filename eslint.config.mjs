// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import nextPlugin from '@next/eslint-plugin-next'
import jsxA11y from 'eslint-plugin-jsx-a11y'

const eslintConfig = [
  // Ignore patterns
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'build/**',
      '.sanity/**',
      'dist/**',
      '**/*.config.js',
      '**/*.config.mjs',
    ],
  }, // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended, // React and Next.js
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // Custom rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',

      // Accessibility: Enforce alt text on images
      'jsx-a11y/alt-text': [
        'error',
        {
          elements: ['img', 'object', 'area', 'input[type="image"]'],
          img: ['Image'], // Next.js Image component
          object: ['Object'],
          area: ['Area'],
          'input[type="image"]': ['InputImage'],
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  ...storybook.configs['flat/recommended'],
]

export default eslintConfig
