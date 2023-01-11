import { useQuery } from '@tanstack/react-query'
import { getProfileRequest } from '@services/lens/profile/getProfile'

export function useGetLensProfileByHandle(handle: string, options: any) {
  const queryLensProfileByHandle = useQuery(
    ['lens-profile-by-handle', handle],
    async () => {
      try {
        const result = await getProfileRequest({
          handle,
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.profile
      } catch (e) {
        console.error(e)
      }
    },
    options,
  )

  return queryLensProfileByHandle
}

export default useGetLensProfileByHandle
