import useStoreLensIndexer from '@hooks/useStoreLensIndexer'
import { useMutation } from '@tanstack/react-query'

export function usePollTransaction(args: { messageSuccess: string; messageError: string; options: any }) {
  const poll = useStoreLensIndexer((state: any) => state.poll)
  const { messageError, messageSuccess, options } = args
  const mutationPollTransaction = useMutation(
    async (hash) => {
      try {
        await poll({
          hash,
          messageSuccess,
          messageError,
        })
      } catch (e) {
        console.error(e)
        //@ts-ignore
        toast.error(e?.message ?? e)
      }
    },
    {
      ...options,
    },
  )

  return mutationPollTransaction
}
