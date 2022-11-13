import DeploymentStep from '@components/DeploymentStep'
import DialogModal from '@components/DialogModal'

export const DialogEndLive = (props: any) => {
  const { stateTxUi, stateEndLiveAudioChat } = props
  return (
    <DialogModal title="End live" isOpen={stateTxUi.isDialogVisible} setIsOpen={stateTxUi.setDialogVisibility}>
      <p className="font-bold text-center pt-6 mb-4">End your rally</p>
      <p className="mb-4 text-center text-negative-11 text-xs">
        <span className="font-bold">Ending a rally is a permanent and irreversible action.</span>
      </p>

      <p className="mb-4 font-medium text-start text-neutral-12 text-xs">
        Once you end your rally, you won't be able to start it again, the audio room will be closed and all the
        participants will be disconnected from it.
      </p>
      <p className="mb-6 text-start font-bold text-center text-neutral-12 text-xs">
        If you want to end your rally, please sign the transaction in your wallet to end your rally.
      </p>
      <ol className="mt-6 space-y-3 font-medium text-xs">
        <li
          className={`
          flex items-center 
            ${stateEndLiveAudioChat.contract.isIdle ? 'text-neutral-11' : 'text-white'}`}
        >
          <DeploymentStep
            isLoading={stateEndLiveAudioChat.contract.isLoading}
            isError={stateEndLiveAudioChat.contract.isError}
            isSuccess={stateEndLiveAudioChat.contract.isSuccess}
          >
            Sign the 'End live' transaction{' '}
          </DeploymentStep>
        </li>
        <li
          className={`
            flex items-center 
            ${stateEndLiveAudioChat.transaction.isIdle ? 'text-neutral-11' : 'text-white'}`}
        >
          <DeploymentStep
            isLoading={stateEndLiveAudioChat.transaction.isLoading}
            isError={stateEndLiveAudioChat.transaction.isError}
            isSuccess={stateEndLiveAudioChat.transaction.isSuccess}
          >
            Updating rally status
          </DeploymentStep>
        </li>
      </ol>
    </DialogModal>
  )
}

export default DialogEndLive
