import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import { chain, useEnsName } from 'wagmi'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { ROUTE_PROFILE } from '@config/routes'
import Link from 'next/link'

interface EthereumAddressProps {
  address: string
  shortenOnFallback: boolean
  displayLensProfile: boolean
}
export const EthereumAddress = (props: EthereumAddressProps) => {
  const { address, displayLensProfile, shortenOnFallback } = props
  const queryUserProfileLens = useWalletAddressDefaultLensProfile(address, {
    enabled: displayLensProfile,
  })

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
        <Link href={ROUTE_PROFILE.replace('[handleLensProfile]', queryUserProfileLens?.data?.handle)}>
          <a className="relative flex flex-col 2xs:flex-row 2xs:items-center flex-grow z-20">
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
        </Link>
      </span>
    )
  return <>{address}</>
}

export default EthereumAddress
