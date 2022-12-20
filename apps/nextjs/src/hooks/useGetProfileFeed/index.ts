import { useQuery } from '@tanstack/react-query'
import { getProfileFeedRequest } from '@services/lens/feed/getProfileFeed'

export function useGetProfileFeed(profileId: string, options: any) {
  const getProfileFeed = useQuery(
    ['profile-feed', profileId],
    async () => {
      try {
        const result = await getProfileFeedRequest({
          profileId,
          limit: 50,
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

  return getProfileFeed
}

export default useGetProfileFeed
