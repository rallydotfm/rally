import audioChatChangeState from '@services/supabase/audioChatChangeState/audioChatChangeState'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useAudioChatChangeState() {
  const mutationAudioChatChangeState = useMutation(
    async (changedStateParams) => {
      //@ts-ignore
      await audioChatChangeState(changedStateParams)
    },
    {
      onError(e) {
        console.error(e)
        toast.error("Your rally changes couldn't be indexed.")
      },
    },
  )

  return mutationAudioChatChangeState
}

export default useAudioChatChangeState
