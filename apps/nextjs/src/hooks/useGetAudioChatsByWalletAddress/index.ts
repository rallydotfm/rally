import { useContractRead, useNetwork } from 'wagmi'
import { audioChatABI } from '@rally/abi'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { useQueries } from '@tanstack/react-query'
import { STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

const contractConfig = {
  address: CONTRACT_AUDIO_CHATS,
  abi: audioChatABI,
}
export function useGetAudioChatsByWalletAddress(address?: string) {
  const { chain } = useNetwork()
  const queryAudioChatsByAddressRawData = useContractRead({
    ...contractConfig,
    chainId: chain?.id,
    functionName: 'getAudioChatsByAdress', //@todo: update this
    enabled: address && chain?.unsupported === false ? true : false,
    args: [address as `0x${string}`],
    onError() {
      console.error('ee')
    },
  })
  const queriesAudioChatsByAddressMetadata = useQueries({
    enabled: queryAudioChatsByAddressRawData?.data?.length > 0 ?? false,
    queries: queryAudioChatsByAddressRawData?.data?.length
      ? queryAudioChatsByAddressRawData?.data?.map((audioChat) => {
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
                  state: STATES_AUDIO_CHATS[audioChat.state],
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
    queryAudioChatsByAddressRawData,
    queriesAudioChatsByAddressMetadata,
  }
}

export default useGetAudioChatsByWalletAddress
