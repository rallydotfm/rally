import { object, string, any } from 'zod'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'

export const schema = object({
  lens_name: string().trim().min(1),
  lens_bio: string().trim().optional(),
  lens_location: string().trim().optional(),
  lens_website: string().trim().url().optional(),
  lens_twitter_handle: string().trim().optional(),
  lens_avatar_image_file: any(),
  lens_avatar_image_src: string().optional(),
  lens_banner_image_file: any(),
  lens_banner_image_src: string().optional(),
})

export function useForm(config: { onSubmit: any }) {
  const { onSubmit } = config

  const formEditLensProfile = useStoreForm({
    extend: validator({ schema }),
    onSubmit,
  })

  return {
    formEditLensProfile,
  }
}

export default useForm
