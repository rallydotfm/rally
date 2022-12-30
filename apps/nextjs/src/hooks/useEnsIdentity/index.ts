import { useQuery } from '@tanstack/react-query'
import { ethers } from 'ethers'

export function useEnsIdentity(address: `0x${string}`, options: any) {
  const queryEnsIdentity = useQuery(
    ['ens-name', address],
    async () => {
      try {
        const provider = new ethers.providers.JsonRpcProvider('https://1rpc.io/eth')

        const name = await provider.lookupAddress(address)
        const avatar = await provider.getAvatar(address)
        return {
          name,
          avatar,
        }
      } catch (e) {
        console.error(e)
      }
    },
    {
      ...options,

      enabled: !address || address === null ? false : true,
    },
  )

  return queryEnsIdentity
}
