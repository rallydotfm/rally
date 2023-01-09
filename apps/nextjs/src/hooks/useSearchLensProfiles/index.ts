import { useQuery } from '@tanstack/react-query'
import { searchProfilesRequest } from '@services/lens/search/searchProfiles'
import { useState } from 'react'
import { useDebouncedEffect } from '@react-hookz/web'
import { SearchRequestTypes } from '@graphql/lens/generated'
import searchEnsName from '@services/ens/subgraph/searchEnsName'

export function useSearchLensProfiles(fallbackToEns: boolean, options?: any) {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [inputSearchLensProfileValue, setInputSearchLensProfileValue] = useState('')
  const [shouldSearchEns, setShouldSearchEns] = useState(false)

  useDebouncedEffect(
    () => {
      setDebouncedSearchQuery(inputSearchLensProfileValue)
    },
    [inputSearchLensProfileValue],
    500,
    2500,
  )
  const querySearchLensProfile = useQuery(
    ['search-lens-profile', debouncedSearchQuery],
    async () => {
      setShouldSearchEns(false)
      try {
        const result = await searchProfilesRequest({
          query: debouncedSearchQuery,
          type: SearchRequestTypes.Profile,
        })
        //@ts-ignore
        if (result?.error) throw new Error(result?.error)
        return result?.search
      } catch (e) {
        setShouldSearchEns(true)
        console.error(e)
      }
    },
    {
      ...options,
      enabled: debouncedSearchQuery.trim() !== '' ? true : false,
      onSettled(data, error) {
        //@ts-ignore
        if ((fallbackToEns === true && data?.items?.length === 0) || !data?.items) {
          setShouldSearchEns(true)
        }
      },
    },
  )

  const querySearchEns = useQuery(
    ['search-ens-name', debouncedSearchQuery],
    async () => {
      try {
        const response = await searchEnsName({ query: debouncedSearchQuery })
        const result = await response.json()
        return result?.data
      } catch (e) {
        console.error(e)
      }
    },
    {
      enabled: shouldSearchEns && fallbackToEns === true,
      refetchOnWindowFocus: false,
    },
  )

  return {
    querySearchLensProfile,
    inputSearchLensProfileValue,
    setInputSearchLensProfileValue,
    querySearchEns,
  }
}

export default useSearchLensProfiles
