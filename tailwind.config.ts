import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import tailwindAnimate from 'tailwindcss-animate'
import plugin from 'tailwindcss/plugin'
import * as tokens from './lib/design-tokens'

/**
 * Themeable colors. These read RGB channel CSS variables (so opacity
 * modifiers like bg-brand-primary/20 still work). Defaults come from the
 * design tokens; a campaign takeover overrides the variables at runtime
 * (see generateCampaignCSS in lib/takeoverManager.ts) to re-skin the site.
 */
const THEMEABLE = {
  'brand-primary': {
    light: tokens.ColorBrandPrimaryLight,
    base: tokens.ColorBrandPrimaryBase,
    dark: tokens.ColorBrandPrimaryDark,
  },
  'brand-secondary': {
    light: tokens.ColorBrandSecondaryLight,
    base: tokens.ColorBrandSecondaryBase,
    dark: tokens.ColorBrandSecondaryDark,
  },
  'brand-ink': {
    light: tokens.ColorBrandInkLight,
    base: tokens.ColorBrandInkBase,
    dark: tokens.ColorBrandInkDark,
  },
} as const

const hexToChannels = (hex: string) => {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.replace(/./g, c => c + c) : h, 16)
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}
const themeVar = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`
const themeScale = (name: keyof typeof THEMEABLE) => ({
  light: themeVar(`${name}-light`),
  base: themeVar(name),
  DEFAULT: themeVar(name),
  dark: themeVar(`${name}-dark`),
})
const themeDefaults = Object.fromEntries(
  Object.entries(THEMEABLE).flatMap(([name, scale]) => [
    [`--color-${name}-light`, hexToChannels(scale.light)],
    [`--color-${name}`, hexToChannels(scale.base)],
    [`--color-${name}-dark`, hexToChannels(scale.dark)],
  ])
)

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: [tokens.TypographyFontFamilyDisplayRegular],
        script: [tokens.TypographyFontFamilyScriptRegular],
        numeral: [tokens.TypographyFontFamilyNumeralRegular],
        'heading-light': [tokens.TypographyFontFamilyHeadingLight],
        heading: [tokens.TypographyFontFamilyHeadingMedium],
        'heading-semibold': [tokens.TypographyFontFamilyHeadingSemiBold],
        'heading-bold': [tokens.TypographyFontFamilyHeadingBold],
        'body-light': [tokens.TypographyFontFamilyBodyLight],
        'body-light-italic': [tokens.TypographyFontFamilyBodyLightItalic],
        body: [tokens.TypographyFontFamilyBodyRegular],
        'body-italic': [tokens.TypographyFontFamilyBodyItalic],
        'body-medium': [tokens.TypographyFontFamilyBodyMedium],
        'body-medium-italic': [tokens.TypographyFontFamilyBodyMediumItalic],
        'body-bold': [tokens.TypographyFontFamilyBodyBold],
        'body-bold-italic': [tokens.TypographyFontFamilyBodyBoldItalic],
        'body-black': [tokens.TypographyFontFamilyBodyBlack],
        'body-black-italic': [tokens.TypographyFontFamilyBodyBlackItalic],
      },
      backgroundImage: {
        'plus-gradient': tokens.GradientPlus,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        gradient: {
          100: tokens.ColorGradient100,
          200: tokens.ColorGradient200,
          300: tokens.ColorGradient300,
          400: tokens.ColorGradient400,
          500: tokens.ColorGradient500,
        },
        action: {
          primary: {
            DEFAULT: themeVar('brand-primary'),
            highlight: themeVar('brand-primary-light'),
            shadow: themeVar('brand-primary-dark'),
            stroke: themeVar('brand-primary-dark'),
            alternate: themeVar('brand-primary'),
            'stroke-alternate': themeVar('brand-primary'),
            content: tokens.ColorActionPrimaryContent,
          },
          secondary: {
            DEFAULT: themeVar('brand-secondary'),
            highlight: themeVar('brand-secondary-light'),
            shadow: themeVar('brand-secondary-dark'),
            stroke: themeVar('brand-secondary-dark'),
            alternate: themeVar('brand-secondary'),
            'stroke-alternate': themeVar('brand-secondary'),
            content: tokens.ColorActionSecondaryContent,
          },
          tertiary: {
            DEFAULT: tokens.ColorActionTertiaryFillDefault,
            highlight: tokens.ColorActionTertiaryFillHighlight,
            shadow: tokens.ColorActionTertiaryFillShadow,
            stroke: tokens.ColorActionTertiaryStroke,
            content: tokens.ColorActionTertiaryContent,
          },
          disabled: {
            DEFAULT: tokens.ColorActionDisabledFill,
            stroke: tokens.ColorActionDisabledStroke,
            content: tokens.ColorActionDisabledContent,
          },
        },
        black: {
          light: tokens.ColorNeutralBlackLight,
          base: tokens.ColorNeutralBlackBase,
          DEFAULT: tokens.ColorNeutralBlackBase,
          dark: tokens.ColorNeutralBlackDark,
        },
        white: {
          light: tokens.ColorNeutralWhiteLight,
          base: tokens.ColorNeutralWhiteBase,
          DEFAULT: tokens.ColorNeutralWhiteBase,
          dark: tokens.ColorNeutralWhiteDark,
        },
        darkGrey: {
          light: tokens.ColorNeutralDarkGreyLight,
          base: tokens.ColorNeutralDarkGreyBase,
          DEFAULT: tokens.ColorNeutralDarkGreyBase,
          dark: tokens.ColorNeutralDarkGreyDark,
        },
        grey: {
          light: tokens.ColorNeutralGreyLight,
          base: tokens.ColorNeutralGreyBase,
          DEFAULT: tokens.ColorNeutralGreyBase,
          dark: tokens.ColorNeutralGreyDark,
        },
        lightGrey: {
          light: tokens.ColorNeutralLightGreyLight,
          base: tokens.ColorNeutralLightGreyBase,
          DEFAULT: tokens.ColorNeutralLightGreyBase,
          dark: tokens.ColorNeutralLightGreyDark,
        },
        brandWhite: {
          light: tokens.ColorBrandWhiteLight,
          base: tokens.ColorBrandWhiteBase,
          DEFAULT: tokens.ColorBrandWhiteBase,
          dark: tokens.ColorBrandWhiteDark,
        },
        orange: {
          light: tokens.ColorSemanticOrangeLight,
          base: tokens.ColorSemanticOrangeBase,
          DEFAULT: tokens.ColorSemanticOrangeBase,
          dark: tokens.ColorSemanticOrangeDark,
        },
        blue: {
          light: tokens.ColorSemanticBlueLight,
          base: tokens.ColorSemanticBlueBase,
          DEFAULT: tokens.ColorSemanticBlueBase,
          dark: tokens.ColorSemanticBlueDark,
        },
        green: {
          light: tokens.ColorSemanticGreenLight,
          base: tokens.ColorSemanticGreenBase,
          DEFAULT: tokens.ColorSemanticGreenBase,
          dark: tokens.ColorSemanticGreenDark,
        },
        pink: {
          light: tokens.ColorSemanticPinkLight,
          base: tokens.ColorSemanticPinkBase,
          DEFAULT: tokens.ColorSemanticPinkBase,
          dark: tokens.ColorSemanticPinkDark,
        },
        red: {
          light: tokens.ColorSemanticRedLight,
          base: tokens.ColorSemanticRedBase,
          DEFAULT: tokens.ColorSemanticRedBase,
          dark: tokens.ColorSemanticRedDark,
        },
        yellow: {
          light: tokens.ColorSemanticYellowLight,
          base: tokens.ColorSemanticYellowBase,
          DEFAULT: tokens.ColorSemanticYellowBase,
          dark: tokens.ColorSemanticYellowDark,
        },
        cyan: {
          light: tokens.ColorSemanticCyanLight,
          base: tokens.ColorSemanticCyanBase,
          DEFAULT: tokens.ColorSemanticCyanBase,
          dark: tokens.ColorSemanticCyanDark,
        },
        gold: {
          light: tokens.ColorSemanticGoldLight,
          base: tokens.ColorSemanticGoldBase,
          DEFAULT: tokens.ColorSemanticGoldBase,
          dark: tokens.ColorSemanticGoldDark,
        },
        navy: {
          light: tokens.ColorSemanticNavyLight,
          base: tokens.ColorSemanticNavyBase,
          DEFAULT: tokens.ColorSemanticNavyBase,
          dark: tokens.ColorSemanticNavyDark,
        },
        purple: {
          light: tokens.ColorSemanticPurpleLight,
          base: tokens.ColorSemanticPurpleBase,
          DEFAULT: tokens.ColorSemanticPurpleBase,
          dark: tokens.ColorSemanticPurpleDark,
        },
        skyBlue: {
          light: tokens.ColorSemanticSkyBlueLight,
          base: tokens.ColorSemanticSkyBlueBase,
          DEFAULT: tokens.ColorSemanticSkyBlueBase,
          dark: tokens.ColorSemanticSkyBlueDark,
        },
        'brand-primary': {
          ...themeScale('brand-primary'),
          '600': themeVar('brand-primary-dark'),
        },
        'brand-secondary': themeScale('brand-secondary'),
        'brand-lime': {
          light: tokens.ColorBrandLimeLight,
          base: tokens.ColorBrandLimeBase,
          DEFAULT: tokens.ColorBrandLimeBase,
          dark: tokens.ColorBrandLimeDark,
        },
        'brand-ink': themeScale('brand-ink'),
        'brand-gray': {
          light: tokens.ColorBrandGrayLight,
          base: tokens.ColorBrandGrayBase,
          DEFAULT: tokens.ColorBrandGrayBase,
          dark: tokens.ColorBrandGrayDark,
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      spacing: {
        none: tokens.SpacingNone,
        ultraCompact: tokens.SpacingUltraCompact,
        extraCompact: tokens.SpacingExtraCompact,
        compact: tokens.SpacingCompact,
        semiCompact: tokens.SpacingSemiCompact,
        extraNarrow: tokens.SpacingExtraNarrow,
        narrow: tokens.SpacingNarrow,
        semiNarrow: tokens.SpacingSemiNarrow,
        relaxed: tokens.SpacingRelaxed,
        extraRelaxed: tokens.SpacingExtraRelaxed,
        ultraRelaxed: tokens.SpacingUltraRelaxed,
        semiExpanded: tokens.SpacingSemiExpanded,
        expanded: tokens.SpacingExpanded,
        extraExpanded: tokens.SpacingExtraExpanded,
        ultraExpanded: tokens.SpacingUltraExpanded,
        jumbo: tokens.SpacingJumbo,
      },
      borderRadius: {
        none: tokens.RadiusNone,
        xxSmall: tokens.RadiusXxSmall,
        xSmall: tokens.RadiusXSmall,
        small: tokens.RadiusSmall,
        medium: tokens.RadiusMedium,
        large: tokens.RadiusLarge,
        xLarge: tokens.RadiusXLarge,
        xxLarge: tokens.RadiusXxLarge,
        xxxLarge: tokens.RadiusXxxLarge,
        circular: tokens.RadiusCircular,
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        none: tokens.StrokeNone,
        fine: tokens.StrokeFine,
        chonk: tokens.StrokeChonk,
        heckinChonk: tokens.StrokeHeckinChonk,
        heftyChonk: tokens.StrokeHeftyChonk,
        megaChonk: tokens.StrokeMegaChonk,
      },
      fontSize: {
        // Button label ramp; size is paired with line-height so they can't drift.
        'label-1': [
          tokens.TypographyLabel1FontSize,
          { lineHeight: tokens.TypographyLabel1LineHeight },
        ],
        'label-2': [
          tokens.TypographyLabel2FontSize,
          { lineHeight: tokens.TypographyLabel2LineHeight },
        ],
        'label-3': [
          tokens.TypographyLabel3FontSize,
          { lineHeight: tokens.TypographyLabel3LineHeight },
        ],
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    typography,
    tailwindAnimate,
    plugin(({ addBase }) => addBase({ ':root': themeDefaults })),
  ],
}
export default config
