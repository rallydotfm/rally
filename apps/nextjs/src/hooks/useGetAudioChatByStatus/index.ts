import { useContractRead, useNetwork } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import getAudioChatMetadata from '@services/rally/audioChat/getAudioChatMetadata'
import toast from 'react-hot-toast'

export function useGetAudioChatByState(states: Array<number>) {
  const { chain } = useNetwork()
  const queryAudioChatsByStateRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId: chain?.id,
    functionName: 'getAudioChatsByState',
    enabled: chain?.unsupported === false ? true : false,
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
    queries: queryAudioChatsByStateRawData?.data?.length
      ? queryAudioChatsByStateRawData?.data?.map((audioChat: any) => {
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
