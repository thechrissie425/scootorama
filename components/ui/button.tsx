import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-heading-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95',
  {
    variants: {
      variant: {
        // --- Design system (Figma: Components / filled-button) ---
        // Prefer these. The variants below them predate the design system.
        primary:
          'font-body-bold uppercase rounded-medium border-chonk bg-action-primary text-action-primary-content border-action-primary-stroke hover:bg-action-primary-highlight active:bg-action-primary-shadow active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-100 disabled:bg-action-disabled disabled:text-action-disabled-content disabled:border-action-disabled-stroke',
        secondary_ds:
          'font-body-bold uppercase rounded-medium border-chonk bg-action-secondary text-action-secondary-content border-action-secondary-stroke hover:bg-action-secondary-highlight active:bg-action-secondary-shadow active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-100 disabled:bg-action-disabled disabled:text-action-disabled-content disabled:border-action-disabled-stroke',
        tertiary:
          'font-body-bold uppercase rounded-medium border-chonk bg-action-tertiary text-action-tertiary-content border-action-tertiary-stroke hover:bg-action-tertiary-highlight active:bg-action-tertiary-shadow active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-100 disabled:bg-action-disabled disabled:text-action-disabled-content disabled:border-action-disabled-stroke',
        // Gradient fill can't be swapped per state like the solid variants, so
        // hover/pressed shift brightness instead.
        plus: 'font-body-bold uppercase rounded-medium border-chonk border-transparent bg-plus-gradient text-action-tertiary-content hover:brightness-105 active:brightness-95 active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-100 disabled:bg-none disabled:bg-action-disabled disabled:text-action-disabled-content disabled:border-action-disabled-stroke disabled:brightness-100',
        outlinedPrimary:
          'font-body-bold uppercase rounded-medium border-chonk border-action-primary-stroke-alternate bg-transparent text-action-primary-alternate hover:bg-action-primary-highlight/10 active:bg-action-primary-highlight/20 active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-100 disabled:border-action-disabled-stroke disabled:text-action-disabled-content',
        outlinedSecondary:
          'font-body-bold uppercase rounded-medium border-chonk border-action-secondary-stroke-alternate bg-transparent text-action-secondary-alternate hover:bg-action-secondary-highlight/10 active:bg-action-secondary-highlight/20 active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-100 disabled:border-action-disabled-stroke disabled:text-action-disabled-content',
        outlinedTertiary:
          'font-body-bold uppercase rounded-medium border-chonk border-action-tertiary-stroke bg-transparent text-action-tertiary-content hover:bg-action-tertiary-highlight active:bg-action-tertiary-shadow active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-100 disabled:border-action-disabled-stroke disabled:text-action-disabled-content',
        textPrimary:
          'font-body-bold uppercase bg-transparent text-action-primary-alternate hover:underline active:opacity-80 active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-50',
        textSecondary:
          'font-body-bold uppercase bg-transparent text-action-secondary-alternate hover:underline active:opacity-80 active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-50',
        textTertiary:
          'font-body-bold uppercase bg-transparent text-action-tertiary-content hover:underline active:opacity-80 active:scale-100 focus-visible:ring-4 focus-visible:ring-black-base focus-visible:ring-offset-0 disabled:opacity-50',

        // --- Legacy (pre design system) ---
        default:
          'bg-brand-primary text-white shadow-lg shadow-brand-primary-dark/10 hover:bg-brand-primary-dark border border-transparent rounded-full',
        destructive:
          'bg-red-600 text-white shadow-sm hover:bg-red-700 rounded-xl font-heading-bold',
        outline:
          'border-2 border-brand-primary bg-transparent text-brand-primary shadow-sm hover:bg-brand-primary hover:text-white rounded-full font-heading-bold',
        secondary:
          'bg-purple-600 text-white shadow-sm hover:bg-purple-700 rounded-xl font-heading-bold',
        ghost:
          'hover:bg-brand-primary/10 hover:text-brand-primary text-brand-primary rounded-md font-heading-semibold',
        link: 'text-brand-primary underline-offset-4 hover:underline font-heading-semibold',
        playful:
          'bg-brand-primary text-white shadow-xl shadow-brand-primary-dark/20 hover:bg-brand-primary-dark rounded-xl font-display tracking-wider uppercase transform hover:scale-105 active:scale-95 border border-brand-primary-dark',
      },
      size: {
        // --- Design system sizes ---
        small: 'h-8 px-semiCompact gap-extraCompact text-label-3',
        medium: 'h-11 px-narrow gap-extraCompact text-label-2',
        // Not in the small/medium web spec, but real CTA usage (BrandCTAButton,
        // pricing/hero buttons) relies on a large size. Height/type from the
        // Figma web button spec (56px control, label/1).
        large: 'h-14 px-relaxed gap-extraCompact text-label-1',

        // --- Legacy ---
        default: 'h-10 px-7 py-2.5 text-[15px]',
        sm: 'h-8 px-3 text-xs rounded-md',
        lg: 'h-12 px-8 text-base rounded-xl',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
