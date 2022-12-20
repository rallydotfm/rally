import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import useIndexedAudioChats from '@hooks/useIndexedAudioChats'
import { useStorePersistedInterests } from '@hooks/usePersistedInterests'
import useWalletAddressDefaultLensProfile from '@hooks/useWalletAddressDefaultLensProfile'
import { endOfToday, getUnixTime, startOfToday } from 'date-fns'
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

  return {
    queryAudioChatsHappeningSoon,
    queryAudioChatsHappeningLater,
    queryAudioChatsHappeningNow,
  }
}

export default useGetHomeAudioChatsSelection
