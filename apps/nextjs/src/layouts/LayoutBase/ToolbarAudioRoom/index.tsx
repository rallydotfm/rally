import { useEffect, useState } from 'react'
import {
  MicrophoneIcon as SolidMicrophoneIcon,
  HandRaisedIcon as SolidHandRaisedIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/20/solid'

import { HandRaisedIcon, HeartIcon, MicrophoneIcon } from '@heroicons/react/24/outline'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import Button from '@components/Button'
import { AudioRenderer, useParticipant } from '@livekit/react-core'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { useRouter } from 'next/router'
import { useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
import { trpc } from '@utils/trpc'
import { useEndLiveAudioChat, useStoreTxUiEndLiveRally } from '@hooks/useEndLiveAudioChat'
import { Listbox } from '@headlessui/react'
import DialogEndLive from '@components/DialogEndLive'
import DialogModalSpeakerInvitation from '@components/pages/rally/[idRally]/DialogModalSpeakerInvitation'
import { useAccount } from 'wagmi'
import { RoomEvent } from 'livekit-client'
import Link from 'next/link'
import type { Participant, Track } from 'livekit-client'

export const ToolbarAudioRoom = () => {
  const { address } = useAccount()
  const state: any = useStoreLiveVoiceChat()
  const { microphonePublication, isSpeaking } = useParticipant(state?.room?.localParticipant)
  const {
    pathname,
    query: { idRally },
  } = useRouter()
  const rally: any = useStoreCurrentLiveRally((state: any) => state.rally)
  const displaySpeakerInvitationModal: any = useStoreCurrentLiveRally(
    (state: any) => state.displaySpeakerInvitationModal,
  )
  const setDisplaySpeakerInvitationModal: any = useStoreCurrentLiveRally(
    (state: any) => state.setDisplaySpeakerInvitationModal,
  )
  const localUserPermissions: any = useStoreCurrentLiveRally((state: any) => state.localUserPermissions)
  const setLocalUserPermissions: any = useStoreCurrentLiveRally((state: any) => state.setLocalUserPermissions)
  const mutationReaction: any = trpc.room.react.useMutation()
  const mutationRaiseHand = trpc.room.raise_hand.useMutation({
    onSuccess(data: any) {
      setIsHandRaised(data)
    },
  })
  const stateTxUiEndLiveRally = useStoreTxUiEndLiveRally()
  const { onClickEndLive, stateEndLiveAudioChat } = useEndLiveAudioChat(stateTxUiEndLiveRally)
  const [isHandRaised, setIsHandRaised] = useState(false)

  useEffect(() => {
    state.room?.on(RoomEvent.ParticipantPermissionsChanged, (prevPermissions: any, participant: Participant) => {
      if (participant?.permissions?.canPublish === true && prevPermissions?.canPublish === false)
        setDisplaySpeakerInvitationModal(
          participant?.permissions?.canPublish === true && prevPermissions?.canPublish === false ? true : false,
        )
      setLocalUserPermissions(participant?.permissions)
    })
    setLocalUserPermissions(state.room.localParticipant.permissions)
  }, [])

  return (
    <>
      {state.audioTracks.map((track: Track) => {
        return (
          <>
            <AudioRenderer track={track} isLocal={false} />
          </>
        )
      })}

      <div className={`w-full justify-evenly flex xs:grid xs:grid-cols-3 2xs:gap-6 xs:gap-8 px-3 xs:px-6`}>
        <div
          className={`col-span-1 flex items-baseline ${
            localUserPermissions?.canPublishData ? 'max-w-[5ex]' : 'max-w-[8ex]'
          } xs:max-w-unset shrink-1 `}
        >
          ​​{' '}
          {pathname !== ROUTE_RALLY_VIEW && (
            <Link href={ROUTE_RALLY_VIEW.replace('[idRally]', rally?.id)}>
              <a className="flex font-bold justify-start items-baseline space-i-1 overflow-hidden text-ellipsis 2xs:space-i-2 xs:space-i-4 self-center text-2xs">
                {rally?.image && (
                  <img
                    alt=""
                    width="40px"
                    height="40px"
                    loading="lazy"
                    className="hidden xs:block w-10 h-10 rounded-md"
                    src={`https://ipfs.io/ipfs/${rally?.image}`}
                  />
                )}
                <span className="whitespace-nowrap block overflow-hidden text-ellipsis xs:-translate-y-2.5">
                  {rally?.name}
                </span>
              </a>
            </Link>
          )}
        </div>

        <div
          className={`col-span-1 transition-all grow-1 w-fit-content max-w-56 ${
            pathname !== ROUTE_RALLY_VIEW ? 'mx-auto' : 'mis-0 mie-auto'
          } xs:w-full shrink-0 flex items-center mx-auto xs:max-w-unset justify-center space-i-2 xs:space-i-6`}
        >
          {localUserPermissions?.canPublish && (
            <Button
              onClick={async () => {
                if (!microphonePublication) {
                  await state.room.localParticipant.setMicrophoneEnabled(true)
                } else {
                  await state.room.localParticipant.setMicrophoneEnabled(microphonePublication.isMuted ? true : false)
                }
              }}
              intent="neutral-ghost"
              scale="sm"
              className={`ring-interactive-11 ${
                isSpeaking ? 'ring-4 ring-opacity-100' : 'ring-0 ring-opacity-0'
              } relative aspect-square shrink-0`}
              title={
                !microphonePublication ? 'Activate your microphone' : microphonePublication.isMuted ? 'Unmute' : 'Mute'
              }
            >
              {!microphonePublication ? (
                <>
                  <MicrophoneIcon className="w-7" />
                  <Cog6ToothIcon className="absolute animate-bounce bottom-1 inline-end-1 pointer-events-none text-neutral-9 w-3" />
                </>
              ) : (
                <>
                  {microphonePublication.isMuted ? (
                    <MicrophoneIcon className="w-7" />
                  ) : (
                    <SolidMicrophoneIcon className="w-7" />
                  )}
                </>
              )}
              <span className="sr-only">
                {!microphonePublication ? 'Activate microphone' : microphonePublication.isMuted ? 'Unmute' : 'Mute'}
              </span>
            </Button>
          )}

          <Button
            onClick={async () => {
              await mutationRaiseHand.mutate({
                id_rally: rally?.id,
                new_is_hand_raised_value: isHandRaised ? false : true,
                user_previous_metadata: state.room.localParticipant?.metadata,
              })
            }}
            intent="neutral-ghost"
            scale="sm"
            className="aspect-square shrink-0"
          >
            {isHandRaised ? <SolidHandRaisedIcon className="w-7" /> : <HandRaisedIcon className="w-7" />}
          </Button>
          <div className="shrink-0 relative">
            <Listbox
              onChange={(value) => {
                mutationReaction.mutate({
                  id_rally: idRally as string,
                  reaction: value,
                  user_previous_metadata: state.room.localParticipant?.metadata,
                })
              }}
              horizontal
            >
              <Listbox.Button as={Button} intent="neutral-ghost" scale="sm" className="aspect-square">
                {<HeartIcon className="w-7" />}
              </Listbox.Button>
              <Listbox.Options className="flex -top-full left-1/2 -translate-y-3 -translate-x-1/2 text-xl flex-row absolute divide-i divide-neutral-7 max-w-72 w-fit-content overflow-x-auto rounded-full bg-neutral-5 focus:outline-none ">
                {['👋', '👍', '✌️', '❤️', '🔥', '💯', '✨', '🫡', '😂', '😭', '😠'].map((emote) => (
                  <Listbox.Option
                    className="flex-grow cursor-pointer hover:bg-neutral-7 focus:bg-white flex items-center justify-center py-1 px-4 aspect-square shrink-0"
                    key={emote}
                    value={emote}
                  >
                    {emote}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
        </div>
        <div className="col-span-1 grow-1 flex items-center justify-end">
          {rally?.creator !== address ? (
            <Button scale="sm" intent="negative-ghost" onClick={async () => await state.room.disconnect()}>
              <ArrowRightOnRectangleIcon className="w-5" />
              <span className="sr-only xs:not-sr-only xs:px-1ex">Leave quietly</span>
            </Button>
          ) : (
            <Button
              scale="sm"
              intent="negative-ghost"
              onClick={async () => {
                stateTxUiEndLiveRally.setDialogVisibility(true)
                await onClickEndLive(rally?.id)
              }}
            >
              <ArrowRightOnRectangleIcon className="w-6 xs:w-5" />
              <span className="sr-only xs:not-sr-only xs:px-1ex">End rally</span>
            </Button>
          )}
        </div>
      </div>
      <DialogEndLive stateTxUi={stateTxUiEndLiveRally} stateEndLiveAudioChat={stateEndLiveAudioChat} />
      {localUserPermissions?.canPublish && !localUserPermissions?.canPublishData && (
        <DialogModalSpeakerInvitation
          isDialogVisible={displaySpeakerInvitationModal}
          setDialogVisibility={setDisplaySpeakerInvitationModal}
        />
      )}
    </>
  )
}

export default ToolbarAudioRoom
