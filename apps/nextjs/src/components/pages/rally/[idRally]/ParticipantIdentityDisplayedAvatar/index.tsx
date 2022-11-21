import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import type { ImgProps } from 'react-html-props'
import { chain, useEnsAvatar } from 'wagmi'

interface ParticipantIdentityDisplayedAvatarProps extends ImgProps {
  identity: string
}

export const ParticipantIdentityDisplayedAvatar = (props: ParticipantIdentityDisplayedAvatarProps) => {
  const { identity, ...rest } = props
  const queryLensProfile = useWalletAddressDefaultLensProfile(identity)
  const queryEns = useEnsAvatar({
    chainId: chain.mainnet.id,
    addressOrName: identity,
    enabled:
      (queryLensProfile?.isSuccess && queryLensProfile?.data === null) || queryLensProfile?.isError ? true : false,
  })
  //@ts-ignore
  if (queryLensProfile?.data?.picture?.original?.url)
    return (
      <img
        //@ts-ignore
        src={queryLensProfile?.data?.picture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')}
        {...rest}
      />
    )
  if (queryEns?.data)
    return (
      <img
        //@ts-ignore
        src={queryEns?.data}
        {...rest}
      />
    )

  return <img src={`https://avatars.dicebear.com/api/identicon/${identity}.svg`} {...rest} />
}

export default ParticipantIdentityDisplayedAvatar
