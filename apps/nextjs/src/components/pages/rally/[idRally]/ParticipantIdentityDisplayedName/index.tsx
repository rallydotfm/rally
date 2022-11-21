import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'
import { chain, useEnsName } from 'wagmi'

interface ParticipantIdentityDisplayedNameProps {
  identity: string
}

export const ParticipantIdentityDisplayedName = (props: ParticipantIdentityDisplayedNameProps) => {
  const { identity } = props
  const queryLensProfile = useWalletAddressDefaultLensProfile(identity)
  const queryEns = useEnsName({
    chainId: chain.mainnet.id,
    address: identity as `0x${string}`,
    enabled:
      (queryLensProfile?.isSuccess && queryLensProfile?.data === null) || queryLensProfile?.isError ? true : false,
  })
  return (
    <>
      {queryLensProfile?.data?.name
        ? queryLensProfile?.data?.name
        : queryEns?.data
        ? queryEns?.data
        : shortenEthereumAddress(identity)}
    </>
  )
}

export default ParticipantIdentityDisplayedName
