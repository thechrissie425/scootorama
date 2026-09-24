'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import * as tokens from '@/lib/design-tokens'

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        small: 'h-6 w-11',
        medium: 'h-7 w-[52px]',
        large: 'h-8 w-[60px]',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
)

const switchThumbVariants = cva(
  'pointer-events-none block shadow-lg ring-0 transition-transform',
  {
    variants: {
      size: {
        small:
          'h-4 w-4 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0.5',
        medium:
          'h-5 w-5 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0.5',
        large:
          'h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0.5',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
)

export interface SwitchProps
  extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(switchVariants({ size }), className)}
    style={
      {
        borderRadius: tokens.RadiusCircular,
        borderWidth: tokens.StrokeChonk,
        '--switch-checked-bg': tokens.ColorToggleFillActive,
        '--switch-unchecked-bg': tokens.ColorToggleFillInactive,
        '--switch-border-checked': tokens.ColorToggleStrokeActive,
        '--switch-border-unchecked': tokens.ColorToggleStrokeInactive,
        '--switch-thumb-checked': tokens.ColorToggleContentActive,
        '--switch-thumb-unchecked': tokens.ColorToggleContentInactive,
      } as React.CSSProperties
    }
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(switchThumbVariants({ size }))}
      style={{
        borderRadius: tokens.RadiusCircular,
      }}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch, switchVariants }
