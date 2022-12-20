import { useContractRead } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import getAudioChatMetadata from '@services/rally/ipfs/audioChat/getAudioChatMetadata'
import toast from 'react-hot-toast'
import { chainId } from '@config/wagmi'

export function useGetAudioChatsByWalletAddress(address?: string) {
  const queryAudioChatsByAddressRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId,
    functionName: 'getAudioChatsByAddress',
    enabled: address ? true : false,
    args: [address as `0x${string}`],
    cacheOnBlock: true,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
  })

  const queriesAudioChatsByAddressMetadata = useQueries({
    //@ts-ignore
    enabled: queryAudioChatsByAddressRawData?.data?.length > 0 ?? false,
    queries: queryAudioChatsByAddressRawData?.data?.length
      ? queryAudioChatsByAddressRawData?.data?.map((audioChat) => {
          return {
            queryKey: ['audio-chat-metadata', audioChat?.audio_event_id],
            queryFn: async () => await getAudioChatMetadata(audioChat),
          }
        })
      : [],
  })

  return {
    queryAudioChatsByAddressRawData,
    queriesAudioChatsByAddressMetadata,
  }
}

export default useGetAudioChatsByWalletAddress
