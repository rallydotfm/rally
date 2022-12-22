import Button from '@components/Button'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import InputTags from '@components/InputTags'
import FormRadioGroup from '@components/FormRadioGroup'
import { RadioGroup } from '@headlessui/react'
import FormRadioOption from '@components/FormRadioOption'
import { useAccount, useNetwork } from 'wagmi'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import InputCheckboxToggle from '@components/InputCheckboxToggle'
import FormSelect from '@components/FormSelect'
import { TOKENS_WHITELIST } from '@config/lens'

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
                <FormField.Description id="input-recording_tags-description">
                  Keywords to let your audience know what to expect from this recording
                </FormField.Description>
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
                  label="Share on Lens"
                  helpText={
                    showSectionLens
                      ? `Enabling this option will share this recording on your Lens profile.`
                      : `Connect to your Lens profile to enable this option.`
                  }
                  checked={data()?.recording_publish_on_lens === true ? true : false}
                  onChange={(value: any) => {
                    setData('recording_publish_on_lens', value)
                  }}
                />
              </FormField>
              {data()?.recording_publish_on_lens === true && (
                <>
                  <div className="bg-neutral-1 p-6 rounded-md">
                    <h2 className="font-semibold text-sm mb-1.5">Configure collect settings</h2>
                    <p className="mb-4 text-neutral-11 text-xs">
                      Collects allow you to monetize your content. When sharing your recording, you can configure a
                      collect module that defines who can collect your recording, when and for how much.
                    </p>
                    <div className="space-y-6">
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
                            Restrict or open who can collect your recording.
                          </FormField.Description>
                          <FormRadioGroup
                            name="collect_module"
                            disabled={
                              disabled ||
                              data()?.recording_publish_on_lens !== true ||
                              !showSectionLens ||
                              !account?.address ||
                              chain?.unsupported === true
                            }
                            value={data()?.collect_module}
                            onChange={(value: number) => {
                              setData('collect_module', value)
                            }}
                          >
                            <RadioGroup.Label className="sr-only">Who can collect this recording ?</RadioGroup.Label>
                            <div className="space-y-4 text-xs">
                              <FormRadioOption value={0}>Anyone</FormRadioOption>
                              <FormRadioOption value={1}>Only my followers</FormRadioOption>
                              <FormRadioOption value={2}>No one</FormRadioOption>
                            </div>
                          </FormRadioGroup>
                        </FormField.InputField>
                      </FormField>
                      {[0, 1].includes(data()?.collect_module) && (
                        <>
                          <FormField>
                            <FormField.InputField>
                              <FormField.Label
                                hasError={errors()?.collect_module_is_limited_amount?.length > 0}
                                htmlFor="collect_module_is_limited_amount"
                              >
                                Is your recording a limited edition ?
                              </FormField.Label>
                              <FormField.Description id="input-collect_module_is_limited_amount-description">
                                Make collecting your recording more exclusive or more accessible by allowing a finite or
                                infinite amount of eligible accounts to collect it. <br />
                                <span className="font-bold">
                                  Limited editions must all specify a positive collect fee amount.
                                </span>
                              </FormField.Description>
                              <FormRadioGroup
                                name="collect_module_is_limited_amount"
                                disabled={
                                  disabled ||
                                  data()?.recording_publish_on_lens !== true ||
                                  !showSectionLens ||
                                  !account?.address ||
                                  chain?.unsupported === true
                                }
                                value={data()?.collect_module_is_limited_amount}
                                onChange={(value: boolean) => {
                                  setData('collect_module_is_limited_amount', value)
                                  if (value === true) {
                                    setData('collect_module_has_fee', true)
                                  } else {
                                    setFields('collect_module_amount', '')
                                  }
                                }}
                              >
                                <RadioGroup.Label className="sr-only">
                                  Who can collect this recording ?
                                </RadioGroup.Label>
                                <div className="space-y-4 text-xs">
                                  <FormRadioOption value={false}>
                                    Unlimited - every eligible account can collect your recording
                                  </FormRadioOption>
                                  <FormRadioOption value={true}>
                                    Limited edition - only a specific amount of eligible accounts can collect your
                                    recording
                                  </FormRadioOption>
                                </div>
                              </FormRadioGroup>
                              {data()?.collect_module_is_limited_amount === true && (
                                <div className="pie-3 pis-8 mt-1.5 animate-appear ">
                                  <label
                                    className="flex items-baseline flex-col space-y-1 xs:space-y-0 xs:flex-row xs:space-i-2"
                                    htmlFor="collect_module_amount"
                                  >
                                    <span className="text-2xs font-medium">Maximum amount of collects</span>
                                    <FormInput
                                      hasError={errors()?.collect_module_amount?.lengt > 0}
                                      placeholder="1000"
                                      scale="sm"
                                      name="collect_module_amount"
                                      min="1"
                                      step="1"
                                      type="number"
                                    />
                                  </label>
                                </div>
                              )}
                            </FormField.InputField>
                          </FormField>

                          <FormField>
                            <FormField.InputField>
                              <FormField.Label
                                hasError={errors()?.collect_module_is_time_limited?.length > 0}
                                htmlFor="collect_module_is_time_limited"
                              >
                                Until when can people collect your recording ?
                              </FormField.Label>
                              <FormField.Description id="input-collect_module_is_time_limited-description">
                                Make collecting your recording exclusive or timeless by specifying until when eligible
                                accounts can collect it.
                              </FormField.Description>
                              <InputCheckboxToggle
                                disabled={
                                  disabled ||
                                  data()?.recording_publish_on_lens !== true ||
                                  !showSectionLens ||
                                  !account?.address ||
                                  chain?.unsupported === true
                                }
                                label="Flash collect"
                                helpText="Enabling this option will make your recording avaible to be collected for the next 24 hours only."
                                checked={data()?.collect_module_is_time_limited === true ? true : false}
                                onChange={(value: any) => {
                                  setData('collect_module_is_time_limited', value)
                                }}
                              />
                            </FormField.InputField>
                          </FormField>

                          <FormField>
                            <FormField.InputField>
                              <FormField.Label
                                hasError={errors()?.collect_module_has_fee?.length > 0}
                                htmlFor="collect_module_has_fee"
                              >
                                Is collecting your recording free ?
                              </FormField.Label>
                              <FormField.Description id="input-collect_module_has_fee-description">
                                You can monetize your recording by setting a collect fee.
                              </FormField.Description>
                              <FormRadioGroup
                                name="collect_module_has_fee"
                                disabled={
                                  data()?.collect_module_is_limited_amount === true ||
                                  disabled ||
                                  data()?.recording_publish_on_lens !== true ||
                                  !showSectionLens ||
                                  !account?.address ||
                                  chain?.unsupported === true
                                }
                                value={data()?.collect_module_has_fee}
                                onChange={(value: boolean) => {
                                  if (value === false) {
                                    setData('collect_module_fee_amount', '')
                                    setData('collect_module_referral_fee_amount', 0)
                                    setData('collect_module_fee_currency_address', '')

                                    setFields('collect_module_fee_amount', '')
                                    setFields('collect_module_referral_fee_amount', 0)
                                    setFields('collect_module_fee_currency_address', '')
                                  }
                                  setFields('collect_module_has_fee', value)
                                }}
                              >
                                <RadioGroup.Label className="sr-only">
                                  Who can collect this recording ?
                                </RadioGroup.Label>
                                <div className="space-y-4 text-xs">
                                  <FormRadioOption value={false}>
                                    <span className="font-bold">Free</span> - eligible accounts don't need to pay
                                    anything to collect your recording
                                  </FormRadioOption>
                                  <FormRadioOption value={true}>
                                    <span className="font-bold">Charge a fee</span>
                                  </FormRadioOption>
                                </div>
                              </FormRadioGroup>

                              {data()?.collect_module_has_fee === true && (
                                <div className="animate-appear px-8 mt-2 ">
                                  <div className="mt-1.5 flex items-baseline flex-col space-y-1 xs:space-y-0 xs:flex-row xs:space-i-2">
                                    <span className="text-2xs font-medium">Amount</span>
                                    <div className="flex">
                                      <FormField>
                                        <FormField.InputField>
                                          <FormField.Label
                                            className="sr-only"
                                            hasError={errors()?.collect_module_fee_amount?.length ? true : false}
                                            htmlFor="collect_module_fee_amount"
                                          >
                                            Amount
                                          </FormField.Label>
                                          <FormField.Description
                                            className="sr-only"
                                            id="collect_module_fee_amount-description"
                                          >
                                            The amount you want to be paid in
                                          </FormField.Description>
                                          <FormInput
                                            className="!rounded-ie-none"
                                            scale="sm"
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            required={true}
                                            disabled={!account?.address || chain?.unsupported === true}
                                            hasError={errors()?.collect_module_fee_amount?.length ? true : false}
                                            name="collect_module_fee_amount"
                                            id="collect_module_fee_amount"
                                            aria-describedby="collect_module_fee_amount-description collect_module_fee_amount-helpblock"
                                          />
                                        </FormField.InputField>
                                        <FormField.HelpBlock
                                          className="sr-only"
                                          hasError={errors()?.collect_module_fee_amount?.length ? true : false}
                                          id={`collect_module_fee_amount-helpblock`}
                                        >
                                          The amount must be a positive number.
                                        </FormField.HelpBlock>
                                      </FormField>
                                      <FormField>
                                        <FormField.InputField>
                                          <FormField.Label
                                            className="sr-only"
                                            hasError={
                                              errors()?.collect_module_fee_currency_address?.length ? true : false
                                            }
                                            htmlFor="collect_module_fee_currency_address"
                                          >
                                            Currency
                                          </FormField.Label>
                                          <FormField.Description
                                            className="sr-only"
                                            id="collect_module_fee_currency_address-description"
                                          >
                                            The currency you want to be paid in
                                          </FormField.Description>
                                          <FormSelect
                                            classNameInput="!rounded-is-none"
                                            className="text-xs"
                                            name="collect_module_fee_currency_address"
                                            id="collect_module_fee_currency_address"
                                            required={true}
                                            scale="sm"
                                            hasError={
                                              errors()?.collect_module_fee_currency_address?.length ? true : false
                                            }
                                          >
                                            <option disabled={true}>Select a currency</option>
                                            {/* @ts-ignore */}
                                            {Object.keys(TOKENS_WHITELIST[process.env.NEXT_PUBLIC_CHAIN]).map(
                                              (tokenAddress) => (
                                                <option value={tokenAddress} key={tokenAddress}>
                                                  {/* @ts-ignore */}
                                                  {TOKENS_WHITELIST[process.env.NEXT_PUBLIC_CHAIN][tokenAddress]}
                                                </option>
                                              ),
                                            )}
                                          </FormSelect>
                                        </FormField.InputField>
                                        <FormField.HelpBlock
                                          className="sr-only"
                                          hasError={
                                            errors()?.collect_module_fee_currency_address?.length ? true : false
                                          }
                                          id={`collect_module_fee_currency_address-helpblock`}
                                        >
                                          Pick a currency
                                        </FormField.HelpBlock>
                                      </FormField>
                                    </div>
                                  </div>

                                  <div className="mt-3 space-y-3 animate-appear ">
                                    <label
                                      className="mt-1.5 flex items-baseline flex-col space-y-1 xs:space-y-0 xs:flex-row xs:space-i-2"
                                      htmlFor="collect_module_referral_fee_amount"
                                    >
                                      <span className="text-2xs font-medium">Referral fee amount in %</span>
                                      <div>
                                        <FormInput
                                          /* @ts-ignore */
                                          type="number"
                                          min="0"
                                          step="1"
                                          scale="sm"
                                          name="collect_module_referral_fee_amount"
                                          hasError={errors()?.collect_module_referral_fee_amount?.length > 0}
                                        />
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              )}
                            </FormField.InputField>
                          </FormField>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-neutral-1 p-6 rounded-md">
                    <h2 className="font-semibold text-sm mb-1.5">Configure mirror and comments settings</h2>
                    <p className="mb-4 text-neutral-11 text-xs">Fine-tune who can comment and mirror your post.</p>
                    <div className="space-y-6">
                      <FormField>
                        <FormField.InputField>
                          <FormField.Label hasError={errors()?.reference_module?.lengt > 0} htmlFor="reference_module">
                            Who can interact with your post ?
                          </FormField.Label>
                          <FormField.Description id="input-reference_module-description">
                            Setup who can interact with your post: close it to a certain degree of your social circle,
                            or open it to everyone.
                          </FormField.Description>
                          <FormRadioGroup
                            name="reference_module"
                            disabled={
                              disabled ||
                              data()?.recording_publish_on_lens !== true ||
                              !showSectionLens ||
                              !account?.address ||
                              chain?.unsupported === true
                            }
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
                                Your followers and their social circle, up to 1 degree of connection (the profiles they
                                follow)
                              </FormRadioOption>
                              <FormRadioOption value={3}>
                                Your followers and their social circle, up to 2 degrees of connection (the profiles they
                                follow and the profiles followed by their followers)
                              </FormRadioOption>
                              <FormRadioOption value={4}>
                                Your followers and their social circle, up to 3 degree of connection (the profiles they
                                follow, the profiles followed by their followers and the profiles followed by the
                                followers of their followers)
                              </FormRadioOption>
                            </div>
                          </FormRadioGroup>
                        </FormField.InputField>
                      </FormField>
                    </div>
                  </div>
                </>
              )}
            </div>
          </fieldset>
        </div>
        <Button
          isLoading={
            [state.transaction, state.contract, state?.publishToLens, state?.uploadAudioFile, state?.uploadData].filter(
              (slice) => slice?.isLoading,
            )?.length > 0
          }
          disabled={
            !isSignedIn ||
            disabled ||
            ![true, false].includes(data()?.recording_publish_on_lens) ||
            !account?.address ||
            chain?.unsupported === true ||
            !isValid() ||
            [state.transaction, state.contract, state?.publishToLens, state?.uploadAudioFile, state?.uploadData].filter(
              (slice) => slice?.isLoading,
            )?.length > 0 ||
            (data()?.recording_publish_on_lens === true &&
              (![0, 1, 2].includes(data()?.collect_module) ||
                ![-1, 0, 1, 2, 3, 4].includes(data()?.reference_module) ||
                ([0, 1].includes(data()?.collect_module) &&
                  (![true, false].includes(data()?.collect_module_is_limited_amount) ||
                    ![true, false].includes(data()?.collect_module_has_fee))) ||
                (data()?.collect_module_has_fee === true &&
                  (!data()?.collect_module_fee_amount ||
                    data()?.collect_module_fee_amount === '' ||
                    !data()?.collect_module_referral_fee_amount ||
                    data()?.collect_module_referral_fee_amount === '' ||
                    data()?.collect_module_fee_currency_address === '')) ||
                (data()?.collect_module_is_limited_amount === true &&
                  (data()?.collect_module_amount === '' ||
                    !data()?.collect_module_fee_amount ||
                    data()?.collect_module_fee_amount === ''))))
          }
        >
          {[state.transaction, state.contract, state?.publishToLens, state?.uploadAudioFile, state?.uploadData].filter(
            (slice) => slice?.isLoading,
          )?.length > 0
            ? labelButtonSubmitting
            : [
                state.transaction,
                state.contract,
                state?.publishToLens,
                state?.uploadAudioFile,
                state?.uploadData,
              ].filter((slice) => slice?.isError)?.length > 0
            ? 'Try again'
            : labelButtonSubmit}
        </Button>
      </form>
    </>
  )
}

export default FormPublishRecording
