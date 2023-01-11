import { useQuery } from '@tanstack/react-query'
import { searchRequest } from '@services/lens/search/searchPublications'
import { useState } from 'react'
import { useDebouncedEffect } from '@react-hookz/web'
import { SearchRequestTypes } from '@graphql/lens/generated'

export function useSearchLensPublications(options?: any) {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [inputSearchPublicationsValue, setInputSearchLensPublicationsValue] = useState('')

  useDebouncedEffect(
    () => {
      setDebouncedSearchQuery(inputSearchPublicationsValue)
    },
    [inputSearchPublicationsValue],
    500,
    2500,
  )
  const querySearchLensPublications = useQuery(
    ['search-lens-publications', debouncedSearchQuery],
    async () => {
      try {
        const result = await searchRequest({
          query: debouncedSearchQuery,
          type: SearchRequestTypes.Publication,
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.search
      } catch (e) {
        console.error(e)
      }
    },
    {
      ...options,
      enabled: debouncedSearchQuery.trim() !== '' ? true : false,
    },
  )

  return {
    querySearchLensPublications,
    inputSearchPublicationsValue,
    setInputSearchLensPublicationsValue,
  }
}

export default useSearchLensPublications
