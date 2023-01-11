import { getNftContract } from '@services/nftport/getNftContract'
import { useQuery } from '@tanstack/react-query'

export function useGetNftContract(args: {
  contractAddress: string
  chain: string
  options?: {
    pageSize?: number
    pageNumber?: number
    query?: any
  }
}) {
  const queryNftContract = useQuery(
    ['nft-data-from-contract', args?.contractAddress ?? '', args?.chain ?? ''],
    async () => {
      const result = await getNftContract({
        chain_name: args?.chain,
        contract: args?.contractAddress,
        page_size: args?.options?.pageSize ?? 1,
        page_number: args?.options?.pageNumber ?? 1,
      })

      return result
    },
    {
      ...args?.options?.query,
      refetchOnWindowFocus: false,
      enabled: ['polygon', 'ethereum'].includes(args?.chain) ? true : false,
    },
  )

  return {
    queryNftContract,
  }
}

export default useGetNftContract
