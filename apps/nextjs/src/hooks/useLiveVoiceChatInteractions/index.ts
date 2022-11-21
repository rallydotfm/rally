import { useStoreDisplayParticipant } from '@components/pages/rally/[idRally]/DialogModalDisplayParticipant'
import { trpc } from '@utils/trpc'
import toast from 'react-hot-toast'

export function useLiveVoiceChatInteractions() {
  const setDialogVisibility = useStoreDisplayParticipant((state) => state.setDialogVisibility)

  const mutationParticipantKickOut = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} was kicked out successfully.`)
      setDialogVisibility(false)
    },
  })

  const mutationInviteToSpeak = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} was invited to speak.`)
      setDialogVisibility(false)
    },
  })

  const mutationMoveBackToAudience = trpc?.room.update_audience_member_permissions.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} was moved back to the audience.`)
      setDialogVisibility(false)
    },
  })

  const mutationRoomAddToBlacklist = trpc?.room.update_room_ban_list.useMutation({
    onSuccess(data) {
      toast(`${data?.id_user} is now banned permanently.`)
      setDialogVisibility(false)
    },
  })
  return { mutationParticipantKickOut, mutationInviteToSpeak, mutationMoveBackToAudience, mutationRoomAddToBlacklist }
}

export default useLiveVoiceChatInteractions
