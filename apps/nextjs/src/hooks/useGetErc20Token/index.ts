import { useQuery } from '@tanstack/react-query'
import { providers, Contract } from 'ethers'
import { erc20ABI } from 'wagmi'
import { chainRPC } from '@config/wagmi'

export function useGetErc20Token(args: { contract: `0x${string}`; chainId: number; options?: any }) {
  const queryErc20Token = useQuery(
    ['erc20-token', args?.contract, args?.chainId],
    async () => {
      try {
        //@ts-ignore
        const provider = new providers.JsonRpcProvider(`${chainRPC?.[parseInt(args?.chainId)]}`)
        const erc20Contract = new Contract(args?.contract, erc20ABI, provider)
        const name = await erc20Contract.name()
        const symbol = await erc20Contract.symbol()
        const decimals = await erc20Contract.decimals()
        const totalSupply = await erc20Contract.totalSupply()

        return {
          name,
          symbol,
          decimals,
          totalSupply,
        }
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
