import { useParticipant } from '@livekit/react-core'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { HandRaisedIcon as SolidHandRaisedIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid'
import LiveVoiceChatParticipantRole from '@components/LiveVoiceChatParticipantRole'
import { useEffect, useState } from 'react'
import { useStoreLiveVoiceChat, useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
import { Popover } from '@headlessui/react'
import { Participant, RoomEvent } from 'livekit-client'
import Button from '@components/Button'
import { trpc } from '@utils/trpc'
import toast from 'react-hot-toast'
import { useStoreDisplayParticipant } from '../DialogModalDisplayParticipant'

interface LiveVoiceChatParticipantProps {
  participant: Participant
}

export const LiveVoiceChatParticipant = (props: LiveVoiceChatParticipantProps) => {
  const { participant } = props
  const { metadata, identity, permissions, isMicrophoneEnabled } = participant
  const { isSpeaking, ...rest } = useParticipant(participant)
  const [reaction, setReaction] = useState('')
  const [hasHandRaised, setHasHandRaised] = useState(false)
  const queryLensProfile = useWalletAddressDefaultLensProfile(identity)
  const selectParticipantToDisplay = useStoreDisplayParticipant((state) => state.selectParticipantToDisplay)
  //@ts-ignore
  const { room } = useStoreLiveVoiceChat()
  const { localParticipant } = room

  const mutationParticipantKickOut = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} was kicked out successfully.`)
    },
  })

  const mutationInviteToSpeak = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} was invited to speak.`)
    },
  })

  const mutationMoveBackToAudience = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} was moved back to the audience.`)
    },
  })

  const mutationRoomAddToBlacklist = trpc?.room.update_room_ban_list.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} is now banned permanently.`)
    },
  })

  //@ts-ignore
  const rally = useStoreCurrentLiveRally((state) => state.rally)

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
        <span className="block w-full h-full relative overflow-hidden rounded-full">
          <span className="absolute inset-0 w-full h-full bg-neutral-2" />
          {/* @ts-ignore */}

          {queryLensProfile?.data?.picture?.original?.url && (
            <img
              className="absolute inset-0 w-full h-full object-cover z-10"
              /* @ts-ignore */
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
        </span>

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
        <span className="block text-2xs overflow-hidden text-ellipsis max-w-[15ex]">{identity}</span>
      </span>

      <span className="pt-0.5 text-2xs text-neutral-10 group-hover:text-neutral-12 font-medium">
        <LiveVoiceChatParticipantRole participant={participant} />
      </span>
      <span className="sr-only">
        {identity} {isSpeaking ? 'is speaking...' : ''} {reaction ? `reacted with ${reaction}` : ''}
      </span>
    </button>
  )
}

export default LiveVoiceChatParticipant
