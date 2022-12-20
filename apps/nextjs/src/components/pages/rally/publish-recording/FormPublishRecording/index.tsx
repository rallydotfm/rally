import Button from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import InputTags from '@components/InputTags'
import FormRadioGroup from '@components/FormRadioGroup'
import { Listbox, RadioGroup } from '@headlessui/react'
import FormRadioOption from '@components/FormRadioOption'
import { useAccount, useNetwork } from 'wagmi'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import InputCheckboxToggle from '@components/InputCheckboxToggle'

interface FormPublishRecording {
  disabled: boolean
  showSectionLens: boolean
  state: any
  apiInputRecordingTags: any
  storeForm: any
  labelButtonSubmit: string
  labelButtonSubmitting: string
}
export const FormPublishRecording = (props: FormPublishRecording) => {
  const {
    showSectionLens,
    disabled,
    state,
    apiInputRecordingTags,
    labelButtonSubmit,
    labelButtonSubmitting,
    storeForm: { form, setData, resetField, addField, data, errors, isValid },
  } = props
  const { chain } = useNetwork()
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state: { isSignedIn: boolean }) => state.isSignedIn)

  return (
    <>
      <form ref={form}>
        <div className="space-y-10 mb-12 text-neutral-12">
          <fieldset className="space-y-5">
            <FormField className="!mt-0">
              <FormField.InputField>
                <FormField.Label hasError={errors()?.recording_title?.length ? true : false} htmlFor="recording_title">
                  Title
                </FormField.Label>
                <FormField.Description id="input-recording_title-description">
                  The title of your recording.
                </FormField.Description>
                <FormInput
                  disabled={disabled || !account?.address || chain?.unsupported === true}
                  hasError={errors()?.recording_title?.length ? true : false}
                  placeholder="Eg: RallyDAO meeting #5"
                  name="recording_title"
                  id="recording_title"
                  required
                  aria-describedby="input-recording_title-description input-recording_title-helpblock"
                />
              </FormField.InputField>
              <FormField.HelpBlock
                hasError={errors()?.recording_title?.length ? true : false}
                id="input-recording_title-helpblock"
              >
                Please type a title.
              </FormField.HelpBlock>
            </FormField>

            <FormField>
              <FormField.InputField>
                <FormField.Label
                  hasError={errors()?.recording_description?.length ? true : false}
                  htmlFor="recording_description"
                >
                  Description
                </FormField.Label>
                <FormField.Description id="input-recording_description-description">
                  A few words on what was discussed in your recording.
                </FormField.Description>
                <FormTextarea
                  disabled={disabled || !account?.address || chain?.unsupported === true}
                  rows={7}
                  hasError={errors()?.recording_description?.length ? true : false}
                  placeholder="Eg: Community discussion about the future of Rally. Members only !"
                  name="recording_description"
                  id="recording_description"
                  aria-describedby="input-recording_description-description input-recording_description-helpblock"
                />
              </FormField.InputField>
              <FormField.HelpBlock
                hasError={errors()?.recording_description?.length ? true : false}
                id="input-recording_description-helpblock"
              >
                Please type a description.
              </FormField.HelpBlock>
            </FormField>

            <FormField>
              <FormField.InputField>
                <FormField.Label hasError={errors()?.recording_tags?.length ? true : false} htmlFor="recording_tags">
                  Tags
                </FormField.Label>
                <FormField.Description id="input-recording_tags-description">Add some tags</FormField.Description>
                <InputTags
                  disabled={disabled || !account?.address || chain?.unsupported === true}
                  className="w-full"
                  api={apiInputRecordingTags}
                />
              </FormField.InputField>
              <FormField.HelpBlock
                hasError={errors()?.recording_tags?.length ? true : false}
                id="input-recording_tags-helpblock"
              >
                Please add at least 1 tag.
              </FormField.HelpBlock>
            </FormField>
          </fieldset>

          <fieldset disabled={!showSectionLens}>
            <div className="space-y-5">
              <FormField>
                <InputCheckboxToggle
                  disabled={disabled || !showSectionLens || !account?.address || chain?.unsupported === true}
                  label="Post to Lens"
                  helpText={
                    showSectionLens
                      ? `Enabling this option will post this recording to your Lens profile.`
                      : `Connect to your Lens profile to enable this option.`
                  }
                  checked={data()?.recording_publish_on_lens === true ? true : false}
                  onChange={(value: any) => {
                    setData('recording_publish_on_lens', value)
                  }}
                />
              </FormField>
              <FormField>
                <FormField.InputField>
                  <FormField.Label
                    className="text-xs"
                    hasError={errors()?.collect_module?.length ? true : false}
                    htmlFor="collect_module"
                  >
                    Who can collect your recording ?
                  </FormField.Label>
                  <FormField.Description id="collect_module-description">
                    When posting your recording on Lens, you can setup a collect module. Collects allow you to monetize
                    your content. You can customize who can collect your recording, when and for how much.
                  </FormField.Description>
                  <FormRadioGroup
                    name="collect_module"
                    disabled={disabled || !showSectionLens || !account?.address || chain?.unsupported === true}
                    value={data()?.type}
                    onChange={(value: string) => {
                      setData('collect_module', parseInt(value))
                    }}
                  >
                    <RadioGroup.Label className="sr-only">Who can collect this recording ?</RadioGroup.Label>
                    <div className="space-y-4 text-xs">
                      <FormRadioOption value={'0'}>Anyone</FormRadioOption>
                      <FormRadioOption value={'1'}>Only my followers</FormRadioOption>
                      <FormRadioOption value={'2T'}>No one</FormRadioOption>
                    </div>
                  </FormRadioGroup>
                </FormField.InputField>
              </FormField>
            </div>
          </fieldset>
        </div>

        <Button
          isLoading={
            [state.transaction, state.contract, state.publishToLens, state.uploadAudioFile, state.uploadData].filter(
              (slice) => slice.isLoading,
            )?.length > 0
          }
          disabled={
            !isSignedIn ||
            disabled ||
            !account?.address ||
            chain?.unsupported === true ||
            !isValid() ||
            [state.transaction, state.contract, state.publishToLens, state.uploadAudioFile, state.uploadData].filter(
              (slice) => slice.isLoading,
            )?.length > 0
          }
        >
          {[state.transaction, state.contract, state.publishToLens, state.uploadAudioFile, state.uploadData].filter(
            (slice) => slice.isLoading,
          )?.length > 0
            ? labelButtonSubmitting
            : [state.transaction, state.contract, state.publishToLens, state.uploadAudioFile, state.uploadData].filter(
                (slice) => slice.isError,
              )?.length > 0
            ? 'Try again'
            : labelButtonSubmit}
        </Button>
      </form>
    </>
  )
}

export default FormPublishRecording
