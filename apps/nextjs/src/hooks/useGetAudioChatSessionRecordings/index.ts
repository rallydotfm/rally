import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { trpc } from '@utils/trpc'

export function useGetAudioChatSessionRecording(data: { id: string; will_be_recorded: boolean; state: string }) {
  const { id, will_be_recorded } = data
  //@ts-ignore
  const querySessionRecordings = trpc.recordings.rally_available_recordings.useQuery(
    {
      id_rally: id,
    },
    {
      enabled:
        will_be_recorded === true &&
        [
          DICTIONARY_STATES_AUDIO_CHATS.LIVE.label,
          DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label,
          //@ts-ignore
        ].includes(data.state),
    },
  )
  return querySessionRecordings
}

export default useGetAudioChatSessionRecording
