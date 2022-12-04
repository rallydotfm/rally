import { useQuery } from '@tanstack/react-query'
import { getFollowing } from '@services/lens/follow/getFollowing'

export function useGetFollowing(address: `0x${string}`, options: any) {
  const getAddressFollowing = useQuery(
    ['following', address],
    async () => {
      try {
        const result = await getFollowing({
          address,
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result
      } catch (e) {
        console.error(e)
      }
    },
    {
      ...options,
    },
  )

  return getAddressFollowing
}

export default useGetFollowing
