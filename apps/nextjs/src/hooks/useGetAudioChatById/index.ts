import { useContractRead } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQuery } from '@tanstack/react-query'
import getAudioChatMetadata from '@services/rally/ipfs/audioChat/getAudioChatMetadata'
import toast from 'react-hot-toast'
import { chainId } from '@config/wagmi'

export function useGetAudioChatById(idAudioChat?: `0x${string}`) {
  const queryAudioChatByIdRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId,
    functionName: 'getAudioChatById',
    enabled: idAudioChat?.length ? true : false,
    args: [idAudioChat as `0x${string}`],
    cacheOnBlock: true,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
  })
  const queryAudioChatMetadata = useQuery(
    //@ts-ignore
    ['audio-chat-metadata', queryAudioChatByIdRawData?.data?.audio_event_id],
    async () => {
      const audioChat = queryAudioChatByIdRawData?.data
      //@ts-ignore
      const metadata = await getAudioChatMetadata(audioChat)
      return metadata
    },
    {
      refetchOnWindowFocus: false,
      enabled:
        queryAudioChatByIdRawData.status === 'success' &&
        //@ts-ignore
        queryAudioChatByIdRawData?.data?.audio_event_id !==
          '0x0000000000000000000000000000000000000000000000000000000000000000'
          ? true
          : false,
    },
  )

  return {
    queryAudioChatByIdRawData,
    queryAudioChatMetadata,
  }
}

export default useGetAudioChatById
