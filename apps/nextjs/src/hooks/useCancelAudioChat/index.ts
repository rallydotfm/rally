import { useContractWrite, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import create from 'zustand'
import { audioChatABI } from '@rally/abi'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { useQueryClient } from '@tanstack/react-query'
import { chainId } from '@config/wagmi'
import useAudioChatChangeState from '@hooks/useAudioChatChangeState'

export interface TxUiCancelRally {
  isDialogVisible: boolean
  rallyId: string | undefined
  setDialogVisibility: (visibility: boolean) => void
  selectRallyToCancel: (id: string) => void
  resetState: () => void
}

export const useStoreTxUiCancelRally = create<TxUiCancelRally>((set) => ({
  selectRallyToCancel: (id: string) =>
    set(() => ({
      rallyId: id,
      isDialogVisible: true,
    })),
  setDialogVisibility: (visibility: boolean) =>
    set(() => ({
      isDialogVisible: visibility,
    })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
      rallyId: undefined,
    })),
  isDialogVisible: false,
  rallyId: undefined,
}))

export function useCancelAudioChat(stateTxUiCancelRally: TxUiCancelRally) {
  const queryClient = useQueryClient()
  const mutationChangeStateAudioChat = useAudioChatChangeState()

  // Query to create a new audio chat
  const contractWriteCancelAudioChat = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'changeState',
    chainId,
  })

  // Transaction receipt for `contractWriteCancelAudioChat` (change audiochat state query)
  const txCancelAudioChat = useWaitForTransaction({
    hash: contractWriteCancelAudioChat?.data?.hash,
    chainId,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
    async onSuccess() {
      try {
        await queryClient.invalidateQueries({
          queryKey: ['audio-chat-metadata', stateTxUiCancelRally.rallyId],
          type: 'active',
          exact: true,
        })
        queryClient.setQueryData(['audio-chat-metadata', stateTxUiCancelRally.rallyId], (rallyData) => ({
          //@ts-ignore
          ...rallyData,
          state: DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label,
        }))
        stateTxUiCancelRally.resetState()
        let newState = DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.label
        //@ts-ignore
        await mutationChangeStateAudioChat.mutateAsync({ chatId: stateTxUiCancelRally.rallyId, state: newState })

        toast.success('Your rally was cancelled successfully !')
      } catch (e) {
        console.error(e)
      }
    },
  })

  async function onClickCancelAudioChat() {
    try {
      await contractWriteCancelAudioChat?.writeAsync?.({
        //@ts-ignore
        recklesslySetUnpreparedArgs: [DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.value, stateTxUiCancelRally.rallyId],
      })
    } catch (e) {
      console.error(e)
    }
  }
  return {
    onClickCancelAudioChat,
    stateCancelAudioChat: {
      contract: contractWriteCancelAudioChat,
      transaction: txCancelAudioChat,
    },
  }
}

export default useCancelAudioChat
