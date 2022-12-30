import { object, string } from 'zod'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'

export const schema = object({
  publication_comment_content: string().trim().min(1),
})

export function useForm(config: { onSubmit: any; initialValues: any }) {
  const { onSubmit, initialValues } = config

  const formCommentLensPublication = useStoreForm({
    extend: validator({ schema }),
    onSubmit,
    initialValues,
  })

  return {
    formCommentLensPublication,
  }
}

export default useForm
