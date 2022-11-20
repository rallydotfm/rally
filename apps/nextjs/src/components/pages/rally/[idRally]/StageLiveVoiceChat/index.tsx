import ListParticipantsVoiceChat from '@components/pages/rally/[idRally]/ListParticipantsVoiceChat'
import DialogModalDisplayParticipant, {
  useStoreDisplayParticipant,
} from '@components/pages/rally/[idRally]/DialogModalDisplayParticipant'
import type { Participant } from 'livekit-client'

interface StageLiveVoiceChatProps {
  roomState: string
  participants: Array<Participant>
  isCurrentRally: boolean
}

export const StageLiveVoiceChat = (props: StageLiveVoiceChatProps) => {
  const { roomState, participants, isCurrentRally } = props
  const pickedParticipant = useStoreDisplayParticipant((state) => state.participant)

  return (
    <>
      {roomState === 'connecting' && <p className="font-bold animate-pulse">Connecting, one moment...</p>}
      {roomState === 'connected' && isCurrentRally && (
        <>
          <div>
            <ListParticipantsVoiceChat
              participants={participants?.filter((participant: Participant) => {
                if (
                  participant?.permissions?.canSubscribe &&
                  participant?.permissions?.canPublishData &&
                  participant?.permissions?.canPublish
                )
                  return participant
              })}
            />
          </div>
          <div>
            <ListParticipantsVoiceChat
              participants={participants?.filter((participant: Participant) => {
                if (
                  participant?.permissions?.canSubscribe &&
                  !participant?.permissions?.canPublishData &&
                  participant?.permissions?.canPublish
                )
                  return participant
              })}
            />
          </div>
          <div>
            <ListParticipantsVoiceChat
              participants={participants?.filter((participant: Participant) => {
                if (participant?.permissions?.canSubscribe && !participant?.permissions?.canPublish) return participant
              })}
            />
          </div>
        </>
      )}
      {pickedParticipant && <DialogModalDisplayParticipant />}
    </>
  )
}

export default StageLiveVoiceChat
