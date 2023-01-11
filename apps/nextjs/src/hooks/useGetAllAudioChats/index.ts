import { contractConfigAudioChat } from '@config/contracts'
import { chainId } from '@config/wagmi'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { useContractRead } from 'wagmi'
import { useQueries } from '@tanstack/react-query'

export function useGetAllAudioChats(options?: any) {
  const queryGetAudioChatsRawMetadata = useContractRead({
    ...contractConfigAudioChat,
    chainId,
    functionName: 'getAllAudioChats',
    enabled: true,
    onError(e) {
      console.error(e)
    },
  })
  const queriesAudioChatsMetadata = useQueries({
    //@ts-ignore
    enabled: queryGetAudioChatsRawMetadata?.data?.length ?? false,
    //@ts-ignore
    queries:
      //@ts-ignore
      queryGetAudioChatsRawMetadata?.data?.length > 0
        ? //@ts-ignore
          queryGetAudioChatsRawMetadata?.data?.map((audioChat: any) => {
            return {
              ...options,
              queryKey: ['audio-chat-metadata', audioChat?.audio_event_id],
              queryFn: async () => {
                const cid = audioChat?.cid_metadata
                try {
                  const response = await fetch(`https://ipfs.io/ipfs/${cid}`)
                  const result = await response.json()

                  const rally = {
                    id: audioChat.audio_event_id,
                    cid: audioChat.cid_metadata,
                    //@ts-ignore
                    state: DICTIONARY_STATES_AUDIO_CHATS[audioChat?.state],
                    creator: audioChat.creator,
                    epoch_time_start_at: parseInt(`${audioChat.start_at}`) * 1000,
                    epoch_time_created_at: parseInt(`${audioChat.created_at}`) * 1000,
                    datetime_start_at: new Date(parseInt(`${audioChat.start_at}`) * 1000),
                    datetime_created_at: new Date(parseInt(`${audioChat.created_at}`) * 1000),
                    ...result,
                  }

                  return rally
                } catch (e) {
                  console.error(e)
                }
              },
            }
          })
        : [],
  })

  return {
    queryGetAudioChatsRawMetadata,
    queriesAudioChatsMetadata,
  }
}

export default useGetAllAudioChats
