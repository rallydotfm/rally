import { trpc } from '@utils/trpc'
import toast from 'react-hot-toast'
import create from 'zustand'
import { persist } from 'zustand/middleware'
interface StateOngoingRecording {
  ongoingRecordingId: string | undefined
  setOngoingRecordingId: (id: string | undefined) => void
}
export const useStorePersistedOngoingRecording = create(
  persist<StateOngoingRecording>(
    (set) => ({
      ongoingRecordingId: undefined,
      setOngoingRecordingId: (ongoingRecordingId: string | undefined) => {
        set({
          ongoingRecordingId,
        })
      },
    }),
    {
      name: 'rally.recording',
    },
  ),
)

export function useLiveVoiceChatRecordRoom(options?: {
  mutationStartRecordingOptions: any
  mutationStopRecordingOptions: any
}) {
  const setOngoingRecordingId = useStorePersistedOngoingRecording((state) => state.setOngoingRecordingId)

  const mutationStartRecording = trpc?.room.start_recording.useMutation({
    onSuccess(data) {
      setOngoingRecordingId(data?.egressID?.egressId)
      toast('Recording in progress...')
    },
  })
  const mutationStopRecording = trpc?.room.stop_recording.useMutation({
    onSuccess(data) {
      setOngoingRecordingId(undefined)
      toast('Recording stopped and saved.')
    },
  })

  return {
    mutationStopRecording,
    mutationStartRecording,
  }
}

export default useLiveVoiceChatRecordRoom
