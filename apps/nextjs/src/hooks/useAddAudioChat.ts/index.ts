import addAudioChat from '@services/supabase/addAudioChat/addAudioChat'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useIndexAudioChat() {
  const mutationIndexAudioChat = useMutation(
    async (audioChatToIndexData) => {
      await addAudioChat(audioChatToIndexData)
    },
    {
      onError(e) {
        console.error(e)
        toast.error('Your rally couldn"t be indexed.')
      },
    },
  )

  return mutationIndexAudioChat
}

export default useIndexAudioChat
