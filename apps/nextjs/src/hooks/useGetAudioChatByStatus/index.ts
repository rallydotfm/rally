import { useContractRead } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import getAudioChatMetadata from '@services/rally/ipfs/audioChat/getAudioChatMetadata'
import toast from 'react-hot-toast'
import { chainId } from '@config/wagmi'

export function useGetAudioChatByState(states: Array<number>) {
  const queryAudioChatsByStateRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId,
    functionName: 'getAudioChatsByState',
    enabled: true,
    args: [states],
    cacheOnBlock: true,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
  })
  const queriesAudioChatsByStateMetadata = useQueries({
    //@ts-ignore
    enabled: queryAudioChatsByStateRawData?.data?.length > 0 ?? false,
    //@ts-ignore
    queries: queryAudioChatsByStateRawData?.data?.length
      ? //@ts-ignore
        queryAudioChatsByStateRawData?.data?.map((audioChat: any) => {
          return {
            queryKey: ['audio-chat-metadata', audioChat?.audio_event_id],
            queryFn: async () => await getAudioChatMetadata(audioChat),
            staleTime: 0,
          }
        })
      : [],
  })

  return {
    queriesAudioChatsByStateMetadata,
    queryAudioChatsByStateRawData,
  }
}

export default useGetAudioChatByState
