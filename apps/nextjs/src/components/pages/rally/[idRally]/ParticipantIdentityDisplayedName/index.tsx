import { shortenEthereumAddress } from '@helpers/shortenEthereumAddress'

interface ParticipantIdentityDisplayedNameProps {
  identity: string
  metadata: string
}

export const ParticipantIdentityDisplayedName = (props: ParticipantIdentityDisplayedNameProps) => {
  const { identity, metadata } = props
  return <>{JSON.parse(metadata)?.display_name}</>
}

export default ParticipantIdentityDisplayedName
