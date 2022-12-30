import getIndexedAudioChatREST from '@services/supabase/getIndexedAudioChatREST/getIndexedAudioChatREST'
import { useQuery } from '@tanstack/react-query'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { getUnixTime } from 'date-fns'

export function useIndexedAudioChatsRest(args: any, options: any) {
  const getIndexedAudioChatsResult = useQuery(
    ['search-audio-chats', args],
    async () => {
      try {
        const result = await getIndexedAudioChatREST(args)
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      select(data) {
        //@ts-ignore
        return data?.map((audioChat: any) => {
          //@ts-ignore
          const state = DICTIONARY_STATES_AUDIO_CHATS[audioChat?.state]
          return {
            ...audioChat,
            id: audioChat?.audio_chat_id,
            cid: audioChat?.cid_metadata,
            state,
            creator: audioChat?.creator,
            datetime_start_at: new Date(audioChat.start_at),
            datetime_created_at: new Date(audioChat.created_at),
            epoch_time_start_at: getUnixTime(new Date(audioChat.start_at)),
            epoch_time_created_at: getUnixTime(new Date(audioChat.created_at)),
          }
        })
      },
      ...options,
    },
  )

  return getIndexedAudioChatsResult
}

export default useIndexedAudioChatsRest
