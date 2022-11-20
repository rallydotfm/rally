import DialogModal from '@components/DialogModal'
import Button from '@components/Button'
import create from 'zustand'
import { useParticipant } from '@livekit/react-core'
import type { Participant } from 'livekit-client'
import { trpc } from '@utils/trpc'
import toast from 'react-hot-toast'
import { useStoreCurrentLiveRally, useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'

export interface ParticipantToDisplay {
  isDialogVisible: boolean
  participant: Participant | undefined
  setDialogVisibility: (visibility: boolean) => void
  selectParticipantToDisplay: (participant: Participant) => void
  resetState: () => void
}

export const useStoreDisplayParticipant = create<ParticipantToDisplay>((set) => ({
  selectParticipantToDisplay: (participant: Participant) =>
    set(() => ({
      participant,
      isDialogVisible: true,
    })),
  setDialogVisibility: (visibility: boolean) =>
    set(() => ({
      isDialogVisible: visibility,
    })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
      participant: undefined,
    })),
  isDialogVisible: false,
  participant: undefined,
}))

export const DialogModalDisplayParticipant = (props: any) => {
  const isDialogVisible = useStoreDisplayParticipant((state) => state.isDialogVisible)
  const setDialogVisibility = useStoreDisplayParticipant((state) => state.setDialogVisibility)
  const pickedParticipant = useStoreDisplayParticipant((state) => state.participant)
  const {
    //@ts-ignore
    room: { localParticipant, ...dataRoom },
  } = useStoreLiveVoiceChat()

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

  //@ts-ignore
  const rally = useStoreCurrentLiveRally((state) => state.rally)
  //@ts-ignore
  const queryLensProfile = useWalletAddressDefaultLensProfile(pickedParticipant?.identity)

  //@ts-ignore
  const { publications } = useParticipant(pickedParticipant)
  return (
    <DialogModal title="Participant" isOpen={isDialogVisible} setIsOpen={setDialogVisibility}>
      <div className="pt-6 flex space-y-3 flex-col justify-center items-center 2xs:space-y-0 2xs:flex-row 2xs:justify-start 2xs:items-end 2xs:space-i-6">
        {/* @ts-ignore */}
        {queryLensProfile?.data?.picture?.original?.url && (
          <div className="w-24 shrink-0 relative aspect-square overflow-hidden rounded-full" overflow-hidden>
            <img
              className="absolute inset-0 w-full h-full object-cover z-10"
              /* @ts-ignore */
              src={queryLensProfile?.data?.picture?.original?.url?.replace(
                'ipfs://',
                'https://lens.infura-ipfs.io/ipfs/',
              )}
              /* @ts-ignore */
              alt={pickedParticipant.identity}
            />
          </div>
        )}
        <div className="space-y-4">
          <p className="break-all font-semibold overflow-hidden text-ellipsis text-xs max-x-fit-content">
            {pickedParticipant?.identity}
          </p>
          <div className="grid grid-cols-1 2xs:grid-cols-2 gap-2">
            <Button scale="xs" intent="primary-outline">
              Follow
            </Button>
            <Button scale="xs" intent="primary-ghost">
              View profile
            </Button>
          </div>
        </div>
      </div>
      <div className="pt-8">
        <ul className="pt-2 border-t-neutral-4 border-transparent border -mis-6 -mie-9 text-2xs font-semibold">
          <li>
            <button
              disabled={!pickedParticipant?.permissions?.canPublish}
              onClick={() => {
                //@ts-ignore
                publications[0].setSubscribed(!publications[0]?.isSubscribed)
              }}
              className="disabled:opacity-50 disabled:cursor-not-allowed text-start px-6 py-3 w-full focus:bg-neutral-12 hover:bg-neutral-3 focus:text-interactive-9"
            >
              {publications[0]?.isSubscribed ? 'Mute' : 'Unmute'}
            </button>
          </li>
          {localParticipant?.identity !== pickedParticipant?.identity && localParticipant?.permissions?.canPublishData && (
            <>
              {!pickedParticipant?.permissions?.canPublish && (
                <li>
                  <button
                    onClick={() =>
                      mutationInviteToSpeak.mutateAsync({
                        id_rally: rally?.id,
                        id_user: pickedParticipant?.identity as string,
                        can_join: true,
                        can_publish_data: false,
                        can_subscribe: true,
                        can_publish: true,
                      })
                    }
                    className="text-start px-6 py-3 w-full focus:bg-neutral-12 hover:bg-neutral-3 focus:text-interactive-9"
                  >
                    Invite to speak
                  </button>
                </li>
              )}
              {pickedParticipant?.permissions?.canPublish && (
                <li>
                  <button
                    onClick={() =>
                      mutationMoveBackToAudience.mutateAsync({
                        id_rally: rally?.id,
                        id_user: pickedParticipant?.identity,
                        can_join: true,
                        can_publish_data: false,
                        can_subscribe: true,
                        can_publish: false,
                      })
                    }
                    className="text-start px-6 py-3 w-full focus:bg-neutral-12 hover:bg-neutral-3  focus:text-interactive-9"
                  >
                    Move to audience
                  </button>
                </li>
              )}

              <li>
                <button
                  disabled={mutationParticipantKickOut?.isLoading}
                  onClick={() =>
                    mutationParticipantKickOut.mutateAsync({
                      id_rally: rally?.id,
                      id_user: pickedParticipant?.identity as string,
                      can_join: false,
                      can_publish_data: false,
                      can_subscribe: false,
                      can_publish: false,
                    })
                  }
                  className="text-start text-negative-10 hover:bg-negative-1 hover:text-negative-11 focus:text-negative-11 focus:bg-negative-2 px-6 py-3 w-full "
                >
                  Kick out
                </button>
              </li>
              <li>
                <button
                  disabled={mutationParticipantKickOut?.isLoading}
                  onClick={async () => {
                    let roomMetadata = JSON.parse(dataRoom?.metadata ?? '')
                    await mutationRoomAddToBlacklist.mutateAsync({
                      id_rally: rally?.id,
                      //@ts-ignore
                      id_user: pickedParticipant?.identity,
                      metadata: JSON.stringify({
                        ...roomMetadata,
                        blacklist: [...roomMetadata.blacklist, pickedParticipant?.identity],
                      }),
                    })
                  }}
                  className="text-start text-negative-10 hover:bg-negative-1 hover:text-negative-11 focus:text-negative-11 focus:bg-negative-2 px-6 py-3 w-full "
                >
                  Ban permanently from this rally
                </button>
              </li>
            </>
          )}
        </ul>
        <div className="-mb-8 mt-3 border-t -mis-6 -mie-9 border-neutral-4">
          <button
            onClick={() => setDialogVisibility(false)}
            className="text-2xs font-semibold text-center px-6 py-6 w-full focus:bg-neutral-12 focus:text-neutral-1 hover:bg-neutral-3"
          >
            Go back
          </button>
        </div>
      </div>
    </DialogModal>
  )
}

export default DialogModalDisplayParticipant
