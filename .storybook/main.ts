import type { StorybookConfig } from '@storybook/nextjs-vite'
import { mergeConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import svgr from 'vite-plugin-svgr'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],

  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [svgr()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '..'),
        },
      },
    })
  },
}
export default config
