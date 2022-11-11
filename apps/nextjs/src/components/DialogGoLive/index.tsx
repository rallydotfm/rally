import DeploymentStep from '@components/DeploymentStep'
import DialogModal from '@components/DialogModal'

export const DialogGoLive = (props: any) => {
  const { stateTxUi, stateGoLiveAudioChat } = props
  return (
    <DialogModal title="Go live" isOpen={stateTxUi.isDialogVisible} setIsOpen={stateTxUi.setDialogVisibility}>
      <p className="font-bold text-center pt-6 mb-4">Before going live...</p>
      <p className="mb-6 text-center text-neutral-12 text-xs">
        Please sign the transaction in your wallet to start your rally.
      </p>
      <p className="text-center text-neutral-12 text-xs">
        After this, you'll be redirected to your rally page, and your rally will be open for other people to join.
      </p>

      <ol className="mt-6">
        <li
          className={`
          flex items-center 
            ${stateGoLiveAudioChat.contract.isIdle ? 'text-neutral-11' : 'text-white'}`}
        >
          <DeploymentStep
            isLoading={stateGoLiveAudioChat.contract.isLoading}
            isError={stateGoLiveAudioChat.contract.isError}
            isSuccess={stateGoLiveAudioChat.contract.isSuccess}
          >
            Sign the 'Go live' transaction{' '}
          </DeploymentStep>
        </li>
        <li
          className={`
            flex items-center 
            ${stateGoLiveAudioChat.transaction.isIdle ? 'text-neutral-11' : 'text-white'}`}
        >
          <DeploymentStep
            isLoading={stateGoLiveAudioChat.transaction.isLoading}
            isError={stateGoLiveAudioChat.transaction.isError}
            isSuccess={stateGoLiveAudioChat.transaction.isSuccess}
          >
            Updating rally status
          </DeploymentStep>
        </li>
      </ol>
    </DialogModal>
  )
}

export default DialogGoLive
