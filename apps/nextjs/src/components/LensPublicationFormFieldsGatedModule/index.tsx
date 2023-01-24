import FormField from '@components/FormField'
import FormRadioGroup from '@components/FormRadioGroup'
import { Listbox, RadioGroup } from '@headlessui/react'
import FormRadioOption from '@components/FormRadioOption'
import { useAccount, useNetwork } from 'wagmi'
import { PhotoIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import Button from '@components/Button'
import { Criteria } from './Criteria'
import { CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { IconLensProtocol, IconUnlockProtocol } from '@components/Icons'
import { chainId } from '@config/wagmi'

interface LensPublicationFormFieldsGatedModuleProps {
  disabled: boolean
  data: any
  setData: any
  errors: any
  setFields: any
  addField: any
  resetField: any
  isCrossPost: boolean
}
export const LensPublicationFormFieldsGatedModule = (props: LensPublicationFormFieldsGatedModuleProps) => {
  const { disabled, data, setData, errors, addField, resetField, setFields, isCrossPost } = props
  const account = useAccount()
  const { chain } = useNetwork()

  return (
    <>
      <FormField>
        <FormField.InputField>
          <FormField.Label
            className="text-xs"
            hasError={errors()?.gated_module?.length > 0 ? true : false}
            htmlFor="gated_module"
          >
            Who can access your publication ?
          </FormField.Label>
          <FormField.Description id="gated_module-description">
            Restrict or open who can access your publication.
          </FormField.Description>
          <FormRadioGroup
            name="gated_module"
            disabled={disabled || !account?.address || chain?.unsupported === true || chain?.id === 1}
            value={data()?.gated_module}
            onChange={(value: boolean) => {
              setData('gated_module', value)
              if (value === false) {
                resetField('access_control_conditions')
              } else {
                if (isCrossPost === true) setData('publish_on_lens', false)
              }
            }}
          >
            <RadioGroup.Label className="sr-only">Who can access this recording ?</RadioGroup.Label>
            <div className="space-y-4 text-xs">
              <FormRadioOption value={false}>Anyone</FormRadioOption>
              <FormRadioOption value={true}>Only wallets meeting specific criteria</FormRadioOption>
            </div>
          </FormRadioGroup>
        </FormField.InputField>
      </FormField>

      {data()?.gated_module === true && (
        <div className=" animate-appear">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-12 animate-appear relative focus-within:z-10">
            <div className="flex flex-col gap-4">
              {data()?.access_control_conditions?.map((condition: any, index: any) => {
                return (
                  <div
                    key={`${condition?.key}`}
                    className="relative focus-within:z-10 flex flex-col animate-appear gap-3"
                  >
                    <div className="focus-within:z-10 flex flex-col border-interactive-6 group focus-within:border-interactive-8 bg-neutral-3 border-2 rounded-md ">
                      <span className="rounded-ee-md rounded-ss-sm pis-1.5 pie-2 py-0.5 bg-interactive-5 group-focus-within:bg-interactive-8 font-bold uppercase text-[0.75em] text-interactive-12 block w-fit-content ">
                        {condition?.type === 'lens-profile'
                          ? 'Own Lens profile with id #'
                          : condition?.type === 'eoa'
                          ? 'Wallet address'
                          : condition?.type === 'nft' &&
                            [
                              '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d',
                              '0xe00dc8cb3a7c3f8e5ab5286afabb0c2d1054187b',
                            ].includes(condition?.contractAddress)
                          ? 'Own a Lens profile'
                          : condition?.type}
                      </span>
                      <div className="py-6 px-3">
                        {/* @ts-ignore */}
                        <Criteria
                          data={data}
                          setData={setData}
                          errors={errors}
                          setFields={setFields}
                          resetField={resetField}
                          index={index}
                          type={condition?.type}
                        />
                      </div>
                      <div className="mt-auto">
                        <Button
                          intent="negative-ghost"
                          className="!rounded-t !pb-2 !rounded-b-none w-full"
                          scale="xs"
                          type="button"
                          disabled={!account?.address || disabled || chain?.unsupported === true || chain?.id === 1}
                          onClick={() => {
                            const updated = data()?.access_control_conditions.filter(
                              (c: any) => c.key !== condition.key,
                            )
                            setData('access_control_conditions', updated)
                          }}
                        >
                          Remove criteria
                        </Button>
                      </div>
                    </div>
                    {index + 1 < data()?.access_control_conditions?.length && (
                      <div className="animate-appear shrink-0 m-auto">
                        <select
                          className="bg-interactive-9 border-interactive-4 border rounded-md p-1.5 font-bold uppercase text-[0.75rem] text-interactive-12"
                          name="gated_module_condition_operator"
                          value={data()?.gated_module_condition_operator}
                          onChange={(e) => {
                            setFields('gated_module_condition_operator', e.target.value)
                          }}
                          required
                        >
                          <option value="and">And</option>
                          <option value="or">Or</option>
                        </select>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="sticky top-32 h-fit-content text-white text-opacity-75 w-full flex flex-col items-center justify-center p-3 border-dashed border rounded-md bg-neutral-1 bg-opacity-50 hover:bg-opacity-75 focus:bg-opacity-90 hover:focus:bg-opacity-95 border-neutral-4">
              <PlusIcon className="w-8 mb-3" />
              <span className="text-center block text-xs font-bold">Add another criteria</span>
              <span className="text-center block text-2xs text-neutral-11">
                You can add up to <span>5</span> criteria.
              </span>
              <span className="text-center block text-2xs text-neutral-11">
                You can configure if the users have to meet all criteria OR one of the criteria.
              </span>
              <ul className="pt-6 w-full text-sm flex flex-col gap-3">
                <li className="relative" value="profile">
                  <Listbox
                    disabled={disabled || data()?.access_control_conditions?.length >= 5}
                    name="access_control_conditions_select_lens"
                    onChange={(value) => {
                      switch (value) {
                        case 'lens-profile-any':
                          {
                            addField('access_control_conditions', {
                              type: 'nft',
                              chainID: chainId,
                              contractAddress:
                                chainId === 137
                                  ? '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d'
                                  : '0xe00dc8cb3a7c3f8e5ab5286afabb0c2d1054187b',
                              contractType: 'ERC721',
                              tokenIds: [],
                            })
                            return
                          }
                          break
                        case 'lens-profile-with-id':
                          {
                            addField('access_control_conditions', {
                              type: 'lens-profile',
                              profileId: '',
                            })
                            return
                          }
                          break
                        case 'follow':
                          {
                            addField('access_control_conditions', {
                              type: 'follow',
                              profileId: '',
                            })
                            return
                          }
                          break
                        case 'collect':
                          {
                            addField('access_control_conditions', {
                              type: 'collect',
                              publicationId: '',
                            })
                            return
                          }
                          break

                        default:
                          break
                      }
                    }}
                  >
                    <Listbox.Button
                      disabled={disabled || data()?.access_control_conditions?.length >= 5}
                      className="disabled:opacity-50 ui-open:rounded-b-none ui-open:bg-neutral-3 focus:ui-open:bg-neutral-4 flex relative items-center gap-x-5 cursor-pointer w-full text-neutral-12 p-3 font-bold bg-neutral-5 border hover:bg-neutral-6 focus:bg-neutral-2 border-neutral-4 rounded-md ui-active:bg-neutral-8"
                    >
                      <div className="w-7 rounded-full aspect-square flex items-center justify-center bg-[#abfe2c]">
                        <IconLensProtocol className="text-xs" />
                      </div>
                      Lens
                    </Listbox.Button>
                    <Listbox.Options className="divide-y z-20 text-2xs absolute flex flex-col w-full  border-neutral-6 border divide-neutral-5 rounded-b-md overflow-hidden bg-neutral-3 focus:outline-none">
                      <Listbox.Option
                        className="cursor-pointer flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold"
                        value="lens-profile-any"
                      >
                        Own a profile
                      </Listbox.Option>
                      <Listbox.Option
                        className="cursor-pointer flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold"
                        value="follow"
                      >
                        Follow a profile
                      </Listbox.Option>
                      <Listbox.Option
                        className="cursor-pointer flex items-center space-i-2 px-4 text-start py-2.5 ui-active:bg-neutral-12 ui-active:text-neutral-1 font-bold"
                        value="collect"
                      >
                        Collect a publication
                      </Listbox.Option>
                    </Listbox.Options>
                  </Listbox>
                </li>
                <li>
                  <button
                    disabled={disabled || data()?.access_control_conditions?.length >= 5}
                    className="disabled:opacity-50 flex items-center gap-x-5 cursor-pointer w-full text-neutral-12 p-3 font-bold bg-neutral-5 border hover:bg-neutral-6 focus:bg-neutral-2 border-neutral-4 rounded-md ui-active:bg-neutral-8"
                    onClick={() => {
                      addField('access_control_conditions', {
                        type: 'unlock',
                        chainID: 1,
                        contractAddress: '',
                        contractType: 'ERC721',
                        tokenIds: [],
                      })
                    }}
                    type="button"
                  >
                    <IconUnlockProtocol className="text-[1.75rem]" />
                    Unlock
                  </button>
                </li>
                <li>
                  <button
                    disabled={disabled || data()?.access_control_conditions?.length >= 5}
                    className="disabled:opacity-50 flex items-center gap-x-5 cursor-pointer w-full text-neutral-12 p-3 font-bold bg-neutral-5 border hover:bg-neutral-6 focus:bg-neutral-2 border-neutral-4 rounded-md ui-active:bg-neutral-8"
                    type="button"
                    onClick={() => {
                      addField('access_control_conditions', {
                        type: 'eoa',
                        chainID: 1,
                        address: '',
                      })
                    }}
                  >
                    <UserCircleIcon className="w-5" />
                    Wallet address
                  </button>
                </li>

                <li>
                  <button
                    disabled={disabled || data()?.access_control_conditions?.length >= 5}
                    type="button"
                    onClick={() => {
                      addField('access_control_conditions', {
                        type: 'nft',
                        chainID: 1,
                        contractAddress: '',
                        contractType: 'ERC721',
                        tokenIds: [],
                      })
                    }}
                    className="disabled:opacity-50 flex items-center gap-x-7 cursor-pointer w-full text-neutral-12 p-3 font-bold bg-neutral-5 border hover:bg-neutral-6 focus:bg-neutral-2 border-neutral-4 rounded-md ui-active:bg-neutral-8"
                  >
                    <PhotoIcon className="w-5" />
                    NFT
                  </button>
                </li>

                <li>
                  <button
                    disabled={disabled || data()?.access_control_conditions?.length >= 5}
                    type="button"
                    onClick={() => {
                      addField('access_control_conditions', {
                        type: 'token',
                        chainID: 1,
                        contractAddress: '',
                        amount: 0, // the amount of the ERC20 token that grants access to the metadata
                        decimals: 18, // the decimals of the ERC20 token that grants access to the metadata
                        condition: 'GREATER_THAN_OR_EQUAL', // the condition that must be met to grant access to the metadata, supported conditions are: '==', '!=', '>', '<', '>=', '<='
                      })
                    }}
                    className="disabled:opacity-50 flex items-center gap-x-7 cursor-pointer w-full text-neutral-12 p-3 font-bold bg-neutral-5 border hover:bg-neutral-6 focus:bg-neutral-2 border-neutral-4 rounded-md ui-active:bg-neutral-8"
                  >
                    <CurrencyDollarIcon className="w-5" />
                    ERC-20 token
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LensPublicationFormFieldsGatedModule
