import create from 'zustand'
import { object, string } from 'zod'
import { useForm as useStoreForm } from '@felte/react'
import { validator } from '@felte/validator-zod'

export interface TxUiCommentRecording {
  isDialogVisible: boolean
  lensPublicationId: string | undefined
  timestamp: string | undefined
  setDialogVisibility: (visibility: boolean) => void
  selectPublicationToComment: (id: string, timestamp: string) => void
  resetState: () => void
}

export const useStoreTxUiCommentRecording = create<TxUiCommentRecording>((set) => ({
  selectPublicationToComment: (id: string, timestamp: string) =>
    set(() => ({
      lensPublicationId: id,
      isDialogVisible: true,
      timestamp: timestamp,
    })),
  setDialogVisibility: (visibility: boolean) =>
    set(() => ({
      isDialogVisible: visibility,
    })),
  resetState: () =>
    set(() => ({
      isDialogVisible: false,
      lensPublicationId: undefined,
    })),
  timestamp: undefined,
  isDialogVisible: false,
  lensPublicationId: undefined,
}))

export const schema = object({
  publication_comment_content: string().trim().min(1),
})

export function useFormCommentRecording(config: { onSubmit: any; initialValues: any }) {
  const { onSubmit, initialValues } = config

  const formCommentRecording = useStoreForm({
    extend: validator({ schema }),
    onSubmit,
    initialValues,
  })

  return {
    formCommentRecording,
  }
}

export default useFormCommentRecording
