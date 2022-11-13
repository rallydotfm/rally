import { useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import create from 'zustand'
import { audioChatABI } from '@rally/abi'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import queryClient from '@config/react-query'
import { utils } from 'ethers'
import { ROUTE_DASHBOARD_RALLIES } from '@config/routes'
import { useRouter } from 'next/router'

export interface TxUiEndLiveRally {
  isDialogVisible: boolean
  setDialogVisibility: (visibility: boolean) => void
  resetState: () => void
}

export const useStoreTxUiEndLiveRally = create<TxUiEndLiveRally>((set) => ({
  setDialogVisibility: (visibility: boolean) =>
    set(() => ({
      isDialogVisible: visibility,
    })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
    })),
  isDialogVisible: false,
}))

export function useEndLiveAudioChat(stateTxUiEndLiveRally: TxUiEndLiveRally) {
  const { chain } = useNetwork()
  const { push } = useRouter()
  // Query to create a new audio chat
  const contractWriteAudioChatEnd = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'changeState',
    chainId: chain?.id,
  })

  // Transaction receipt for `contractWriteAudioChatEnd` (change audiochat state query)
  const txAudioChatEnd = useWaitForTransaction({
    hash: contractWriteAudioChatEnd?.data?.hash,
    chainId: chain?.id,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
    async onSuccess(data) {
      try {
        const iface = new utils.Interface(audioChatABI)
        const log = data.logs
        //@ts-ignore
        const { audio_event_id } = iface.parseLog(log[0]).args

        await queryClient.invalidateQueries({
          queryKey: ['audio-chat-metadata', audio_event_id],
          type: 'active',
          exact: true,
        })
        queryClient.setQueryData(['audio-chat-metadata', audio_event_id], (rallyData) => ({
          //@ts-ignore
          ...rallyData,
          state: DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label,
        }))

        stateTxUiEndLiveRally.resetState()
        toast.success('Your rally ended successfully !')
        push(ROUTE_DASHBOARD_RALLIES)
      } catch (e) {
        console.error(e)
      }
    },
  })

  async function onClickEndLive(id: string) {
    try {
      await contractWriteAudioChatEnd?.writeAsync?.({
        //@ts-ignore
        recklesslySetUnpreparedArgs: [DICTIONARY_STATES_AUDIO_CHATS.FINISHED.value, id],
      })
    } catch (e) {
      console.error(e)
    }
  }
  return {
    onClickEndLive,
    stateEndLiveAudioChat: {
      contract: contractWriteAudioChatEnd,
      transaction: txAudioChatEnd,
    },
  }
}

export default useEndLiveAudioChat
