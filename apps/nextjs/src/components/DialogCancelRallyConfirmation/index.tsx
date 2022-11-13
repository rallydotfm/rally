import DialogModal from '@components/DialogModal'
import Button from '@components/Button'

export const DialogCancelRallyConfirmation = (props: any) => {
  const { stateTxUi, stateCancelAudioChat, onClickCancel } = props
  return (
    <DialogModal title="Cancel rally" isOpen={stateTxUi.isDialogVisible} setIsOpen={stateTxUi.setDialogVisibility}>
      <p className="font-bold text-center py-6">Are you sure you want to cancel this rally ?</p>
      <div className="flex flex-col justify-center items-center xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
        <Button
          isLoading={stateCancelAudioChat.contract.isLoading || stateCancelAudioChat.transaction.isLoading}
          disabled={stateCancelAudioChat.contract.isLoading || stateCancelAudioChat.transaction.isLoading}
          onClick={onClickCancel}
        >
          Yes, cancel this rally
        </Button>
        <Button onClick={stateTxUi.resetState} intent="neutral-outline">
          Go back
        </Button>
      </div>
    </DialogModal>
  )
}

export default DialogCancelRallyConfirmation
