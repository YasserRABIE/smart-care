import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge our custom font sizes; otherwise `text-display-xl` is mistaken for a
// text color and dropped when combined with `text-white`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            '2xs',
            'xs',
            'sm',
            'md',
            'lg',
            'xl',
            'display-xs',
            'display-sm',
            'display-md',
            'display-lg',
            'display-xl',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
