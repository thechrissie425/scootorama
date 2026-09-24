import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// tailwind-merge doesn't know our custom font-size scale (label-1/2/3 from
// the button type ramp), so it falls back to a generic "text-*" bucket that
// collides with text-color utilities like text-action-primary-content —
// silently dropping whichever one appears first. Registering the scale here
// fixes that; without it, design-system button text renders with no color
// class at all (inherits black) instead of the intended white/dark content.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['label-1', 'label-2', 'label-3'] }],
      'border-w': [
        {
          border: [
            'none',
            'fine',
            'chonk',
            'heckinChonk',
            'heftyChonk',
            'megaChonk',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
