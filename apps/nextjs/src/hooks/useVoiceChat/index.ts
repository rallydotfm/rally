import { trpc } from '@utils/trpc'
import { createContext, useContext } from 'react'
import create from 'zustand'

export const ContextLiveVoiceChat = createContext(undefined)

export function useStoreLiveVoiceChat() {
  return useContext(ContextLiveVoiceChat)
}

export const useStoreCurrentLiveRally = create((set) => ({
  rally: undefined,
  localUserPermissions: undefined,
  displaySpeakerInvitationModal: false,
  setLocalUserPermissions: (newPermissions: any) => set(() => ({ localUserPermissions: newPermissions })),
  setDisplaySpeakerInvitationModal: (shouldBeDisplayed: boolean) =>
    set(() => ({ displaySpeakerInvitationModal: shouldBeDisplayed })),
  setLiveRally: (rally: any) => set(() => ({ rally })),
}))

//@ts-ignore
export function useConnectToVoiceChat(rally) {
  const state = useStoreLiveVoiceChat()
  //@ts-ignore
  const setLiveRally = useStoreCurrentLiveRally((state) => state.setLiveRally)
  const mutationJoinRoom = trpc.credentials.getRoomCredential.useMutation({
    async onSuccess(data) {
      try {
        //@ts-ignore
        this.roomService = data?.token
        //@ts-ignore
        await state.connect(`wss://${process.env.NEXT_PUBLIC_LIVEKIT_URL}`, data?.token, {})
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
