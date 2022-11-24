import { trpc } from '@utils/trpc'
import { createContext, useContext } from 'react'
import toast from 'react-hot-toast'
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
  resetState: () =>
    set(() => ({
      rally: undefined,
      localUserPermissions: undefined,
      displaySpeakerInvitationModal: false,
    })),
}))

//@ts-ignore
export function useConnectToVoiceChat(rally) {
  const state = useStoreLiveVoiceChat()
  const setLiveRally = useStoreCurrentLiveRally((currentLiveRallyState: any) => currentLiveRallyState.setLiveRally)
  const resetState = useStoreCurrentLiveRally((currentLiveRallyState: any) => currentLiveRallyState.resetState)
  const mutationJoinRoom = trpc.credentials.getRoomCredential.useMutation({
    async onSuccess(data) {
      try {
        //@ts-ignore
        this.roomService = data?.token
        //@ts-ignore
        const didConnect = await state.connect(`wss://${process.env.NEXT_PUBLIC_LIVEKIT_URL}`, data?.token, {})
        if (didConnect?.localParticipant) {
          setLiveRally(rally)
        } else {
          toast.error(
            "Something went wrong and you couldn't join the rally. Make you joined one of the the required guilds and claimed one of the whitelisted roles and try again.",
          )
          resetState()
        }
      } catch (e) {
        resetState()
      }
    },
  })
  return {
    mutationJoinRoom,
  }
}
