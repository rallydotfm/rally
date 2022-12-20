import { object, string, number } from 'zod'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'

export const schema = object({
  type: string(),
  fee_amount: number().positive().optional(),
  currency_address: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
  recipient_address: string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
})

export function useForm(config: { onSubmit: any; initialValues: any }) {
  const { onSubmit, initialValues } = config

  const formSetMembership = useStoreForm({
    extend: validator({ schema }),
    onSubmit,
    initialValues,
  })

  return {
    formSetMembership,
  }
}

export default useForm
