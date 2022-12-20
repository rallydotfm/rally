import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import getIndexedAudioChats from '@services/rally/subgraph/audioChats/getIndexedAudioChats'
import { useQuery } from '@tanstack/react-query'

/**
 * Get sorted and filtered audio chats that were indexed in the subgraph
 */
export function useIndexedAudioChats(args: any, options: any) {
  const getIndexedAudioChatsResult = useQuery(
    ['indexed-audio-chats', args],
    async () => {
      try {
        const result = await getIndexedAudioChats(args)
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      select(data) {
        return data?.audioChats?.map((audioChat: any) => {
          //@ts-ignore
          const state = DICTIONARY_STATES_AUDIO_CHATS[audioChat?.state]
          return {
            ...audioChat,
            id: audioChat?.id,
            cid: audioChat?.cid_metadata,
            state,
            creator: audioChat?.creator,
            datetime_start_at: new Date(parseInt(`${audioChat?.start_at}`) * 1000),
            datetime_created_at: new Date(parseInt(`${audioChat?.created_at}`) * 1000),
            epoch_time_start_at: parseInt(`${audioChat?.start_at}`) * 1000,
            epoch_time_created_at: parseInt(`${audioChat?.created_at}`) * 1000,
          }
        })
      },
      ...options,
    },
  )

  return getIndexedAudioChatsResult
}

export default useIndexedAudioChats
