import create from 'zustand'

interface StoreAudioPlayer {
  isOpen: boolean
  isReady: boolean
  trackSrc: undefined | string
  rally?: {
    clickedAt?: Date | undefined
    name: string
    imageSrc?: string
    id: string
  }
  setIsReady: (isReady: boolean) => void
  setAudioPlayer: (args: {
    isOpen: boolean
    trackSrc?: string
    rally?: {
      clickedAt?: Date | undefined
      name: string
      imageSrc?: string
      id: string
      timestamp?: number
    }
  }) => void
  reset: () => void
}

export const initialState = {
  isOpen: false,
  trackSrc: undefined,
  rally: undefined,
  isReady: false,
}

export const useAudioPlayer = create<StoreAudioPlayer>((set, get) => ({
  reset: () => ({
    ...initialState,
  }),
  setIsReady: (isReady) => {
    return set(() => ({
      isReady,
    }))
  },
  setAudioPlayer: (args: {
    isOpen: boolean
    trackSrc?: string
    rally?: {
      clickedAt?: Date | undefined
      timestamp?: number
      name: string
      imageSrc?: string
      id: string
      lensPublicationId?: string
    }
  }) => {
    const { isOpen, trackSrc, rally } = args
    return set(() => ({
      isOpen,
      trackSrc,
      rally,
    }))
  },

  ...initialState,
}))

export default useAudioPlayer
