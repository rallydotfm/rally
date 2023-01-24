import FormField from '@components/FormField'
import FormInput from '@components/FormInput'
import FormSelect from '@components/FormSelect'
import { useAccount, useNetwork } from 'wagmi'
import LensProfileSuggestions from '@components/LensProfileSuggestions'

export const ExternallyOwnedAccount = (props: any) => {
  const { index, chains, ...formProps } = props
  const { data, setFields, errors } = formProps
  const account = useAccount()
  const { chain } = useNetwork()

  return (
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
              <option key={`eoa-chain-picker${chain?.id}`} value={chain?.id}>
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
            hasError={errors()?.access_control_conditions?.[index]?.address?.length > 0 ? true : false}
            htmlFor={`access_control_conditions.${index}.address`}
          >
            Paste the wallet address below
          </FormField.Label>
          <FormField.Description className="sr-only" id={`access_control_conditions.${index}.address-description`}>
            The externally owned wallet address
          </FormField.Description>
          <div className="relative z-10">
            <LensProfileSuggestions
              shouldSearchEns={true}
              onSelectValue={(value: string) => {
                setFields(`access_control_conditions.${index}.address`, value)
              }}
            />
            <FormInput
              scale="sm"
              type="text"
              className="!pis-8 w-full"
              placeholder="0x..."
              pattern="^0x[a-fA-F0-9]{40}$"
              required={true}
              disabled={!account?.address || chain?.unsupported === true || chain?.id === 1}
              hasError={errors()?.access_control_conditions?.[index]?.address?.length > 0 ? true : false}
              name={`access_control_conditions.${index}.address`}
              id={`access_control_conditions.${index}.address`}
              aria-describedby={`access_control_conditions.${index}.address-description access_control_conditions.${index}.address-helpblock`}
            />
          </div>
        </FormField.InputField>
        <FormField.HelpBlock
          className="text-[0.85rem]"
          hasError={errors()?.access_control_conditions?.[index]?.address?.length > 0 ? true : false}
          id={`access_control_conditions.${index}.address-helpblock`}
        >
          The wallet address must be a valid Ethereum address, exist on this chain and be an externally owned address
          (not a contract address).
        </FormField.HelpBlock>
      </FormField>
    </div>
  )
}

export default ExternallyOwnedAccount
