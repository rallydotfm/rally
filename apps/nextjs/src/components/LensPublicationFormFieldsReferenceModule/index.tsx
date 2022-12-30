import FormField from '@components/FormField'
import FormRadioGroup from '@components/FormRadioGroup'
import FormRadioOption from '@components/FormRadioOption'
import { RadioGroup } from '@headlessui/react'
import { useAccount, useNetwork } from 'wagmi'

export const LensPublicationFormFieldsReferenceModule = (props: any) => {
  const { disabled, data, setData, errors } = props
  const account = useAccount()
  const { chain } = useNetwork()
  return (
    <>
      <FormField>
        <FormField.InputField>
          <FormField.Label hasError={errors()?.reference_module?.lengt > 0} htmlFor="reference_module">
            Who can interact with your post ?
          </FormField.Label>
          <FormField.Description id="input-reference_module-description">
            Setup who can interact with your post: close it to a certain degree of your social circle, or open it to
            everyone.
          </FormField.Description>
          <FormRadioGroup
            name="reference_module"
            disabled={disabled || data()?.publish_on_lens !== true || !account?.address || chain?.unsupported === true}
            value={data()?.reference_module}
            onChange={(value: string) => {
              setData('reference_module', value)
            }}
          >
            <RadioGroup.Label className="sr-only">
              Can every eligible account comment and mirror your post ?
            </RadioGroup.Label>
            <div className="space-y-4 text-xs">
              <FormRadioOption value={-1}>Everyone</FormRadioOption>
              <FormRadioOption value={0}>No one (you included)</FormRadioOption>
              <FormRadioOption value={1}>Your followers only</FormRadioOption>
              <FormRadioOption value={2}>
                Your followers and their social circle, up to 1 degree of connection (the profiles they follow)
              </FormRadioOption>
              <FormRadioOption value={3}>
                Your followers and their social circle, up to 2 degrees of connection (the profiles they follow and the
                profiles followed by their followers)
              </FormRadioOption>
              <FormRadioOption value={4}>
                Your followers and their social circle, up to 3 degree of connection (the profiles they follow, the
                profiles followed by their followers and the profiles followed by the followers of their followers)
              </FormRadioOption>
            </div>
          </FormRadioGroup>
        </FormField.InputField>
      </FormField>
    </>
  )
}

export default LensPublicationFormFieldsReferenceModule
