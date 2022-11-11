import { useContractRead, useNetwork } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQuery } from '@tanstack/react-query'
import getAudioChatMetadata from '@services/rally/audioChat/getAudioChatMetadata'
import toast from 'react-hot-toast'

export function useGetAudioChatById(idAudioChat?: `0x${string}`) {
  const { chain } = useNetwork()
  const queryAudioChatByIdRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId: chain?.id,
    functionName: 'getAudioChatById',
    enabled: idAudioChat?.length && chain?.unsupported === false ? true : false,
    args: [idAudioChat as `0x${string}`],
    cacheOnBlock: true,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
  })
  const queryAudioChatMetadata = useQuery(
    ['audio-chat-metadata', queryAudioChatByIdRawData?.data?.audio_event_id],
    async () => {
      const audioChat = queryAudioChatByIdRawData?.data
      //@ts-ignore
      const metadata = await getAudioChatMetadata(audioChat)
      return metadata
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
