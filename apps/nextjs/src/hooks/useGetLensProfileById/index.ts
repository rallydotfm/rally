import { useQuery } from '@tanstack/react-query'
import { getProfileRequest } from '@services/lens/profile/getProfile'

export function useGetLensProfileById(id: string, options: any) {
  const queryLensProfileById = useQuery(
    ['lens-profile-by-id', id],
    async () => {
      try {
        const result = await getProfileRequest({
          profileId: id,
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

  return queryLensProfileById
}

export default useGetLensProfileById
