import { object, string, boolean, array, any, number } from 'zod'
import { isPast } from 'date-fns'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import * as tagsInput from '@zag-js/tags-input'
import { useMachine, normalizeProps } from '@zag-js/react'

export const schema = object({
  rally_name: string().trim().min(1),
  rally_description: string().trim().min(1),
  rally_max_attendees: number().positive().optional(),
  rally_image_file: any(),
  rally_image_src: string().optional(),
  rally_start_at: string().refine((value) => value !== '' && !isPast(new Date(value))),
  rally_tags: array(string()),
  rally_has_cohosts: boolean(),
  rally_cohosts: array(
    object({
      name: string().optional(),
      eth_address: string().regex(/^0x[a-fA-F0-9]{40}$/),
    }),
  ).optional(),
  rally_is_recorded: boolean(),
  rally_is_private: boolean(),
  rally_access_control_guilds: array(
    object({
      guild_id: string(),
      roles: array(string()),
    }),
  ).optional(),
  rally_access_control_blacklist: array(string().regex(/^0x[a-fA-F0-9]{40}$/)).optional(),
  rally_access_control_whitelist: array(string().regex(/^0x[a-fA-F0-9]{40}$/)).optional(),
})

export function useForm(config: { initialValues: any; onSubmit: any }) {
  const { initialValues, onSubmit } = config
  const formAudioChat = useStoreForm({
    initialValues,
    extend: validator({ schema }),
    onSubmit,
  })

  const [stateTags, sendTags] = useMachine(
    tagsInput.machine({
      id: 'rally-tags-input',
      addOnPaste: true,
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
