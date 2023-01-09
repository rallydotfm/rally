import useCreateLensComment from '@hooks/useCreateLensComment'
import useForm from './useForm'
import FormComment from './Form'

interface PostCommentProps {
  idLensPublication: string
}

export const PostComment = (props: PostCommentProps) => {
  const { idLensPublication } = props

  const {
    publishComment,
    mutationPollTransaction,
    mutationUploadJsonFile,
    contractWriteComment,
    signTypedDataComment,
    mutationCreateCommentViaDispatcher,
  } = useCreateLensComment()
  const storeForm = useForm({
    onSubmit: async (formValues: any) => {
      try {
        await publishComment({
          ...formValues,
          publicationId: idLensPublication,
        })
        storeForm.formCommentLensPublication.reset()
      } catch (e) {
        console.error(e)
      }
    },
    initialValues: {
      publication_comment_content: '',
      publish_on_lens: true,
      gated_module: false,
      gated_module_condition_operator: 'and',
      collect_module_has_fee: false,
      reference_module: -1,
      collect_module: 1,
    },
  })

  return (
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
  )
}

export default PostComment
