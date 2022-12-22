import audioChatChangeState from '@services/supabase/audioChatChangeState/audioChatChangeState'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useAudioChatChangeState() {
  const mutationAudioChatChangeState = useMutation(
    async (changedStateParams) => {
      console.log('I am now in index.ts')
      //@ts-ignore
      await audioChatChangeState(changedStateParams)
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

  return mutationAudioChatChangeState
}

export default useAudioChatChangeState
