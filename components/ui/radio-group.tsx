'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import * as tokens from '@/lib/design-tokens'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const radioVariants = cva(
  [
    'relative aspect-square rounded-full transition-all',
    'flex items-center justify-center',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    // Use CSS custom properties for colors (set via inline styles)
    'bg-[var(--radio-bg)]',
    'border-[var(--radio-border)]',
    'shadow-sm',
  ],
  {
    variants: {
      size: {
        // Small: 16px outer + 2px border = 20px total, inner dot ~6px
        small: 'h-5 w-5',
        // Medium: 20px outer + 2px border = 24px total, inner dot ~8px
        medium: 'h-6 w-6',
        // Large: 24px outer + 2px border = 28px total, inner dot ~10px
        large: 'h-7 w-7',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
)

const indicatorVariants = cva(
  'rounded-full absolute bg-[var(--radio-icon-color)]',
  {
    variants: {
      size: {
        // Inner dot sizes - approximately 37.5% of outer circle
        small: 'h-[6px] w-[6px]',
        medium: 'h-2 w-2',
        large: 'h-2.5 w-2.5',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
)

export interface RadioGroupItemProps
  extends
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioVariants({ size }), className)}
      style={
        {
          borderWidth: tokens.StrokeChonk,
          '--radio-bg': 'var(--radio-checked-bg, var(--radio-unchecked-bg))',
          '--radio-border':
            'var(--radio-checked-border, var(--radio-unchecked-border))',
          '--radio-checked-bg': tokens.ColorInputFillDefault,
          '--radio-unchecked-bg': tokens.ColorFormFieldFillDefault,
          '--radio-checked-border': tokens.ColorInputStroke,
          '--radio-unchecked-border': tokens.ColorFormFieldStrokeDefault,
          '--radio-icon-color': tokens.ColorInputContent,
        } as React.CSSProperties
      }
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div className={cn(indicatorVariants({ size }))} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
