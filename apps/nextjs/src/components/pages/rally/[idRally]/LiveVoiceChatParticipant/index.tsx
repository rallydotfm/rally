import { useParticipant } from '@livekit/react-core'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { HandRaisedIcon as SolidHandRaisedIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/20/solid'
import LiveVoiceChatParticipantRole from '@components/LiveVoiceChatParticipantRole'
import { useEffect, useState } from 'react'
import { useStoreLiveVoiceChat, useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
import { Popover } from '@headlessui/react'
import type { Participant } from 'livekit-client'
import Button from '@components/Button'
import { trpc } from '@utils/trpc'
import toast from 'react-hot-toast'

interface LiveVoiceChatParticipantProps {
  participant: Participant
}

export const LiveVoiceChatParticipant = (props: LiveVoiceChatParticipantProps) => {
  const { participant } = props
  const { isSpeaking, connectionQuality, isLocal, cameraPublication, metadata, ...rest } = useParticipant(participant)
  const [reaction, setReaction] = useState('')
  const [hasHandRaised, setHasHandRaised] = useState(false)
  const queryLensProfile = useWalletAddressDefaultLensProfile(participant?.identity)
  const {
    room: { localParticipant, ...dataRoom },
  } = useStoreLiveVoiceChat()

  const mutationParticipantKickOut = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} was kicked out successfully.`)
    },
  })

  const mutationInviteToSpeak = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} is now a speaker`)
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
      if (userMetadata?.is_hand_raised) setHasHandRaised(userMetadata?.is_hand_raised)
    }
  }, [metadata])

  return (
    <>
      <Popover className={`${mutationParticipantKickOut?.isLoading ? 'animate-pulse' : ''}`}>
        <Popover.Button className="group rounded-lg p-4 relative w-fit-content flex items-center flex-col">
          <span
            className={`${
              isSpeaking ? 'ring-interactive-11' : 'ring-transparent'
            } w-20 ring-4 relative ring-offset-black group-hover:ring-offset-neutral-2 ring-offset-4 aspect-square rounded-full `}
          >
            <span className="block w-full h-full relative overflow-hidden rounded-full">
              <span className="absolute inset-0 w-full h-full bg-neutral-2" />
              {queryLensProfile?.data?.picture?.original?.url && (
                <img
                  className="absolute inset-0 w-full h-full object-cover z-10"
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

            {hasHandRaised && (
              <div
                className={`absolute bg-neutral-12 text-neutral-1 border-4 p-1 rounded-full border-black z-20 inline-end-0 bottom-0 translate-y-1/4 translate-x-1/4`}
              >
                <SolidHandRaisedIcon className=" w-5" />
              </div>
            )}
            {participant?.permissions?.canPublish && (
              <div
                className={`absolute bg-neutral-3 group-hover:bg-neutral-5 text-neutral-12 border-4 p-1 rounded-full border-black z-20 inline-end-0 bottom-0 translate-y-1/4 translate-x-1/4`}
              >
                {participant?.audioLevel > 0 ? (
                  <SpeakerWaveIcon className="w-5" />
                ) : (
                  <SpeakerXMarkIcon className="w-5" />
                )}
              </div>
            )}
          </span>

          <span className="font-bold text-2xs pt-3 overflow-hidden text-ellipsis max-w-24">
            {participant?.identity}
          </span>
          <span className="pt-0.5 text-2xs text-neutral-10 group-hover:text-neutral-12 font-medium">
            <LiveVoiceChatParticipantRole permissions={participant?.permissions} />
          </span>
          <span className="sr-only">
            {participant?.identity} {isSpeaking ? 'is speaking...' : ''} {reaction ? `reacted with ${reaction}` : ''}
          </span>
        </Popover.Button>
        <Popover.Panel className="animate-appear border-neutral-4 border rounded-md absolute bg-neutral-2 max-h-40 overflow-auto max-w-screen-min w-max-content z-10">
          <div className="flex items-end pis-3 pie-6 pt-3 pb-5 bg-neutral-3 space-i-2">
            <div className="w-20 relative aspect-square overflow-hidden rounded-full" overflow-hidden>
              {queryLensProfile?.data?.picture?.original?.url && (
                <img
                  className="absolute inset-0 w-full h-full object-cover z-10"
                  src={queryLensProfile?.data?.picture?.original?.url?.replace(
                    'ipfs://',
                    'https://lens.infura-ipfs.io/ipfs/',
                  )}
                  alt={participant.identity}
                />
              )}
            </div>
            <div className="space-y-2 pt-3">
              <p className="font-semibold max-w-[12ex] overflow-hidden text-ellipsis text-2xs">
                {participant?.identity}
              </p>
              <Button intent="primary-outline" scale="xs">
                Follow
              </Button>
            </div>
          </div>
          {localParticipant?.identity !== participant?.identity && localParticipant?.permissions?.canPublishData && (
            <div>
              <ul className="text-[0.785rem] font-semibold divide-y divide-neutral-4">
                {!participant?.permissions?.canPublish && (
                  <li>
                    <button
                      onClick={() =>
                        mutationInviteToSpeak.mutateAsync({
                          id_rally: rally?.id,
                          id_user: participant?.identity,
                          can_join: true,
                          can_publish_data: false,
                          can_subscribe: true,
                          can_publish: true,
                        })
                      }
                      className="text-start pis-3 pie-6 py-2 w-full focus:bg-neutral-12 hover:bg-neutral-3  focus:text-interactive-9"
                    >
                      Invite to speak
                    </button>
                  </li>
                )}
                {participant?.permissions?.canPublish && (
                  <li>
                    <button
                      onClick={() =>
                        mutationMoveBackToAudience.mutateAsync({
                          id_rally: rally?.id,
                          id_user: participant?.identity,
                          can_join: true,
                          can_publish_data: false,
                          can_subscribe: true,
                          can_publish: false,
                        })
                      }
                      className="text-start pis-3 pie-6 py-2 w-full focus:bg-neutral-12 hover:bg-neutral-3  focus:text-interactive-9"
                    >
                      Move to audience
                    </button>
                  </li>
                )}
                {participant?.permissions?.canPublish && participant?.isSpeaking && (
                  <li>
                    <button className="text-start pis-3 pie-6 py-2 w-full focus:bg-neutral-12 hover:bg-neutral-3  focus:text-interactive-9">
                      Mute
                    </button>
                  </li>
                )}
                <li>
                  <button
                    disabled={mutationParticipantKickOut?.isLoading}
                    onClick={() =>
                      mutationParticipantKickOut.mutateAsync({
                        id_rally: rally?.id,
                        id_user: participant?.identity,
                        can_join: false,
                        can_publish_data: false,
                        can_subscribe: false,
                        can_publish: false,
                      })
                    }
                    className="text-start text-negative-10 hover:bg-negative-1 hover:text-negative-11 focus:text-negative-11 focus:bg-negative-2 pis-3 pie-6 py-2 w-full "
                  >
                    Kick out
                  </button>
                </li>
                <li>
                  <button
                    disabled={mutationParticipantKickOut?.isLoading}
                    onClick={async () => {
                      let roomMetadata = JSON.parse(dataRoom?.metadata ?? '')
                      await mutationRoomAddToBlacklist.mutateAsync({
                        id_rally: rally?.id,
                        id_user: participant?.identity,
                        metadata: JSON.stringify({
                          ...roomMetadata,
                          blacklist: [...roomMetadata.blacklist, participant?.identity],
                        }),
                      })
                    }}
                    className="text-start text-negative-10 hover:bg-negative-1 hover:text-negative-11 focus:text-negative-11 focus:bg-negative-2 pis-3 pie-6 py-2 w-full "
                  >
                    Ban permanently from this rally
                  </button>
                </li>
              </ul>
            </div>
          )}
          <div className="grid grid-cols-2"></div>
          <div></div>
        </Popover.Panel>
      </Popover>
    </>
  )
}

export default LiveVoiceChatParticipant
