import { object, string, boolean, number, array } from 'zod'
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
  gated_module: boolean(),
  recording_category: string().trim().min(1),
  recording_tags: array(string()),
  gated_module_condition_operator: string().optional(),
  access_control_conditions: array(
    object({
      chainID: number().optional().or(string().optional()),
      tokenIds: array(string()).optional().or(array(number())).optional(),
      followNftContractAddress: string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .optional(),
      publicationCollectModuleContractAddress: string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .optional(),
      publicationId: string()?.optional().or(number().optional()),
      address: string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .optional(),
      contractAddress: string()
        .regex(/^0x[a-fA-F0-9]{40}$/)
        .optional(),
      contractType: string().optional(),
      profileId: string().optional(),
      publicationUrl: string().url().optional(),
      condition: string().optional(),
      amount: number().optional(),
      type: string(),
      gated_module_condition_operator: string().optional(),
    }),
  ).optional(),
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
