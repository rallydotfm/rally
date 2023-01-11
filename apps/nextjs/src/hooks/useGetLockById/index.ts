import getLockById from '@services/unlock/subgraph/getLockById'
import { useQuery } from '@tanstack/react-query'

export function useGetLockById(args: { chainId: number; contractAddress: string; options?: any }) {
  const queryLockById = useQuery(
    ['lock-by-id', args?.chainId, args?.contractAddress],
    async () => {
      const { chainId, contractAddress } = args
      const response = await getLockById({
        //@ts-ignore
        chainId,
        //@ts-ignore
        address: contractAddress,
      })
      const result = await response.json()
      return result?.data
    },
    {
      ...args?.options,
      refetchOnWindowFocus: false,
    },
  )

  return {
    queryLockById,
  }
}

export default useGetLockById
