import { useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import create from 'zustand'
import { audioChatABI } from '@rally/abi'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'

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
  const { chain } = useNetwork()
  // Query to create a new audio chat
  const contractWriteAudioChatGoLive = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'changeState',
    chainId: chain?.id,
  })

  // Transaction receipt for `contractWriteAudioChatGoLive` (change audiochat state query)
  const txAudioChatGoLive = useWaitForTransaction({
    hash: contractWriteAudioChatGoLive?.data?.hash,
    chainId: chain?.id,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
    async onSuccess() {
      try {
        stateTxUiRallyGoLive.resetState()
        toast.success('Your rally is live !')
      } catch (e) {
        console.error(e)
      }
    },
  })

  async function onClickGoLive(id: string) {
    console.log(DICTIONARY_STATES_AUDIO_CHATS.LIVE.value, id)
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
