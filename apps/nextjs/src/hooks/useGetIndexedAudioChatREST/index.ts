import getIndexedAudioChatREST from '@services/supabase/getIndexedAudioChatREST/getIndexedAudioChatREST'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

export function useIndexedAudioChatsRest(args: any, options: any) {
  const getIndexedAudioChatsResult = useQuery(
    ['indexed-audio-chats', args],
    async () => {
      try {
        const result = await getIndexedAudioChatREST(args)
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      select(data) {
        console.log('Maybe', data)
        //@ts-ignore
        return data.map((audioChat: any) => {
          console.log('Maybe Maybe?', data)
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

export default useIndexedAudioChatsRest
