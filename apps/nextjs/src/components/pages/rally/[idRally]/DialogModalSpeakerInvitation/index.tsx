import DialogModal from '@components/DialogModal'
import Button from '@components/Button'
import { useStoreLiveVoiceChat } from '@hooks/useVoiceChat'
interface DialogModalSpeakerInvitationProps {
  isDialogVisible: boolean
  setDialogVisibility: () => void
}
export const DialogModalSpeakerInvitation = (props: DialogModalSpeakerInvitationProps) => {
  const { isDialogVisible, setDialogVisibility } = props
  //@ts-ignore
  const { room } = useStoreLiveVoiceChat()

  return (
    <DialogModal title="Join the stage as a speaker" isOpen={isDialogVisible} setIsOpen={setDialogVisibility}>
      <p className="font-bold text-center py-6">Do you want to join the stage ?</p>
      <p>
        You were invited to join the stage and be a speaker. Click on "Accept" to join the stage and active your
        microphone?
      </p>
      <div className="flex flex-col justify-center items-center xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
        <Button
          onClick={async () => {
            await room.localParticipant.setMicrophoneEnabled(true)
            //@ts-ignore
            setDialogVisibility(false)
          }}
        >
          Accept
        </Button>
        <Button
          intent="neutral-outline"
          onClick={() => {
            //@ts-ignore
            setDialogVisibility(false)
          }}
        >
          Go back
        </Button>
      </div>
    </DialogModal>
  )
}

export default DialogModalSpeakerInvitation
