import { trpc } from '@utils/trpc'
import toast from 'react-hot-toast'

export function useLiveVoiceChatRecordRoom(options?: {
  mutationStartRecordingOptions: any
  mutationStopRecordingOptions: any
}) {
  const mutationStartRecording = trpc?.room.start_recording.useMutation({
    onSuccess(data) {
      console.log('data', data)
      toast('Recording in progress...')
      options?.mutationStartRecordingOptions?.onSuccess(data)
    },
  })
  const mutationStopRecording = trpc?.room.stop_recording.useMutation({
    onSuccess(data) {
      toast('Recording stopped and saved.')
      options?.mutationStopRecordingOptions?.onSuccess(data)
    },
  })

  return {
    mutationStopRecording,
    mutationStartRecording,
  }
}

export default useLiveVoiceChatRecordRoom
