import DialogModal from '@components/DialogModal'
import Button from '@components/Button'

export const DialogDeleteRallyConfirmation = (props) => {
  const { stateTxUi, stateDeleteAudioChat, onClickDelete } = props
  return (
    <DialogModal title="Delete rally" isOpen={stateTxUi.isDialogVisible} setIsOpen={stateTxUi.setDialogVisibility}>
      <p className="font-bold text-center pt-6 mb-4">Are you sure you want to delete this rally ?</p>
      <p className="mb-6 text-center text-neutral-12 text-xs">
        Deleting a rally is irreversible and will make it inaccessible to you and all other users.
      </p>
      <div className="flex flex-col justify-center items-center xs:flex-row space-y-3 xs:space-y-0 xs:space-i-3">
        <Button
          intent="negative"
          isLoading={stateDeleteAudioChat.contract.isLoading || stateDeleteAudioChat.transaction.isLoading}
          disabled={
            stateDeleteAudioChat.contract.isLoading ||
            stateDeleteAudioChat.transaction.isLoading ||
            stateDeleteAudioChat.contract.isSuccess ||
            stateDeleteAudioChat.transaction.isSuccess
          }
          onClick={onClickDelete}
        >
          Yes, delete this rally
        </Button>
        <Button onClick={stateTxUi.resetState} intent="neutral-outline">
          Go back
        </Button>
      </div>
    </DialogModal>
  )
}

export default DialogDeleteRallyConfirmation
