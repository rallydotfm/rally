import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
// CTA looking element (like button and links)
export const button = cva(
  [
    'inline-flex items-center justify-center',
    'tracking-wide',
    'rounded-full',
    'transition-colors transition-500',
    'disabled:!opacity-50 disabled:pointer-events-none',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-primary-10 hover:bg-primary-9 focus:bg-primary-11 hover:focus:bg-opacity-95',
          'text-primary-3',
          'border-transparent',
        ],
        'primary-outline': [
          'bg-transparent hover:bg-primary-3 focus:bg-primary-11 hover:focus:bg-opacity-95',
          'text-white focus:text-primary-3',
          'border-primary-9 focus:border-primary-11',
        ],
        negative: [
          'bg-negative-10 hover:bg-negative-9 focus:bg-negative-11 hover:focus:bg-opacity-95',
          'text-negative-3',
          'border-transparent',
        ],
        'negative-outline': [
          'bg-transparent hover:bg-negative-3 focus:bg-negative-11 hover:focus:bg-opacity-95',
          'text-white focus:text-negative-3',
          'border-negative-9 focus:border-negative-11',
        ],
        'neutral-outline': [
          'border-neutral-9 hover:border-neutral-10 focus:border-white bg-white bg-opacity-0 text-white hover:bg-opacity-10 focus:border-transparent focus:bg-opacity-100 focus:text-black',
        ],
        'primary-ghost': [
          'border-transparent bg-primary-10 bg-opacity-0 text-primary-10 hover:bg-opacity-10 focus:border-transparent focus:bg-opacity-100 focus:text-primary-1',
        ],
        'neutral-ghost': [
          'border-transparent bg-white bg-opacity-0 text-white hover:bg-opacity-10 focus:border-transparent focus:bg-opacity-100 focus:text-black',
        ],
        'negative-ghost': [
          'border-transparent bg-negative-11 bg-opacity-0 text-negative-11 hover:bg-opacity-10 focus:border-transparent focus:bg-opacity-100 focus:text-negative-1',
        ],
      },
      scale: {
        default: ['text-xs', 'py-2 px-4 sm:px-5', 'font-bold', 'border'],
        lg: ['text-md', 'py-1.5 px-4 sm:px-5', 'font-bold', 'border'],
        sm: ['text-2xs', 'py-2 px-2.5', 'font-bold', 'border'],
        xs: ['text-2xs', 'py-0.5 px-3', 'font-bold', 'border'],
      },
    },
    defaultVariants: {
      intent: 'primary',
      scale: 'default',
    },
  },
)

export type SystemUiButtonProps = VariantProps<typeof button>

export default button
