import addAudioChat from '@services/supabase/addAudioChat/addAudioChat'
import deleteAudioChat from '@services/supabase/deleteAudioChat/deleteAudioChat'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useUnindexAudioChat() {
  const mutationUnindexAudioChat = useMutation(
    async (audioChatToDelete: string) => {
      console.log('I am now in index.ts')
      await deleteAudioChat(audioChatToDelete)
    },
    {
      onSuccess() {
        console.log('rally deleted')
      },
      onError(e) {
        console.error(e)
        toast.error('Your rally couldnt be deleted.')
      },
    },
  )

  return mutationUnindexAudioChat
}

export default useUnindexAudioChat
