import { useStoreDisplayParticipant } from '@components/pages/rally/[idRally]/DialogModalDisplayParticipant'
import { trpc } from '@utils/trpc'
import toast from 'react-hot-toast'

export function useLiveVoiceChatInteractions() {
  const setDialogVisibility = useStoreDisplayParticipant((state) => state.setDialogVisibility)

  //@ts-ignore
  const mutationParticipantKickOut = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data: { display_name: string }) {
      toast(`${data?.display_name} was kicked out successfully.`)
      setDialogVisibility(false)
    },
  })

  //@ts-ignore
  const mutationInviteToSpeak = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data: { display_name: string }) {
      toast(`${data?.display_name} was invited to speak.`)
      setDialogVisibility(false)
    },
  })

  //@ts-ignore
  const mutationMoveBackToAudience = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data: { display_name: string }) {
      toast(`${data?.display_name} was moved back to the audience.`)
      setDialogVisibility(false)
    },
  })
  //@ts-ignore
  const mutationRoomAddToBlacklist = trpc?.room.update_room_ban_list.useMutation({
    onSuccess(data: { display_name: string }) {
      toast(`${data?.display_name} is now banned permanently.`)
      setDialogVisibility(false)
    },
  })
  return { mutationParticipantKickOut, mutationInviteToSpeak, mutationMoveBackToAudience, mutationRoomAddToBlacklist }
}

export default useLiveVoiceChatInteractions
