import Button from '@components/Button'
import DialogModal from '@components/DialogModal'
import { useStoreCurrentLiveRally, useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { useEffect, useState } from 'react'
import { RoomEvent } from 'livekit-client'
import { HandRaisedIcon } from '@heroicons/react/24/outline'
import type { Participant } from 'livekit-client'
import useLiveVoiceChatInteractions from '@hooks/useLiveVoiceChatInteractions'
import { MicrophoneIcon } from '@heroicons/react/20/solid'
import ParticipantIdentityDisplayedName from '@components/pages/rally/[idRally]/ParticipantIdentityDisplayedName'
import ParticipantIdentityDisplayedAvatar from '../ParticipantIdentityDisplayedAvatar'

export const DialogModalListParticipantsWithRaisedHands = () => {
  const rally = useStoreCurrentLiveRally((state: any) => state.rally)
  const [isDialogVisible, setDialogVisibility] = useState(false)
  const stateVoiceChat: any = useStoreLiveVoiceChat()
  const { mutationInviteToSpeak } = useLiveVoiceChatInteractions()
  const [listParticipantsWithRaisedHand, setListParticipantsWithRaisedHand] = useState(
    stateVoiceChat?.participants?.filter((participant: Participant) => {
      const metadata = participant?.metadata !== '' ? JSON.parse(participant?.metadata ?? '') : ''

      return metadata !== '' && metadata?.is_hand_raised === true
    }) ?? [],
  )

  useEffect(() => {
    stateVoiceChat.room?.on(RoomEvent.ParticipantMetadataChanged, (prevMetadata: string, participant: Participant) => {
      const metadata = participant?.metadata !== '' ? JSON.parse(participant?.metadata ?? '') : ''
      if (metadata?.is_hand_raised) {
        setListParticipantsWithRaisedHand([...listParticipantsWithRaisedHand, participant])
      } else {
        const updatedList = listParticipantsWithRaisedHand.filter((p: Participant) => {
          return p.identity !== participant.identity
        })
        setListParticipantsWithRaisedHand(updatedList)
      }
    })
  }, [])

  return (
    <>
      <Button
        scale="sm"
        disabled={listParticipantsWithRaisedHand?.length === 0}
        onClick={() => setDialogVisibility(true)}
        className="pointer-events-auto relative aspect-square w-fit-content"
        intent="neutral-outline"
      >
        <HandRaisedIcon className="w-6" />
        {listParticipantsWithRaisedHand?.length > 0 && (
          <span className="text-[0.75rem] font-bold self-end">{listParticipantsWithRaisedHand?.length}</span>
        )}
      </Button>
      <DialogModal
        title="List of participants that would like to join the stage"
        isOpen={isDialogVisible}
        setIsOpen={setDialogVisibility}
      >
        {listParticipantsWithRaisedHand?.length > 0 && (
          <ul className="space-y-6  pt-8">
            {listParticipantsWithRaisedHand?.map((participantWithHandRaised: Participant) => (
              <li
                className="w-full flex justify-between 2xs:justify-start 2xs:grid items-center gap-1.5 2xs:gap-4 grid-cols-12 text-xs"
                key={`hand-raised-${participantWithHandRaised?.identity}-${participantWithHandRaised?.sid}`}
              >
                <>
                  <div className="2xs:col-span-6 flex 2xs:space-i-3 xs:space-i-6 items-center">
                    <div className="hidden 2xs:block rounded-md w-8 h-8 overflow-hidden">
                      <ParticipantIdentityDisplayedAvatar
                        metadata={participantWithHandRaised?.metadata as string}
                        identity={participantWithHandRaised.identity}
                      />
                    </div>
                    <span className="font-bold justify-center block overflow-hidden text-ellipsis">
                      <ParticipantIdentityDisplayedName
                        metadata={participantWithHandRaised?.metadata as string}
                        identity={participantWithHandRaised.identity}
                      />
                    </span>
                  </div>
                  <div className="2xs:col-span-6 2xs:justify-self-end block overflow-hidden text-ellipsis">
                    <Button
                      disabled={participantWithHandRaised.permissions?.canPublish === false}
                      onClick={async () => {
                        await mutationInviteToSpeak.mutateAsync({
                          id_rally: rally?.id,
                          id_user: participantWithHandRaised.identity,
                          can_publish: true,
                          can_join: true,
                          can_publish_data: false,
                          can_subscribe: true,
                        })
                      }}
                      className="w-full xs:w-fit-content xs:!px-5"
                      intent="primary-outline"
                      scale="sm"
                    >
                      <MicrophoneIcon className="w-4 mie-2" />
                      Invite to speak
                    </Button>
                  </div>
                </>
              </li>
            ))}
          </ul>
        )}
      </DialogModal>
    </>
  )
}

export default DialogModalListParticipantsWithRaisedHands
