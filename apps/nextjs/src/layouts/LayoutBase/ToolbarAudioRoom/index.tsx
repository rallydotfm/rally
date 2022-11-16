import { MicrophoneIcon, HandRaisedIcon, FaceFrownIcon, Cog6ToothIcon } from '@heroicons/react/20/solid'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import Button from '@components/Button'
import { AudioRenderer, useParticipant } from '@livekit/react-core'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { useRouter } from 'next/router'
import LiveVoiceChatParticipantRole from '@components/LiveVoiceChatParticipantRole'
import { useStoreCurrentLiveRally } from '@hooks/useVoiceChat'

export const ToolbarAudioRoom = (props) => {
  const { participant } = props
  const state = useStoreLiveVoiceChat()
  const { microphonePublication, isSpeaking } = useParticipant(participant)
  const { pathname } = useRouter()
  const rally = useStoreCurrentLiveRally((state) => state.rally)
  return (
    <>
      {state.audioTracks.map((track) => {
        return (
          <>
            <AudioRenderer track={track} isLocal={false} />
          </>
        )
      })}

      <div className="flex w-full items-center justify-between px-6">
        <div className="font-bold text-2xs text-interactive-11 bg-interactive-1 py-0.5 px-3 rounded-full">
          ​​{' '}
          {pathname === ROUTE_RALLY_VIEW ? (
            <>
              <LiveVoiceChatParticipantRole permissions={participant.permissions} />
            </>
          ) : (
            <>{rally?.name}</>
          )}
        </div>
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
          <Button intent="neutral-ghost" scale="sm" className="aspect-square">
            <HandRaisedIcon className="w-7" />
          </Button>
          <Button intent="neutral-ghost" scale="sm" className="aspect-square">
            <FaceFrownIcon className="w-7" />
          </Button>
        </div>
        <div>
          <Button scale="sm" intent="negative-ghost" onClick={() => state.room.disconnect()}>
            Leave quietly
          </Button>
        </div>
      </div>
    </>
  )
}

export default ToolbarAudioRoom
