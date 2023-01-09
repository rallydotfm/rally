import getPublicationRequest from '@services/lens/publications/getPublication'
import { useQuery } from '@tanstack/react-query'

export function useGetLensPublicationById(args: { idLensPublication: string; idProfile?: string; options: any }) {
  const { idLensPublication, idProfile, options } = args
  const queryLensPublicationById = useQuery(
    ['lens-publication-by-id', idLensPublication, idProfile ?? null],
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

export default useGetLensPublicationById
