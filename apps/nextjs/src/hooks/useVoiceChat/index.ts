import { trpc } from '@utils/trpc'
import { createContext, useContext } from 'react'
import create from 'zustand'

export const ContextLiveVoiceChat = createContext(undefined)

export function useStoreLiveVoiceChat() {
  return useContext(ContextLiveVoiceChat)
}

export const useStoreCurrentLiveRally = create((set) => ({
  rally: undefined,
  setLiveRally: (rally: any) => set(() => ({ rally })),
}))

export function useConnectToVoiceChat(rally) {
  const state = useStoreLiveVoiceChat()
  const setLiveRally = useStoreCurrentLiveRally((state) => state.setLiveRally)
  const mutationJoinRoom = trpc.credentials.getRoomCredential.useMutation({
    async onSuccess(data) {
      try {
        this.roomService = data?.token
        await state.connect(`wss://${process.env.NEXT_PUBLIC_LIVEKIT_URL}`, data?.token)
        setLiveRally(rally)
      } catch (e) {
        setLiveRally(undefined)
      }
    },
  })
  return {
    mutationJoinRoom,
  }
}
