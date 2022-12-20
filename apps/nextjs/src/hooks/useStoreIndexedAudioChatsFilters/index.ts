import { AUDIO_CHATS_SORT_ORDER } from '@helpers/audioChatsSortOptions'
import { DICTIONARY_STATES_AUDIO_CHATS } from '@helpers/mappingAudioChatState'
import { addYears, getUnixTime, startOfToday } from 'date-fns'
import create from 'zustand'

interface StoreIndexedAudioChatsFilters {
  setStartBetweenRange: (range: [greaterOrEqualToEpochDateTime: number, lowerOrEqualToEpochDateTime: number]) => void
  setOrder: (order: [orderBy: string, orderDirection: string]) => void
  setCreatorEthAddress: (address: string) => void
  setNameRally: (title: string) => void
  setCategories: (categories: Array<string>) => void
  setStatuses: (statuses: Array<number>) => void
  toggleShowNSFW: (showNSFW: boolean) => void
  togglePublicOnly: (publicOnly: boolean) => void
  setSkip: (skip: number) => void
  resetFilters: () => void
  skip: number
  first: number
  creatorEthAddress: string
  nameRally: string
  showNSFW: boolean
  publicOnly: boolean
  categories: Array<string>
  statuses: Array<number>
  order: [orderBy: string, orderDirection: string]
  startBetweenRange: [greaterOrEqualToEpochDateTime: number, lowerOrEqualToEpochDateTime: number]
  useProfileInterest: boolean
  setUseProfileInterests: (shouldUseProfileInterests: boolean) => void
}

export const initialState = {
  creatorEthAddress: '',
  nameRally: '',
  skip: 0,
  first: 30,
  showNSFW: false,
  publicOnly: false,
  categories: [],
  startBetweenRange: [0, getUnixTime(addYears(startOfToday(), 5))] as [number, number],
  statuses: [
    DICTIONARY_STATES_AUDIO_CHATS.PLANNED.value,
    DICTIONARY_STATES_AUDIO_CHATS.READY.value,
    DICTIONARY_STATES_AUDIO_CHATS.LIVE.value,
  ],
}

export const createStoreIndexedAudioChatsFilters = () =>
  create<StoreIndexedAudioChatsFilters>((set, get) => ({
    resetFilters: () => {
      return set(() => ({
        ...initialState,
      }))
    },

    setCategories: (categories: Array<string>) => {
      return set(() => ({
        categories,
      }))
    },

    setStatuses: (statuses: Array<number>) => {
      return set(() => ({
        statuses,
      }))
    },

    setNameRally: (nameRally: string) => {
      return set(() => ({
        nameRally,
      }))
    },

    setCreatorEthAddress: (creatorEthAddress: string) => {
      return set(() => ({
        creatorEthAddress,
      }))
    },

    toggleShowNSFW: (shouldShowNSFW: boolean) => {
      set(() => {
        return {
          showNSFW: shouldShowNSFW,
        }
      })
    },

    togglePublicOnly: (publicOnly: boolean) => {
      set(() => {
        return {
          publicOnly,
        }
      })
    },

    setSkip: (skip: number) => {
      set(() => {
        return {
          skip,
        }
      })
    },

    setOrder: (newOrder: [orderBy: string, orderDirection: string]) => {
      set(() => {
        return {
          order: newOrder,
        }
      })
    },

    setStartBetweenRange: (range: [greaterOrEqualToEpochDateTime: number, lowerOrEqualToEpochDateTime: number]) => {
      set(() => {
        return {
          startBetweenRange: range,
        }
      })
    },

    useProfileInterest: true,
    setUseProfileInterests: (shouldUseProfileInterests) => {
      set(() => {
        return {
          useProfileInterest: shouldUseProfileInterests,
        }
      })
    },

    ...initialState,
    order: AUDIO_CHATS_SORT_ORDER[0]?.value.split('.') as [string, string],
  }))

export const useStoreSortAndFilterQueryAllRallies = createStoreIndexedAudioChatsFilters()
export const useStoreSortAndFilterQueryUpcomingRallies = createStoreIndexedAudioChatsFilters()
