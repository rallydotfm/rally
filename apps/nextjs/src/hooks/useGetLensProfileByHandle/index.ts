import { useQuery } from '@tanstack/react-query'
import { getProfileByHandleRequest } from '@services/lens/profile/getProfileByHandle'

export function useGetLensProfileByHandle(handle: string, options: any) {
  const queryLensProfileByHandle = useQuery(
    ['lens-profile-by-handle', handle],
    async () => {
      try {
        const result = await getProfileByHandleRequest({
          handle,
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.data?.profile
      } catch (e) {
        console.error(e)
      }
    },
    options,
  )

  return queryLensProfileByHandle
}

export default useGetLensProfileByHandle
