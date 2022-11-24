import type { Participant } from 'livekit-client'

interface LiveVoiceChatParticipantRoleProps {
  participant: Participant
}

export const LiveVoiceChatParticipantRole = (props: LiveVoiceChatParticipantRoleProps) => {
  const { participant } = props
  const {
    isMicrophoneEnabled,
    //@ts-ignore
    permissions: { canSubscribe, canPublishData, canPublish },
  } = participant

  if (canSubscribe && canPublishData && canPublish)
    return (
      <>
        Host{' '}
        {!isMicrophoneEnabled && (
          <span className="font-bold animate-pulse text-[0.75em] text-interactive-12">(mic disabled)</span>
        )}
      </>
    )
  if (canSubscribe && canPublish)
    return (
      <>
        Speaker{' '}
        {!isMicrophoneEnabled && (
          <span className="font-bold animate-pulse text-[0.75em] text-interactive-12">(mic disabled)</span>
        )}
      </>
    )
  if (canSubscribe) return <>Listener</>
  return null
}

export default LiveVoiceChatParticipantRole
