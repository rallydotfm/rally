import { object, string, boolean, array, instanceof as zodValidationInstanceOf } from 'zod'
import { isPast } from 'date-fns'
import { useForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import * as tagsInput from '@zag-js/tags-input'
import { useMachine, normalizeProps } from '@zag-js/react'

export const schema = object({
  rally_name: string().trim().min(1),
  rally_description: string().trim().min(1),
  rally_description_private: string().optional(),
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

export function useCreateAudioEvent() {
  const formAudioEvent = useForm({
    initialValues: {
      rally_is_private: false,
      rally_has_cohosts: false,
      rally_is_recorded: false,
      rally_tags: [],
      rally_cohosts: [],
      rally_name: '',
      rally_description: '',
      rally_start_at: '',
      rally_access_control_guilds: [],
      rally_access_control_blacklist: [],
      rally_access_control_whitelist: [],
    },
    extend: validator({ schema }),
    onSubmit: (values) => console.log(values),
  })

  const [stateTags, sendTags] = useMachine(
    tagsInput.machine({
      id: 'create-rally-tags-input',
      addOnPaste: true,
      onChange: (tags: { values: Array<string> }) => {
        //@ts-ignore
        formAudioEvent.setData('rally_tags', tags.values)
      },
    }),
  )
  const apiInputRallyTags = tagsInput.connect(stateTags, sendTags, normalizeProps)

  const [stateCohosts, sendCohosts] = useMachine(
    tagsInput.machine({
      id: 'create-rally-cohosts-input',
      addOnPaste: true,
      onChange: (tags: { values: Array<string> }) => {
        //@ts-ignore
        formAudioEvent.setData('rally_cohosts', tags.values)
      },
    }),
  )
  const apiInputRallyCohosts = tagsInput.connect(stateCohosts, sendCohosts, normalizeProps)

  return {
    formAudioEvent,
    apiInputRallyTags,
    apiInputRallyCohosts,
  }
}

export default useCreateAudioEvent
