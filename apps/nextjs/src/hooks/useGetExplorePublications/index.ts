import { useQuery } from '@tanstack/react-query'
import { explorePublications } from '@services/lens/explore/explorePublications'
import { PublicationSortCriteria } from '@graphql/lens/generated'

export function useGetExplorePublications(sortCriteria: PublicationSortCriteria, options: any) {
  const getExplorePublications = useQuery(
    ['explore-publications', sortCriteria],
    async () => {
      try {
        const result = await explorePublications({
          sortCriteria: sortCriteria ?? PublicationSortCriteria.Latest,
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

  return getExplorePublications
}

export default useGetExplorePublications
