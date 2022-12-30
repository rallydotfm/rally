import { useContractWrite, useWaitForTransaction } from 'wagmi'
import toast from 'react-hot-toast'
import create from 'zustand'
import { audioChatABI } from '@rally/abi'
import { CONTRACT_AUDIO_CHATS } from '@config/contracts'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import queryClient from '@config/react-query'
import { utils } from 'ethers'
import { ROUTE_DASHBOARD_RALLIES } from '@config/routes'
import { useRouter } from 'next/router'
import { chainId } from '@config/wagmi'
import { useStoreCurrentLiveRally } from '@hooks/useVoiceChat'
import { trpc } from '@utils/trpc'
import useAudioChatChangeState from '@hooks/useAudioChatChangeState'

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
  const mutationChangeStateAudioChat = useAudioChatChangeState()

  const rally = useStoreCurrentLiveRally((currentLiveRallyState: any) => currentLiveRallyState.rally)
  const resetState = useStoreCurrentLiveRally((currentLiveRallyState: any) => currentLiveRallyState.resetState)
  const mutationEndRoom = trpc.room.end_room.useMutation({
    onSuccess() {
      resetState()
    },
  })

  const { push } = useRouter()
  // Query to create a new audio chat
  const contractWriteAudioChatEnd = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: CONTRACT_AUDIO_CHATS,
    abi: audioChatABI,
    functionName: 'changeState',
    chainId,
  })

  // Transaction receipt for `contractWriteAudioChatEnd` (change audiochat state query)
  const txAudioChatEnd = useWaitForTransaction({
    hash: contractWriteAudioChatEnd?.data?.hash,
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
        await mutationEndRoom.mutateAsync({
          id_rally: rally?.id ?? audio_event_id,
        })
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
        let newState = DICTIONARY_STATES_AUDIO_CHATS.FINISHED.label
        //@ts-ignore
        await mutationChangeStateAudioChat.mutateAsync({ chatId: audio_event_id, state: newState })

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
