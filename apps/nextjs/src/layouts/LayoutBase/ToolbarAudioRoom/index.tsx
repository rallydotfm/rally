import {
  MicrophoneIcon,
  HandRaisedIcon,
  FaceFrownIcon,
  ExclamationTriangleIcon,
  AdjustmentsVerticalIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/20/solid'
import Button from '@components/Button'
import { AudioRenderer, useParticipant } from '@livekit/react-core'
import { Provider as ProviderAudioRoom, useStore as useStoreAudioRoom } from '@hooks/useLiveAudioRoom'

export const ToolbarAudioRoom = (props) => {
  const { participant } = props
  const state = useStoreAudioRoom()
  const { microphonePublication, isSpeaking } = useParticipant(participant)
  return (
    <>
      {state.audioTracks.map((t) => {
        return (
          <>
            <AudioRenderer track={t} isLocal={false} />
          </>
        )
      })}

      <div className="flex items-center justify-between px-6">
        <div></div>
        <div className="flex items-center justify-center space-i-4">
          {state.room.localParticipant.permissions.canPublish && (
            <Button
              onClick={async () => {
                if (!microphonePublication) await state.room.localParticipant.setMicrophoneEnabled(true)
              }}
              intent="neutral-ghost"
              scale="sm"
              className={`relative aspect-square`}
              title={!microphonePublication ? "Rally doesn't have access to your microphone" : ''}
            >
              {!microphonePublication ? (
                <>
                  <MicrophoneIcon className="w-7" />
                  <AdjustmentsVerticalIcon className="absolute bottom-0 inline-end-0 pointer-events-none text-neutral-9 w-4" />
                </>
              ) : (
                <>{isSpeaking ? <SpeakerWaveIcon className="w-7" /> : <SpeakerXMarkIcon className="w-7" />}</>
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
          <Button scale="sm" intent="negative-ghost" onClick={() => setJoined(false)}>
            Leave quietly
          </Button>
        </div>
      </div>
    </>
  )
}

export default ToolbarAudioRoom
