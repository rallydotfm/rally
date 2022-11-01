import { useContractRead, useNetwork } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQuery } from '@tanstack/react-query'
import { STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

export function useGetAudioChatById(idAudioChat?: `0x${string}`) {
  const { chain } = useNetwork()
  const queryAudioChatByIdRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId: chain?.id,
    functionName: 'getAudioChatById',
    enabled: idAudioChat && chain?.unsupported === false ? true : false,
    args: [idAudioChat as `0x${string}`],
    onError(e) {
      console.error(e)
    },
  })
  const queryAudioChatMetadata = useQuery(
    ['audio-chat-metadata', queryAudioChatByIdRawData?.data?.cid_metadata],
    async () => {
      const cid = queryAudioChatByIdRawData?.data?.cid_metadata
      try {
        const response = await fetch(`https://${cid}.ipfs.w3s.link/data.json`)
        const result = await response.json()
        return {
          id: queryAudioChatByIdRawData?.data?.audioEventId,
          cid: queryAudioChatByIdRawData?.data?.cid_metadata,
          //@ts-ignore
          state: STATES_AUDIO_CHATS[queryAudioChatByIdRawData?.data?.state],
          creator: queryAudioChatByIdRawData?.data?.creator,
          datetime_start_at: new Date(parseInt(`${queryAudioChatByIdRawData?.data?.eventTimestamp}`) * 1000),
          datetime_created_at: new Date(parseInt(`${queryAudioChatByIdRawData?.data?.createdAt}`) * 1000),
          epoch_time_start_at: parseInt(`${queryAudioChatByIdRawData?.data?.eventTimestamp}`) * 1000,
          epoch_time_created_at: parseInt(`${queryAudioChatByIdRawData?.data?.createdAt}`) * 1000,
          ...result,
        }
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled:
        queryAudioChatByIdRawData.status === 'success' && queryAudioChatByIdRawData?.data?.cid_metadata ? true : false,
    },
  )

  return {
    queryAudioChatByIdRawData,
    queryAudioChatMetadata,
  }
}

export default useGetAudioChatById
