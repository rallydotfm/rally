import DialogModal from '@components/DialogModal'
import Button from '@components/Button'
import create from 'zustand'
import { useParticipant } from '@livekit/react-core'
import { useStoreCurrentLiveRally, useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import useLiveVoiceChatInteractions from '@hooks/useLiveVoiceChatInteractions'
import ParticipantIdentityDisplayedName from '@components/pages/rally/[idRally]/ParticipantIdentityDisplayedName'
import ParticipantIdentityDisplayedAvatar from '@components/pages/rally/[idRally]/ParticipantIdentityDisplayedAvatar'
import type { Participant } from 'livekit-client'

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
    room: { localParticipant, ...dataRoom },
  }: any = useStoreLiveVoiceChat()
  const { mutationParticipantKickOut, mutationInviteToSpeak, mutationMoveBackToAudience, mutationRoomAddToBlacklist } =
    useLiveVoiceChatInteractions()

  const rally = useStoreCurrentLiveRally((state: any) => state.rally)
  const queryLensProfile = useWalletAddressDefaultLensProfile(pickedParticipant?.identity as string)

  const { publications } = useParticipant(pickedParticipant as Participant)
  return (
    <DialogModal title="Participant" isOpen={isDialogVisible} setIsOpen={setDialogVisibility}>
      <div className="pt-6 flex space-y-3 flex-col justify-center items-center 2xs:space-y-0 2xs:flex-row 2xs:justify-start 2xs:items-start 2xs:space-i-6">
        <div className="w-24 shrink-0 relative aspect-square overflow-hidden border-neutral-4 border rounded-full">
          <ParticipantIdentityDisplayedAvatar
            className="absolute inset-0 w-full h-full object-cover z-10"
            /* @ts-ignore */
            identity={pickedParticipant.identity}
          />
        </div>
        <div>
          <div className="leading-tight">
            <p className="break-all flex flex-col font-semibold text-sm max-x-fit-content">
              <ParticipantIdentityDisplayedName identity={pickedParticipant?.identity as string} />
            </p>
            {queryLensProfile?.data?.handle && (
              <p className="mt-1 text-2xs text-neutral-9">{queryLensProfile?.data?.handle}</p>
            )}
            {queryLensProfile?.data?.bio && (
              <p className="pb-1 mt-2 overflow-hidden text-ellipsis leading-[25px] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box] text-xs text-neutral-11">
                {queryLensProfile?.data?.bio}
              </p>
            )}
          </div>

          {queryLensProfile?.data?.stats && (
            <div className="mt-2">
              <ul className="grid grid-cols-2 gap-6 w-full">
                <li className="flex space-i-1ex items-baseline">
                  <span className="font-bold text-white text-base">
                    {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
                      queryLensProfile?.data?.stats?.totalFollowers,
                    )}
                  </span>{' '}
                  <span className="text-2xs text-neutral-12">followers</span>
                </li>
                <li className="flex space-i-1ex items-baseline">
                  <span className="font-bold text-white text-base">
                    {new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
                      queryLensProfile?.data?.stats?.totalFollowing,
                    )}
                  </span>{' '}
                  <span className="text-2xs text-neutral-12">following</span>
                </li>
              </ul>
            </div>
          )}
          {queryLensProfile?.data?.followModule && !pickedParticipant?.isLocal && (
            <div className="mt-4">
              <Button
                scale="xs"
                intent={queryLensProfile?.data?.isFollowedByMe ? 'negative-outline' : 'primary-outline'}
              >
                {queryLensProfile?.data?.isFollowedByMe ? 'Unfollow' : 'Follow'}
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="pt-8">
        <ul className="pt-2 border-t-neutral-4 border-transparent border -mis-6 -mie-9 text-2xs font-semibold">
          {pickedParticipant?.isLocal &&
            pickedParticipant?.permissions?.canPublish &&
            !pickedParticipant?.isMicrophoneEnabled && (
              <li>
                <button
                  onClick={async () => {
                    await localParticipant.setMicrophoneEnabled(true)
                  }}
                  className="text-start px-6 py-3 w-full focus:bg-neutral-12 hover:bg-neutral-3 focus:text-interactive-9"
                >
                  Enable your microphone
                </button>
              </li>
            )}
          <li className="disabled:opacity-50 disabled:cursor-not-allowed text-start px-6 py-3 w-full focus:bg-neutral-12 hover:bg-neutral-3 focus:text-positive-9">
            View profile
          </li>

          {!pickedParticipant?.isLocal && (
            <>
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
              {localParticipant?.identity !== pickedParticipant?.identity &&
                localParticipant?.permissions?.canPublishData && (
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
                            id_user: pickedParticipant?.identity as string,
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