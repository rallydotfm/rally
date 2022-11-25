import Button from '@components/Button'
import DialogModal from '@components/DialogModal'
import { useState } from 'react'
import FormPin from './FormPin'

export const DialogModalPinItem = () => {
  const [isDialogVisible, setDialogVisibility] = useState(false)
  return (
    <>
      <Button
        scale="sm"
        type="button"
        onClick={() => setDialogVisibility(true)}
        className="pointer-events-auto relative aspect-square w-fit-content"
        intent="neutral-outline"
      ></Button>
      <DialogModal
        title="List of participants that would like to join the stage"
        isOpen={isDialogVisible}
        setIsOpen={setDialogVisibility}
      >
        <FormPin />
      </DialogModal>
    </>
  )
}

export default DialogModalPinItem
