import { useContractRead, useNetwork } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import { STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

export function useGetAudioChatByState(state: readonly number[]) {
  const { chain } = useNetwork()
  const queryAudioChatsByStateRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId: chain?.id,
    functionName: 'getAudioChatsByState',
    enabled: chain?.unsupported === false ? true : false,
    args: [[state]],
    onError(e) {
      console.error(e)
    },
  })
  const queriesAudioChatsByStateMetadata = useQueries({
    //@ts-ignore
    enabled: queryAudioChatsByStateRawData?.data?.length > 0 ?? false,
    onSuccess(data) {
      console.log(data)
    },
    queries: queryAudioChatsByStateRawData?.data?.length
      ? queryAudioChatsByStateRawData?.data?.map((audioChat) => {
          return {
            queryKey: ['audio-chat-metadata', audioChat?.cid_metadata],
            queryFn: async () => {
              const cid = audioChat?.cid_metadata
              try {
                const response = await fetch(`https://${cid}.ipfs.w3s.link/data.json`)
                const result = await response.json()
                return {
                  id: audioChat.audioEventId,
                  cid: audioChat.cid_metadata,
                  //@ts-ignore
                  state: STATES_AUDIO_CHATS[audioChat?.state],
                  creator: audioChat.creator,
                  epoch_time_start_at: parseInt(`${audioChat.eventTimestamp}`) * 1000,
                  epoch_time_created_at: parseInt(`${audioChat.createdAt}`) * 1000,
                  datetime_start_at: new Date(parseInt(`${audioChat.eventTimestamp}`) * 1000),
                  datetime_created_at: new Date(parseInt(`${audioChat.createdAt}`) * 1000),
                  ...result,
                }
              } catch (e) {
                console.error(e)
              }
            },
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
