import { useQuery } from '@tanstack/react-query'
import { getListProfileInterests } from '@services/lens/profile-interests/getListProfileInterests'

export function useGetProfilesInterests() {
  const getProfileInterests = useQuery(
    ['lens-list-profile-interests'],
    async () => {
      try {
        const result = await getListProfileInterests()
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.data?.profileInterests
      } catch (e) {
        console.error(e)
      }
    },
    {
      cacheTime: Infinity,
    },
  )

  return getProfileInterests
}

export default useGetProfilesInterests
