import type { NextPage } from 'next'
import Head from 'next/head'
import { getLayout } from '@layouts/LayoutSearch'
import { IconSpinner } from '@components/Icons'
import ListFilteredRallies from '@components/pages/search/recordings/ListFilteredRallies'
import Filters from '@components/pages/search/recordings/Filters'
import ListMoreFilters from '@components/pages/search/recordings/ListMoreFilters'
import DialogModalMoreFilters from '@components/pages/search/recordings/DialogModalMoreFilters'
import { createStoreIndexedAudioChatsFilters } from '@hooks/useStoreIndexedAudioChatsFilters'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import { useState } from 'react'
import { isAddress } from 'ethers/lib/utils'
import useIndexedRecordingsRest from '@hooks/useGetIndexedRecordingsREST '

const PER_PAGE = 30
const useStoreFiltersAudioChatsRecordingsSearchPage = createStoreIndexedAudioChatsFilters()

const Page: NextPage = () => {
  const setCategories = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.setCategories)
  const setCreatorEthAddress = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.setCreatorEthAddress)
  const setNameRally = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.setNameRally)
  const setSkip = useStoreFiltersAudioChatsRecordingsSearchPage((state) => state.setSkip)
  const nameRally = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.nameRally)
  const creatorEthAddress = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.creatorEthAddress)
  const skip = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.skip)
  const toggleShowNSFW = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.toggleShowNSFW)
  const showNSFW = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.showNSFW)
  const categories = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.categories)
  const order = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.order)
  const setOrder = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.setOrder)
  const resetFilters = useStoreFiltersAudioChatsRecordingsSearchPage((state: any) => state.resetFilters)
  const queryListInterests = useGetProfilesInterests()
  const queryAudioChatsRecordings = useIndexedRecordingsRest(
    {
      first: PER_PAGE,
      skip,
      categories: categories?.length > 0 ? categories : queryListInterests.data,
      creator: isAddress(creatorEthAddress) ? creatorEthAddress : '', // ensure that we use a valid Ethereum address to filter on creator eth address
      name: nameRally,
      nsfw: showNSFW === true ? [true, false] : [false],
      orderBy: order[0],
      orderDirection: order[1],
    },
    {
      enabled: queryListInterests?.data?.length ?? [].length > 0 ? true : false,
    },
  )
  const [isModalFiltersOpen, setIsModalFiltersOpen] = useState(false)

  return (
    <>
      <Head>
        <title>Search recordings - Rally</title>
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
            queryAudioChats={queryAudioChatsRecordings}
            numberFilters={categories.length + (showNSFW ? 1 : 0)}
            filterCategories={categories}
            filterShowNSFW={showNSFW}
            setSortOrder={setOrder}
            setCreatorEthAddress={setCreatorEthAddress}
            setIsModalFiltersOpen={setIsModalFiltersOpen}
            setNameRally={setNameRally}
            nameRally={nameRally}
            creatorEthAddress={creatorEthAddress}
            sortOrder={order}
          />
        </div>
        {queryAudioChatsRecordings?.data ? (
          <>
            <ListFilteredRallies
              skip={skip}
              perPage={PER_PAGE}
              setSkip={setSkip}
              list={queryAudioChatsRecordings?.data}
              isError={queryAudioChatsRecordings?.isError}
              isLoading={queryAudioChatsRecordings?.isLoading}
            />
          </>
        ) : (
          queryAudioChatsRecordings?.isLoading && (
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
            filterShowNSFW={showNSFW}
            setFilterShowNSFW={toggleShowNSFW}
          />
        </DialogModalMoreFilters>
      </main>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
