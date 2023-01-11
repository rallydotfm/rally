import { useQuery } from '@tanstack/react-query'
import getErc20TokenByContractAddress from '@services/alchemy/tokens/getErc20TokenByContractAddress'

export function useGetErc20Token(args: { contract: `0x${string}`; chainId: number; options?: any }) {
  const queryErc20Token = useQuery(
    ['erc20-token', args?.contract, args?.chainId],
    async () => {
      try {
        const { result } = await getErc20TokenByContractAddress({
          chainId: args?.chainId,
          contractAddress: args?.contract,
        })
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      ...args?.options,
    },
  )

  return queryErc20Token
}

export default useGetErc20Token
