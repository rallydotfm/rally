import create from 'zustand'

interface StoreAudioPlayer {
  isOpen: boolean
  trackSrc: undefined | string
  rally?: {
    name: string
    imageSrc?: string
    id: string
  }
  setAudioPlayer: (args: {
    isOpen: boolean
    trackSrc?: string
    rally?: {
      name: string
      imageSrc?: string
      id: string
    }
  }) => void
  reset: () => void
}

export const initialState = {
  isOpen: false,
  trackSrc: undefined,
  rally: undefined,
}

export const useAudioPlayer = create<StoreAudioPlayer>((set, get) => ({
  reset: () => ({
    ...initialState,
  }),

  setAudioPlayer: (args: {
    isOpen: boolean
    trackSrc?: string
    rally?: {
      name: string
      imageSrc?: string
      id: string
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
