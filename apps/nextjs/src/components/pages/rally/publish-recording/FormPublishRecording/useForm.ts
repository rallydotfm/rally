import { object, string, boolean, array } from 'zod'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import * as tagsInput from '@zag-js/tags-input'
import { useMachine, normalizeProps } from '@zag-js/react'
import { useAccount, useNetwork } from 'wagmi'

export const schema = object({
  recording_title: string().trim().min(1),
  recording_language: string().trim().min(1),
  recording_description: string().trim(),
  recording_image_src: string().optional(),
  recording_is_nsfw: boolean(),
  publish_on_lens: boolean(),
  recording_category: string().trim().min(1),
  recording_tags: array(string()),
})

export function useForm(config: { initialValues: any; onSubmit: any }) {
  const { initialValues, onSubmit } = config
  const account = useAccount()
  const { chain } = useNetwork()

  const formPublishRecording = useStoreForm({
    initialValues,
    extend: validator({ schema }),
    onSubmit,
  })

  const [stateTags, sendTags] = useMachine(
    tagsInput.machine({
      id: 'recording-tags-input',
      addOnPaste: true,
      disabled: !account?.address || chain?.unsupported || chain?.id === 1 ? true : false,
      value: initialValues?.recording_tags ?? [],
      onChange: (tags: { values: Array<string> }) => {
        //@ts-ignore
        formPublishRecording.setData('recording_tags', tags.values)
      },
    }),
  )
  const apiInputRecordingTags = tagsInput.connect(stateTags, sendTags, normalizeProps)

  return {
    formPublishRecording,
    apiInputRecordingTags,
  }
}

export default useForm
