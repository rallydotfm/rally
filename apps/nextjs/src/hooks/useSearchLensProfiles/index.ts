import { useQuery } from '@tanstack/react-query'
import { searchProfilesRequest } from '@services/lens/search/searchProfiles'
import { useState } from 'react'
import { useDebouncedEffect } from '@react-hookz/web'
import { SearchRequestTypes } from '@graphql/lens/generated'

export function useSearchLensProfiles(options?: any) {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [inputSearchLensProfileValue, setInputSearchLensProfileValue] = useState('')

  useDebouncedEffect(
    () => {
      setDebouncedSearchQuery(inputSearchLensProfileValue)
    },
    [inputSearchLensProfileValue],
    1200,
    2000,
  )
  const querySearchLensProfile = useQuery(
    ['search-lens-profile', debouncedSearchQuery],
    async () => {
      try {
        const result = await searchProfilesRequest({
          query: debouncedSearchQuery,
          type: SearchRequestTypes.Profile,
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
    querySearchLensProfile,
    inputSearchLensProfileValue,
    setInputSearchLensProfileValue,
  }
}

export default useSearchLensProfiles
