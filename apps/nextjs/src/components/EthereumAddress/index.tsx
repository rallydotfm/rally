import { useQuery } from '@tanstack/react-query'
import { getDefaultProfile } from '@services/lens/profile/getDefaultProfile'
import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import { chain, useEnsName } from 'wagmi'

interface EthereumAddressProps {
  address: string
  shortenOnFallback: boolean
  displayLensProfile: boolean
}
export const EthereumAddress = (props: EthereumAddressProps) => {
  const { address, displayLensProfile, shortenOnFallback } = props
  const queryUserProfileLens = useQuery(
    ['lens-profile', address],
    async () => {
      try {
        const result = await getDefaultProfile({
          ethereumAddress: address,
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.data?.defaultProfile
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: displayLensProfile,
    },
  )

  console.log(queryUserProfileLens)

  const queryEns = useEnsName({
    chainId: chain.mainnet.id,
    address: address as `0x${string}`,
    enabled:
      (queryUserProfileLens?.isSuccess && queryUserProfileLens?.data === null) || queryUserProfileLens?.isError
        ? true
        : false,
  })

  if (!displayLensProfile || queryUserProfileLens?.status === 'error' || queryUserProfileLens?.data === null) {
    if (queryEns?.status === 'success' && queryEns?.data !== null) return <>{queryEns?.data}</>
    return <>{shortenOnFallback === true ? shortenEthereumAddress(address) : address}</>
  }

  if (queryUserProfileLens?.status === 'loading') return <>Loading {shortenEthereumAddress(address)} profile data...</>
  if (queryUserProfileLens?.status === 'success' && queryUserProfileLens?.data !== null)
    return (
      <span className="flex items-baseline 2xs:items-center">
        <a
          title={`View ${queryUserProfileLens?.data?.name}'s profile on LensFrens`}
          className="relative flex flex-col 2xs:flex-row 2xs:items-center flex-grow z-20"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://lensfrens.xyz/${queryUserProfileLens?.data?.handle}`}
        >
          {/**@ts-ignore */}
          {queryUserProfileLens?.data?.picture?.original?.url && (
            <div className="shrink-0 w-10 h-10 mb-3 2xs:mb-0 2xs:mie-3 bg-neutral-5 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                //@ts-ignore
                src={queryUserProfileLens?.data?.picture?.original?.url?.replace(
                  'ipfs://',
                  'https://lens.infura-ipfs.io/ipfs/',
                )}
                alt=""
              />
            </div>
          )}

          <span className="flex flex-wrap whitespace-pre-line">
            <span className="font-bold w-full">{queryUserProfileLens?.data?.name}&nbsp;</span>
            <span className="text-[0.9em] opacity-50">@{queryUserProfileLens?.data?.handle}</span>
          </span>
        </a>
      </span>
    )
  return <>{address}</>
}

export default EthereumAddress
