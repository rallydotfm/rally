import { getNftContract } from '@services/nftport/getNftContract'
import { useQuery } from '@tanstack/react-query'

export function useGetNftContract(condition: any, pageSize?: number, pageNumber?: number) {
  const queryNftContract = useQuery(
    ['nft-data', condition?.standardContractType ?? '', condition?.contractAddress ?? '', condition?.chain ?? ''],
    async () => {
      const result = await getNftContract({
        chain_name: condition?.chain,
        contract: condition?.contractAddress,
        page_size: pageSize ?? 1,
        page_number: pageNumber ?? 1,
      })
      return result
    },
    {
      refetchOnWindowFocus: false,
      enabled: ['polygon', 'ethereum'].includes(condition?.chain) ? true : false,
    },
  )

  return {
    queryNftContract,
  }
}

export default useGetNftContract
