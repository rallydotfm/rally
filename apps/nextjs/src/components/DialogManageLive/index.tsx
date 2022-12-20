import DialogModal from '@components/DialogModal'
import { useAccount } from 'wagmi'
import { PauseCircleIcon, SignalSlashIcon, UsersIcon } from '@heroicons/react/20/solid'
import { PlayCircleIcon } from '@heroicons/react/24/outline'
import useLiveVoiceChatRecordRoom from '@hooks/useLiveVoiceChatRecordRoom'

export const DialogManageLive = (props: any) => {
  const { rally, onClickEndRally, canRecord, participants, ...dialogProps } = props
  const { mutationStopRecording, mutationStartRecording } = useLiveVoiceChatRecordRoom()
  const account = useAccount()

  return (
    <DialogModal title="Manage live" {...dialogProps}>
      <h1 className="break-all font-semibold">{rally?.name}</h1>
      <div className="flex items-center text-neutral-12 mt-2.5">
        <UsersIcon className="mie-1ex w-5" />
        <p className="text-xs">{participants?.length ?? 0} participants</p>
      </div>
      <div className="pt-8">
        <ul className="pt-2 border-t-neutral-4 border-transparent border -mis-6 -mie-9 text-2xs">
          <li>
            <button
              onClick={async () =>
                await mutationStartRecording.mutate({
                  id_rally: rally?.id,
                })
              }
              disabled={mutationStartRecording?.isLoading || rally.will_be_recorded === false || canRecord === false}
              className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-medium text-start px-6 py-3 w-full focus:bg-neutral-12 hover:bg-neutral-3 focus:text-interactive-9"
            >
              <PlayCircleIcon className="shrink-0 w-6 mie-1ex" />
              <span className="grow flex items-center justify-between">
                Start recording{' '}
                {rally.will_be_recorded === false && <span className="text-2xs italic pis-1ex">disabled</span>}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={async () =>
                await mutationStopRecording.mutate({
                  id_egress: 'EG_yRiGsVQjW2FD',
                })
              }
              disabled={mutationStartRecording?.isLoading || rally.will_be_recorded === false || canRecord === false}
              className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-medium text-start px-6 py-3 w-full focus:bg-neutral-12 hover:bg-neutral-3 focus:text-interactive-9"
            >
              <PauseCircleIcon className="shrink-0 w-6 mie-1ex" />
              <span className="grow flex items-center justify-between">
                Stop recording{' '}
                {rally.will_be_recorded === false && <span className="text-2xs italic pis-1ex">disabled</span>}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={onClickEndRally}
              className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-medium text-start text-negative-10 hover:bg-negative-1 hover:text-negative-11 focus:text-negative-11 focus:bg-negative-2 px-6 py-3 w-full "
            >
              <SignalSlashIcon className="w-6 mie-1ex" />
              End rally
            </button>
          </li>
        </ul>

        <div className="-mb-8 mt-3 border-t -mis-6 -mie-9 border-neutral-4">
          <button
            onClick={() => dialogProps.setIsOpen(false)}
            className="text-2xs font-semibold text-center px-6 py-6 w-full focus:bg-neutral-12 focus:text-neutral-1 hover:bg-neutral-3"
          >
            Go back
          </button>
        </div>
      </div>
    </DialogModal>
  )
}

export default DialogManageLive
