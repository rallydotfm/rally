import { useEffect, useState } from 'react'
import { Participant } from 'livekit-client'
import { useParticipant } from '@livekit/react-core'
import { HandRaisedIcon as SolidHandRaisedIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid'
import LiveVoiceChatParticipantRole from '@components/LiveVoiceChatParticipantRole'
import { useStoreDisplayParticipant } from '@components/pages/rally/[idRally]/DialogModalDisplayParticipant'
import ParticipantIdentityDisplayedName from '@components/pages/rally/[idRally]/ParticipantIdentityDisplayedName'
import ParticipantIdentityDisplayedAvatar from '@components/pages/rally/[idRally]/ParticipantIdentityDisplayedAvatar'
import { MicrophoneIcon } from '@heroicons/react/24/solid'

interface LiveVoiceChatParticipantProps {
  participant: Participant
}

export const LiveVoiceChatParticipant = (props: LiveVoiceChatParticipantProps) => {
  const { participant } = props
  const { metadata, identity, permissions, isMicrophoneEnabled } = participant
  const { isSpeaking } = useParticipant(participant)
  const [reaction, setReaction] = useState('')
  const [hasHandRaised, setHasHandRaised] = useState(false)
  const selectParticipantToDisplay = useStoreDisplayParticipant((state) => state.selectParticipantToDisplay)

  useEffect(() => {
    if (metadata) {
      const userMetadata = JSON.parse(metadata ?? '')
      if (userMetadata?.reaction && userMetadata?.reaction !== '') {
        setReaction(userMetadata.reaction?.emoji)
        setTimeout(() => {
          setReaction('')
        }, 2600)
      }
      setHasHandRaised(userMetadata?.is_hand_raised ?? false)
    }
  }, [metadata])

  return (
    <button
      onClick={() => selectParticipantToDisplay(participant)}
      className="group rounded-lg p-4 relative w-fit-content flex items-center flex-col"
    >
      <span
        className={`${
          isSpeaking ? 'ring-interactive-11' : 'ring-transparent'
        } w-20 ring-4 relative ring-offset-black group-hover:ring-offset-neutral-2 ring-offset-4 aspect-square rounded-full `}
      >
        <span
          className={`${
            participant?.isLocal && !participant?.isMicrophoneEnabled && participant?.permissions?.canPublish
              ? 'opacity-50'
              : ''
          } block w-full h-full border-neutral-4 border relative overflow-hidden rounded-full`}
        >
          <span className="absolute inset-0 w-full h-full bg-neutral-2" />
          <ParticipantIdentityDisplayedAvatar
            metadata={participant?.metadata as string}
            className="absolute inset-0 w-full h-full object-cover z-10"
            identity={participant?.identity}
            alt=""
          />
          {reaction && reaction !== '' && (
            <span className="animate-scale-up text-2xl inset-0 flex items-center justify-center absolute w-full h-full rounded-full bg-white bg-opacity-75 z-10">
              <span className="animate-appear">{reaction}</span>
            </span>
          )}
        </span>
        {!participant?.isMicrophoneEnabled && participant?.permissions?.canPublish && (
          <div
            className={`absolute bg-negative-3 group-hover:bg-negative-5 text-negative-11 border-4 p-1 rounded-full border-black z-20 inline-end-0 bottom-0 translate-y-1/4 translate-x-1/4`}
          >
            <MicrophoneIcon className="w-4 animate-pulse" />
          </div>
        )}

        {permissions?.canPublish && isMicrophoneEnabled && (
          <div
            className={`absolute bg-neutral-3 group-hover:bg-neutral-5 text-neutral-12 border-4 p-1 rounded-full border-black z-20 inline-end-0 bottom-0 translate-y-1/4 translate-x-1/4`}
          >
            {participant?.audioLevel > 0 ? <SpeakerWaveIcon className="w-5" /> : <SpeakerXMarkIcon className="w-5" />}
          </div>
        )}
      </span>

      <span className="font-bold flex space-i-1 items-center pt-3">
        {hasHandRaised === true && <SolidHandRaisedIcon className="text-neutral-12 w-[1.05rem]" />}
        <span className="block text-2xs overflow-hidden text-ellipsis max-w-[15ex]">
          <ParticipantIdentityDisplayedName metadata={participant?.metadata as string} identity={identity} />
        </span>
      </span>
      {participant?.isLocal && (
        <span className="block mt-1 text-[0.75rem] bg-interactive-12 font-bold text-interactive-9 px-2 rounded-md">
          you
        </span>
      )}

      <span className="pt-0.5 text-2xs flex flex-col text-neutral-10 group-hover:text-neutral-12 font-medium">
        <LiveVoiceChatParticipantRole participant={participant} />
      </span>
      <span className="sr-only">
        <ParticipantIdentityDisplayedName metadata={participant?.metadata as string} identity={identity} />{' '}
        {isSpeaking ? 'is speaking...' : ''} {reaction ? `reacted with ${reaction}` : ''}
      </span>
    </button>
  )
}

export default LiveVoiceChatParticipant
