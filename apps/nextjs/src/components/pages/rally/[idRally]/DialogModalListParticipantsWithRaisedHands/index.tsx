import Button from '@components/Button'
import DialogModal from '@components/DialogModal'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
import { useState } from 'react'
import type { Participant } from 'livekit-client'
import { HandRaisedIcon } from '@heroicons/react/24/outline'

//@TODO: synchronize with the user metada on participant metadata change
export const DialogModalListParticipantsWithRaisedHands = () => {
  const [isDialogVisible, setDialogVisibility] = useState(false)
  const stateVoiceChat = useStoreLiveVoiceChat()

  return (
    <>
      <Button
        scale="sm"
        disabled={
          //@ts-ignore
          stateVoiceChat?.participants?.filter((participant: Participant) => {
            const metadata = participant?.metadata !== '' ? JSON.parse(participant?.metadata ?? '') : ''

            return metadata !== '' && metadata?.is_hand_raised === true
          })?.length === 0
        }
        onClick={() => setDialogVisibility(true)}
        className="pointer-events-auto relative aspect-square w-fit-content"
        intent="neutral-outline"
      >
        <HandRaisedIcon className="w-6" />
        {/* @ts-ignore */}
        {stateVoiceChat?.participants?.filter((participant: Participant) => {
          const metadata = participant?.metadata !== '' ? JSON.parse(participant?.metadata ?? '') : ''

          return metadata !== '' && metadata?.is_hand_raised === true
        })?.length > 0 && (
          <span className="text-[0.75rem] font-bold self-end">
            {
              //@ts-ignore
              stateVoiceChat?.participants?.filter((participant: Participant) => {
                const metadata = participant?.metadata !== '' ? JSON.parse(participant?.metadata ?? '') : ''

                return metadata !== '' && metadata?.is_hand_raised === true
              })?.length
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
        {stateVoiceChat?.participants
          ?.filter((participant: Participant) => {
            const metadata = participant?.metadata !== '' ? JSON.parse(participant?.metadata ?? '') : ''

            return metadata !== '' && metadata?.is_hand_raised === true
          })
          ?.map((participantWithHandRaised: Participant) => (
            <li key={`hand-raised-${participantWithHandRaised?.identity}-${participantWithHandRaised?.sid}`}>
              {participantWithHandRaised?.identity}
            </li>
          ))}
      </DialogModal>
    </>
  )
}

export default DialogModalListParticipantsWithRaisedHands
