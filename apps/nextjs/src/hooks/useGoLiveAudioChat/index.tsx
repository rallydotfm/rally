import { useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import create from 'zustand'
import { audioChatABI } from '@rally/abi'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import queryClient from '@config/react-query'
import { utils } from 'ethers'
import { ROUTE_RALLY_VIEW } from '@config/routes'
import { useRouter } from 'next/router'
import { chainId } from '@config/wagmi'

export interface TxUiGoLiveRally {
  isDialogVisible: boolean
  setDialogVisibility: (visibility: boolean) => void
  resetState: () => void
}

export const useStoreTxUiGoLiveRally = create<TxUiGoLiveRally>((set) => ({
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

export function useGoLiveAudioChat(stateTxUiRallyGoLive: TxUiGoLiveRally) {
  const { push } = useRouter()
  // Query to create a new audio chat
  const contractWriteAudioChatGoLive = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'changeState',
    chainId,
  })

  // Transaction receipt for `contractWriteAudioChatGoLive` (change audiochat state query)
  const txAudioChatGoLive = useWaitForTransaction({
    hash: contractWriteAudioChatGoLive?.data?.hash,
    chainId,
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
          state: DICTIONARY_STATES_AUDIO_CHATS.LIVE.label,
        }))

        stateTxUiRallyGoLive.resetState()
        toast.success('Your rally is live !')
        push(ROUTE_RALLY_VIEW.replace('[idRally]', audio_event_id))
      } catch (e) {
        console.error(e)
      }
    },
  })

  async function onClickGoLive(id: string) {
    try {
      await contractWriteAudioChatGoLive?.writeAsync?.({
        //@ts-ignore
        recklesslySetUnpreparedArgs: [DICTIONARY_STATES_AUDIO_CHATS.LIVE.value, id],
      })
    } catch (e) {
      console.error(e)
    }
  }
  return {
    onClickGoLive,
    stateGoLive: {
      contract: contractWriteAudioChatGoLive,
      transaction: txAudioChatGoLive,
    },
  }
}

export default useGoLiveAudioChat
