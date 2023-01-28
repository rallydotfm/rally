import { useEffect, useState } from 'react'
import {
  MicrophoneIcon as SolidMicrophoneIcon,
  HandRaisedIcon as SolidHandRaisedIcon,
  ArrowRightOnRectangleIcon,
  UsersIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
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
import DialogManageLive from '@components/DialogManageLive'
import button from '@components/Button/styles'

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
  const [isDialogManageRallyOpen, setIsDialogManageRallyOpen] = useState(false)

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

      <div className={`w-full justify-evenly flex xs:grid xs:grid-cols-3 2xs:gap-4 xs:gap-8 px-3 md:px-6`}>
        <div
          className={`col-span-1 flex items-baseline ${
            localUserPermissions?.canPublishData ? 'max-w-[5ex]' : 'max-w-[8ex]'
          } xs:max-w-unset shrink-1 `}
        >
          ​​{' '}
          <mark className="text-[0.75rem] flex items-center mie-4 xs:mie-6 font-bold my-auto text-interactive-12 bg-interactive-3 px-1ex py-1 rounded">
            <UsersIcon className="mie-1ex w-3" />

            {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(state.participants.length)}
          </mark>
          {pathname !== ROUTE_RALLY_VIEW && (
            <Link
              className="flex font-bold justify-start items-baseline space-i-1 overflow-hidden text-ellipsis 2xs:space-i-2 xs:space-i-4 self-center text-2xs"
              href={ROUTE_RALLY_VIEW.replace('[idRally]', rally?.id)}
            >
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
              <span
                className={`whitespace-nowrap block overflow-hidden text-ellipsis ${
                  rally?.image ? 'xs:-translate-y-2.5' : ''
                }`}
              >
                {rally?.name}
              </span>
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
              className={`ring-interactive-11  ${
                isSpeaking ? 'ring-4 ring-opacity-100' : 'ring-0 ring-opacity-0'
              } relative aspect-square w-auto max-w-12 !p-2 shrink-0`}
              title={
                !microphonePublication ? 'Activate your microphone' : microphonePublication.isMuted ? 'Unmute' : 'Mute'
              }
            >
              {!microphonePublication ? (
                <>
                  <MicrophoneIcon className="w-7 pointer-events-none" />
                  <XMarkIcon className="absolute shadow w-[1.2rem] pointer-events-none bottom-1 inline-end-0 text-negative-9" />
                </>
              ) : (
                <>
                  {microphonePublication.isMuted ? (
                    <>
                      <MicrophoneIcon className="w-7 pointer-events-none" />
                      <XMarkIcon className="absolute shadow w-[1.2rem] pointer-events-none bottom-1 inline-end-0 text-negative-9" />
                    </>
                  ) : (
                    <SolidMicrophoneIcon className="w-7 pointer-events-none" />
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
            className="aspect-square w-auto max-w-12 !p-2 shrink-0"
          >
            {isHandRaised ? (
              <SolidHandRaisedIcon className="w-[1.35rem] pointer-events-none" />
            ) : (
              <HandRaisedIcon className="w-[1.35rem] pointer-events-none" />
            )}
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
              <Listbox.Button
                className={button({
                  intent: 'neutral-ghost',
                  class: 'aspect-square w-auto max-w-12 !p-2',
                  scale: 'sm',
                })}
              >
                {<HeartIcon className="w-[1.35rem] pointer-events-none" />}
              </Listbox.Button>
              <Listbox.Options>
                <div className="rotate-45 bg-neutral-5 inset-0 w-full h-full absolute -translate-y-[125%]" />
                <div className="max-h-64 border-neutral-7 bg-neutral-5 absolute w-64 rounded-md overflow-y-auto top-0 left-1/2 -translate-y-[105%] -translate-x-1/2 ">
                  <div className="text-2xs text-center pt-3 pb-2 font-bold">Send a reaction</div>
                  <div className="p-1 border-t border-neutral-3 grid grid-cols-5 text-xl">
                    {['👋', '👍', '✌️', '❤️', '🔥', '💯', '✨', '🫡', '😂', '😭', '😠'].map((emote) => (
                      <Listbox.Option
                        className="col-span-1 cursor-pointer rounded-full hover:bg-neutral-7 focus:bg-white flex items-center justify-center aspect-square"
                        key={emote}
                        value={emote}
                      >
                        {emote}
                      </Listbox.Option>
                    ))}
                  </div>
                </div>
              </Listbox.Options>
            </Listbox>
          </div>
        </div>
        <div className="col-span-1 grow-1 flex items-center relative z-10 justify-end">
          {rally?.creator !== address ? (
            <Button
              scale="sm"
              className="aspect-square w-auto max-w-12 xs:max-w-unset xs:w-unset xs:aspect-auto !p-2 xs:!px-[3ex]"
              intent="negative-ghost"
              onClick={async () => await state.room.disconnect()}
            >
              <ArrowRightOnRectangleIcon className="w-5" />
              <span className="sr-only xs:not-sr-only xs:px-1ex">Leave quietly</span>
            </Button>
          ) : (
            <Button
              className="aspect-square w-auto max-w-12 xs:max-w-unset xs:w-unset xs:aspect-auto !p-2 xs:!px-[3ex]"
              scale="sm"
              intent="neutral-ghost"
              onClick={() => setIsDialogManageRallyOpen(true)}
            >
              <span className="sr-only xs:not-sr-only">Manage live</span>
              <EllipsisHorizontalIcon className="w-5 xs:hidden" />
            </Button>
          )}
        </div>
      </div>
      <DialogManageLive
        onClickEndRally={async () => {
          setIsDialogManageRallyOpen(false)
          stateTxUiEndLiveRally.setDialogVisibility(true)
          await onClickEndLive(rally?.id)
        }}
        rally={rally}
        participants={state.participants}
        canRecord={localUserPermissions?.canRecord}
        isOpen={isDialogManageRallyOpen}
        setIsOpen={setIsDialogManageRallyOpen}
      />
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
