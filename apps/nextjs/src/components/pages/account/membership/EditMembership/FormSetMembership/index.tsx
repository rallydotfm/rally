import Button from '@components/Button'
import { useAccount, useNetwork } from 'wagmi'
import { RadioGroup } from '@headlessui/react'
import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormRadioGroup from '@components/FormRadioGroup'
import FormRadioOption from '@components/FormRadioOption'
import { FOLLOW_MODULE_TYPES } from '@hooks/useSetFollowModule'
import FormSelect from '@components/FormSelect'
import { TOKENS_WHITELIST } from '@config/lens'

interface FormSetMembershipProps {
  storeForm: any
  isError: boolean
  isLoading: boolean
  labelCta: string
}
export const FormSetMembership = (props: FormSetMembershipProps) => {
  const {
    labelCta,
    isLoading,
    storeForm: {
      formSetMembership: { form, errors, isValid, data, setData },
    },
  } = props
  const account = useAccount()
  const { chain } = useNetwork()

  return (
    <form ref={form}>
      <fieldset className="space-y-5 mb-12">
        <div className="space-y-5">
          <FormRadioGroup
            className="!mt-0"
            name="type"
            disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
            value={data()?.type}
            onChange={(value: string) => {
              setData('type', value)
              if (value !== FOLLOW_MODULE_TYPES.FEE) {
                setData('recipient_address', undefined)
                setData('fee_amount', undefined)
                setData('currency_address', undefined)
              }
            }}
          >
            <RadioGroup.Label className="sr-only">Who can follow your profile ?</RadioGroup.Label>
            <div className="space-y-4 text-xs">
              <FormRadioOption value={FOLLOW_MODULE_TYPES.FREE}>Anyone can follow my profile for free</FormRadioOption>
              <FormRadioOption value={FOLLOW_MODULE_TYPES.PROFILE}>
                Anyone with a Lens profile can follow my profile for free
              </FormRadioOption>
              <FormRadioOption value={FOLLOW_MODULE_TYPES.REVERT}>No one can follow my profile</FormRadioOption>

              <FormRadioOption value={FOLLOW_MODULE_TYPES.FEE}>
                Anyone can follow my profile for a one-time fee
              </FormRadioOption>
            </div>
          </FormRadioGroup>
          {data().type === FOLLOW_MODULE_TYPES.FEE && (
            <>
              <div className="xs:px-6 grid grid-cols-1 gap-2 animate-appear">
                <FormField>
                  <FormField.InputField>
                    <FormField.Label
                      className="text-xs"
                      hasError={errors()?.currency_address?.length ? true : false}
                      htmlFor="currency_address"
                    >
                      Currency
                    </FormField.Label>
                    <FormField.Description className="sr-only" id="currency_address-description">
                      The currency you want to be paid in
                    </FormField.Description>
                    <FormSelect
                      name="currency_address"
                      id="currency_address"
                      required={true}
                      scale="sm"
                      hasError={errors()?.currency_address?.length ? true : false}
                    >
                      <option disabled={true}>Select a currency</option>
                      {/* @ts-ignore */}
                      {Object.keys(TOKENS_WHITELIST[process.env.NEXT_PUBLIC_CHAIN]).map((tokenAddress) => (
                        <option value={tokenAddress} key={tokenAddress}>
                          {/* @ts-ignore */}
                          {TOKENS_WHITELIST[process.env.NEXT_PUBLIC_CHAIN][tokenAddress]}
                        </option>
                      ))}
                    </FormSelect>
                  </FormField.InputField>
                  <FormField.HelpBlock
                    hasError={errors()?.currency_address?.length ? true : false}
                    id={`currency_address-helpblock`}
                  >
                    Pick a currency
                  </FormField.HelpBlock>
                </FormField>

                <FormField>
                  <FormField.InputField>
                    <FormField.Label
                      className="text-xs"
                      hasError={errors()?.fee_amount?.length ? true : false}
                      htmlFor="fee_amount"
                    >
                      Amount
                    </FormField.Label>
                    <FormField.Description className="sr-only" id="fee_amount-description">
                      The amount you want to be paid in
                    </FormField.Description>
                    <FormInput
                      scale="sm"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required={true}
                      disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
                      hasError={errors()?.fee_amount?.length ? true : false}
                      name="fee_amount"
                      id="fee_amount"
                      aria-describedby="fee_amount-description fee_amount-helpblock"
                    />
                  </FormField.InputField>
                  <FormField.HelpBlock
                    hasError={errors()?.fee_amount?.length ? true : false}
                    id={`fee_amount-helpblock`}
                  >
                    The amount must be a positive number.
                  </FormField.HelpBlock>
                </FormField>

                <FormField>
                  <FormField.InputField>
                    <FormField.Label
                      className="text-xs"
                      hasError={errors()?.recipient_address?.length ? true : false}
                      htmlFor="recipient_address"
                    >
                      Recipient Ethereum address
                    </FormField.Label>
                    <FormField.Description className="sr-only" id="recipient_address-description">
                      The Ethereum address that will receive the funds
                    </FormField.Description>
                    <FormInput
                      scale="sm"
                      type="text"
                      required={true}
                      defaultValue={account?.address}
                      disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
                      hasError={errors()?.recipient_address?.length ? true : false}
                      name="recipient_address"
                      id="recipient_address"
                      aria-describedby="recipient_address-description recipient_address-helpblock"
                    />
                  </FormField.InputField>
                  <FormField.HelpBlock
                    hasError={errors()?.recipient_address?.length ? true : false}
                    id={`recipient_address-helpblock`}
                  >
                    The recipient address must be a valid Ethereum address.
                  </FormField.HelpBlock>
                </FormField>
              </div>
            </>
          )}
        </div>
      </fieldset>
      <Button isLoading={isLoading} disabled={!isValid() || chain?.unsupported || chain?.id === 1 || isLoading}>
        {labelCta}
      </Button>
    </form>
  )
}

export default FormSetMembership
