import Button from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import InputTags from '@components/InputTags'
import { useAccount, useNetwork } from 'wagmi'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import InputCheckboxToggle from '@components/InputCheckboxToggle'
import LensPublicationFormFieldsReferenceModule from '@components/LensPublicationFormFieldsReferenceModule'
import LensPublicationFormFieldsCollectModule from '@components/LensPublicationFormFieldsCollectModule'
import LensPublicationFormFieldsGatedModule from '@components/LensPublicationFormFieldsGatedModule'

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
    storeForm: { form, setData, setFields, resetField, addField, data, errors, isValid },
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
                  disabled={disabled || !account?.address || chain?.unsupported === true || chain?.id === 1}
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
                  disabled={disabled || !account?.address || chain?.unsupported === true || chain?.id === 1}
                  className="min-h-[30ch]"
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
                <FormField.Description id="input-recording_tags-description">
                  Keywords to let your audience know what to expect from this recording
                </FormField.Description>
                <InputTags
                  disabled={disabled || !account?.address || chain?.unsupported === true || chain?.id === 1}
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
            <div className="relative focus-within:z-10 bg-neutral-1 p-6 rounded-md">
              <h2 className="font-semibold text-sm mb-1.5">Configure access-control settings</h2>
              <p className="mb-4 text-neutral-11 text-xs">
                Define who can access your post with on-chain criteria.
                <br /> Your wallet will be whitelisted by default.
              </p>
              <div className="space-y-6">
                <LensPublicationFormFieldsGatedModule
                  data={data}
                  setData={setData}
                  errors={errors}
                  disabled={disabled || !showSectionLens}
                  setFields={setFields}
                  addField={addField}
                  resetField={resetField}
                />
              </div>
            </div>
          </fieldset>

          <fieldset disabled={!showSectionLens}>
            <div className="space-y-5">
              <FormField>
                <InputCheckboxToggle
                  disabled={
                    disabled || !showSectionLens || !account?.address || chain?.unsupported === true || chain?.id === 1
                  }
                  label="Share on Lens"
                  helpText={
                    showSectionLens
                      ? `Enabling this option will share this recording on your Lens profile.`
                      : `Connect to your Lens profile to enable this option.`
                  }
                  checked={data()?.publish_on_lens === true ? true : false}
                  onChange={(value: any) => {
                    setData('publish_on_lens', value)
                  }}
                />
              </FormField>
              {data()?.publish_on_lens === true && (
                <>
                  <div className="relative focus-within:z-10 bg-neutral-1 p-6 rounded-md">
                    <h2 className="font-semibold text-sm mb-1.5">Configure collect settings</h2>
                    <p className="mb-4 text-neutral-11 text-xs">
                      Collects allow you to monetize your content. When sharing your recording, you can configure a
                      collect module that defines who can collect your recording, when and for how much.
                    </p>
                    <div className="space-y-6">
                      <LensPublicationFormFieldsCollectModule
                        data={data}
                        setFields={setFields}
                        setData={setData}
                        errors={errors}
                        disabled={disabled || !showSectionLens}
                      />
                    </div>
                  </div>
                  <div className="relative focus-within:z-10 bg-neutral-1 p-6 rounded-md">
                    <h2 className="font-semibold text-sm mb-1.5">Configure mirror and comments settings</h2>
                    <p className="mb-4 text-neutral-11 text-xs">Fine-tune who can comment and mirror your post.</p>
                    <div className="space-y-6">
                      <LensPublicationFormFieldsReferenceModule
                        data={data}
                        setData={setData}
                        errors={errors}
                        disabled={disabled || !showSectionLens}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </fieldset>
        </div>
        <Button
          isLoading={[
            state.transaction,
            state.contract,
            state?.publishToLens,
            state?.uploadAudioFile,
            state?.uploadData,
          ].find((slice) => slice?.isLoading)}
          disabled={
            !isSignedIn ||
            disabled ||
            ![true, false].includes(data()?.publish_on_lens) ||
            !account?.address ||
            chain?.unsupported === true ||
            chain?.id === 1 ||
            !isValid() ||
            [state.transaction, state.contract, state?.publishToLens, state?.uploadAudioFile, state?.uploadData].find(
              (slice) => slice?.isLoading,
            ) ||
            (data()?.publish_on_lens === true &&
              (![0, 1, 2].includes(data()?.collect_module) ||
                ![-1, 0, 1, 2, 3, 4].includes(data()?.reference_module) ||
                ([0, 1].includes(data()?.collect_module) &&
                  (![true, false].includes(data()?.collect_module_has_fee) ||
                    (data()?.collect_module_has_fee === true &&
                      ![true, false].includes(data()?.collect_module_is_limited_amount)))) ||
                (data()?.collect_module_has_fee === true &&
                  (!data()?.collect_module_fee_amount ||
                    data()?.collect_module_fee_amount === '' ||
                    data()?.collect_module_referral_fee_amount === '' ||
                    data()?.collect_module_fee_currency_address === '')) ||
                (data()?.collect_module_is_limited_amount === true &&
                  (data()?.collect_module_amount === '' ||
                    !data()?.collect_module_fee_amount ||
                    data()?.collect_module_fee_amount === ''))))
          }
        >
          {[state.transaction, state.contract, state?.publishToLens, state?.uploadAudioFile, state?.uploadData].find(
            (slice) => slice?.isLoading,
          )
            ? labelButtonSubmitting
            : [state.transaction, state.contract, state?.publishToLens, state?.uploadAudioFile, state?.uploadData].find(
                (slice) => slice?.isError,
              )
            ? 'Try again'
            : labelButtonSubmit}
        </Button>
      </form>
    </>
  )
}

export default FormPublishRecording
