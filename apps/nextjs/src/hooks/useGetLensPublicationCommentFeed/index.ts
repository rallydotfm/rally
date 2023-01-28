import getPublicationsRequest from '@services/lens/publications/getPublications'
import { useQuery } from '@tanstack/react-query'

export function useGetLensPublicationCommentFeed(publicationId: string, options?: any) {
  const queryCommentFeed = useQuery(
    ['publication-comment-feed', publicationId],
    async () => {
      const result = await getPublicationsRequest({
        commentsOf: publicationId,
        limit: 50,
      })
      return result
    },
    {
      ...options,
    },
  )

  return { queryCommentFeed }
}

export default useGetLensPublicationCommentFeed
