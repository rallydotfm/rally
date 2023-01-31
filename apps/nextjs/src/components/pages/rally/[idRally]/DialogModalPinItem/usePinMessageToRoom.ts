import { useForm } from '@felte/react'
import { validator } from '@felte/validator-zod'
import { object, string } from 'zod'
import { trpc } from '@utils/trpc'
import toast from 'react-hot-toast'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { useRoom } from '@livekit/react-core'

export const schema = object({
  pinnedMediaUrl: string().url(),
  pinnedMediaMessage: string().optional(),
})

export function usePinMessageToRoom(idRally: string) {
  const stateLiveVoiceChat = useStoreLiveVoiceChat()
  const {
    //@ts-ignore
    room: { metadata },
    //@ts-ignore
  } = useRoom(stateLiveVoiceChat?.room)

  //@ts-ignore
  const mutation = trpc.room.pin_message.useMutation({
    onSuccess() {
      toast('Your message was pinned successfully !')
    },
    onError(e: Error) {
      toast.error(`Something went wrong and your message couldn't be pinned to the room. Please try again.`)
      console.error(e)
    },
  })
  const storeForm = useForm({
    extend: validator({ schema }),
    onSubmit: async (values) => {
      await mutation.mutateAsync({
        id_rally: idRally,
        pinned_media_url: values?.pinnedMediaUrl,
        pinned_media_message: values?.pinnedMediaMessage ?? '',
        room_previous_metadata: metadata ?? '',
      })
    },
  })

  return {
    storeForm,
    mutationPinMessageToRoom: mutation,
  }
}

export default usePinMessageToRoom
