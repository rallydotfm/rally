import DialogModal from '@components/DialogModal'

export const DialogModalMoreFilters = (props: any) => {
  const { children, ...dialogProps } = props
  return (
    <>
      <DialogModal {...dialogProps}>{children}</DialogModal>
    </>
  )
}

export default DialogModalMoreFilters
