import Nft from './Nft'
import Token from './Token'
import ExternallyOwnedAccount from './ExternallyOwnedAccount'
import PickLensProfile from './PickLensProfile'
import LockSuggestions from './PickLock'
import { UNLOCK_SUBGRAPH_API_URL } from '@config/unlock'
import FormField from '@components/FormField'
import FormSelect from '@components/FormSelect'
import Publication from './Publication'
import { supportedChains } from '@config/lit'

export const Criteria = (props: any) => {
  const { type, ...rest } = props
  const { setFields, data, errors, index } = rest
  switch (type) {
    case 'nft':
      if (
        (data()?.access_control_conditions?.[index]?.contractAddress === '0xdb46d1dc155634fbc732f92e853b10b288ad5a1d' &&
          data()?.access_control_conditions?.[index]?.chainID === 137) ||
        (data()?.access_control_conditions?.[index]?.contractAddress === '0xe00dc8cb3a7c3f8e5ab5286afabb0c2d1054187b' &&
          data()?.access_control_conditions?.[index]?.chainID === 80001)
      )
        return (
          <div className="pb-4 xs:text-center text-xs font-bold m-auto">
            Must have a Lens profile to access this publication
            <div className="pt-12 text-center">
              <a
                className="text-neutral-11 font-normal block text-2xs"
                target="_blank "
                href="https://docs.lens.xyz/docs/profile/"
              >
                Curious about Lens profiles ? <br />
                <span className="underline hover:no-underline">Learn more on Lens's website.</span>
              </a>
            </div>
            <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.chainID`} />
            <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.contractAddress`} />
            <input className="sr-only" disabled hidden name={`access_control_conditions.${index}.contractType`} />
          </div>
        )
      return (
        <>
          <div className="pb-4 xs:text-center text-xs font-bold">
            Must own NFT matching the following criteria to access this publication :
          </div>
          <Nft chains={supportedChains} {...rest} />
        </>
      )
      break

    case 'token':
      return (
        <>
          <div className="pb-4 xs:text-center text-xs font-bold">
            Must hold ERC-20 tokens matching the following criteria to access this publication :
          </div>

          <Token chains={supportedChains} {...rest} />
        </>
      )
      break
    case 'eoa':
      return (
        <>
          <div className="pb-4 xs:text-center text-xs font-bold">
            Must have a wallet address matching the following criteria to access this publication :
          </div>
          <ExternallyOwnedAccount chains={supportedChains} {...rest} />
        </>
      )
      break

    case 'lens-profile':
      return (
        <>
          <div className="pb-4 xs:text-center text-xs font-bold">
            Must own the following Lens profile to access this publication :
          </div>
          <PickLensProfile
            pickType="ownership"
            onPickValue={(value: string) => {
              setFields(`access_control_conditions.${index}.profileId`, value)
            }}
            label="Select Lens profile"
            {...rest}
          />
        </>
      )
      break
    case 'follow':
      return (
        <>
          <div className="pb-4 xs:text-center text-xs font-bold">
            Must follow this Lens profile to access this publication :
          </div>
          <PickLensProfile
            pickType="follow"
            onPickValue={(value: string) => {
              setFields(`access_control_conditions.${index}.profileId`, value)
            }}
            label="Must follow the following Lens profile"
            {...rest}
          />
        </>
      )
      break
    case 'unlock':
      return (
        <>
          <div className="pb-4 xs:text-center text-xs font-bold">
            Must own the following Lock to access this publication :
          </div>
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
                <FormField.Description
                  className="sr-only"
                  id={`access_control_conditions.${index}.chainID-description`}
                >
                  The chain on which the NFT contract is deployed to
                </FormField.Description>
                <FormSelect
                  scale="sm"
                  required
                  hasError={errors()?.access_control_conditions?.[index]?.chainID?.length > 0 ? true : false}
                  onChange={(e) => {
                    setFields(`access_control_conditions.${index}.chainID`, parseInt(e.target.value))
                  }}
                >
                  {supportedChains?.map((chain: { id: number; name: string }) => (
                    <option value={chain.id} key={`unlock-picker-chain${chain?.id}`}>
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

            <LockSuggestions
              chainId={data()?.access_control_conditions?.[index].chainID}
              chains={supportedChains?.filter((chain) =>
                Object.keys(UNLOCK_SUBGRAPH_API_URL).includes(chain?.id.toString()),
              )}
              onSelectValue={(value: string) => {
                setFields(`access_control_conditions.${index}.contractAddress`, value)
              }}
              {...rest}
            />
          </div>
        </>
      )
      break
    case 'collect':
      return (
        <>
          {' '}
          <Publication chains={supportedChains} {...rest} />
        </>
      )
      break
    default:
      break
  }
}

export default Criteria
