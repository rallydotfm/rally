import addAudioChat from '@services/supabase/addAudioChat/addAudioChat'
import deleteAudioChat from '@services/supabase/deleteAudioChat/deleteAudioChat'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useUnindexAudioChat() {
  const mutationUnindexAudioChat = useMutation(
    async (audioChatToDelete: string) => {
      await deleteAudioChat(audioChatToDelete)
    },
    {
      onError(e) {
        console.error(e)
      },
    },
  )

  return mutationUnindexAudioChat
}

export default useUnindexAudioChat
