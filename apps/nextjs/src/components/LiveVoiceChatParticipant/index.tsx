import { useParticipant } from '@livekit/react-core'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { HandRaisedIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid'
import LiveVoiceChatParticipantRole from '@components/LiveVoiceChatParticipantRole'
import { useEffect, useState } from 'react'

export const LiveVoiceChatParticipant = ({ participant }) => {
  const { isSpeaking, connectionQuality, isLocal, cameraPublication, metadata, ...rest } = useParticipant(participant)
  const [reaction, setReaction] = useState('')
  const [hasHandRaised, setHasHandRaised] = useState(false)
  const queryLensProfile = useWalletAddressDefaultLensProfile(participant.identity)
  useEffect(() => {
    if (metadata) {
      const userMetadata = JSON.parse(metadata ?? '')
      if (userMetadata?.reaction && userMetadata?.reaction !== '') {
        setReaction(userMetadata.reaction?.emoji)
        setTimeout(() => {
          setReaction('')
        }, 2600)
      }
      if (userMetadata?.is_hand_raised) setHasHandRaised(userMetadata?.is_hand_raised)
    }
  }, [metadata])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-fit-content">
        <button
          className={`${
            isSpeaking ? 'ring-interactive-11' : 'ring-transparent'
          } w-20 ring-4 relative ring-offset-black ring-offset-4 aspect-square rounded-full overflow-hidden`}
        >
          {queryLensProfile?.data?.picture?.original?.url && (
            <img
              src={queryLensProfile?.data?.picture?.original?.url?.replace(
                'ipfs://',
                'https://lens.infura-ipfs.io/ipfs/',
              )}
              alt={participant.identity}
            />
          )}
          {reaction && reaction !== '' && (
            <span className="animate-scale-up text-2xl inset-0 flex items-center justify-center absolute w-full h-full rounded-full bg-white bg-opacity-75 z-10">
              <span className="animate-appear">{reaction}</span>
            </span>
          )}
        </button>
        {hasHandRaised && (
          <div
            className={`absolute bg-neutral-12 text-neutral-1 border-4 p-1 rounded-full border-black z-20 inline-end-0 bottom-0 translate-x-1/4`}
          >
            <HandRaisedIcon className=" w-5" />
          </div>
        )}
        {participant?.permissions?.canPublish && (
          <div
            className={`absolute bg-neutral-3 text-neutral-12 border-4 p-1 rounded-full border-black z-20 inline-end-0 bottom-0 translate-x-1/4`}
          >
            {participant?.audioLevel > 0 ? <SpeakerWaveIcon className="w-5" /> : <SpeakerXMarkIcon className="w-5" />}
          </div>
        )}
      </div>

      <p className="font-bold text-2xs pt-1 overflow-hidden text-ellipsis max-w-24">{participant?.identity}</p>
      <p className="pt-0.5 text-2xs text-neutral-10 font-medium">
        <LiveVoiceChatParticipantRole permissions={participant?.permissions} />
      </p>
    </div>
  )
}

export default LiveVoiceChatParticipant
