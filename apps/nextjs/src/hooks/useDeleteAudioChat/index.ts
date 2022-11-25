import { useContractWrite, useNetwork, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import create from 'zustand'
import { audioChatABI } from '@rally/abi'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { chainId } from '@config/wagmi'

export interface TxUiDeleteRally {
  isDialogVisible: boolean
  rallyId: string | undefined
  setDialogVisibility: (visibility: boolean) => void
  selectRallyToDelete: (id: string) => void
  resetState: () => void
}

export const useStoreTxUiDeleteRally = create<TxUiDeleteRally>((set) => ({
  selectRallyToDelete: (id: string) =>
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

export function useDeleteAudioChat(stateTxUiDeleteRally: TxUiDeleteRally, refetch: any) {
  // Query to delete an audio chat
  const contractWriteDeleteAudioChat = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'deleteAudioChat',
    chainId,
  })

  // Transaction receipt for `contractWriteDeleteAudioChat` (delete audiochat)
  const txDeleteAudioChat = useWaitForTransaction({
    hash: contractWriteDeleteAudioChat?.data?.hash,
    chainId,
    onError(e) {
      console.error(e)
      toast.error(e?.message)
    },
    async onSuccess() {
      try {
        await refetch()

        stateTxUiDeleteRally.resetState()
        toast.success('Your rally was deleted successfully !')
      } catch (e) {
        console.error(e)
      }
    },
  })

  async function onClickDeleteAudioChat() {
    try {
      await contractWriteDeleteAudioChat?.writeAsync?.({
        //@ts-ignore
        recklesslySetUnpreparedArgs: [stateTxUiDeleteRally.rallyId],
      })
    } catch (e) {
      console.error(e)
    }
  }
  return {
    onClickDeleteAudioChat,
    stateDeleteAudioChat: {
      contract: contractWriteDeleteAudioChat,
      transaction: txDeleteAudioChat,
    },
  }
}

export default useDeleteAudioChat
