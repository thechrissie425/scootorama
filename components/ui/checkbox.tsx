'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import SvgIcon from '@/components/ui/SvgIcon'
import checkmarkIcon from '@/icons/system/checkmark.svg'
import minusIcon from '@/icons/controllers/button-minus.svg'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import * as tokens from '@/lib/design-tokens'

const checkboxVariants = cva(
  'grid place-content-center peer shrink-0 border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        small: 'h-4 w-4',
        medium: 'h-5 w-5',
        large: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  }
)

const checkboxIconVariants = cva('grid place-content-center', {
  variants: {
    size: {
      small: 'h-3 w-3',
      medium: 'h-4 w-4',
      large: 'h-5 w-5',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
})

export interface CheckboxProps
  extends
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ size }), className)}
    style={
      {
        borderRadius: tokens.RadiusXSmall,
        borderWidth: tokens.StrokeChonk,
        '--checkbox-checked-bg': tokens.ColorInputFillDefault,
        '--checkbox-unchecked-bg': tokens.ColorNeutralWhiteBase,
        '--checkbox-checked-border': tokens.ColorInputStroke,
        '--checkbox-unchecked-border': tokens.ColorFormFieldStrokeDefault,
        '--checkbox-icon-color': tokens.ColorInputContent,
      } as React.CSSProperties
    }
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn(checkboxIconVariants({ size }))}>
      {props.checked === 'indeterminate' ? (
        <SvgIcon
          src={minusIcon}
          className={cn(checkboxIconVariants({ size }))}
        />
      ) : (
        <SvgIcon
          src={checkmarkIcon}
          className={cn(checkboxIconVariants({ size }))}
        />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox, checkboxVariants }
