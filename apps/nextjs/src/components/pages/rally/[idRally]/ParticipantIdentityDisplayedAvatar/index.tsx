import type { ImgProps } from 'react-html-props'

interface ParticipantIdentityDisplayedAvatarProps extends ImgProps {
  identity: string
  metadata: string
}

export const ParticipantIdentityDisplayedAvatar = (props: ParticipantIdentityDisplayedAvatarProps) => {
  const { identity, metadata, ...rest } = props

  return <img src={JSON.parse(metadata)?.avatar_url} {...rest} />
}

export default ParticipantIdentityDisplayedAvatar
