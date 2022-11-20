import LiveVoiceChatParticipant from '@components/pages/rally/[idRally]/LiveVoiceChatParticipant'
import { useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
import type { Participant } from 'livekit-client'

interface ListParticipantsVoiceChatProps {
  participants: Array<Participant>
}

export const ListParticipantsVoiceChat = (props: ListParticipantsVoiceChatProps) => {
  const { participants } = props
  //@ts-ignore
  const rally = useStoreCurrentLiveRally((state) => state.rally)

  return (
    <ul className="flex flex-wrap gap-4 justify-center">
      {participants.map((participant: Participant) => {
        return (
          <li className="animate-appear relative focus-within:z-10" key={`${participant?.sid}-${rally?.id}`}>
            <LiveVoiceChatParticipant participant={participant} />
          </li>
        )
      })}
    </ul>
  )
}

export default ListParticipantsVoiceChat
