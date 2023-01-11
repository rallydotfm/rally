import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormSelect from '@components/FormSelect'
import { useAccount, useNetwork } from 'wagmi'
import NFTContractSuggestions from '@components/NFTContractSuggestions'
import { isAddress } from 'ethers/lib/utils'
import { useGetNftInterface } from '@hooks/useGetNftInterface'
import InputTags from '@components/InputTags'
import * as tagsInput from '@zag-js/tags-input'
import { useMachine, normalizeProps } from '@zag-js/react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { IconSpinner } from '@components/Icons'
import { useState } from 'react'
import InputCheckboxToggle from '@components/InputCheckboxToggle'

export const Nft = (props: any) => {
  const { index, chains, ...formProps } = props
  const { data, setData, setFields, errors } = formProps
  const [pickedNft, setPickedNft] = useState(null)
  const account = useAccount()
  const { chain } = useNetwork()
  const [stateTags, sendTags] = useMachine(
    tagsInput.machine({
      id: `access_control_conditions.${index}.tokenIds`,
      addOnPaste: true,
      disabled: !account?.address || chain?.unsupported || chain?.id === 1 ? true : false,
      value: [],
      onChange: (tags: { values: Array<string> }) => {
        //@ts-ignore
        setData(`access_control_conditions.${index}.tokenIds`, tags.values)
      },
    }),
  )
  const apiInputTags = tagsInput.connect(stateTags, sendTags, normalizeProps)

  const queryNftInterface = useGetNftInterface({
    contract: data()?.access_control_conditions?.[index]?.contractAddress,
    chainId: data()?.access_control_conditions?.[index]?.chainID,
    options: {
      enabled:
        data()?.access_control_conditions?.[index]?.chainID &&
        isAddress(data()?.access_control_conditions?.[index]?.contractAddress) === true
          ? true
          : false,
      onSuccess(data: string) {
        if (data) {
          setFields(`access_control_conditions.${index}.contractType`, data)
        }
      },
    },
  })

  return (
    <div>
      <div className="flex flex-col gap-4">
        <FormField>
          <FormField.InputField>
            <FormField.Label
              className="text-2xs"
              hasError={errors()?.access_control_conditions?.[index]?.chainID?.length > 0 ? true : false}
              htmlFor={`access_control_conditions.${index}.chainID`}
            >
              Chain
            </FormField.Label>
            <FormField.Description className="sr-only" id={`access_control_conditions.${index}.chainID-description`}>
              The chain on which the NFT contract is deployed to
            </FormField.Description>
            <FormSelect
              onChange={(e) => {
                setFields(`access_control_conditions.${index}.chainID`, parseInt(e.currentTarget.value))
              }}
              name={`access_control_conditions.${index}.chainID`}
              scale="sm"
              required
              hasError={errors()?.access_control_conditions?.[index]?.chainID?.length > 0 ? true : false}
            >
              {chains?.map((chain: { id: number; name: string }) => (
                <option key={`chain-${chain?.id}`} value={chain?.id}>
                  {chain?.name}
                </option>
              ))}
            </FormSelect>
          </FormField.InputField>
          <FormField.HelpBlock
            className="sr-only"
            hasError={errors()?.access_control_conditions?.[index]?.chainID?.length > 0 ? true : false}
            id={`access_control_conditions.${index}.chainID-helpblock`}
          >
            The chain must be specified.
          </FormField.HelpBlock>
        </FormField>
        <FormField>
          <FormField.InputField>
            <FormField.Label
              className="text-2xs flex flex-wrap"
              hasError={errors()?.access_control_conditions?.[index]?.contractAddress?.length > 0 ? true : false}
              htmlFor={`access_control_conditions.${index}.contractAddress`}
            >
              Paste the contract address below
            </FormField.Label>
            <FormField.Description
              className="sr-only"
              id={`access_control_conditions.${index}.contractAddress-description`}
            >
              The contract address of this NFT
            </FormField.Description>

            <div className="relative z-20">
              {[1, 137].includes(data()?.access_control_conditions?.[index]?.chainID) && (
                <NFTContractSuggestions
                  chainId={data()?.access_control_conditions[index].chainID}
                  onSelectValue={(value: string) => {
                    //@ts-ignore
                    setPickedNft(value)
                    setFields(`access_control_conditions.${index}.contractAddress`, value)
                  }}
                />
              )}
              <FormInput
                className={`w-full ${
                  [1, 137].includes(data()?.access_control_conditions?.[index]?.chainID) ? '!pis-8' : ''
                }`}
                scale="sm"
                type="text"
                placeholder="0x..."
                pattern="^0x[a-fA-F0-9]{40}$"
                required={true}
                disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
                hasError={errors()?.access_control_conditions?.[index]?.contractAddress?.length > 0 ? true : false}
                name={`access_control_conditions.${index}.contractAddress`}
                id={`access_control_conditions.${index}.contractAddress`}
                aria-describedby={`access_control_conditions.${index}.contractAddress-description  access_control_conditions.${index}.contractAddress-validity-helpblock access_control_conditions.${index}.contractAddress-helpblock`}
              />
            </div>
          </FormField.InputField>
          <FormField.HelpBlock
            className="sr-only"
            hasError={errors()?.access_control_conditions?.[index]?.contractAddress?.length > 0 ? true : false}
            id={`access_control_conditions.${index}.contractAddress-helpblock`}
          >
            The contract address must be a valid Ethereum address
          </FormField.HelpBlock>
          <FormField.HelpBlock
            className="text-[0.8rem] !not-sr-only !pt-2"
            hasError={
              errors()?.access_control_conditions?.[index]?.contractAddress?.length > 0 || queryNftInterface?.isError
                ? true
                : false
            }
            id={`access_control_conditions.${index}.contractAddress-validity-helpblock`}
          >
            {queryNftInterface?.isLoading === true &&
              isAddress(data()?.access_control_conditions?.[index]?.contractAddress) && (
                <span className="flex items-center space-i-1ex">
                  <IconSpinner className="text-xs animate-spin" />
                  <span className="font-bold block animate-pulse">Checking contract validity...</span>
                </span>
              )}
            {queryNftInterface?.isError === true &&
              data()?.access_control_conditions?.[index]?.contractAddress?.trim() !== '' && (
                <span className="flex items-center animate-appear text-negative-11">
                  <XMarkIcon className="shrink-0 text-negative-11 mie-1ex w-5" /> Invalid NFT contract address. Make
                  sure this contract exists on this chain !
                </span>
              )}
            {queryNftInterface?.isSuccess === true && (
              <span className="flex items-center animate-appear text-neutral-11">
                <CheckIcon className="shrink-0 text-positive-11 mie-1ex w-5" /> Valid NFT contract address
              </span>
            )}
          </FormField.HelpBlock>
        </FormField>
        <FormField>
          <InputCheckboxToggle
            disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
            scale="sm"
            classNameLabel="text-2xs"
            label="Whitelisted IDs only"
            helpText="Keep this option disabled if you want every holder to have access to your publication."
            checked={
              data()?.access_control_conditions?.[index]?.shouldLimitAccessToNftHoldersWithSpecificIds === true
                ? true
                : false
            }
            onChange={(value: any) => {
              setFields(`access_control_conditions.${index}.shouldLimitAccessToNftHoldersWithSpecificIds`, value)
              if (value === false) {
                apiInputTags.clearAll()
                setFields(`access_control_conditions.${index}.tokenIds`, [])
              }
            }}
          />
        </FormField>

        {data()?.access_control_conditions?.[index]?.shouldLimitAccessToNftHoldersWithSpecificIds === true && (
          <FormField className="animate-appear">
            <FormField.InputField>
              <FormField.Label
                className="text-2xs !pb-1"
                hasError={errors()?.access_control_conditions?.[index]?.tokenIds?.length > 0 ? true : false}
                htmlFor={`access_control_conditions.${index}.tokenIds-helpblock`}
              >
                Add the ID of every NFTs that will grant access to your publication.
              </FormField.Label>
              <InputTags
                className="w-full"
                scale="sm"
                placeholder='Type a token ID and press "Enter"'
                api={apiInputTags}
                disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
              />
            </FormField.InputField>
          </FormField>
        )}
      </div>
      {pickedNft !== null && (
        <div className="animate-appear text-2xs mt-6">
          Picked NFT:{' '}
          <span className="font-bold">
            {/* @ts-ignore */}
            {data()?.access_control_conditions?.[index]?.contractType} -{' '}
            {
              chains.filter(
                (chain: any) => chain.id === parseInt(data()?.access_control_conditions?.[index]?.chainID),
              )?.[0]?.name
            }
          </span>
          <p className="overflow-hidden text-ellipsis font-mono text-neutral-11">
            {data()?.access_control_conditions?.[index]?.contractAddress}
          </p>
          {data()?.access_control_conditions?.[index]?.shouldLimitAccessToNftHoldersWithSpecificIds && (
            <div className="animate-appear mt-2">
              <span>Whitelisted IDs:</span>
              <ul className="flex flex-wrap gap-2">
                {apiInputTags.value.map((v) => {
                  return (
                    <li className="animate-appear font-mono" key={`nft-id-${v.replaceAll(' ', '_')}`}>
                      {v}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {/* @ts-ignore */}
        </div>
      )}
    </div>
  )
}

export default Nft
