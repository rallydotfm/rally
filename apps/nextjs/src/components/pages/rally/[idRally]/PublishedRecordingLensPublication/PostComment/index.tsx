import useCreateLensComment from '@hooks/useCreateLensComment'
import useForm from './useForm'
import FormComment from './Form'
import { Disclosure, Transition } from '@headlessui/react'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/20/solid'

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
      collect_module_has_fee: false,
      reference_module: -1,
      collect_module: 1,
    },
  })

  return (
    <Disclosure>
      <Disclosure.Button className="flex items-center text-sm font-bold text-neutral-12">
        <ChatBubbleLeftRightIcon className="mis-2 w-5 text-neutral-11 mie-1ex" />
        Comment
      </Disclosure.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Disclosure.Panel className="pt-4">
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
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  )
}

export default PostComment
