import addAudioChat from '@services/supabase/addAudioChat/addAudioChat'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useIndexAudioChat() {
  const mutationIndexAudioChat = useMutation(
    async (audioChatToIndexData) => {
      console.log('I am now in index.ts')
      await addAudioChat(audioChatToIndexData)
    },
    {
      onSuccess() {
        console.log('rallz created')
      },
      onError(e) {
        console.error(e)
        toast.error('Your rally couldn4t be indexed.')
      },
    },
  )

  return mutationIndexAudioChat
}

export default useIndexAudioChat
