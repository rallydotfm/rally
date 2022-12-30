import { endOfWeek, getUnixTime, startOfWeek } from 'date-fns'
import type { NextPage } from 'next'
import Head from 'next/head'
import CalendarWeek from '@components/pages/upcoming/CalendarWeek'
import { getLayout } from '@layouts/LayoutUpcoming'
import ListFilters from '@components/pages/upcoming/ListFilters'
import DialogModalFilters from '@components/pages/upcoming/DialogModalFilters'
import { createStoreIndexedAudioChatsFilters } from '@hooks/useStoreIndexedAudioChatsFilters'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import useIndexedAudioChatsRest from '@hooks/useGetIndexedAudioChatREST'
import { useState } from 'react'
import { isAddress } from 'ethers/lib/utils'
import Button from '@components/Button'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid'
import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useUnmountEffect, useUpdateEffect } from '@react-hookz/web'
import { useStorePersistedInterests } from '@hooks/usePersistedInterests'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { useAccount } from 'wagmi'
import { Popover } from '@headlessui/react'
import button from '@components/Button/styles'
import InputCheckboxToggle from '@components/InputCheckboxToggle'

const PER_PAGE = 100
const useStoreFiltersAudioChatsUpcomingPage = createStoreIndexedAudioChatsFilters()

const Page: NextPage = () => {
  const account = useAccount()
  const useProfileInterest = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.useProfileInterest)
  const setUseProfileInterests = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.setUseProfileInterests)
  const setCategories = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.setCategories)
  const categories = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.categories)
  const interests = useStorePersistedInterests((state: any) => state.interests)
  const queryCurrentUserDefaultLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
    onSuccess(data: { interests: Array<string> }) {
      if (data?.interests && categories?.length === 0) setCategories(data?.interests)
    },
  })
  const setStatuses = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.setStatuses)
  const setCreatorEthAddress = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.setCreatorEthAddress)
  const setNameRally = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.setNameRally)
  const nameRally = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.nameRally)
  const creatorEthAddress = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.creatorEthAddress)
  const skip = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.skip)
  const toggleShowNSFW = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.toggleShowNSFW)
  const togglePublicOnly = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.togglePublicOnly)
  const showNSFW = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.showNSFW)
  const publicOnly = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.publicOnly)
  const statuses = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.statuses)
  const order = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.order)
  const resetFilters = useStoreFiltersAudioChatsUpcomingPage((state: any) => state.resetFilters)
  const queryListInterests = useGetProfilesInterests()
  const queryAudioChats = useIndexedAudioChatsRest(
    {
      first: PER_PAGE,
      skip,
      categories:
        categories?.length > 0
          ? categories
          : useProfileInterest === false || (useProfileInterest && categories?.length === 0)
          ? queryListInterests.data
          : //@ts-ignore
          queryCurrentUserDefaultLensProfile?.data?.interests?.length > 0
          ? queryCurrentUserDefaultLensProfile?.data?.interests
          : interests?.length > 0
          ? interests
          : queryListInterests.data,
      creator: isAddress(creatorEthAddress) ? creatorEthAddress : '', // ensure that we use a valid Ethereum address to filter on creator eth address
      name: nameRally,
      nsfw: showNSFW === true ? [true, false] : [false],
      gated: publicOnly === true ? [false] : [true, false],
      states: statuses,
      orderBy: order[0],
      orderDirection: order[1],
      start_at_min: getUnixTime(startOfWeek(new Date())),
      start_at_max: getUnixTime(endOfWeek(new Date())),
    },
    {
      enabled:
        //@ts-ignore
        queryListInterests?.data?.length > 0 &&
        (!account?.address || (account?.address && queryCurrentUserDefaultLensProfile?.isSuccess))
          ? true
          : false,
    },
  )
  const [isModalFiltersOpen, setIsModalFiltersOpen] = useState(false)

  useUpdateEffect(() => {
    if (categories?.length && queryCurrentUserDefaultLensProfile?.data?.interests?.length) {
      if (categories.sort().toString() == queryCurrentUserDefaultLensProfile?.data?.interests.sort().toString()) {
        setUseProfileInterests(true)
      } else {
        setUseProfileInterests(false)
      }
    }
  }, [categories])
  useUnmountEffect(() => {
    resetFilters()
  })

  return (
    <>
      <Head>
        <title>Upcoming rallies this week - Rally</title>
        <meta
          name="description"
          content="Discover upcoming audio rooms on Rally, the open-source alternative to Clubhouse and Twitter Space for Web3 communities."
        />
      </Head>
      <main>
        <div className="flex flex-col gap-12">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Popover className="relative">
                <Popover.Button
                  className={button({
                    intent: 'neutral-ghost',
                    scale: 'xs',
                    class: '!p-0 h-8 aspect-square',
                  })}
                >
                  <Cog6ToothIcon className="w-5" />
                  <span className="sr-only">Preferences</span>
                </Popover.Button>
                <Popover.Panel className="animate-appear bg-neutral-5 border border-neutral-8 rounded-md w-72 mt-1 absolute z-10">
                  <div className="px-3 py-1.5 border-b border-neutral-7">
                    <span className="text-xs font-medium text-neutral-12">Preferences</span>
                  </div>
                  <div className="px-3 pt-3 pb-5">
                    <InputCheckboxToggle
                      onChange={(e: boolean) => {
                        if (
                          e === true &&
                          //@ts-ignore
                          (queryCurrentUserDefaultLensProfile?.data?.interests?.length > 0 || interests?.length > 0)
                        ) {
                          setCategories(
                            //@ts-ignore
                            queryCurrentUserDefaultLensProfile?.data?.interests?.length > 0
                              ? queryCurrentUserDefaultLensProfile?.data?.interests
                              : interests,
                          )
                        }
                        setUseProfileInterests(e)
                      }}
                      checked={useProfileInterest}
                      scale="xs"
                      classNameLabel="text-[0.95rem]"
                      label="Apply profile interests"
                    />
                  </div>
                </Popover.Panel>
              </Popover>

              <Button
                type="button"
                scale="xs"
                className="!pis-3"
                intent="interactive-outline"
                onClick={() => setIsModalFiltersOpen(true)}
                disabled={
                  queryListInterests?.isLoading ||
                  (account?.address && !queryCurrentUserDefaultLensProfile?.isSuccess) ||
                  queryAudioChats?.isLoading
                }
                isLoading={
                  queryListInterests?.isLoading ||
                  (account?.address && !queryCurrentUserDefaultLensProfile?.isSuccess) ||
                  queryAudioChats?.isLoading
                }
              >
                <AdjustmentsHorizontalIcon className="w-5 mie-1ex" />
                Filters
                {categories.length +
                  statuses.length +
                  (nameRally?.length > 0 ? 1 : 0) +
                  (showNSFW ? 1 : 0) +
                  (publicOnly ? 1 : 0) >
                0 + (isAddress(creatorEthAddress) ? 1 : 0)
                  ? ` (${
                      categories.length +
                      statuses.length +
                      (nameRally?.length > 0 ? 1 : 0) +
                      (showNSFW ? 1 : 0) +
                      (publicOnly ? 1 : 0) +
                      (isAddress(creatorEthAddress) ? 1 : 0)
                    })`
                  : ''}
              </Button>
            </div>
            <Button title="Clear filters" type="button" scale="xs" intent="neutral-ghost" onClick={resetFilters}>
              Clear
            </Button>
          </div>
          <CalendarWeek queryAudioChats={queryAudioChats} />
        </div>
      </main>
      <DialogModalFilters
        onClickResetFilters={resetFilters}
        isOpen={isModalFiltersOpen}
        setIsOpen={setIsModalFiltersOpen}
      >
        <ListFilters
          filterCategories={categories}
          setCategoriesFilter={setCategories}
          filterStatuses={statuses}
          setStatusesFilter={setStatuses}
          filterShowNSFW={showNSFW}
          setFilterShowNSFW={toggleShowNSFW}
          filterPublicOnly={publicOnly}
          setFilterPublicOnly={togglePublicOnly}
          setFilterNameRally={setNameRally}
          filterNameRally={nameRally}
          filterCreatorEthAddress={creatorEthAddress}
          setFilterCreatorEthAddress={setCreatorEthAddress}
        />
      </DialogModalFilters>
    </>
  )
}

//@ts-ignore
Page.getLayout = getLayout

export default Page
