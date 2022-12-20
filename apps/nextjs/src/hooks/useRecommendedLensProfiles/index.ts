import { useQuery } from '@tanstack/react-query'
import { getRecommendedProfiles } from '@services/lens/profile/getRecommendedProfiles'

export function useRecommendedLensProfiles(options?: any) {
  const queryRecommendedLensProfile = useQuery(
    ['recommended-lens-profile'],
    async () => {
      try {
        const result = await getRecommendedProfiles()
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.recommendedProfiles
      } catch (e) {
        console.error(e)
      }
    },
    {
      ...options,
    },
  )

  return queryRecommendedLensProfile
}

export default useRecommendedLensProfiles
