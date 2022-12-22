import {
  queryAudioChatsHappeningLater,
  queryAudioChatsHappeningNow,
  queryAudioChatsHappeningSoon,
} from '@services/supabase/queryAudioChatsHappening/queryAudioChatsHappening'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export function useQueryAudioChatsHappeningSoon() {
  const mutationIndexAudioChat = useMutation(
    async () => {
      console.log('I am now in index.ts')
      await queryAudioChatsHappeningSoon()
    },
    {
      onSuccess() {
        console.log('Rally is fetched')
      },
      onError(e) {
        console.error(e)
        toast.error('Your rally couldnt be fetched')
      },
    },
  )

  return mutationIndexAudioChat
}
export function useQueryAudioChatsHappeningLater() {
  const mutationIndexAudioChat = useMutation(
    async () => {
      console.log('I am now in index.ts')
      await queryAudioChatsHappeningLater()
    },
    {
      onSuccess() {
        console.log('Rally is fetched')
      },
      onError(e) {
        console.error(e)
        toast.error('Your rally couldnt be fetched')
      },
    },
  )

  return mutationIndexAudioChat
}
export function useQueryAudioChatsHappeningNow() {
  const mutationIndexAudioChat = useMutation(
    async () => {
      console.log('I am now in index.ts')
      let resultsHappeningNow = await queryAudioChatsHappeningNow()
    },
    {
      onSuccess() {
        console.log('Rally is fetched')
      },
      onError(e) {
        console.error(e)
        toast.error('Your rally couldnt be fetched')
      },
    },
  )

  return mutationIndexAudioChat
}
