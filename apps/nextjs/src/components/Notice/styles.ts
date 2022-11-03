import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
// CTA looking element (like button and links)
export const notice = cva(['rounded-md'], {
  variants: {
    intent: {
      primary: ['bg-primary-10', 'text-primary-3', 'border-transparent'],
      'primary-outline': ['text-white', 'border-primary-9', 'bg-black'],
      'neutral-outline': ['bg-black text-white', 'border-neutral-4'],
      'negative-outline': ['bg-negative-1 text-negative-11', 'border-negative-4'],
    },
    scale: {
      default: ['border', 'text-xs', 'py-2 px-4 sm:px-5', 'font-bold'],
    },
  },
  defaultVariants: {
    intent: 'primary',
    scale: 'default',
  },
})

export type SystemUiNoticeProps = VariantProps<typeof notice>

export default notice
