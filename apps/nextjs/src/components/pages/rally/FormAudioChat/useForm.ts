import { object, string, boolean, array, any, number } from 'zod'
import { isPast } from 'date-fns'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import * as tagsInput from '@zag-js/tags-input'
import { useMachine, normalizeProps } from '@zag-js/react'
import { useAccount, useNetwork } from 'wagmi'

export const schema = object({
  rally_name: string().trim().min(1),
  rally_language: string().trim().min(1),
  rally_description: string().trim(),
  rally_max_attendees: number().positive().optional(),
  rally_image_file: any(),
  rally_image_src: string().optional(),
  rally_category: string().trim().min(1),
  rally_start_at: string().refine((value) => value !== '' && !isPast(new Date(value))),
  rally_tags: array(string()),
  rally_has_cohosts: boolean(),
  rally_cohosts: array(
    object({
      eth_address: string().regex(/^0x[a-fA-F0-9]{40}$/),
    }),
  ).optional(),
  rally_guests: array(
    object({
      eth_address: string().regex(/^0x[a-fA-F0-9]{40}$/),
    }),
  ).optional(),
  rally_is_recorded: boolean(),
  rally_clips_allowed: boolean(),
  rally_is_gated: boolean(),
  rally_is_indexed: boolean(),
  rally_access_control_guilds: array(
    object({
      guild_id: string(),
      roles: array(string()),
    }),
  ).optional(),
})

export function useForm(config: { initialValues: any; onSubmit: any }) {
  const { initialValues, onSubmit } = config
  const account = useAccount()
  const { chain } = useNetwork()

  const formAudioChat = useStoreForm({
    initialValues,
    extend: validator({ schema }),
    onSubmit,
  })

  const [stateTags, sendTags] = useMachine(
    tagsInput.machine({
      id: 'rally-tags-input',
      addOnPaste: true,
      disabled: !account?.address || chain?.unsupported || chain?.id === 1 ? true : false,
      value: initialValues?.rally_tags ?? [],
      onChange: (tags: { values: Array<string> }) => {
        //@ts-ignore
        formAudioChat.setData('rally_tags', tags.values)
      },
    }),
  )
  const apiInputRallyTags = tagsInput.connect(stateTags, sendTags, normalizeProps)

  return {
    formAudioChat,
    apiInputRallyTags,
  }
}

export default useForm
