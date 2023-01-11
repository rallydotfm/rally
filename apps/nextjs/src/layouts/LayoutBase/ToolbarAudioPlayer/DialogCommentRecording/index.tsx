import useCreateLensComment from '@hooks/useCreateLensComment'
import DialogModal from '@components/DialogModal'
import { useFormCommentRecording, useStoreTxUiCommentRecording } from '@hooks/useCommentRecording'
import FormComment from './Form'
import Button from '@components/Button'

interface DialogCommentLensPublicationProps {
  stateTxUi: any
}

export const DialogCommentLensPublication = (props: DialogCommentLensPublicationProps) => {
  const { stateTxUi } = props

  const {
    publishComment,
    mutationPollTransaction,
    mutationUploadJsonFile,
    contractWriteComment,
    signTypedDataComment,
    mutationCreateCommentViaDispatcher,
  } = useCreateLensComment()
  const storeForm = useFormCommentRecording({
    onSubmit: async (formValues: any) => {
      try {
        await publishComment({
          ...formValues,
          publicationId: stateTxUi.idLensPublication,
        })
        storeForm.formCommentRecording.reset()
      } catch (e) {
        console.error(e)
      }
    },
    initialValues: {
      publication_comment_content: `${stateTxUi?.timestamp}`,
      publish_on_lens: true,
      gated_module: false,
      gated_module_condition_operator: 'and',
      collect_module_has_fee: false,
      reference_module: -1,
      collect_module: 1,
    },
  })

  return (
    <DialogModal
      title="Comment publication"
      isOpen={stateTxUi.isDialogVisible}
      setIsOpen={stateTxUi.setDialogVisibility}
    >
      <div className="animate-appear pt-6 -mis-6 -mie-9">
        <FormComment
          labelCta={
            mutationUploadJsonFile.isLoading
              ? 'Uploading metadata...'
              : signTypedDataComment.isLoading
              ? 'Sign message...'
              : contractWriteComment.isLoading
              ? 'Sign transaction...'
              : mutationPollTransaction.isLoading || mutationCreateCommentViaDispatcher?.isLoading
              ? 'Indexing...'
              : [
                  mutationUploadJsonFile.isError,
                  signTypedDataComment.isError,
                  contractWriteComment.isError,
                  mutationPollTransaction.isError,
                ].includes(true)
              ? 'Try again'
              : 'Comment'
          }
          isLoading={[
            mutationCreateCommentViaDispatcher?.isLoading,
            mutationUploadJsonFile.isLoading,
            signTypedDataComment.isLoading,
            contractWriteComment.isLoading,
            mutationPollTransaction.isLoading,
          ].includes(true)}
          isError={[
            mutationCreateCommentViaDispatcher?.isError,
            mutationUploadJsonFile.isError,
            signTypedDataComment.isError,
            contractWriteComment.isError,
            mutationPollTransaction.isError,
          ].includes(true)}
          storeForm={storeForm}
        />
      </div>
      <footer className=" mt-2 pt-4 border-t border-neutral-4  -mis-6 -mie-9 flex justify-center">
        <Button
          className="-mb-4"
          onClick={() => stateTxUi.setDialogVisibility(false)}
          intent="neutral-ghost"
          scale="xs"
        >
          Go back
        </Button>
      </footer>
    </DialogModal>
  )
}

export default DialogCommentLensPublication
