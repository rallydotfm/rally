import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormSelect from '@components/FormSelect'
import { useAccount, useNetwork } from 'wagmi'
import { isAddress } from 'ethers/lib/utils'
import { useGetErc20Token } from '@hooks/useGetErc20Token'
import { IconSpinner } from '@components/Icons'
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid'
import Erc20ContractSuggestions from '@components/Erc20ContractSuggestions'
import { ScalarOperator } from '@lens-protocol/sdk-gated'

export const Token = (props: any) => {
  const { index, chains, ...formProps } = props
  const { data, setData, resetField, setFields, errors } = formProps
  const account = useAccount()
  const { chain } = useNetwork()

  const queryToken = useGetErc20Token({
    contract: data()?.access_control_conditions?.[index]?.contractAddress,
    chainId: data()?.access_control_conditions?.[index]?.chainID,
    options: {
      enabled:
        data()?.access_control_conditions?.[index]?.chainID &&
        isAddress(data()?.access_control_conditions?.[index]?.contractAddress) === true
          ? true
          : false,

      onSuccess(data: { name: string; decimals: number; symbol: string }) {
        if (data) {
          setData(`access_control_conditions.${index}.decimals`, data?.decimals)
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
                resetField(`access_control_conditions.${index}.contractAddress`)
              }}
              name={`access_control_conditions.${index}.chainID`}
              scale="sm"
              required
              hasError={errors()?.access_control_conditions?.[index]?.chainID?.length > 0 ? true : false}
            >
              {chains?.map((chain: { id: number; name: string }) => (
                <option key={`token-picker-chain${chain?.id}`} value={chain?.id}>
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
              The contract address of this ERC-20 token
            </FormField.Description>

            <div className="relative z-20">
              {[1, 137, 10, 42161, 42220].includes(data()?.access_control_conditions?.[index]?.chainID) && (
                <Erc20ContractSuggestions
                  chainId={data()?.access_control_conditions[index].chainID}
                  onSelectValue={(value: string) => {
                    setFields(`access_control_conditions.${index}.contractAddress`, value)
                  }}
                />
              )}
              <FormInput
                className={`w-full ${
                  [1, 137, 10, 42161, 42220].includes(data()?.access_control_conditions?.[index]?.chainID)
                    ? '!pis-8'
                    : ''
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
                aria-describedby={`access_control_conditions.${index}.contractAddress-description access_control_conditions.${index}.contractAddress-helpblock`}
              />
            </div>
          </FormField.InputField>
          <FormField.HelpBlock
            className="sr-only"
            hasError={errors()?.access_control_conditions?.[index]?.contractAddress?.length > 0 ? true : false}
            id={`access_control_conditions.${index}.contractAddress-helpblock`}
          >
            The contract address must be a valid Ethereum address and exist on this chain.
          </FormField.HelpBlock>
          <FormField.HelpBlock
            className="text-[0.8rem] !not-sr-only !pt-2"
            hasError={
              errors()?.access_control_conditions?.[index]?.contractAddress?.length > 0 || queryToken?.isError
                ? true
                : false
            }
            id={`access_control_conditions.${index}.contractAddress-validity-helpblock`}
          >
            {queryToken?.isLoading === true && isAddress(data()?.access_control_conditions?.[index]?.contractAddress) && (
              <span className="flex items-center space-i-1ex">
                <IconSpinner className="text-xs animate-spin" />
                <span className="block font-bold animate-pulse">Checking contract validity...</span>
              </span>
            )}
            {queryToken?.isError === true &&
              data()?.access_control_conditions?.[index]?.contractAddress?.trim() !== '' && (
                <span className="flex items-center animate-appear text-negative-11">
                  <XMarkIcon className="shrink-0 text-negative-11 mie-1ex w-5" /> Invalid ERC-20 token contract address.
                  Make sure this contract exists on this chain !
                </span>
              )}
            {queryToken?.isSuccess === true && (
              <span className="flex items-center animate-appear text-neutral-11">
                <CheckIcon className="shrink-0 text-positive-11 mie-1ex w-5" /> {queryToken?.data?.name} ($
                {queryToken?.data?.symbol})
              </span>
            )}
          </FormField.HelpBlock>
        </FormField>
        <FormField>
          <FormField.InputField>
            <FormField.Label
              className="text-2xs flex flex-wrap"
              hasError={errors()?.access_control_conditions?.[index]?.amount?.length > 0 ? true : false}
              htmlFor={`access_control_conditions.${index}.amount`}
            >
              Token amount held by the user must be
            </FormField.Label>
            <FormField.Description className="sr-only" id={`access_control_conditions.${index}.amount-description`}>
              The amount of tokens required to access your publication
            </FormField.Description>
            <div className="flex gap-3 lg:gap-0 flex-col">
              <FormSelect
                scale="sm"
                disabled={
                  !isAddress(data()?.access_control_conditions?.[index]?.contractAddress) ||
                  !account?.address ||
                  chain?.unsupported === true ||
                  chain?.id === 1
                }
                classNameInput="lg:!rounded-b-none"
                className="w-full"
                name={`access_control_conditions.${index}.condition`}
                id={`access_control_conditions.${index}.condition`}
                hasError={false}
              >
                <option value={ScalarOperator.Equal}>Exactly equal to</option>
                <option value={ScalarOperator.GreaterThanOrEqual}>Greater than or equal to</option>
                <option value={ScalarOperator.GreaterThanOrEqual}>Greater than</option>
                <option value={ScalarOperator.LessThanOrEqual}>Less than or equal to</option>
                <option value={ScalarOperator.LessThan}>Lower than</option>
                <option value={ScalarOperator.NotEqual}>Not equal to</option>
              </FormSelect>
              <FormInput
                scale="sm"
                type="number"
                step="any"
                min={0}
                max={queryToken?.data?.totalSupply}
                className="w-full lg:!border-t-0 lg:rounded-t-none"
                placeholder="100"
                required={true}
                disabled={
                  !isAddress(data()?.access_control_conditions?.[index]?.contractAddress) ||
                  !account?.address ||
                  chain?.unsupported === true ||
                  chain?.id === 1
                }
                hasError={
                  errors()?.access_control_conditions?.[index]?.amount?.length > 0 ||
                  parseFloat(data()?.access_control_conditions?.[index]?.amount) >
                    parseFloat(queryToken?.data?.totalSupply)
                    ? true
                    : false
                }
                name={`access_control_conditions.${index}.amount`}
                id={`access_control_conditions.${index}.amount`}
                aria-describedby={`access_control_conditions.${index}.amount-description access_control_conditions.${index}.amount-helpblock`}
              />
            </div>
            <span className="block text-ellipsis whitespace-nowrap overflow-hidden text-[0.75rem] pt-1.5 font-medium text-neutral-11">
              Maximum value:{' '}
              {queryToken?.data?.totalSupply
                ? new Intl.NumberFormat().format(parseFloat(queryToken?.data?.totalSupply))
                : '--'}
            </span>
          </FormField.InputField>
          <FormField.HelpBlock
            className="sr-only"
            hasError={errors()?.access_control_conditions?.[index]?.amount?.length > 0 ? true : false}
            id={`access_control_conditions.${index}.amount-helpblock`}
          >
            The required amount must be a positive number inferior or equal to the max supply of this token.
          </FormField.HelpBlock>
        </FormField>
      </div>

      {queryToken?.data?.name && (
        <div className="animate-appear text-2xs mt-6">
          Picked token:{' '}
          <span className="font-bold">
            {/* @ts-ignore */}
            {queryToken?.data?.name} (${queryToken?.data?.symbol}) -{' '}
            {
              chains.filter(
                (chain: any) => chain.id === parseInt(data()?.access_control_conditions?.[index]?.chainID),
              )?.[0]?.name
            }
          </span>
          {/* @ts-ignore */}
          <p className="overflow-hidden text-ellipsis font-mono text-neutral-11">
            {data()?.access_control_conditions?.[index]?.contractAddress}
          </p>
        </div>
      )}
    </div>
  )
}

export default Token
