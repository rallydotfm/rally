import DialogModal from '@components/DialogModal'

export const DialogGoLive = (props) => {
  const { stateTxUi, stateGoLive } = props
  return (
    <DialogModal title="Go live" isOpen={stateTxUi.isDialogVisible} setIsOpen={stateTxUi.setDialogVisibility}>
      <p className="font-bold text-center pt-6 mb-4">Before going live...</p>
      <p className="mb-6 text-center text-neutral-12 text-xs">
        Please sign the transaction in your wallet to start your rally.
      </p>
      <p className="text-center text-neutral-12 text-xs">
        After this, you'll be redirected to your rally page, and your rally will be open for other people to join.
      </p>
    </DialogModal>
  )
}

export default DialogGoLive
