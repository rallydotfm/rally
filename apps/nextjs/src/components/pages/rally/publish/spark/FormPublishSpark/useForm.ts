import { object, string, boolean, number, array } from 'zod'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import * as tagsInput from '@zag-js/tags-input'
import { useMachine, normalizeProps } from '@zag-js/react'
import { useAccount, useNetwork } from 'wagmi'

export const schema = object({
  spark_title: string().trim().min(1),
  spark_language: string().trim().min(1),
  spark_description: string().trim(),
  spark_image_src: string().optional(),
  spark_is_nsfw: boolean(),
  publish_on_lens: boolean(),
  gated_module: boolean(),
  spark_category: string().trim().min(1),
  spark_tags: array(string()),
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

  const formPublishSpark = useStoreForm({
    initialValues,
    extend: validator({ schema }),
    onSubmit,
  })

  const [stateTags, sendTags] = useMachine(
    tagsInput.machine({
      id: 'spark-tags-input',
      addOnPaste: true,
      disabled: !account?.address || chain?.unsupported || chain?.id === 1 ? true : false,
      value: initialValues?.spark_tags ?? [],
      onChange: (tags: { values: Array<string> }) => {
        //@ts-ignore
        formPublishSpark.setData('spark_tags', tags.values)
      },
    }),
  )
  const apiInputSparkTags = tagsInput.connect(stateTags, sendTags, normalizeProps)

  return {
    formPublishSpark,
    apiInputSparkTags,
  }
}

export default useForm
