import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import useIndexedAudioChatsRest from '@hooks/useGetIndexedAudioChatREST'
import useGetLensProfileByHandle from '@hooks/useGetLensProfileByHandle'
import useGetProfilesInterests from '@hooks/useGetProfileInterests'
import { createStoreIndexedAudioChatsFilters } from '@hooks/useStoreIndexedAudioChatsFilters'
import { addYears, getUnixTime } from 'date-fns'

const PER_PAGE = 50
export const useStoreFiltersProfileRallies = createStoreIndexedAudioChatsFilters()
export function useGetAudioChatsByLensHandle(handle: string) {
  const setSkip = useStoreFiltersProfileRallies((state) => state.setSkip)
  const skip = useStoreFiltersProfileRallies((state: any) => state.skip)
  const order = useStoreFiltersProfileRallies((state: any) => state.order)
  const setOrder = useStoreFiltersProfileRallies((state: any) => state.setOrder)
  const resetFilters = useStoreFiltersProfileRallies((state: any) => state.resetFilters)

  const queryLensProfile = useGetLensProfileByHandle(handle, {
    enabled: handle && handle !== null ? true : false,
  })
  const queryListInterests = useGetProfilesInterests()

  const queryAudioChatsByLensHandle = useIndexedAudioChatsRest(
    {
      address: '',
      first: PER_PAGE,
      skip,
      categories: queryListInterests.data,
      creator: queryLensProfile?.data?.ownedBy,
      name: '',
      nsfw: [true, false],
      gated: [false, true],
      states: [
        DICTIONARY_STATES_AUDIO_CHATS.PLANNED.value,
        DICTIONARY_STATES_AUDIO_CHATS.READY.value,
        DICTIONARY_STATES_AUDIO_CHATS.LIVE.value,
        DICTIONARY_STATES_AUDIO_CHATS.CANCELLED.value,
        DICTIONARY_STATES_AUDIO_CHATS.FINISHED.value,
      ],
      orderBy: order[0],
      orderDirection: order[1],
      start_at_min: 0,
      start_at_max: getUnixTime(addYears(new Date(), 100)),
    },
    {
      enabled:
        queryLensProfile?.data?.ownedBy &&
        queryLensProfile?.data?.ownedBy !== null &&
        //@ts-ignore
        queryListInterests?.data?.length > 0
          ? true
          : false,
    },
  )

  return {
    queryAudioChatsByLensHandle,
    setOrder,
    setSkip,
    resetFilters,
    order,
    skip,
    perPage: PER_PAGE,
  }
}

export default useGetAudioChatsByLensHandle
