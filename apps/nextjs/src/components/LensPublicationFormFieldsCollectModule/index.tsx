import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormRadioGroup from '@components/FormRadioGroup'
import { RadioGroup } from '@headlessui/react'
import FormRadioOption from '@components/FormRadioOption'
import { useAccount, useNetwork } from 'wagmi'
import InputCheckboxToggle from '@components/InputCheckboxToggle'
import FormSelect from '@components/FormSelect'
import { TOKENS_WHITELIST } from '@config/lens'

interface LensPublicationFormFieldsCollectModuleProps {
  disabled: boolean
  data: any
  setData: any
  errors: any
  setFields: any
}
export const LensPublicationFormFieldsCollectModule = (props: LensPublicationFormFieldsCollectModuleProps) => {
  const { disabled, data, setData, errors, setFields } = props
  const account = useAccount()
  const { chain } = useNetwork()

  return (
    <>
      <FormField>
        <FormField.InputField>
          <FormField.Label
            className="text-xs"
            hasError={errors()?.collect_module?.length ? true : false}
            htmlFor="collect_module"
          >
            Who can collect your publication ?
          </FormField.Label>
          <FormField.Description id="collect_module-description">
            Restrict or open who can collect your publication.
          </FormField.Description>
          <FormRadioGroup
            name="collect_module"
            disabled={
              disabled ||
              data()?.publish_on_lens !== true ||
              !account?.address ||
              //@ts-ignore
              chain?.unsupported === true ||
              //@ts-ignore
              chain?.id === 1
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
        <FormField>
          <FormField.InputField>
            <FormField.Label
              className="text-xs"
              hasError={errors()?.collect_module_has_fee?.length > 0}
              htmlFor="collect_module_has_fee"
            >
              Is collecting your publication free ?
            </FormField.Label>
            <FormField.Description id="input-collect_module_has_fee-description">
              You can monetize your publication by setting a collect fee.
            </FormField.Description>
            <FormRadioGroup
              name="collect_module_has_fee"
              disabled={
                data()?.collect_module_is_limited_amount === true ||
                disabled ||
                data()?.publish_on_lens !== true ||
                !account?.address ||
                //@ts-ignore
                chain?.unsupported === true ||
                //@ts-ignore
                chain?.id === 1
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
              <RadioGroup.Label className="sr-only">Who can collect this recording ?</RadioGroup.Label>
              <div className="space-y-4 text-xs">
                <FormRadioOption value={false}>
                  <span className="font-bold">Free</span> - eligible accounts don't need to pay anything to collect your
                  recording
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
                          placeholder="1"
                          className="sr-only"
                          hasError={errors()?.collect_module_fee_amount?.length ? true : false}
                          htmlFor="collect_module_fee_amount"
                        >
                          Amount
                        </FormField.Label>
                        <FormField.Description className="sr-only" id="collect_module_fee_amount-description">
                          The amount you want to be paid in
                        </FormField.Description>
                        <FormInput
                          className="!rounded-ie-none"
                          scale="sm"
                          type="number"
                          min="0.01"
                          placeholder="0"
                          step="0.01"
                          required={true}
                          //@ts-ignore
                          disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
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
                          hasError={errors()?.collect_module_fee_currency_address?.length ? true : false}
                          htmlFor="collect_module_fee_currency_address"
                        >
                          Currency
                        </FormField.Label>
                        <FormField.Description className="sr-only" id="collect_module_fee_currency_address-description">
                          The currency you want to be paid in
                        </FormField.Description>
                        <FormSelect
                          classNameInput="!rounded-is-none"
                          className="text-xs"
                          name="collect_module_fee_currency_address"
                          id="collect_module_fee_currency_address"
                          required={true}
                          scale="sm"
                          hasError={errors()?.collect_module_fee_currency_address?.length ? true : false}
                        >
                          <option disabled={true}>Select a currency</option>
                          {/* @ts-ignore */}
                          {Object.keys(TOKENS_WHITELIST[process.env.NEXT_PUBLIC_CHAIN]).map((tokenAddress) => (
                            <option value={tokenAddress} key={`whitelisted-list${tokenAddress}`}>
                              {/* @ts-ignore */}
                              {TOKENS_WHITELIST[process.env.NEXT_PUBLIC_CHAIN][tokenAddress]}
                            </option>
                          ))}
                        </FormSelect>
                      </FormField.InputField>
                      <FormField.HelpBlock
                        className="sr-only"
                        hasError={errors()?.collect_module_fee_currency_address?.length ? true : false}
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
                        step="0.01"
                        scale="sm"
                        max="100"
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
      )}

      {[0, 1].includes(data()?.collect_module) && data()?.collect_module_has_fee === true && (
        <>
          <FormField>
            <FormField.InputField>
              <FormField.Label
                className="text-xs"
                hasError={errors()?.collect_module_is_limited_amount?.length > 0}
                htmlFor="collect_module_is_limited_amount"
              >
                Is your publication a limited edition ?
              </FormField.Label>
              <FormField.Description id="input-collect_module_is_limited_amount-description">
                Make collecting your publication more exclusive or more accessible by allowing a finite or infinite
                amount of eligible accounts to collect it. <br />
                <span className="font-bold">Limited editions must all specify a positive collect fee amount.</span>
              </FormField.Description>
              <FormRadioGroup
                name="collect_module_is_limited_amount"
                disabled={
                  disabled ||
                  data()?.publish_on_lens !== true ||
                  !account?.address ||
                  //@ts-ignore
                  chain?.unsupported === true ||
                  //@ts-ignore
                  chain?.id === 1
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
                <RadioGroup.Label className="sr-only">Who can collect this recording ?</RadioGroup.Label>
                <div className="space-y-4 text-xs">
                  <FormRadioOption value={false}>
                    Unlimited - every eligible account can collect your publication
                  </FormRadioOption>
                  <FormRadioOption value={true}>
                    Limited edition - only a specific amount of eligible accounts can collect your publication
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
                className="text-xs"
                hasError={errors()?.collect_module_is_time_limited?.length > 0}
                htmlFor="collect_module_is_time_limited"
              >
                Until when can people collect your publication ?
              </FormField.Label>
              <FormField.Description id="input-collect_module_is_time_limited-description">
                Make collecting your publication exclusive or timeless by specifying until when eligible accounts can
                collect it.
              </FormField.Description>
              <InputCheckboxToggle
                disabled={
                  disabled ||
                  data()?.publish_on_lens !== true ||
                  !account?.address ||
                  //@ts-ignore
                  chain?.unsupported === true ||
                  //@ts-ignore
                  chain?.id === 1
                }
                label="Flash collect"
                helpText="Enabling this option will make your publication avaible to be collected for the next 24 hours only."
                checked={data()?.collect_module_is_time_limited === true ? true : false}
                onChange={(value: any) => {
                  setData('collect_module_is_time_limited', value)
                }}
              />
            </FormField.InputField>
          </FormField>
        </>
      )}
    </>
  )
}

export default LensPublicationFormFieldsCollectModule
