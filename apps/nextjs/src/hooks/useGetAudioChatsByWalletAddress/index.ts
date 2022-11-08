import { useContractRead, useNetwork } from 'wagmi'
import { contractConfigAudioChat } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import getAudioChatMetadata from '@services/rally/audioChat/getAudioChatMetadata'
import toast from 'react-hot-toast'

export function useGetAudioChatsByWalletAddress(address?: string) {
  const { chain } = useNetwork()
  const queryAudioChatsByAddressRawData = useContractRead({
    ...contractConfigAudioChat,
    chainId: chain?.id,
    functionName: 'getAudioChatsByAdress', //@todo: update this
    enabled: address && chain?.unsupported === false ? true : false,
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
            queryKey: ['audio-chat-metadata', audioChat?.cid_metadata],
            queryFn: async () => await getAudioChatMetadata(audioChat),
            staleTime: 0,
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
