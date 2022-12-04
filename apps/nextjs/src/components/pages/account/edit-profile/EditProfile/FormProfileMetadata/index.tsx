import Button from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import { CameraIcon } from '@heroicons/react/20/solid'
import { useAccount, useNetwork } from 'wagmi'

interface FormEditProfileProps {
  storeForm: any
  isError: boolean
  isLoading: boolean
  labelCta: string
}
export const FormEditProfile = (props: FormEditProfileProps) => {
  const {
    labelCta,
    isLoading,
    storeForm: {
      formEditLensProfile: { form, errors, isValid, data, setData },
    },
  } = props
  const account = useAccount()
  const { chain } = useNetwork()

  return (
    <form ref={form}>
      <fieldset className="space-y-5 mb-12">
        <FormField className="!mt-0">
          <FormField.InputField>
            <FormField.Label hasError={errors()?.lens_name?.length > 0 ? true : false} htmlFor="lens_name">
              Name
            </FormField.Label>
            <FormField.Description id="input-lens_name-description">Your display name.</FormField.Description>
            <FormInput
              disabled={!account?.address || chain?.unsupported === true}
              hasError={errors()?.lens_name?.length > 0 ? true : false}
              placeholder="Eg: Jean Doe"
              name="lens_name"
              id="lens_name"
              required
              aria-describedby="input-lens_name-description input-lens_name-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={errors()?.lens_name?.length > 0 ? true : false} id="input-lens_name-helpblock">
            Please type a name.
          </FormField.HelpBlock>
        </FormField>
        <FormField>
          <FormField.InputField>
            <FormField.Label hasError={errors()?.lens_bio?.length > 0 ? true : false} htmlFor="lens_bio">
              Bio
            </FormField.Label>
            <FormField.Description id="input-lens_bio-description">A few words about you.</FormField.Description>
            <FormTextarea
              disabled={!account?.address || chain?.unsupported === true}
              rows={7}
              hasError={errors()?.lens_bio?.length > 0 ? true : false}
              placeholder="Eg: Underslept developer."
              name="lens_bio"
              id="lens_bio"
              aria-describedby="input-lens_bio-description input-lens_bio-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={errors()?.lens_bio?.length > 0 ? true : false} id="input-lens_bio-helpblock">
            Please type a few words about you.
          </FormField.HelpBlock>
        </FormField>

        <FormField>
          <FormField.InputField>
            <FormField.Label hasError={errors()?.lens_location?.length > 0 ? true : false} htmlFor="lens_location">
              Location
            </FormField.Label>
            <FormField.Description id="input-lens_location-description">Where you hail from.</FormField.Description>
            <FormInput
              disabled={!account?.address || chain?.unsupported === true}
              hasError={errors()?.lens_location?.length > 0 ? true : false}
              placeholder="Eg: Planet Earth"
              name="lens_location"
              id="lens_location"
              required
              aria-describedby="input-lens_location-description input-lens_location-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock
            hasError={errors()?.lens_location?.length > 0 ? true : false}
            id="input-lens_location-helpblock"
          >
            Please type a location.
          </FormField.HelpBlock>
        </FormField>

        <FormField>
          <FormField.InputField>
            <FormField.Label hasError={errors()?.lens_website?.length > 0 ? true : false} htmlFor="lens_website">
              Your website
            </FormField.Label>
            <FormField.Description id="input-lens_website-description">Your online hide-out.</FormField.Description>
            <FormInput
              disabled={!account?.address || chain?.unsupported === true}
              hasError={errors()?.lens_website?.length > 0 ? true : false}
              placeholder="https://..."
              name="lens_website"
              id="lens_website"
              required
              type="url"
              aria-describedby="input-lens_website-description input-lens_website-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock
            hasError={errors()?.lens_website?.length > 0 ? true : false}
            id="input-lens_website-helpblock"
          >
            Please type a valid URL.
          </FormField.HelpBlock>
        </FormField>

        <FormField>
          <FormField.InputField>
            <FormField.Label
              hasError={errors()?.lens_twitter_handle?.length > 0 ? true : false}
              htmlFor="lens_twitter_handle"
            >
              Twitter handle
            </FormField.Label>
            <FormField.Description id="input-lens_twitter_handle-description">
              Your @ on the blue bird app.
            </FormField.Description>
            <FormInput
              disabled={!account?.address || chain?.unsupported === true}
              hasError={errors()?.lens_twitter_handle?.length > 0 ? true : false}
              placeholder="Eg: coolTwitterHandle999"
              name="lens_twitter_handle"
              id="lens_twitter_handle"
              required
              aria-describedby="input-lens_twitter_handle-description input-lens_twitter_handle-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock
            hasError={errors()?.lens_twitter_handle?.length > 0 ? true : false}
            id="input-lens_twitter_handle-helpblock"
          >
            Please type your Twitter handle
          </FormField.HelpBlock>
        </FormField>

        <FormField>
          <FormField.InputField>
            <div className="flex flex-col lg:justify-between lg:flex-row lg:space-i-6">
              <div>
                <FormField.Label
                  hasError={errors()?.lens_banner_image_file?.length ? true : false}
                  htmlFor="lens_banner_image_file"
                >
                  Your banner image
                </FormField.Label>
                <FormField.Description id="input-lens_banner_image_file-description">
                  Click on the picture to upload an image from your files.
                </FormField.Description>
                <FormField.HelpBlock
                  hasError={false}
                  className="not-sr-only text-neutral-11 text-2xs"
                  id="input-lens_banner_image_file-helpblock"
                >
                  Your image should not be larger than 1MB.
                </FormField.HelpBlock>
              </div>
              <div className="mt-3 relative lg:mt-0">
                <div className="w-full lg:w-96 aspect-twitter-card rounded-md overflow-hidden relative bg-neutral-1">
                  <input
                    disabled={!account?.address || chain?.unsupported === true}
                    onChange={(e) => {
                      //@ts-ignore
                      const src = URL.createObjectURL(e.target.files[0])
                      setData('lens_banner_image_src', src)
                    }}
                    className="absolute w-full h-full block inset-0 z-30 cursor-pointer opacity-0"
                    type="file"
                    accept="image/*"
                    name="lens_banner_image_file"
                    id="lens_banner_image_file"
                    required
                    aria-describedby="input-lens_banner_image_file-description input-lens_banner_image_file-helpblock"
                  />
                  <div className="absolute w-full h-full rounded-md inset-0 z-20 bg-neutral-3 bg-opacity-20 flex items-center justify-center">
                    <CameraIcon className="w-10 text-white" />
                  </div>

                  {data()?.lens_banner_image_src && (
                    <img
                      alt=""
                      loading="lazy"
                      width="112"
                      height="112"
                      className="absolute w-full h-full object-cover block z-10 inset-0"
                      src={data()?.lens_banner_image_src}
                    />
                  )}
                </div>

                {data()?.lens_banner_image_src && (
                  <Button
                    disabled={!account?.address || chain?.unsupported === true}
                    type="button"
                    className="mt-2 w-full"
                    intent="negative-ghost"
                    scale="xs"
                    onClick={() => {
                      setData('lens_banner_image_src')
                      setData('lens_banner_image_file')
                    }}
                  >
                    Delete image
                  </Button>
                )}
              </div>
            </div>
          </FormField.InputField>
        </FormField>
      </fieldset>
      <Button isLoading={isLoading} disabled={!isValid || isLoading}>
        {labelCta}
      </Button>
    </form>
  )
}

export default FormEditProfile
