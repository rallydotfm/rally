import { pollUntilIndexed } from '@services/lens/indexer/pollUntilIndexed'
import toast from 'react-hot-toast'
import create from 'zustand'

export const useStoreLensIndexer = create(() => ({
  poll: async (args: { hash: string; messageSuccess: string; messageError: string }) => {
    const { hash, messageSuccess, messageError } = args

    try {
      await pollUntilIndexed({ txHash: hash })
      toast.success(messageSuccess)
    } catch (e) {
      toast.error(messageError)
    }
  },
}))

export default useStoreLensIndexer
