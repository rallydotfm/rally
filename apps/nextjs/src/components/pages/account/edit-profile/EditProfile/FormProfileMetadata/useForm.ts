import { object, string, any } from 'zod'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'

export const schema = object({
  lens_name: string().optional(),
  lens_bio: string().optional(),
  lens_location: string().optional(),
  lens_website: string().url().or(string().max(0)),
  lens_twitter_handle: string().optional(),
  lens_banner_image_file: any(),
  lens_banner_image_src: string().optional(),
})

export function useForm(config: { onSubmit: any; initialValues: any }) {
  const { onSubmit, initialValues } = config

  const formEditLensProfile = useStoreForm({
    extend: validator({ schema }),
    onSubmit,
    initialValues,
  })

  return {
    formEditLensProfile,
  }
}

export default useForm
