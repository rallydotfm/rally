import { trpc } from '@utils/trpc'
import createContext from 'zustand/context'

export const { Provider, useStore } = createContext()

export function useLiveAudioRoom() {
  const state = useStore()

  const mutationJoinRoom = trpc.credentials.getRoomCredential.useMutation({
    async onSuccess(data) {
      this.roomService = data?.token
      await state.joinRoom(data?.token)
    },
  })
  return {
    mutationJoinRoom,
  }
}

export default useLiveAudioRoom
