import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutSearch'
import { IconSpinner } from '@components/Icons'
import ListFilteredRallies from '@components/pages/search/rallies/ListFilteredRallies'
import Filters from '@components/pages/search/rallies/Filters'
import ListMoreFilters from '@components/pages/search/rallies/ListMoreFilters'
import DialogModalMoreFilters from '@components/pages/search/rallies/DialogModalMoreFilters'
import { createStoreIndexedAudioChatsFilters } from '@hooks/useStoreIndexedAudioChatsFilters'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import useIndexedAudioChats from '@hooks/useIndexedAudioChats'
import { useState } from 'react'
import { isAddress } from 'ethers/lib/utils'
import useIndexedAudioChatsRest from '@hooks/useGetIndexedAudioChatREST'

const PER_PAGE = 30
const useStoreFiltersAudioChatsSearchPage = createStoreIndexedAudioChatsFilters()

const Page: NextPage = () => {
  const setCategories = useStoreFiltersAudioChatsSearchPage((state: any) => state.setCategories)
  const setStatuses = useStoreFiltersAudioChatsSearchPage((state: any) => state.setStatuses)
  const setCreatorEthAddress = useStoreFiltersAudioChatsSearchPage((state: any) => state.setCreatorEthAddress)
  const setNameRally = useStoreFiltersAudioChatsSearchPage((state: any) => state.setNameRally)
  const setSkip = useStoreFiltersAudioChatsSearchPage((state) => state.setSkip)
  const nameRally = useStoreFiltersAudioChatsSearchPage((state: any) => state.nameRally)
  const creatorEthAddress = useStoreFiltersAudioChatsSearchPage((state: any) => state.creatorEthAddress)
  const skip = useStoreFiltersAudioChatsSearchPage((state: any) => state.skip)
  const toggleShowNSFW = useStoreFiltersAudioChatsSearchPage((state: any) => state.toggleShowNSFW)
  const togglePublicOnly = useStoreFiltersAudioChatsSearchPage((state: any) => state.togglePublicOnly)
  const showNSFW = useStoreFiltersAudioChatsSearchPage((state: any) => state.showNSFW)
  const publicOnly = useStoreFiltersAudioChatsSearchPage((state: any) => state.publicOnly)
  const statuses = useStoreFiltersAudioChatsSearchPage((state: any) => state.statuses)
  const categories = useStoreFiltersAudioChatsSearchPage((state: any) => state.categories)
  const order = useStoreFiltersAudioChatsSearchPage((state: any) => state.order)
  const setOrder = useStoreFiltersAudioChatsSearchPage((state: any) => state.setOrder)
  const resetFilters = useStoreFiltersAudioChatsSearchPage((state: any) => state.resetFilters)
  const startBetweenRange = useStoreFiltersAudioChatsSearchPage((state: any) => state.startBetweenRange)
  const setStartBetweenRange = useStoreFiltersAudioChatsSearchPage((state: any) => state.setStartBetweenRange)
  const queryListInterests = useGetProfilesInterests()
  const queryAudioChats = useIndexedAudioChatsRest(
    {
      first: PER_PAGE,
      skip,
      categories: categories?.length > 0 ? categories : queryListInterests.data,
      creator: isAddress(creatorEthAddress) ? creatorEthAddress : '', // ensure that we use a valid Ethereum address to filter on creator eth address
      name: nameRally,
      nsfw: showNSFW === true ? [true, false] : [false],
      gated: publicOnly === true ? [false] : [true, false],
      states: statuses,
      orderBy: order[0],
      orderDirection: order[1],
      start_at_min: startBetweenRange[0],
      start_at_max: startBetweenRange[1],
    },
    {
      enabled: queryListInterests?.data?.length ?? [].length > 0 ? true : false,
    },
  )
  const [isModalFiltersOpen, setIsModalFiltersOpen] = useState(false)

  return (
    <>
      <Head>
        <title>Search rallies - Rally</title>
        <meta
          name="description"
          content="Rally is an open-source alternative to Twitter Space/Clubhouse for web3 communities."
        />
      </Head>
      <main className="pt-2 flex-grow flex flex-col">
        <h1 className="sr-only">Search rallies by...</h1>
        <div className="relative pb-6 z-10">
          <Filters
            clearFilters={resetFilters}
            queryAudioChats={queryAudioChats}
            numberFilters={categories.length + statuses.length + (showNSFW ? 1 : 0) + (publicOnly ? 1 : 0)}
            filterCategories={categories}
            filterStatuses={statuses}
            filterShowNSFW={showNSFW}
            filterPublicOnly={publicOnly}
            filterStartBetweenRange={startBetweenRange}
            setSortOrder={setOrder}
            setStartBetweenRange={setStartBetweenRange}
            setCreatorEthAddress={setCreatorEthAddress}
            setIsModalFiltersOpen={setIsModalFiltersOpen}
            setNameRally={setNameRally}
            nameRally={nameRally}
            creatorEthAddress={creatorEthAddress}
            sortOrder={order}
          />
        </div>
        {queryAudioChats?.data ? (
          <>
            <ListFilteredRallies
              skip={skip}
              perPage={PER_PAGE}
              setSkip={setSkip}
              list={queryAudioChats?.data}
              isError={queryAudioChats?.isError}
              isLoading={queryAudioChats?.isLoading}
            />
          </>
        ) : (
          queryAudioChats?.isLoading && (
            <div className="mb-6 pt-12 animate-appear flex items-center justify-center space-i-1ex">
              <IconSpinner className="text-lg animate-spin" />
              <p className="font-bold animate-pulse">Loading rallies...</p>
            </div>
          )
        )}

        <DialogModalMoreFilters isOpen={isModalFiltersOpen} setIsOpen={setIsModalFiltersOpen}>
          <ListMoreFilters
            filtersCategories={categories}
            setCategoriesFilter={setCategories}
            filtersStatuses={statuses}
            setStatusesFilter={setStatuses}
            filterShowNSFW={showNSFW}
            setFilterShowNSFW={toggleShowNSFW}
            filterPublicOnly={publicOnly}
            setFilterPublicOnly={togglePublicOnly}
          />
        </DialogModalMoreFilters>
      </main>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
