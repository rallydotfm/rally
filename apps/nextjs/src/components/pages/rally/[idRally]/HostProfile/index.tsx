import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import { chain, useEnsName } from 'wagmi'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { ROUTE_PROFILE } from '@config/routes'
import Link from 'next/link'

interface HostProfileProps {
  address: string
}
export const HostProfile = (props: HostProfileProps) => {
  const { address } = props
  const queryUserProfileLens = useWalletAddressDefaultLensProfile(address, {
    enabled: true,
  })

  const queryEns = useEnsName({
    chainId: chain.mainnet.id,
    address: address as `0x${string}`,
    enabled:
      (queryUserProfileLens?.isSuccess && queryUserProfileLens?.data === null) || queryUserProfileLens?.isError
        ? true
        : false,
  })

  if (queryUserProfileLens?.status === 'error' || queryUserProfileLens?.data === null) {
    if (queryEns?.status === 'success' && queryEns?.data !== null)
      return (
        <div className="flex w-fit-content items-center text-center flex-col">
          <div className="shrink-0 w-12 h-12 mb-2 bg-neutral-5 rounded-full overflow-hidden">
            <img
              className="w-full h-full object-cover"
              //@ts-ignore
              src={`https://avatars.dicebear.com/api/identicon/${address}.svg`}
              alt=""
            />
          </div>
          <span className="flex flex-col items-center justify-center">
            <span className="font-bold w-full">{queryEns?.data}&nbsp;</span>
            <span className="text-[0.9em] opacity-50">{shortenEthereumAddress(address)}</span>
          </span>
        </div>
      )
    return (
      <div className="flex w-fit-content items-center text-center flex-col">
        <div className="shrink-0 w-12 h-12 mb-2 bg-neutral-5 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            //@ts-ignore
            src={`https://avatars.dicebear.com/api/identicon/${address}.svg`}
            alt=""
          />
        </div>
        <span className="flex flex-col items-center justify-center">
          <span className="font-bold w-full">{shortenEthereumAddress(address)}&nbsp;</span>
        </span>
      </div>
    )
  }

  if (queryUserProfileLens?.status === 'loading') return <>Loading {shortenEthereumAddress(address)} profile data...</>
  if (queryUserProfileLens?.status === 'success' && queryUserProfileLens?.data !== null)
    return (
      <article className="flex w-fit-content text-center flex-col">
        <Link
          title={`View ${queryUserProfileLens?.data?.name}'s profile page`}
          href={ROUTE_PROFILE.replace('[handleLensProfile]', queryUserProfileLens?.data?.handle)}
        >
          <a className="relative flex flex-col items-center z-20">
            {/**@ts-ignore */}
            {queryUserProfileLens?.data?.picture?.original?.url && (
              <div className="shrink-0 w-12 h-12 mb-2 bg-neutral-5 rounded-full overflow-hidden">
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

            <span className="flex flex-col items-center justify-center">
              <span className="font-bold w-full">{queryUserProfileLens?.data?.name}&nbsp;</span>
              <span className="text-[0.9em] opacity-50">@{queryUserProfileLens?.data?.handle}</span>
            </span>
          </a>
        </Link>
      </article>
    )
  return <>{shortenEthereumAddress(address)}</>
}

export default HostProfile
