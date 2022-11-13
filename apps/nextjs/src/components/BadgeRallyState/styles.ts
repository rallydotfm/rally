import { cva } from 'class-variance-authority'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import type { VariantProps } from 'class-variance-authority'
// CTA looking element (like badge and links)
export const badge = cva('text-[0.7rem] font-bold uppercase w-fit-content tracking-wider', {
  variants: {
    state: {
      [DICTIONARY_STATES_AUDIO_CHATS.PLANNED.label]: 'bg-neutral-4 text-neutral-12',
      [DICTIONARY_STATES_AUDIO_CHATS.READY.label]: 'bg-interactive-3 text-interactive-9',
      [DICTIONARY_STATES_AUDIO_CHATS.LIVE.label]: 'bg-primary-6 text-primary-10',
      [DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label]: 'bg-negative-2 text-negative-10',
      [DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label]: 'bg-neutral-12 text-neutral-1',
    },
    scale: {
      default: ['text-2xs px-2 py-1 rounded-md'],
    },
  },
  defaultVariants: {
    scale: 'default',
  },
})

export type SystemUiBadgeProps = VariantProps<typeof badge>

export default badge
