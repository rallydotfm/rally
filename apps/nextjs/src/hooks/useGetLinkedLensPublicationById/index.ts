import getPublicationRequest from '@services/lens/publications/getPublication'
import { useQuery } from '@tanstack/react-query'

export function useGetLinkedLensPublicationById(args: {
  idLensPublication: string
  idRally: string
  idProfile?: string
  options: any
}) {
  const { idLensPublication, idRally, idProfile, options } = args
  const queryLensPublicationById = useQuery(
    ['linked-lens-publication-by-id', idLensPublication, idRally, idProfile ?? null],
    async () => {
      try {
        const result = await getPublicationRequest(
          {
            publicationId: idLensPublication,
          },
          idProfile,
        )
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

  return queryLensPublicationById
}

export default useGetLinkedLensPublicationById
