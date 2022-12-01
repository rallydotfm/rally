import Button from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import { CameraIcon } from '@heroicons/react/20/solid'
import { useAccount, useNetwork } from 'wagmi'

interface FormEditProfileProps {
  storeForm: any
}
export const FormEditProfile = (props: FormEditProfileProps) => {
  const { storeForm } = props
  const { form, errors, isValid, data, setData } = storeForm
  const account = useAccount()
  const { chain } = useNetwork()
  return (
    <form ref={form}>
      <fieldset className="space-y-5 mb-6">
        <FormField className="!mt-0">
          <FormField.InputField>
            <FormField.Label hasError={false} htmlFor="lens_name">
              Name
            </FormField.Label>
            <FormField.Description id="input-lens_name-description">Your display name.</FormField.Description>
            <FormInput
              disabled={!account?.address || chain?.unsupported === true}
              hasError={false}
              placeholder="Eg: Jean Doe"
              name="lens_name"
              id="lens_name"
              required
              aria-describedby="input-lens_name-description input-lens_name-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={false} id="input-lens_name-helpblock">
            Please type a name.
          </FormField.HelpBlock>
        </FormField>
        <FormField>
          <FormField.InputField>
            <FormField.Label hasError={false} htmlFor="lens_bio">
              Bio
            </FormField.Label>
            <FormField.Description id="input-lens_bio-description">A few words about you.</FormField.Description>
            <FormTextarea
              disabled={!account?.address || chain?.unsupported === true}
              rows={7}
              hasError={false}
              placeholder="Eg: Underslept developer."
              name="lens_bio"
              id="lens_bio"
              aria-describedby="input-lens_bio-description input-lens_bio-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={false} id="input-lens_bio-helpblock">
            Please type a few words about you.
          </FormField.HelpBlock>
        </FormField>

        <FormField>
          <FormField.InputField>
            <FormField.Label hasError={false} htmlFor="lens_location">
              Location
            </FormField.Label>
            <FormField.Description id="input-lens_location-description">Where you hail from.</FormField.Description>
            <FormInput
              disabled={!account?.address || chain?.unsupported === true}
              hasError={false}
              placeholder="Eg: jeanDoe"
              name="lens_location"
              id="lens_location"
              required
              aria-describedby="input-lens_location-description input-lens_location-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={false} id="input-lens_location-helpblock">
            Please type a location.
          </FormField.HelpBlock>
        </FormField>

        <FormField>
          <FormField.InputField>
            <FormField.Label hasError={false} htmlFor="lens_website">
              Your website
            </FormField.Label>
            <FormField.Description id="input-lens_website-description">
              Your @ on the blue bird app.
            </FormField.Description>
            <FormInput
              disabled={!account?.address || chain?.unsupported === true}
              hasError={false}
              placeholder="https://..."
              name="lens_website"
              id="lens_website"
              required
              type="url"
              aria-describedby="input-lens_website-description input-lens_website-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={false} id="input-lens_website-helpblock">
            Please type a valid URL.
          </FormField.HelpBlock>
        </FormField>

        <FormField>
          <FormField.InputField>
            <FormField.Label hasError={false} htmlFor="lens_twitter_handle">
              Twitter handle
            </FormField.Label>
            <FormField.Description id="input-lens_twitter_handle-description">
              Your @ on the blue bird app.
            </FormField.Description>
            <FormInput
              disabled={!account?.address || chain?.unsupported === true}
              hasError={false}
              placeholder="Eg: Paldea"
              name="lens_twitter_handle"
              id="lens_twitter_handle"
              required
              aria-describedby="input-lens_twitter_handle-description input-lens_twitter_handle-helpblock"
            />
          </FormField.InputField>
          <FormField.HelpBlock hasError={false} id="input-lens_twitter_handle-helpblock">
            Please type your Twitter handle
          </FormField.HelpBlock>
        </FormField>
      </fieldset>
      <Button>Edit profile</Button>
    </form>
  )
}

export default FormEditProfile
