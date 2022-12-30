import Button from '@components/Button'
import button from '@components/Button/styles'
import FormField from '@components/FormField'
import FormTextarea from '@components/FormTextarea'
import LensPublicationFormFieldsCollectModule from '@components/LensPublicationFormFieldsCollectModule'
import LensPublicationFormFieldsReferenceModule from '@components/LensPublicationFormFieldsReferenceModule'
import { Disclosure } from '@headlessui/react'
import { ChatBubbleLeftRightIcon, TagIcon } from '@heroicons/react/24/outline'
import { useStoreHasSignedInWithLens } from '@hooks/useSignInWithLens'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount, useNetwork } from 'wagmi'

export const FormComment = (props: any) => {
  const { chain } = useNetwork()
  const account = useAccount()
  const isSignedIn = useStoreHasSignedInWithLens((state) => state.isSignedIn)
  const queryUserProfileLens = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const {
    labelCta,
    isLoading,
    disabled,
    storeForm: {
      formCommentRecording: { form, data, errors, setData, setFields, isValid },
    },
  } = props

  return (
    <>
      <form ref={form} className="gap-2 flex flex-col w-full">
        <fieldset>
          <FormField className="w-full">
            <FormField.InputField>
              <FormTextarea
                hasError={errors()?.publication_comment_content?.length > 0}
                name="publication_comment_content"
                id="publication_comment_content"
                required
                className="!bg-transparent !px-4 border-x-0 !border-t-0 py-3 !border-y-neutral-4 w-full min-h-[30ch] h-[fit-content] !rounded-none"
                disabled={
                  !queryUserProfileLens?.data?.id || isLoading || chain?.unsupported || chain?.id === 1 || !isSignedIn
                }
                placeholder="What's up ?"
              />
            </FormField.InputField>
          </FormField>
        </fieldset>
        <div className="flex relative px-1 flex-col gap-3">
          <Disclosure>
            <Disclosure.Button
              className={button({
                intent: 'interactive-ghost',
                scale: 'xs',
                class: 'text-[0.775rem] text-opacity-90 w-10 h-10 !p-0',
              })}
            >
              <TagIcon className="w-5 stroke-2" /> <span className="sr-only">Collecy settings</span>
            </Disclosure.Button>
            <Disclosure.Panel className="border-t border-neutral-4 space-y-3 py-4 -mx-3 px-6">
              <div className="space-y-6">
                <LensPublicationFormFieldsCollectModule
                  data={data}
                  setFields={setFields}
                  setData={setData}
                  errors={errors}
                  disabled={false}
                />
              </div>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure>
            <Disclosure.Button
              className={button({
                intent: 'interactive-ghost',
                scale: 'xs',
                class:
                  'text-[0.775rem] text-opacity-90 absolute inline-start-0 translate-x-[calc(100%+0.25rem)] w-10 h-10 !p-0',
              })}
            >
              <ChatBubbleLeftRightIcon className="w-5 stroke-2" />
              <span className="sr-only">Reference settings</span>
            </Disclosure.Button>
            <Disclosure.Panel className="border-t border-neutral-4 py-4 -mx-3 px-6">
              <LensPublicationFormFieldsReferenceModule
                data={data}
                setFields={setFields}
                setData={setData}
                errors={errors}
                disabled={false}
              />
            </Disclosure.Panel>
          </Disclosure>
        </div>
        <div className="-mx-3 px-3 flex mt-1 pt-3 border-t border-neutral-4">
          <Button
            scale="sm"
            className="mx-auto xs:mie-0"
            intent="primary-ghost"
            isLoading={isLoading}
            disabled={
              !isSignedIn ||
              disabled ||
              !account?.address ||
              chain?.id === 1 ||
              chain?.unsupported === true ||
              !isValid() ||
              isLoading ||
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
            {labelCta}
          </Button>
        </div>
      </form>
    </>
  )
}

export default FormComment
