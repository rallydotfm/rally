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

  if (canSubscribe && canPublishData && canPublish) return <span>Host</span>
  if (canSubscribe && canPublish && isMicrophoneEnabled) return <span>Speaker</span>
  if (canSubscribe) return <span>Listener</span>
  return null
}

export default LiveVoiceChatParticipantRole
