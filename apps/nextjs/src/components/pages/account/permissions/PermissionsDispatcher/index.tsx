import InputCheckboxToggle from '@components/InputCheckboxToggle'
import { useState } from 'react'
import { useEnableDispatcher } from '@hooks/useEnableDispatcher'
import useDisableDispatcher from '@hooks/useDisableDispatcher'

interface PermissionsDispatcherProps {
  profile: any
}

export const PermissionsDispatcher = (props: PermissionsDispatcherProps) => {
  const { profile } = props
  const [checked, setChecked] = useState(profile?.dispatcher === null ? false : true)
  const { enableDispatcher, contractWriteEnableDispatcher, ...enable } = useEnableDispatcher(profile)
  const { disableDispatcher, contractWriteDisableDispatcher, ...disable } = useDisableDispatcher(profile)

  return (
    <section className="animate-appear">
      <h2 className="pt-6 font-bold">Dispatcher</h2>
      <p className="pt-1 mb-3 text-xs text-neutral-11">
        The dispatcher allows you to interact with Rally without signing any of your transactions.
      </p>

      <InputCheckboxToggle
        checked={checked}
        disabled={[
          enable.mutationPollTransaction.isLoading ||
            contractWriteEnableDispatcher.isLoading ||
            enable.signTypedDataFollow.isLoading ||
            disable.mutationPollTransaction.isLoading ||
            contractWriteDisableDispatcher.isLoading ||
            disable.signTypedDataFollow.isLoading,
        ].includes(true)}
        onChange={(e: boolean) => {
          setChecked(e)
          if (e === true) {
            enableDispatcher()
          } else {
            disableDispatcher()
          }
        }}
        label="Enable dispatcher"
        helpText={
          [enable.signTypedDataFollow.isLoading || disable.signTypedDataFollow.isLoading].includes(true)
            ? 'Sign message...'
            : [contractWriteDisableDispatcher.isLoading || contractWriteEnableDispatcher.isLoading].includes(true)
            ? 'Sign transaction...'
            : [disable.mutationPollTransaction.isLoading || enable.mutationPollTransaction.isLoading].includes(true)
            ? 'Indexing...'
            : ''
        }
      />
    </section>
  )
}

export default PermissionsDispatcher
