import { useEffect, useState } from 'react'
import {
  MicrophoneIcon,
  HandRaisedIcon as SolidHandRaisedIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/20/solid'
import { HandRaisedIcon } from '@heroicons/react/24/outline'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import Button from '@components/Button'
import { AudioRenderer, useParticipant } from '@livekit/react-core'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { useRouter } from 'next/router'
import { useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
import { IconLiveReaction } from '@components/Icons'
import { trpc } from '@utils/trpc'
import { useEndLiveAudioChat, useStoreTxUiEndLiveRally } from '@hooks/useEndLiveAudioChat'
import { Listbox } from '@headlessui/react'
import DialogEndLive from '@components/DialogEndLive'
import { useAccount } from 'wagmi'
import type { Participant } from 'livekit-client'

interface ToolbarAudioRoomProps {
  participant: Participant
}
export const ToolbarAudioRoom = () => {
  const { address } = useAccount()
  const state = useStoreLiveVoiceChat()
  const { microphonePublication, isSpeaking } = useParticipant(state?.room?.localParticipant)
  const {
    pathname,
    query: { idRally },
  } = useRouter()
  const rally = useStoreCurrentLiveRally((state) => state.rally)
  const mutationReaction = trpc.room.react.useMutation()
  const mutationRaiseHand = trpc.room.raise_hand.useMutation()
  const stateTxUiEndLiveRally = useStoreTxUiEndLiveRally()
  const { onClickEndLive, stateEndLiveAudioChat } = useEndLiveAudioChat(stateTxUiEndLiveRally)
  const [isHandRaised, setIsHandRaised] = useState(false)

  useEffect(() => {
    if (state?.room?.localParticipant?.metadata) {
      const userMetadata = JSON.parse(state.room.localParticipant.metadata ?? '')
      if (userMetadata?.is_hand_raised) {
        setIsHandRaised(userMetadata.is_hand_raised)
      }
    }
  }, [state?.room?.localParticipant?.metadata])

  return (
    <>
      {state.audioTracks.map((track) => {
        return (
          <>
            <AudioRenderer track={track} isLocal={false} />
          </>
        )
      })}

      <div className="w-full grid grid-cols-3 px-6">
        <div className="font-bold text-2xs">​​ {pathname !== ROUTE_RALLY_VIEW && <>{rally?.name}</>}</div>
        <div className="flex items-center justify-center space-i-4">
          {state.room.localParticipant.permissions.canPublish && (
            <Button
              onClick={async () => {
                if (!microphonePublication) {
                  await state.room.localParticipant.setMicrophoneEnabled(true)
                }
              }}
              intent="neutral-ghost"
              scale="sm"
              className={`ring-interactive-11 ${
                isSpeaking ? 'ring-4 ring-opacity-100' : 'ring-0 ring-opacity-0'
              } relative aspect-square relative`}
              title={!microphonePublication ? "Rally doesn't have access to your microphone" : ''}
            >
              {!microphonePublication ? (
                <>
                  <MicrophoneIcon className="w-7" />
                  <Cog6ToothIcon className="absolute animate-bounce bottom-0 inline-end-0 pointer-events-none text-neutral-9 w-4" />
                </>
              ) : (
                <>
                  <MicrophoneIcon className="w-7" />
                </>
              )}
            </Button>
          )}
          {!state.room.localParticipant.permissions.canPublish && (
            <Button
              onClick={() => {
                mutationRaiseHand.mutate({ id_rally: rally?.id, new_is_hand_raised_value: !isHandRaised })
              }}
              intent="neutral-ghost"
              scale="sm"
              className="aspect-square"
            >
              {isHandRaised ? <SolidHandRaisedIcon className="w-7" /> : <HandRaisedIcon className="w-7" />}
            </Button>
          )}
          <Listbox
            onChange={(value) => {
              mutationReaction.mutate({
                id_rally: idRally,
                reaction: value,
              })
            }}
            horizontal
          >
            <Listbox.Button as={Button} intent="neutral-ghost" scale="sm" className="aspect-square">
              {<IconLiveReaction className="text-2xl" />}
            </Listbox.Button>
            <Listbox.Options className="flex top-0 text-xl flex-row absolute -translate-y-3/4 divide-i divide-neutral-7 my-1 max-w-72 w-full overflow-x-auto rounded-md bg-neutral-5  focus:outline-none ">
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
        <div className="flex items-center justify-end">
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
              <ArrowRightOnRectangleIcon className="w-5" />
              <span className="sr-only xs:not-sr-only xs:px-1ex">End rally</span>
            </Button>
          )}
        </div>
      </div>
      <DialogEndLive stateTxUi={stateTxUiEndLiveRally} stateEndLiveAudioChat={stateEndLiveAudioChat} />
    </>
  )
}

export default ToolbarAudioRoom
