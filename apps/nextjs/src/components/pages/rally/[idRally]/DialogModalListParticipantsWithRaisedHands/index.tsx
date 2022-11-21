import Button from '@components/Button'
import DialogModal from '@components/DialogModal'
import { useStoreCurrentLiveRally, useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { useEffect, useState } from 'react'
import { RoomEvent } from 'livekit-client'
import { HandRaisedIcon } from '@heroicons/react/24/outline'
import type {Participant } from 'livekit-client'
import useLiveVoiceChatInteractions from '@hooks/useLiveVoiceChatInteractions'
//@TODO: synchronize with the user metada on participant metadata change
export const DialogModalListParticipantsWithRaisedHands = () => {
  //@ts-ignore
  const rally = useStoreCurrentLiveRally((state) => state.rally)
  const [isDialogVisible, setDialogVisibility] = useState(false)
  const stateVoiceChat = useStoreLiveVoiceChat()
  const {mutationInviteToSpeak} = useLiveVoiceChatInteractions()
  const [listParticipantsWithRaisedHand, setListParticipantsWithRaisedHand] = useState(
    //@ts-ignore
    stateVoiceChat?.participants?.filter((participant: Participant) => {
      const metadata = participant?.metadata !== '' ? JSON.parse(participant?.metadata ?? '') : ''

      return metadata !== '' && metadata?.is_hand_raised === true
    }) ?? []
  )

  
  useEffect(() => {
    //@ts-ignore
    stateVoiceChat.room?.on(RoomEvent.ParticipantMetadataChanged, (prevMetadata: string, participant: Participant) => {
      const metadata = participant?.metadata !== '' ? JSON.parse(participant?.metadata ?? '') : ''
      console.log(metadata)
      console.log(participant)
      if (metadata?.is_hand_raised){
        setListParticipantsWithRaisedHand([...listParticipantsWithRaisedHand, participant])
      }
      else {
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
        disabled={
          //@ts-ignore
          listParticipantsWithRaisedHand?.length === 0
        }
        onClick={() => setDialogVisibility(true)}
        className="pointer-events-auto relative aspect-square w-fit-content"
        intent="neutral-outline"
      >
        <HandRaisedIcon className="w-6" />
        {/* @ts-ignore */}
        {listParticipantsWithRaisedHand?.length > 0 && (
          <span className="text-[0.75rem] font-bold self-end">
            {
              //@ts-ignore
              listParticipantsWithRaisedHand?.length
            }
          </span>
        )}
      </Button>
      <DialogModal
        title="List of participants that would like to join the stage"
        isOpen={isDialogVisible}
        setIsOpen={setDialogVisibility}
      >
        {/* @ts-ignore */}
        {listParticipantsWithRaisedHand?.map((participantWithHandRaised: Participant) => (
            
            <li key={`hand-raised-${participantWithHandRaised?.identity}-${participantWithHandRaised?.sid}`}>
              {participantWithHandRaised?.identity} {participantWithHandRaised.isLocal ?  " (You)" : 
              <> {participantWithHandRaised.permissions?.canPublish === false && <Button
                onClick={ async () => {
                  await mutationInviteToSpeak.mutateAsync({
                    id_rally: rally?.id, 
                    id_user: participantWithHandRaised.identity, 
                    can_publish: true, can_join: true,
                     can_publish_data: false, 
                    can_subscribe: true
                  })
                }}
                scale="sm"
                >Invite to speak</Button>}
              </> }
            </li>
          ))}
      </DialogModal>
    </>
  )
}

export default DialogModalListParticipantsWithRaisedHands
