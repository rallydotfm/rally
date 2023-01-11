import { PublicationTypes } from '@graphql/lens/generated'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import useIndexedAudioChats from '@hooks/useIndexedAudioChats'
import { useStorePersistedInterests } from '@hooks/usePersistedInterests'
import { createStoreIndexedAudioChatsFilters } from '@hooks/useStoreIndexedAudioChatsFilters'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { explorePublications } from '@services/lens/explore/explorePublications'
import getPublicationsRequest from '@services/lens/publications/getPublications'
import { useQuery } from '@tanstack/react-query'
import { addYears, endOfToday, getUnixTime, startOfToday } from 'date-fns'
import { useAccount } from 'wagmi'

const PER_PAGE = 16
export function useGetHomeAudioChatsSelection() {
  const account = useAccount()
  const queryListInterests = useGetProfilesInterests()
  const interests = useStorePersistedInterests((state: any) => state.interests)
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const queryAudioChatsHappeningNow = useIndexedAudioChats(
    {
      first: PER_PAGE,
      skip: 0,
      //@ts-ignore
      categories:
        //@ts-ignore
        queryLensProfile?.data?.interests?.length > 0
          ? queryLensProfile?.data?.interests
          : interests?.[account?.address as `0x${string}`]?.length > 0
          ? interests?.[account?.address as `0x${string}`]
          : queryListInterests.data,
      creator: '', // ensure that we use a valid Ethereum address to filter on creator eth address
      name: '',
      nsfw: [true, false],
      gated: [true, false],
      states: [DICTIONARY_STATES_AUDIO_CHATS.LIVE.value],
      orderBy: 'name',
      orderDirection: 'asc',
      start_at_min: 0,
      start_at_max: getUnixTime(endOfToday()),
    },
    {
      enabled:
        ((account?.address && queryLensProfile?.isSuccess) || !account?.address) &&
        (queryListInterests?.data?.length ?? [].length > 0)
          ? true
          : false,
    },
  )
  const queryAudioChatsHappeningSoon = useIndexedAudioChats(
    {
      first: PER_PAGE,
      skip: 0,
      categories:
        //@ts-ignore
        queryLensProfile?.data?.interests?.length > 0
          ? queryLensProfile?.data?.interests
          : interests?.[account?.address as `0x${string}`]?.length > 0
          ? interests?.[account?.address as `0x${string}`]
          : queryListInterests.data,
      creator: '', // ensure that we use a valid Ethereum address to filter on creator eth address
      name: '',
      nsfw: [true, false],
      gated: [true, false],
      states: [DICTIONARY_STATES_AUDIO_CHATS.READY.value],
      orderBy: 'metadata_name',
      orderDirection: 'asc',
      start_at_min: getUnixTime(startOfToday()),
      start_at_max: getUnixTime(endOfToday()),
    },
    {
      enabled:
        ((account?.address && queryLensProfile?.isSuccess) || !account?.address) &&
        (queryListInterests?.data?.length ?? [].length > 0)
          ? true
          : false,
    },
  )

  const queryAudioChatsHappeningLater = useIndexedAudioChats(
    {
      first: PER_PAGE,
      skip: 0,
      //@ts-ignore
      categories:
        //@ts-ignore
        queryLensProfile?.data?.interests?.length > 0
          ? queryLensProfile?.data?.interests
          : interests?.[account?.address as `0x${string}`]?.length > 0
          ? interests?.[account?.address as `0x${string}`]
          : queryListInterests.data,
      creator: '', // ensure that we use a valid Ethereum address to filter on creator eth address
      name: '',
      nsfw: [true, false],
      gated: [true, false],
      states: [DICTIONARY_STATES_AUDIO_CHATS.PLANNED.value],
      orderBy: 'name',
      orderDirection: 'asc',
      start_at_min: getUnixTime(startOfToday()),
      start_at_max: getUnixTime(endOfToday()),
    },
    {
      enabled:
        ((account?.address && queryLensProfile?.isSuccess) || !account?.address) &&
        (queryListInterests?.data?.length ?? [].length > 0)
          ? true
          : false,
    },
  )

  /*
  const queryGetLatestPosts = useQuery(
    ['home-latest-post', queryLensProfile?.data?.id],
    async () => {
      const result = await explorePublications({
        sources: ['Rally'],
      })
      return result
    },
    {
      refetchOnWindowFocus: false,
    },
  )*/

  return {
    // queryGetLatestPosts,
    queryAudioChatsHappeningSoon,
    queryAudioChatsHappeningLater,
    queryAudioChatsHappeningNow,
  }
}

const useStoreFiltersAudioChatsHomePage = createStoreIndexedAudioChatsFilters()

export function useGetHomeAudioChatsSelectionFromRESTIndexer() {
  const account = useAccount()
  const interests = useStorePersistedInterests((state: any) => state.interests)
  const queryLensProfile = useWalletAddressDefaultLensProfile(account?.address as `0x${string}`, {
    enabled: account?.address ? true : false,
  })
  const skip = useStoreFiltersAudioChatsHomePage((state: any) => state.skip)
  const showNSFW = useStoreFiltersAudioChatsHomePage((state: any) => state.showNSFW)
  const publicOnly = useStoreFiltersAudioChatsHomePage((state: any) => state.publicOnly)
  const order = useStoreFiltersAudioChatsHomePage((state: any) => state.order)
  const queryListInterests = useGetProfilesInterests()

  const queryAudioChatsHappeningLater = useIndexedAudioChats(
    {
      address: account?.address ?? '',
      first: PER_PAGE,
      skip,
      categories:
        //@ts-ignore
        queryLensProfile?.data?.interests?.length > 0
          ? queryLensProfile?.data?.interests
          : interests?.[account?.address as `0x${string}`]?.length > 0
          ? interests?.[account?.address as `0x${string}`]
          : queryListInterests.data,
      creator: '',
      name: '',
      nsfw: showNSFW === true ? [true, false] : [false],
      gated: [false, true],
      states: [DICTIONARY_STATES_AUDIO_CHATS.PLANNED.value],
      orderBy: order[0],
      orderDirection: order[1],
      start_at_min: getUnixTime(startOfToday()),
      start_at_max: getUnixTime(endOfToday()),
    },
    {
      enabled: queryListInterests?.data?.length ?? [].length > 0 ? true : false,
    },
  )
  const queryAudioChatsHappeningNow = useIndexedAudioChats(
    {
      address: account?.address ?? '',
      first: PER_PAGE,
      skip,
      categories:
        //@ts-ignore
        queryLensProfile?.data?.interests?.length > 0
          ? queryLensProfile?.data?.interests
          : interests?.[account?.address as `0x${string}`]?.length > 0
          ? interests?.[account?.address as `0x${string}`]
          : queryListInterests.data,
      creator: '',
      name: '',
      nsfw: showNSFW === true ? [true, false] : [false],
      gated: [true, false],
      states: [DICTIONARY_STATES_AUDIO_CHATS.LIVE.value],
      orderBy: order[0],
      orderDirection: order[1],
      //@ts-ignore
      start_at_min: getUnixTime(new Date(null)),
      start_at_max: getUnixTime(addYears(new Date(), 100)),
    },
    {
      enabled: queryListInterests?.data?.length ?? [].length > 0 ? true : false,
    },
  )
  const queryAudioChatsHappeningSoon = useIndexedAudioChats(
    {
      address: account?.address ?? '',
      first: PER_PAGE,
      skip,
      categories:
        //@ts-ignore
        queryLensProfile?.data?.interests?.length > 0
          ? queryLensProfile?.data?.interests
          : interests?.[account?.address as `0x${string}`]?.length > 0
          ? interests?.[account?.address as `0x${string}`]
          : queryListInterests.data,
      creator: '',
      name: '',
      nsfw: showNSFW === true ? [true, false] : [false],
      gated: publicOnly === true ? [false] : [true, false],
      states: [DICTIONARY_STATES_AUDIO_CHATS.READY.value],
      orderBy: order[0],
      orderDirection: order[1],
      start_at_min: getUnixTime(startOfToday()),
      start_at_max: getUnixTime(endOfToday()),
    },
    {
      enabled: queryListInterests?.data?.length ?? [].length > 0 ? true : false,
    },
  )

  const queryGetLatestPosts = useQuery(
    ['home-latest-post'],
    async () => {
      const result = await getPublicationsRequest(
        {
          sources: ['Rally'],
        },
        queryLensProfile?.data?.id ?? null,
      )
      return result
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  return {
    queryGetLatestPosts,
    queryAudioChatsHappeningLater,
    queryAudioChatsHappeningNow,
    queryAudioChatsHappeningSoon,
  }
}
export default useGetHomeAudioChatsSelection
