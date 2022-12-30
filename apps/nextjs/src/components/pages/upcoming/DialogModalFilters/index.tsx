import Button from '@components/Button'
import DialogModal from '@components/DialogModal'

export const DialogModalFilters = (props: any) => {
  const { children, onClickResetFilters, ...dialogProps } = props

  return (
    <>
      <DialogModal {...dialogProps}>
        {children}
        <footer className="bg-neutral-1 border-t border-neutral-4 z-10 pis-8 pie-10 -mis-8 -mie-10 sticky -bottom-6">
          <div className="flex w-full justify-between pt-2 pb-2 -mb-8 gap-4">
            <Button
              intent="neutral-outline"
              scale="sm"
              onClick={() => {
                onClickResetFilters()
                dialogProps.setIsOpen(false)
              }}
            >
              Clear filters
            </Button>
            <Button intent="neutral-ghost" scale="xs" onClick={() => dialogProps.setIsOpen(false)}>
              Go back
            </Button>
          </div>
        </footer>
      </DialogModal>
    </>
  )
}

export default DialogModalFilters
