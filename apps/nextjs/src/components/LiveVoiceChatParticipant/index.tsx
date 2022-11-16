import { useParticipant } from '@livekit/react-core'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'

export const LiveVoiceChatParticipant = ({ participant }) => {
  const { isSpeaking, connectionQuality, isLocal, cameraPublication, ...rest } = useParticipant(participant)
  const queryLensProfile = useWalletAddressDefaultLensProfile(participant.identity)
  console.log(participant)
  return (
    <button className="w-20 aspect-square rounded-full overflow-hidden">
      {queryLensProfile?.data?.picture?.original?.url && (
        <img
          src={queryLensProfile?.data?.picture?.original?.url?.replace('ipfs://', 'https://lens.infura-ipfs.io/ipfs/')}
          alt={participant.identity}
        />
      )}
    </button>
  )
}

export default LiveVoiceChatParticipant
