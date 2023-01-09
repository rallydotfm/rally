import { useContractRead } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import getAudioChatMetadata from '@services/rally/ipfs/audioChat/getAudioChatMetadata'
import toast from 'react-hot-toast'
import { chainId } from '@config/wagmi'

export function useGetPublishedRecordingsByWalletAddress(address?: string) {
  const queryRecordingsByAddressRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId,
    functionName: 'getAllRecordingsByWalletAddress',
    enabled: address ? true : false,
    args: [address as `0x${string}`],
    cacheOnBlock: true,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
  })

  console.log(queryRecordingsByAddressRawData.data)
  const queriesAudioChatsByAddressMetadata = useQueries({
    //@ts-ignore
    enabled: queryRecordingsByAddressRawData?.data?.length > 0 ?? false,
    //@ts-ignore
    queries: queryRecordingsByAddressRawData?.data?.length
      ? //@ts-ignore
        queryRecordingsByAddressRawData?.data?.map((audioChat) => {
          return {
            queryKey: ['audio-chat-metadata', audioChat?.audio_event_id],
            queryFn: async () => await getAudioChatMetadata(audioChat),
          }
        })
      : [],
  })

  return {
    queryRecordingsByAddressRawData,
    queriesAudioChatsByAddressMetadata,
  }
}

export default useGetPublishedRecordingsByWalletAddress
